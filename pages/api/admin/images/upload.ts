import type { NextApiRequest, NextApiResponse } from 'next';
import { createImage } from '@/lib/db/images';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { optimizeForWeb, createThumbnail } from '@/lib/utils/imageOptimization';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false, // Disable response limit
    sizeLimit: '50mb', // Set higher limit to allow formidable to handle file size validation
  },
};

interface UploadedFile {
  filepath: string;
  originalFilename: string;
  mimetype: string;
  size: number;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('📤 [Upload API] Request received:', req.method);

  if (req.method !== 'POST') {
    console.log('❌ [Upload API] Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Require authentication
  console.log('🔐 [Upload API] Checking authentication...');
  const { requireAuth } = await import('@/lib/auth/middleware');
  const isAuthenticated = await requireAuth(req as any, res);
  if (!isAuthenticated) {
    console.log('❌ [Upload API] Authentication failed');
    return;
  }
  console.log('✅ [Upload API] Authentication successful');

  // Check database (Supabase Postgres) connection
  if (!process.env.DATABASE_URL) {
    console.log('⚠️ [Upload API] DATABASE_URL not set');
    return res.status(500).json({
      error: 'Server configuration error: Database not configured',
      help: 'Set DATABASE_URL in .env.local (e.g. postgresql://postgres:[PASSWORD]@db.PROJECT_REF.supabase.co:5432/postgres, use %40 for @ in password)'
    });
  }

  // Check Supabase Storage configuration (images bucket)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('⚠️ [Upload API] Supabase Storage not configured');
    return res.status(500).json({
      error: 'Server configuration error: Supabase Storage not configured',
      help: 'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for the Supabase project'
    });
  }

  try {
    console.log('📋 [Upload API] Parsing form data...');
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });
    console.log('   Max file size: 10MB');

    const [fields, files] = await form.parse(req);
    console.log('✅ [Upload API] Form parsed successfully');

    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const optimize = Array.isArray(fields.optimize) ? fields.optimize[0] : fields.optimize;

    console.log('📁 [Upload API] Category:', category);
    console.log('📄 [Upload API] File received:', file ? 'Yes' : 'No');

    if (!category || !file) {
      console.log('❌ [Upload API] Missing required fields');
      return res.status(400).json({
        error: 'Missing required fields: category and file are required'
      });
    }

    const uploadedFile = file as UploadedFile;
    const mimetype = (uploadedFile.mimetype || '').toLowerCase();
    if (!mimetype.startsWith('image/')) {
      console.log('❌ [Upload API] Invalid file type:', mimetype);
      return res.status(400).json({
        error: 'Invalid file type: only images are allowed (e.g. image/jpeg, image/png, image/webp)'
      });
    }

    // Validate category length (schema: VARCHAR(50))
    if (category.length > 50) {
      console.log('❌ [Upload API] Category name too long:', category.length);
      return res.status(400).json({
        error: 'Category name too long (max 50 characters)'
      });
    }

    const originalBuffer = fs.readFileSync(uploadedFile.filepath);
    const originalSize = originalBuffer.length;

    console.log('📏 [Upload API] Original file size:', (originalSize / 1024 / 1024).toFixed(2), 'MB');
    console.log('📝 [Upload API] Original filename:', uploadedFile.originalFilename);

    // Optimize images for maximum speed
    console.log('🔧 [Upload API] Starting image optimization...');
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
      console.log('✅ [Upload API] Image optimized:', {
        format: optimizedFormat,
        originalSize: (originalSize / 1024).toFixed(2) + ' KB',
        optimizedSize: (optimizedBuffer.length / 1024).toFixed(2) + ' KB',
        compressionRatio: compressionRatio + '%'
      });
    } else {
      optimizedBuffer = originalBuffer;
      optimizedFormat = uploadedFile.mimetype;
      console.log('⏭️ [Upload API] Optimization skipped');
    }

    // Generate ultra-small thumbnail for instant loading
    console.log('🖼️ [Upload API] Creating thumbnail...');
    const thumbnail = await createThumbnail(originalBuffer, 200);
    const thumbnailFileName = `thumb-${Date.now()}-${path.parse(uploadedFile.originalFilename).name}.webp`;
    const fileName = `${Date.now()}-${path.parse(uploadedFile.originalFilename).name}.webp`;
    console.log('✅ [Upload API] Thumbnail created');

    // Upload to DigitalOcean Spaces for fast CDN delivery
    const imageKey = `images/${category}/${fileName}`;
    const thumbnailKey = `images/${category}/${thumbnailFileName}`;

    console.log('☁️ [Upload API] Uploading to DigitalOcean Spaces...');
    console.log('   Image key:', imageKey);
    console.log('   Thumbnail key:', thumbnailKey);

    // Import Supabase storage upload function
    const { uploadToSupabaseStorage } = await import('@/lib/storage/supabaseStorage');

    // Upload to Supabase Storage (images bucket)
    console.log('⬆️ [Upload API] Uploading main image to Supabase Storage...');
    const imageUrl = await uploadToSupabaseStorage(imageKey, optimizedBuffer, optimizedFormat, {
      cacheControl: 'public, max-age=31536000, immutable', // 1 year cache
      metadata: {
        category,
        originalFilename: uploadedFile.originalFilename,
      },
    });
    console.log('✅ [Upload API] Main image uploaded:', imageUrl);

    // Upload thumbnail to Supabase Storage
    let thumbnailUrl: string;
    try {
      console.log('⬆️ [Upload API] Uploading thumbnail to Supabase Storage...');
      thumbnailUrl = await uploadToSupabaseStorage(thumbnailKey, thumbnail.buffer, 'image/webp', {
        cacheControl: 'public, max-age=31536000, immutable',
      });
      console.log('✅ [Upload API] Thumbnail uploaded:', thumbnailUrl);
    } catch (thumbnailError) {
      console.warn('⚠️ [Upload API] Thumbnail upload error (non-critical):', thumbnailError);
      thumbnailUrl = imageUrl; // Fallback to main image
    }

    // Save metadata to PostgreSQL database
    console.log('💾 [Upload API] Saving to database...');
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

    console.log('✅ [Upload API] Database saved:', dbData.id);

    // Clean up temp file
    console.log('🗑️ [Upload API] Cleaning up temp file...');
    fs.unlinkSync(uploadedFile.filepath);

    const response = {
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
    };

    console.log('🎉 [Upload API] Upload successful!');
    console.log('   Image URL:', dbData.url);
    console.log('   Thumbnail URL:', thumbnailUrl);
    console.log('   Database ID:', dbData.id);

    return res.status(200).json(response);
  } catch (uploadError: any) {
    console.error('❌ [Upload API] Upload error:', uploadError);
    console.error('   Error name:', uploadError.name);
    console.error('   Error message:', uploadError.message);
    console.error('   Error stack:', uploadError.stack);

    return res.status(500).json({
      error: 'Failed to upload image',
      details: uploadError.message,
      help: 'Please check server logs for more details. Common issues: file permissions, disk space, DigitalOcean Spaces credentials'
    });
  }
}

export default handler;
