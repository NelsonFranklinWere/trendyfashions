const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying images for Vercel deployment...\n');

// Check featured category images
const featuredImages = [
  '/images/officials/ClarksOfficials1.jpg',
  '/images/sneakers/Addidas-samba.jpg',
  '/images/casual/Cassualss1.jpg',
  '/images/airforce/Af1customized1-1.jpg',
  '/images/vans/Skater-Vans.jpg',
  '/images/airmax/Air-Max97.jpg',
  '/images/jordan/J11.jpg',
  '/images/other/AS3HIGHCUTS-1.jpg',
];

console.log('📋 Checking featured category images:');
let allExist = true;
featuredImages.forEach(imgPath => {
  const fullPath = path.join(process.cwd(), 'public', imgPath);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  console.log(`   ${status} ${imgPath}`);
  if (!exists) allExist = false;
});

console.log('');

// Check folder structure
const folders = ['formal', 'sneakers', 'casual', 'airforce', 'vans', 'airmax', 'jordan', 'other'];
console.log('📁 Checking folder structure:');
folders.forEach(folder => {
  const folderPath = path.join(process.cwd(), 'public', 'images', folder);
  const exists = fs.existsSync(folderPath);
  if (exists) {
    const files = fs.readdirSync(folderPath).filter(f => 
      /\.(jpg|jpeg|png|webp)$/i.test(f)
    );
    console.log(`   ✅ ${folder}/ (${files.length} images)`);
  } else {
    console.log(`   ❌ ${folder}/ (missing)`);
    allExist = false;
  }
});

console.log('');

// Check for problematic file names
console.log('🔍 Checking for problematic file names:');
const problematic = [];
function checkFolder(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      checkFolder(filePath);
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
      // Check for spaces, special chars, or very long names
      if (file.includes(' ') || file.length > 100 || /[^a-zA-Z0-9._-]/.test(file)) {
        problematic.push(path.relative(path.join(process.cwd(), 'public'), filePath));
      }
    }
  });
}

checkFolder(path.join(process.cwd(), 'public', 'images'));

if (problematic.length > 0) {
  console.log(`   ⚠️  Found ${problematic.length} files with potentially problematic names:`);
  problematic.slice(0, 10).forEach(f => console.log(`      - ${f}`));
  if (problematic.length > 10) {
    console.log(`      ... and ${problematic.length - 10} more`);
  }
} else {
  console.log('   ✅ All file names look good');
}

console.log('');

// Summary
if (allExist && problematic.length === 0) {
  console.log('✅ All checks passed! Images should work on Vercel.');
  console.log('');
  console.log('If images still don\'t display on Vercel:');
  console.log('   1. Check Vercel build logs for errors');
  console.log('   2. Verify the build completed successfully');
  console.log('   3. Check Vercel function logs for image loading errors');
  console.log('   4. Ensure Next.js image optimization is working');
  console.log('   5. Try clearing Vercel cache and redeploying');
} else {
  console.log('❌ Some issues found. Please fix them before deploying.');
}

