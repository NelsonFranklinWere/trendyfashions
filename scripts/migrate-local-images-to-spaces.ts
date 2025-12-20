/**
 * Migration Script: Upload local images to DigitalOcean Spaces
 * 
 * This script:
 * 1. Reads all local images from public/images/migrated/
 * 2. Uploads them to DigitalOcean Spaces
 * 3. Updates database URLs to point to Spaces CDN
 */

import { uploadToSpaces, getSpacesUrl } from '../lib/storage/spaces';
import { query } from '../lib/db/postgres';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import { promisify } from 'util';

// Load environment variables
config({ path: '.env.local' });

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

interface MigrationStats {
  total: number;
  uploaded: number;
  failed: number;
  skipped: number;
  updated: number;
}

async function migrateImagesToSpaces() {
  console.log('🚀 Starting migration of local images to DigitalOcean Spaces...\n');

  const stats: MigrationStats = {
    total: 0,
    uploaded: 0,
    failed: 0,
    skipped: 0,
    updated: 0,
  };

  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'migrated');
    
    if (!fs.existsSync(imagesDir)) {
      console.log('⚠️  No local images directory found');
      return;
    }

    // Get all category directories
    const categories = await readdir(imagesDir);
    
    for (const category of categories) {
      const categoryPath = path.join(imagesDir, category);
      const categoryStat = await stat(categoryPath);
      
      if (!categoryStat.isDirectory()) continue;

      console.log(`\n📁 Processing category: ${category}`);
      
      const files = await readdir(categoryPath);
      const imageFiles = files.filter(f => 
        /\.(jpg|jpeg|png|webp)$/i.test(f) && !f.startsWith('thumb-')
      );

      for (const file of imageFiles) {
        stats.total++;
        const filePath = path.join(categoryPath, file);
        const fileBuffer = await readFile(filePath);
        
        const spacesKey = `images/${category}/${file}`;
        
        try {
          // Check if already exists in database with Spaces URL
          const existing = await query(
            `SELECT id, url FROM images WHERE filename = $1 AND url LIKE '%digitaloceanspaces.com%'`,
            [file]
          );

          if (existing.rows.length > 0) {
            console.log(`   ⏭️  ${file} already in Spaces, skipping...`);
            stats.skipped++;
            continue;
          }

          // Upload to Spaces
          const contentType = file.endsWith('.webp') ? 'image/webp' : 
                             file.endsWith('.png') ? 'image/png' : 'image/jpeg';
          
          const cdnUrl = await uploadToSpaces(spacesKey, fileBuffer, contentType, {
            cacheControl: 'public, max-age=31536000, immutable',
            metadata: {
              category,
              filename: file,
            },
          });

          console.log(`   ✅ Uploaded: ${file} → ${cdnUrl}`);

          // Update database with Spaces URL
          const updateResult = await query(
            `UPDATE images SET url = $1, storage_path = $2 WHERE filename = $3 AND category = $4`,
            [cdnUrl, spacesKey, file, category]
          );

          if (updateResult.rowCount > 0) {
            stats.updated++;
            console.log(`   ✅ Updated database URL`);
          }

          stats.uploaded++;
        } catch (error: any) {
          console.error(`   ❌ Error uploading ${file}:`, error.message);
          stats.failed++;
        }
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary');
    console.log('='.repeat(50));
    console.log(`Total images:     ${stats.total}`);
    console.log(`✅ Uploaded:       ${stats.uploaded}`);
    console.log(`⏭️  Skipped:        ${stats.skipped}`);
    console.log(`🔄 Updated:        ${stats.updated}`);
    console.log(`❌ Failed:         ${stats.failed}`);
    console.log('='.repeat(50));

    if (stats.failed > 0) {
      console.log('\n⚠️  Some images failed to upload. Check errors above.');
    } else {
      console.log('\n✅ All images migrated to DigitalOcean Spaces!');
      console.log('🚀 Images will now load super fast from CDN!');
    }
  } catch (error: any) {
    console.error('\n❌ Migration error:', error);
    process.exit(1);
  }
}

// Run migration
migrateImagesToSpaces()
  .then(() => {
    console.log('\n✨ Migration complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });

