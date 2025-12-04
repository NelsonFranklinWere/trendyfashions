import fs from 'fs';
import path from 'path';
import { optimizeForWeb, optimizeForMobile } from '../lib/utils/imageOptimization';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const OPTIMIZED_DIR = path.join(process.cwd(), 'public', 'images-optimized');

interface OptimizationStats {
  total: number;
  optimized: number;
  skipped: number;
  totalOriginalSize: number;
  totalOptimizedSize: number;
  errors: number;
}

async function optimizeExistingImages(): Promise<void> {
  console.log('🔄 Optimizing existing images...\n');

  // Create optimized directory
  if (!fs.existsSync(OPTIMIZED_DIR)) {
    fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
  }

  const stats: OptimizationStats = {
    total: 0,
    optimized: 0,
    skipped: 0,
    totalOriginalSize: 0,
    totalOptimizedSize: 0,
    errors: 0,
  };

  // Process all image files
  function processDirectory(dir: string, relativePath: string = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativeFilePath = path.join(relativePath, entry.name);

      if (entry.isDirectory()) {
        // Create corresponding directory in optimized folder
        const optimizedSubDir = path.join(OPTIMIZED_DIR, relativeFilePath);
        if (!fs.existsSync(optimizedSubDir)) {
          fs.mkdirSync(optimizedSubDir, { recursive: true });
        }
        processDirectory(fullPath, relativeFilePath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          stats.total++;
          optimizeImage(fullPath, relativeFilePath, ext);
        }
      }
    }
  }

  async function optimizeImage(filePath: string, relativePath: string, ext: string) {
    try {
      const originalBuffer = fs.readFileSync(filePath);
      const originalSize = originalBuffer.length;
      stats.totalOriginalSize += originalSize;

      // Skip if already small
      if (originalSize < 100 * 1024) {
        // Less than 100KB
        stats.skipped++;
        console.log(`⏭️  Skipped (already small): ${relativePath}`);
        return;
      }

      // Optimize for web
      const optimized = await optimizeForWeb(originalBuffer);
      stats.totalOptimizedSize += optimized.size;

      // Save optimized image
      const optimizedPath = path.join(OPTIMIZED_DIR, relativePath.replace(ext, '.webp'));
      const optimizedDir = path.dirname(optimizedPath);
      if (!fs.existsSync(optimizedDir)) {
        fs.mkdirSync(optimizedDir, { recursive: true });
      }

      fs.writeFileSync(optimizedPath, optimized.buffer);
      stats.optimized++;

      const compressionRatio = ((originalSize - optimized.size) / originalSize) * 100;
      console.log(
        `✅ ${relativePath}: ${(originalSize / 1024).toFixed(2)}KB → ${(optimized.size / 1024).toFixed(2)}KB (${compressionRatio.toFixed(1)}% reduction)`
      );
    } catch (error: any) {
      stats.errors++;
      console.error(`❌ Error optimizing ${relativePath}:`, error.message);
    }
  }

  // Start processing
  processDirectory(IMAGES_DIR);

  // Wait for all optimizations to complete
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Print summary
  console.log('\n📊 Summary:');
  console.log('─'.repeat(60));
  console.log(`Total images: ${stats.total}`);
  console.log(`Optimized: ${stats.optimized}`);
  console.log(`Skipped: ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`Original total size: ${(stats.totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized total size: ${(stats.totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  const totalCompression = ((stats.totalOriginalSize - stats.totalOptimizedSize) / stats.totalOriginalSize) * 100;
  console.log(`Total compression: ${totalCompression.toFixed(1)}%`);
  console.log(`\n✅ Optimized images saved to: ${OPTIMIZED_DIR}`);
  console.log(`\n⚠️  Review optimized images before replacing originals!`);
}

// Run the script
if (require.main === module) {
  optimizeExistingImages().catch(console.error);
}

export { optimizeExistingImages };
