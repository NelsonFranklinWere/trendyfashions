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

const uploadCategoryMapping: Record<string, string> = {
  officials: 'mens-officials',
  'mens-officials': 'mens-officials',
  casuals: 'casual',
  'mens-casuals': 'casual',
  casual: 'casual',
  loafers: 'loafers',
  'mens-loafers': 'loafers',
  nike: 'nike',
  'mens-nike': 'nike',
  sports: 'sports',
  vans: 'vans',
  sneakers: 'sneakers',
  'mens-style': 'mens-style',
};

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

  // Check database connection
  if (!process.env.DATABASE_URL) {
    console.log('⚠️ [Upload API] DATABASE_URL not set');
    return res.status(500).json({
      error: 'Server configuration error: Database not configured',
      help: 'Set DATABASE_URL in .env.local (e.g. postgresql://trendy:PASSWORD@127.0.0.1:5432/trendyfashionzone)'
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

    const rawCategory = Array.isArray(fields.category) ? fields.category[0] : fields.category;
    const category = rawCategory ? (uploadCategoryMapping[String(rawCategory)] || String(rawCategory)) : rawCategory;
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const optimize = Array.isArray(fields.optimize) ? fields.optimize[0] : fields.optimize;
    const rawName = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const rawDescription = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const rawPrice = Array.isArray(fields.price) ? fields.price[0] : fields.price;

    const imageName = rawName ? String(rawName) : undefined;
    const imageDescription = rawDescription ? String(rawDescription) : undefined;
    const parsedPrice = rawPrice !== undefined && rawPrice !== null && String(rawPrice).trim() !== '' ? Number.parseFloat(String(rawPrice)) : NaN;
    const imagePrice = Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : undefined;

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

    // Card-sized thumb (linked name) — sharp enough for grid + retina, still tiny vs originals
    console.log('🖼️ [Upload API] Creating thumbnail...');
    const baseName = path.parse(uploadedFile.originalFilename).name.replace(/[^\w.-]+/g, '-');
    const stamp = Date.now();
    const fileName = `${stamp}-${baseName}.webp`;
    const thumbnail = await createThumbnail(originalBuffer, 720);
    // Same stem as full file so toThumbnailSrc(full) resolves correctly
    const thumbnailFileName = `thumb-${fileName}`;
    console.log('✅ [Upload API] Thumbnail created');

    // Upload to DigitalOcean Spaces for fast CDN delivery
    const imageKey = `images/${category}/${fileName}`;
    const thumbnailKey = `images/${category}/${thumbnailFileName}`;

    console.log('☁️ [Upload API] Saving image files locally...');
    console.log('   Image key:', imageKey);
    console.log('   Thumbnail key:', thumbnailKey);

    const { uploadToLocalStorage } = await import('@/lib/storage/localStorage');

    console.log('⬆️ [Upload API] Writing main image...');
    const imageUrl = await uploadToLocalStorage(imageKey, optimizedBuffer, optimizedFormat);
    console.log('✅ [Upload API] Main image saved:', imageUrl);

    let thumbnailUrl: string;
    try {
      console.log('⬆️ [Upload API] Writing thumbnail...');
      thumbnailUrl = await uploadToLocalStorage(thumbnailKey, thumbnail.buffer, 'image/webp');
      console.log('✅ [Upload API] Thumbnail saved:', thumbnailUrl);
    } catch (thumbnailError) {
      console.warn('⚠️ [Upload API] Thumbnail upload error (non-critical):', thumbnailError);
      thumbnailUrl = imageUrl;
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
      name: imageName,
      description: imageDescription,
      price: imagePrice,
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
