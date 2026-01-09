const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const QUALITY = 75; // JPEG quality (1-100)
const MAX_WIDTH = 1920; // Max width in pixels
const MAX_HEIGHT = 1920; // Max height in pixels

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Statistics
let stats = {
  total: 0,
  compressed: 0,
  skipped: 0,
  errors: 0,
  originalSize: 0,
  compressedSize: 0,
};

/**
 * Get file size in bytes
 */
function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch (error) {
    return 0;
  }
}

/**
 * Compress a single image file
 */
async function compressImage(filePath) {
  try {
    const originalSize = getFileSize(filePath);
    if (originalSize === 0) {
      stats.skipped++;
      return;
    }

    stats.originalSize += originalSize;

    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    const isJpeg = ext === '.jpg' || ext === '.jpeg';

    // Read image metadata
    const metadata = await sharp(filePath).metadata();
    
    // Calculate new dimensions (maintain aspect ratio)
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
      if (width > height) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      } else {
        width = Math.round((width * MAX_HEIGHT) / height);
        height = MAX_HEIGHT;
      }
    }

    // Create temporary file path
    const tempPath = filePath + '.tmp';

    // Compress image
    let sharpInstance = sharp(filePath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      });

    if (isJpeg) {
      sharpInstance = sharpInstance.jpeg({
        quality: QUALITY,
        progressive: true,
        mozjpeg: true,
      });
    } else if (ext === '.png') {
      sharpInstance = sharpInstance.png({
        quality: QUALITY,
        compressionLevel: 9,
      });
    } else if (ext === '.webp') {
      sharpInstance = sharpInstance.webp({
        quality: QUALITY,
      });
    }

    await sharpInstance.toFile(tempPath);

    // Check if compression was successful and file is smaller
    const compressedSize = getFileSize(tempPath);
    
    if (compressedSize < originalSize) {
      // Replace original with compressed version
      fs.renameSync(tempPath, filePath);
      stats.compressed++;
      stats.compressedSize += compressedSize;
      const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      console.log(`✅ Compressed: ${path.basename(filePath)} (${(originalSize / 1024).toFixed(1)}KB → ${(compressedSize / 1024).toFixed(1)}KB, ${savings}% saved)`);
    } else {
      // Keep original if compressed version is larger
      fs.unlinkSync(tempPath);
      stats.skipped++;
      stats.compressedSize += originalSize;
      console.log(`⏭️  Skipped: ${path.basename(filePath)} (already optimized)`);
    }
  } catch (error) {
    stats.errors++;
    console.error(`❌ Error compressing ${filePath}:`, error.message);
  }
}

/**
 * Process all images in a directory recursively
 */
async function processDirectory(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Recursively process subdirectories
        await processDirectory(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (IMAGE_EXTENSIONS.includes(ext)) {
          stats.total++;
          await compressImage(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error.message);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting image compression...\n');
  console.log(`Settings: Quality=${QUALITY}, Max dimensions=${MAX_WIDTH}x${MAX_HEIGHT}\n`);

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Images directory not found: ${IMAGES_DIR}`);
    process.exit(1);
  }

  await processDirectory(IMAGES_DIR);

  // Print statistics
  console.log('\n' + '='.repeat(60));
  console.log('📊 Compression Statistics:');
  console.log('='.repeat(60));
  console.log(`Total images processed: ${stats.total}`);
  console.log(`Successfully compressed: ${stats.compressed}`);
  console.log(`Skipped (already optimized): ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`\nOriginal total size: ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Compressed total size: ${(stats.compressedSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (stats.originalSize > 0) {
    const totalSavings = ((1 - stats.compressedSize / stats.originalSize) * 100).toFixed(1);
    const savedMB = ((stats.originalSize - stats.compressedSize) / 1024 / 1024).toFixed(2);
    console.log(`Total space saved: ${savedMB} MB (${totalSavings}%)`);
  }
  console.log('='.repeat(60));
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
