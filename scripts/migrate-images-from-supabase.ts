/**
 * Migration Script: Download all images from Supabase Storage to local filesystem
 * 
 * This script:
 * 1. Fetches all image records from Supabase database
 * 2. Downloads each image from Supabase Storage
 * 3. Saves to public/images/migrated/{category}/{filename}
 * 4. Creates a migration log for reference
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

interface ImageRecord {
  id: string;
  category: string;
  subcategory: string;
  filename: string;
  url: string;
  storage_path: string;
  thumbnail_url?: string;
  file_size?: number;
  mime_type?: string;
}

interface MigrationStats {
  total: number;
  downloaded: number;
  failed: number;
  skipped: number;
  totalSize: number;
}

interface MigrationLogEntry {
  id: string;
  filename: string;
  category: string;
  status: 'success' | 'failed' | 'skipped';
  localPath?: string;
  error?: string;
  originalUrl?: string;
}

async function ensureDirectoryExists(dirPath: string) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function downloadImage(
  storagePath: string,
  localPath: string,
  isThumbnail: boolean = false
): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('images')
      .download(storagePath);

    if (error) {
      console.error(`   ❌ Download error: ${error.message}`);
      return false;
    }

    if (!data) {
      console.error(`   ❌ No data returned for ${storagePath}`);
      return false;
    }

    // Convert blob to buffer
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure directory exists
    const dir = path.dirname(localPath);
    await ensureDirectoryExists(dir);

    // Write file
    await writeFile(localPath, buffer);

    return true;
  } catch (error: any) {
    console.error(`   ❌ Error downloading ${storagePath}:`, error.message);
    return false;
  }
}

async function migrateImages() {
  console.log('🚀 Starting image migration from Supabase Storage...\n');

  const stats: MigrationStats = {
    total: 0,
    downloaded: 0,
    failed: 0,
    skipped: 0,
    totalSize: 0,
  };

  const migrationLog: MigrationLogEntry[] = [];

  try {
    // 1. Fetch all images from database
    console.log('📥 Fetching image records from Supabase database...');
    const { data: images, error: dbError } = await supabaseAdmin
      .from('images')
      .select('*')
      .order('category', { ascending: true });

    if (dbError) {
      console.error('❌ Database error:', dbError);
      process.exit(1);
    }

    if (!images || images.length === 0) {
      console.log('⚠️  No images found in database');
      return;
    }

    stats.total = images.length;
    console.log(`✅ Found ${stats.total} images in database\n`);

    // 2. Download each image
    console.log('📥 Downloading images...\n');
    const outputDir = path.join(process.cwd(), 'public', 'images', 'migrated');

    for (let i = 0; i < images.length; i++) {
      const image = images[i] as ImageRecord;
      const progress = `[${i + 1}/${stats.total}]`;

      console.log(`${progress} Processing: ${image.filename} (${image.category})`);

      // Create local path structure: public/images/migrated/{category}/{filename}
      const categoryDir = path.join(outputDir, image.category);
      const localPath = path.join(categoryDir, image.filename);

      // Check if file already exists
      if (fs.existsSync(localPath)) {
        console.log(`   ⏭️  Already exists, skipping...`);
        stats.skipped++;
        migrationLog.push({
          id: image.id,
          filename: image.filename,
          category: image.category,
          status: 'skipped',
          localPath: `/images/migrated/${image.category}/${image.filename}`,
          originalUrl: image.url,
        });
        continue;
      }

      // Download main image
      const downloaded = await downloadImage(image.storage_path, localPath);

      if (downloaded) {
        stats.downloaded++;
        if (image.file_size) {
          stats.totalSize += image.file_size;
        }

        // Download thumbnail if exists
        if (image.thumbnail_url && image.storage_path) {
          const thumbnailPath = image.storage_path.replace(
            /\.(jpg|jpeg|png|webp)$/i,
            '_thumb.webp'
          );
          const localThumbnailPath = path.join(
            categoryDir,
            path.basename(thumbnailPath)
          );

          await downloadImage(thumbnailPath, localThumbnailPath, true);
        }

        const relativePath = `/images/migrated/${image.category}/${image.filename}`;

        migrationLog.push({
          id: image.id,
          filename: image.filename,
          category: image.category,
          status: 'success',
          localPath: relativePath,
          originalUrl: image.url,
        });

        console.log(`   ✅ Downloaded to: ${relativePath}`);
      } else {
        stats.failed++;
        migrationLog.push({
          id: image.id,
          filename: image.filename,
          category: image.category,
          status: 'failed',
          error: 'Download failed',
          originalUrl: image.url,
        });
      }

      // Small delay to avoid rate limiting
      if (i < images.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // 3. Save migration log
    const logPath = path.join(process.cwd(), 'migration-images-log.json');
    await writeFile(logPath, JSON.stringify(migrationLog, null, 2));
    console.log(`\n📝 Migration log saved to: ${logPath}`);

    // 4. Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary');
    console.log('='.repeat(50));
    console.log(`Total images:     ${stats.total}`);
    console.log(`✅ Downloaded:    ${stats.downloaded}`);
    console.log(`⏭️  Skipped:       ${stats.skipped}`);
    console.log(`❌ Failed:         ${stats.failed}`);
    console.log(`📦 Total size:     ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📁 Output dir:     ${outputDir}`);
    console.log('='.repeat(50));

    if (stats.failed > 0) {
      console.log('\n⚠️  Some images failed to download. Check the migration log for details.');
    } else {
      console.log('\n✅ All images migrated successfully!');
    }
  } catch (error: any) {
    console.error('\n❌ Migration error:', error);
    process.exit(1);
  }
}

// Run migration
migrateImages()
  .then(() => {
    console.log('\n✨ Migration complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });

