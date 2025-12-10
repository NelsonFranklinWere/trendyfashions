import sharp from 'sharp';

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  progressive?: boolean;
}

export interface OptimizedImageResult {
  buffer: Buffer;
  width: number;
  height: number;
  format: string;
  size: number;
  originalSize: number;
  compressionRatio: number;
}

/**
 * Optimize image for web/mobile - first level optimization
 * Reduces file size while maintaining visual quality
 */
export async function optimizeImage(
  inputBuffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImageResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 85,
    format = 'webp',
    progressive = true,
  } = options;

  const originalSize = inputBuffer.length;
  let image = sharp(inputBuffer);
  const metadata = await image.metadata();

  // Calculate optimal dimensions (maintain aspect ratio)
  let width = metadata.width || maxWidth;
  let height = metadata.height || maxHeight;

  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height;
    if (width > height) {
      width = maxWidth;
      height = Math.round(maxWidth / aspectRatio);
    } else {
      height = maxHeight;
      width = Math.round(maxHeight * aspectRatio);
    }
  }

  // Resize and optimize based on format
  image = image.resize(width, height, {
    fit: 'inside',
    withoutEnlargement: true,
  });

  let optimizedBuffer: Buffer;

  switch (format) {
    case 'webp':
      optimizedBuffer = await image
        .webp({
          quality,
          effort: 2, // Minimal effort for fastest encoding
          smartSubsample: false, // Disable for faster processing
          nearLossless: false, // Disable for better compression
        })
        .toBuffer();
      break;

    case 'avif':
      optimizedBuffer = await image
        .avif({
          quality,
          effort: 4, // AVIF encoding is slower, use lower effort
        })
        .toBuffer();
      break;

    case 'jpeg':
      optimizedBuffer = await image
        .jpeg({
          quality,
          progressive,
          mozjpeg: true, // Use mozjpeg for better compression
        })
        .toBuffer();
      break;

    case 'png':
      optimizedBuffer = await image
        .png({
          quality,
          compressionLevel: 9,
          adaptiveFiltering: true,
        })
        .toBuffer();
      break;

    default:
      optimizedBuffer = await image.webp({ quality }).toBuffer();
  }

  const compressionRatio = ((originalSize - optimizedBuffer.length) / originalSize) * 100;

  return {
    buffer: optimizedBuffer,
    width,
    height,
    format: format === 'webp' ? 'image/webp' : format === 'avif' ? 'image/avif' : `image/${format}`,
    size: optimizedBuffer.length,
    originalSize,
    compressionRatio: Math.round(compressionRatio * 100) / 100,
  };
}

/**
 * Generate multiple sizes for responsive images
 */
export async function generateResponsiveSizes(
  inputBuffer: Buffer,
  sizes: number[] = [640, 768, 1024, 1280, 1920]
): Promise<Array<{ width: number; buffer: Buffer; format: string }>> {
  const results = await Promise.all(
    sizes.map(async (width) => {
      const optimized = await optimizeImage(inputBuffer, {
        maxWidth: width,
        quality: 85,
        format: 'webp',
      });
      return {
        width,
        buffer: optimized.buffer,
        format: optimized.format,
      };
    })
  );

  return results;
}

/**
 * Optimize image for mobile (ultra-compressed for slow connections)
 */
export async function optimizeForMobile(inputBuffer: Buffer): Promise<OptimizedImageResult> {
  return optimizeImage(inputBuffer, {
    maxWidth: 500, // Ultra-small for mobile to load instantly
    maxHeight: 500, // Ultra-small for mobile to load instantly
    quality: 45, // Very low quality for smallest files
    format: 'webp',
  });
}

/**
 * Optimize image for web (ultra-aggressive compression for instant loading)
 * Maximum speed optimization
 */
export async function optimizeForWeb(inputBuffer: Buffer): Promise<OptimizedImageResult> {
  return optimizeImage(inputBuffer, {
    maxWidth: 600, // Ultra-reduced for instant loading
    maxHeight: 600, // Ultra-reduced for instant loading
    quality: 50, // Very low quality for smallest file sizes
    format: 'webp',
  });
}

/**
 * Create thumbnail (ultra-small preview for instant loading)
 */
export async function createThumbnail(
  inputBuffer: Buffer,
  size: number = 200 // Ultra-small thumbnails for instant loading
): Promise<OptimizedImageResult> {
  return optimizeImage(inputBuffer, {
    maxWidth: size,
    maxHeight: size,
    quality: 45, // Very low quality for tiny file sizes
    format: 'webp',
  });
}

/**
 * Detect if image should be optimized (check if already optimized)
 * Ultra-low threshold to optimize ALL images for maximum speed
 */
export function shouldOptimize(
  buffer: Buffer,
  maxSize: number = 50 * 1024 // 50KB - optimize all images above this size
): boolean {
  return buffer.length > maxSize;
}
