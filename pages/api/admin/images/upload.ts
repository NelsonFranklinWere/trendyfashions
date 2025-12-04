import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { optimizeForWeb, optimizeForMobile, createThumbnail, shouldOptimize } from '@/lib/utils/imageOptimization';

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

  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ 
      error: 'Supabase configuration missing',
      details: 'Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file'
    });
  }

  // Require authentication
  const { requireAuth } = await import('@/lib/auth/middleware');
  const isAuthenticated = await requireAuth(req as any, res);
  if (!isAuthenticated) {
    return;
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    
    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
    const subcategory = Array.isArray(fields.subcategory) ? fields.subcategory[0] : fields.subcategory;
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const optimize = Array.isArray(fields.optimize) ? fields.optimize[0] : fields.optimize;

    if (!category || !subcategory || !file) {
      return res.status(400).json({ 
        error: 'Missing required fields: category, subcategory, and file are required' 
      });
    }

    const uploadedFile = file as UploadedFile;
    const originalBuffer = fs.readFileSync(uploadedFile.filepath);
    const originalSize = originalBuffer.length;

    // Optimize images before upload
    let optimizedBuffer: Buffer;
    let optimizedFormat = 'image/webp';
    let width: number | undefined;
    let height: number | undefined;
    let compressionRatio = 0;

    if (optimize !== 'false' && shouldOptimize(originalBuffer)) {
      // Optimize for web (balanced quality)
      const optimized = await optimizeForWeb(originalBuffer);
      optimizedBuffer = optimized.buffer;
      optimizedFormat = optimized.format;
      width = optimized.width;
      height = optimized.height;
      compressionRatio = optimized.compressionRatio;
    } else {
      // Use original if optimization disabled or file is already small
      optimizedBuffer = originalBuffer;
      optimizedFormat = uploadedFile.mimetype;
    }

    // Generate thumbnail for faster loading
    const thumbnail = await createThumbnail(originalBuffer, 300);
    const thumbnailFileName = `thumb-${Date.now()}-${path.parse(uploadedFile.originalFilename).name}.webp`;
    const thumbnailPath = `${category}/${subcategory}/${thumbnailFileName}`;

    const fileName = `${Date.now()}-${path.parse(uploadedFile.originalFilename).name}.webp`;
    const storagePath = `${category}/${subcategory}/${fileName}`;

    // Upload optimized image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('images')
      .upload(storagePath, optimizedBuffer, {
        contentType: optimizedFormat,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload image to storage', details: uploadError.message });
    }

    // Upload thumbnail
    const { error: thumbnailError } = await supabaseAdmin.storage
      .from('images')
      .upload(thumbnailPath, thumbnail.buffer, {
        contentType: 'image/webp',
        upsert: false,
      });

    if (thumbnailError) {
      console.warn('Thumbnail upload error (non-critical):', thumbnailError);
    }

    // Get public URLs
    const { data: urlData } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(storagePath);

    const { data: thumbnailUrlData } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(thumbnailPath);

    // Save metadata to database
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('images')
      .insert({
        category,
        subcategory,
        filename: uploadedFile.originalFilename,
        url: urlData.publicUrl,
        storage_path: storagePath,
        file_size: optimizedBuffer.length,
        mime_type: optimizedFormat,
        width: width || undefined,
        height: height || undefined,
        uploaded_by: 'admin', // TODO: Get from auth token
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Try to delete uploaded files if DB insert fails
      await supabaseAdmin.storage.from('images').remove([storagePath, thumbnailPath]);
      return res.status(500).json({ error: 'Failed to save image metadata', details: dbError.message });
    }

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
        thumbnailUrl: thumbnailUrlData.publicUrl,
      },
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

export default handler;
