const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const VANS_DIR = path.join(IMAGES_DIR, 'vans');

// Create vans folder if it doesn't exist
if (!fs.existsSync(VANS_DIR)) {
  fs.mkdirSync(VANS_DIR, { recursive: true });
  console.log('✅ Created vans folder');
}

console.log('🔄 Moving vans images to vans folder...\n');

// Find all vans images in all folders
const folders = ['sneakers', 'casual', 'customized', 'other'];
let moved = 0;
let skipped = 0;

folders.forEach(folder => {
  const folderPath = path.join(IMAGES_DIR, folder);
  if (!fs.existsSync(folderPath)) return;

  const files = fs.readdirSync(folderPath)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .filter(file => {
      const lower = file.toLowerCase();
      return lower.includes('vans');
    });

  files.forEach(file => {
    const sourcePath = path.join(folderPath, file);
    const targetPath = path.join(VANS_DIR, file);

    // Skip if already in vans folder
    if (path.dirname(sourcePath) === VANS_DIR) {
      return;
    }

    // Skip if target exists
    if (fs.existsSync(targetPath)) {
      console.log(`⚠️  Skipping ${file} - already exists in vans folder`);
      skipped++;
      return;
    }

    try {
      fs.renameSync(sourcePath, targetPath);
      console.log(`✅ Moved: ${folder}/${file} → vans/`);
      moved++;
    } catch (error) {
      console.error(`❌ Error moving ${file}:`, error.message);
    }
  });
});

console.log(`\n📊 Summary:`);
console.log(`   Moved: ${moved}`);
console.log(`   Skipped: ${skipped}`);
console.log(`\n✅ Complete!`);

