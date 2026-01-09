const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying all image paths in codebase...\n');

const imagesDir = path.join(process.cwd(), 'public', 'images');
const issues = [];

// Get all actual image files
const actualImages = new Set();
function getAllImages(dir, basePath = '') {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllImages(filePath, path.join(basePath, file));
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
      const relPath = `/images/${basePath ? basePath + '/' : ''}${file}`;
      actualImages.add(relPath);
    }
  });
}

getAllImages(imagesDir);

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
featuredImages.forEach(imgPath => {
  const exists = actualImages.has(imgPath);
  const status = exists ? '✅' : '❌';
  console.log(`   ${status} ${imgPath}`);
  if (!exists) {
    issues.push(`Featured image missing: ${imgPath}`);
  }
});

// Check logo
console.log('\n📋 Checking logo:');
const logoPath = '/images/logos/Logo.jpeg';
const logoExists = actualImages.has(logoPath);
console.log(`   ${logoExists ? '✅' : '❌'} ${logoPath}`);
if (!logoExists) {
  issues.push(`Logo missing: ${logoPath}`);
}

// Check contact page image
console.log('\n📋 Checking contact page image:');
const contactImagePath = '/images/officials/Empire-at-Officials1.jpg';
const contactExists = actualImages.has(contactImagePath);
console.log(`   ${contactExists ? '✅' : '❌'} ${contactImagePath}`);
if (!contactExists) {
  issues.push(`Contact image missing: ${contactImagePath}`);
}

// Summary
console.log('\n📊 Summary:');
console.log(`   Total images in filesystem: ${actualImages.size}`);
console.log(`   Issues found: ${issues.length}`);

if (issues.length > 0) {
  console.log('\n❌ Issues:');
  issues.forEach(issue => console.log(`   - ${issue}`));
} else {
  console.log('\n✅ All checked images exist!');
}

