const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const categories = ['formal', 'casual', 'customized', 'sneakers', 'running', 'sports'];

console.log('🔄 Ensuring unique image names for order tracking...\n');

const allImageNames = new Map(); // filename -> array of full paths
const duplicates = [];

// Scan all categories
categories.forEach(category => {
  const categoryDir = path.join(IMAGES_DIR, category);
  if (!fs.existsSync(categoryDir)) return;

  const files = fs.readdirSync(categoryDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

  files.forEach(file => {
    const lower = file.toLowerCase();
    const fullPath = path.join(categoryDir, file);
    
    if (!allImageNames.has(lower)) {
      allImageNames.set(lower, []);
    }
    allImageNames.get(lower).push({ category, file, fullPath });
  });
});

// Find duplicates
allImageNames.forEach((paths, filename) => {
  if (paths.length > 1) {
    duplicates.push({ filename, paths });
  }
});

if (duplicates.length === 0) {
  console.log('✅ No duplicate image names found. All images have unique names!\n');
} else {
  console.log(`⚠️  Found ${duplicates.length} duplicate image names:\n`);
  
  let renamed = 0;
  
  duplicates.forEach(({ filename, paths }) => {
    console.log(`📁 ${filename} appears in:`);
    paths.forEach((path, index) => {
      console.log(`   ${index + 1}. ${path.category}/${path.file}`);
    });
    
    // Rename duplicates to include category and index
    paths.forEach((pathInfo, index) => {
      if (index === 0) {
        // Keep first one as is
        console.log(`   ✅ Keeping: ${pathInfo.category}/${pathInfo.file}`);
        return;
      }
      
      // Rename others to include category prefix
      const ext = path.extname(pathInfo.file);
      const base = path.basename(pathInfo.file, ext);
      const newName = `${pathInfo.category}-${base}${ext}`;
      const newPath = path.join(path.dirname(pathInfo.fullPath), newName);
      
      // Check if new name already exists
      if (fs.existsSync(newPath)) {
        // Add index if still duplicate
        const finalName = `${pathInfo.category}-${base}-${index}${ext}`;
        const finalPath = path.join(path.dirname(pathInfo.fullPath), finalName);
        try {
          fs.renameSync(pathInfo.fullPath, finalPath);
          console.log(`   ✅ Renamed: ${pathInfo.file} → ${finalName}`);
          renamed++;
        } catch (error) {
          console.log(`   ❌ Error renaming ${pathInfo.file}: ${error.message}`);
        }
      } else {
        try {
          fs.renameSync(pathInfo.fullPath, newPath);
          console.log(`   ✅ Renamed: ${pathInfo.file} → ${newName}`);
          renamed++;
        } catch (error) {
          console.log(`   ❌ Error renaming ${pathInfo.file}: ${error.message}`);
        }
      }
    });
    console.log('');
  });
  
  console.log(`📊 Renamed ${renamed} files to ensure uniqueness\n`);
}

// Check for problematic characters in filenames
console.log('🔍 Checking for problematic characters in filenames...\n');
let problematic = 0;

categories.forEach(category => {
  const categoryDir = path.join(IMAGES_DIR, category);
  if (!fs.existsSync(categoryDir)) return;

  const files = fs.readdirSync(categoryDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

  files.forEach(file => {
    // Check for spaces, special characters that might cause issues in URLs
    if (file.includes(' ') || file.includes('@') || file.includes('&') || file.includes('#')) {
      const newName = file
        .replace(/\s+/g, '-')
        .replace(/@/g, '-at-')
        .replace(/&/g, '-and-')
        .replace(/#/g, '-hash-')
        .replace(/[^a-zA-Z0-9._-]/g, '-');
      
      const oldPath = path.join(categoryDir, file);
      const newPath = path.join(categoryDir, newName);
      
      if (file !== newName && !fs.existsSync(newPath)) {
        try {
          fs.renameSync(oldPath, newPath);
          console.log(`  ✅ ${category}/${file} → ${newName}`);
          problematic++;
        } catch (error) {
          console.log(`  ❌ Error: ${file}`);
        }
      }
    }
  });
});

if (problematic === 0) {
  console.log('✅ No problematic characters found\n');
} else {
  console.log(`\n📊 Fixed ${problematic} filenames with problematic characters\n`);
}

console.log('✅ Image name uniqueness check complete!');

