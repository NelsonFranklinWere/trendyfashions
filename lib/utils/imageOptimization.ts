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
 * Optimize image for web/mobile — sharp resize + encode.
 */
export async function optimizeImage(
  inputBuffer: Buffer,
  options: ImageOptimizationOptions = {},
): Promise<OptimizedImageResult> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 78,
    format = 'webp',
    progressive = true,
  } = options;

  const originalSize = inputBuffer.length;
  let image = sharp(inputBuffer);
  const metadata = await image.metadata();

  let width = metadata.width || maxWidth;
  let height = metadata.height || maxHeight;

  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height;
    if (width >= height) {
      width = maxWidth;
      height = Math.round(maxWidth / aspectRatio);
    } else {
      height = maxHeight;
      width = Math.round(maxHeight * aspectRatio);
    }
  }

  image = image.rotate().resize(width, height, {
    fit: 'inside',
    withoutEnlargement: true,
  });

  let optimizedBuffer: Buffer;

  switch (format) {
    case 'webp':
      optimizedBuffer = await image
        .webp({
          quality,
          effort: 4,
          smartSubsample: true,
        })
        .toBuffer();
      break;
    case 'avif':
      optimizedBuffer = await image
        .avif({
          quality,
          effort: 4,
        })
        .toBuffer();
      break;
    case 'jpeg':
      optimizedBuffer = await image
        .jpeg({
          quality,
          progressive,
          mozjpeg: true,
        })
        .toBuffer();
      break;
    case 'png':
      optimizedBuffer = await image
        .png({
          compressionLevel: 8,
          adaptiveFiltering: true,
        })
        .toBuffer();
      break;
    default:
      optimizedBuffer = await image.webp({ quality, effort: 4 }).toBuffer();
  }

  const compressionRatio = ((originalSize - optimizedBuffer.length) / originalSize) * 100;

  return {
    buffer: optimizedBuffer,
    width,
    height,
    format:
      format === 'webp'
        ? 'image/webp'
        : format === 'avif'
          ? 'image/avif'
          : `image/${format}`,
    size: optimizedBuffer.length,
    originalSize,
    compressionRatio: Math.round(compressionRatio * 100) / 100,
  };
}

/**
 * Multiple widths for responsive delivery (optional pipeline).
 */
export async function generateResponsiveSizes(
  inputBuffer: Buffer,
  sizes: number[] = [480, 720, 1080, 1440],
): Promise<Array<{ width: number; buffer: Buffer; format: string }>> {
  return Promise.all(
    sizes.map(async (w) => {
      const optimized = await optimizeImage(inputBuffer, {
        maxWidth: w,
        maxHeight: w,
        quality: w <= 480 ? 72 : 78,
        format: 'webp',
      });
      return {
        width: w,
        buffer: optimized.buffer,
        format: optimized.format,
      };
    }),
  );
}

/** Compact icons / search chips (not product cards). */
export async function optimizeForMobile(inputBuffer: Buffer): Promise<OptimizedImageResult> {
  return optimizeImage(inputBuffer, {
    maxWidth: 360,
    maxHeight: 360,
    quality: 68,
    format: 'webp',
  });
}

/**
 * Full product image stored for PDP + grid.
 * ~1200px keeps retina product tiles sharp while staying web-friendly.
 */
export async function optimizeForWeb(inputBuffer: Buffer): Promise<OptimizedImageResult> {
  return optimizeImage(inputBuffer, {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 78,
    format: 'webp',
  });
}

/**
 * Card / grid thumbnail — wide enough for 2–3x mobile columns (not 200px stubs).
 */
export async function createThumbnail(
  inputBuffer: Buffer,
  size: number = 720,
): Promise<OptimizedImageResult> {
  return optimizeImage(inputBuffer, {
    maxWidth: size,
    maxHeight: size,
    quality: 74,
    format: 'webp',
  });
}

/** Tiny blur / admin list only */
export async function createTinyThumb(
  inputBuffer: Buffer,
  size: number = 160,
): Promise<OptimizedImageResult> {
  return optimizeImage(inputBuffer, {
    maxWidth: size,
    maxHeight: size,
    quality: 55,
    format: 'webp',
  });
}

export function shouldOptimize(
  buffer: Buffer,
  maxSize: number = 40 * 1024,
): boolean {
  return buffer.length > maxSize;
}
