import type { NextApiRequest, NextApiResponse } from 'next';
import { createImage } from '@/lib/db/images';
import { uploadToSpaces } from '@/lib/storage/spaces';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { optimizeForWeb, createThumbnail } from '@/lib/utils/imageOptimization';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface UploadedFile {
  filepath: string;
  originalFilename: string;
  mimetype: string;
  size: number;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Require authentication
  const { requireAuth } = await import('@/lib/auth/middleware');
  const isAuthenticated = await requireAuth(req as any, res);
  if (!isAuthenticated) {
    return;
  }

  // Check if CDN credentials are available
  const hasCdnCredentials = process.env.DO_SPACES_KEY && process.env.DO_SPACES_SECRET;

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    
    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const optimize = Array.isArray(fields.optimize) ? fields.optimize[0] : fields.optimize;

    if (!category || !file) {
      return res.status(400).json({ 
        error: 'Missing required fields: category and file are required' 
      });
    }

    // Validate category length (schema: VARCHAR(50))
    if (category.length > 50) {
      return res.status(400).json({ 
        error: 'Category name too long (max 50 characters)' 
      });
    }

    const uploadedFile = file as UploadedFile;
    const originalBuffer = fs.readFileSync(uploadedFile.filepath);
    const originalSize = originalBuffer.length;

    // Optimize images for maximum speed
    let optimizedBuffer: Buffer;
    let optimizedFormat = 'image/webp';
    let width: number | undefined;
    let height: number | undefined;
    let compressionRatio = 0;

    // Always optimize images for fast loading (unless explicitly disabled)
    if (optimize !== 'false') {
      const optimized = await optimizeForWeb(originalBuffer);
      optimizedBuffer = optimized.buffer;
      optimizedFormat = optimized.format;
      width = optimized.width;
      height = optimized.height;
      compressionRatio = optimized.compressionRatio;
    } else {
      optimizedBuffer = originalBuffer;
      optimizedFormat = uploadedFile.mimetype;
    }

    // Generate ultra-small thumbnail for instant loading
    const thumbnail = await createThumbnail(originalBuffer, 200);
    const thumbnailFileName = `thumb-${Date.now()}-${path.parse(uploadedFile.originalFilename).name}.webp`;
    const fileName = `${Date.now()}-${path.parse(uploadedFile.originalFilename).name}.webp`;
    
    // Upload to DigitalOcean Spaces for fast CDN delivery
    const imageKey = `images/${category}/${fileName}`;
    const thumbnailKey = `images/${category}/${thumbnailFileName}`;

    let imageUrl: string;
    let thumbnailUrl: string;

    if (hasCdnCredentials) {
      // Upload to DigitalOcean Spaces
      imageUrl = await uploadToSpaces(imageKey, optimizedBuffer, optimizedFormat, {
        cacheControl: 'public, max-age=31536000, immutable', // 1 year cache
        metadata: {
          category,
          originalFilename: uploadedFile.originalFilename,
        },
      });

      // Upload thumbnail to Spaces
      try {
        thumbnailUrl = await uploadToSpaces(thumbnailKey, thumbnail.buffer, 'image/webp', {
          cacheControl: 'public, max-age=31536000, immutable',
        });
      } catch (thumbnailError) {
        console.warn('Thumbnail upload error (non-critical):', thumbnailError);
        thumbnailUrl = imageUrl; // Fallback to main image
      }
    } else {
      // Fallback to local storage
      const fsPromises = require('fs').promises;

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', category);
      await fsPromises.mkdir(uploadsDir, { recursive: true });

      // Save optimized image
      const localImagePath = path.join(uploadsDir, fileName);
      await fsPromises.writeFile(localImagePath, optimizedBuffer);
      imageUrl = `/uploads/${category}/${fileName}`;

      // Save thumbnail
      const thumbnailDir = path.join(process.cwd(), 'public', 'uploads', 'thumbnails');
      await fsPromises.mkdir(thumbnailDir, { recursive: true });
      const localThumbnailPath = path.join(thumbnailDir, thumbnailFileName);
      await fsPromises.writeFile(localThumbnailPath, thumbnail.buffer);
      thumbnailUrl = `/uploads/thumbnails/${thumbnailFileName}`;
    }

    // Save metadata to PostgreSQL database
    const dbData = await createImage({
      category,
      subcategory: '', // Always empty - we don't use subcategories
      filename: uploadedFile.originalFilename,
      url: imageUrl,
      thumbnail_url: thumbnailUrl,
      storage_path: imageKey,
      file_size: optimizedBuffer.length,
      mime_type: optimizedFormat,
      width: width || undefined,
      height: height || undefined,
      uploaded_by: 'admin',
    });

    // Clean up temp file
    fs.unlinkSync(uploadedFile.filepath);

    return res.status(200).json({
      success: true,
      image: dbData,
      optimization: {
        originalSize,
        optimizedSize: optimizedBuffer.length,
        compressionRatio: compressionRatio > 0 ? `${compressionRatio}%` : '0%',
        format: optimizedFormat,
        thumbnailUrl: thumbnailUrl,
        cdnUrl: imageUrl,
      },
    });
  } catch (uploadError: any) {
    console.error('Upload error:', uploadError);
    const errorMessage = hasCdnCredentials
      ? 'Failed to upload image to DigitalOcean Spaces'
      : 'Failed to save image locally';

    const helpMessage = hasCdnCredentials
      ? 'Please ensure DO_SPACES_KEY, DO_SPACES_SECRET, and DO_SPACES_BUCKET are set in .env.local'
      : 'Please check file permissions and disk space';

    return res.status(500).json({
      error: errorMessage,
      details: uploadError.message,
      help: helpMessage
    });
  }
}

export default handler;
