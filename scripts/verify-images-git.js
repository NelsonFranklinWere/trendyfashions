const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Verifying image tracking in Git...\n');

const imagesDir = path.join(process.cwd(), 'public', 'images');
const trackedFiles = execSync('git ls-files public/images/', { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(Boolean);

const allImageFiles = [];
function getAllImages(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllImages(filePath);
    } else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
      const relPath = path.relative(process.cwd(), filePath);
      allImageFiles.push(relPath);
    }
  });
}

getAllImages(imagesDir);

console.log(`📊 Total images in filesystem: ${allImageFiles.length}`);
console.log(`📊 Total images tracked in Git: ${trackedFiles.length}\n`);

const untracked = allImageFiles.filter(f => !trackedFiles.includes(f));
const missing = trackedFiles.filter(f => !fs.existsSync(f));

if (untracked.length > 0) {
  console.log(`⚠️  ${untracked.length} images NOT tracked in Git:`);
  untracked.slice(0, 10).forEach(f => console.log(`   - ${f}`));
  if (untracked.length > 10) {
    console.log(`   ... and ${untracked.length - 10} more`);
  }
  console.log('');
}

if (missing.length > 0) {
  console.log(`⚠️  ${missing.length} tracked files missing from filesystem:`);
  missing.slice(0, 10).forEach(f => console.log(`   - ${f}`));
  if (missing.length > 10) {
    console.log(`   ... and ${missing.length - 10} more`);
  }
  console.log('');
}

if (untracked.length === 0 && missing.length === 0) {
  console.log('✅ All images are properly tracked in Git!');
} else {
  console.log('❌ Action needed: Some images need to be added to Git');
  console.log('\nTo fix, run:');
  if (untracked.length > 0) {
    console.log(`   git add ${untracked.slice(0, 5).join(' ')}${untracked.length > 5 ? ' ...' : ''}`);
    console.log(`   # Or add all: git add public/images/`);
  }
}

