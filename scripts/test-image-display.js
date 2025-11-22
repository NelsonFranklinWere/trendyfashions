const fs = require('fs');
const path = require('path');

console.log('🔍 Testing image display setup...\n');

// Test logo
const logoPath = path.join(process.cwd(), 'public', 'images', 'logos', 'SecondLogo.jpeg');
const logoExists = fs.existsSync(logoPath);
const logoStats = logoExists ? fs.statSync(logoPath) : null;

console.log('📋 Logo (SecondLogo.jpeg):');
console.log(`   Exists: ${logoExists ? '✅' : '❌'}`);
if (logoExists) {
  console.log(`   Size: ${(logoStats.size / 1024).toFixed(2)} KB`);
  console.log(`   Path: ${logoPath}`);
}

// Test contact image
const contactPath = path.join(process.cwd(), 'public', 'images', 'formal', 'ClarksOfficials1.jpg');
const contactExists = fs.existsSync(contactPath);
const contactStats = contactExists ? fs.statSync(contactPath) : null;

console.log('\n📋 Contact Image (ClarksOfficials1.jpg):');
console.log(`   Exists: ${contactExists ? '✅' : '❌'}`);
if (contactExists) {
  console.log(`   Size: ${(contactStats.size / 1024).toFixed(2)} KB`);
  console.log(`   Path: ${contactPath}`);
}

// Check if files are readable
console.log('\n📋 File Permissions:');
if (logoExists) {
  const logoReadable = fs.accessSync(logoPath, fs.constants.R_OK) === undefined;
  console.log(`   Logo readable: ${logoReadable ? '✅' : '❌'}`);
}
if (contactExists) {
  const contactReadable = fs.accessSync(contactPath, fs.constants.R_OK) === undefined;
  console.log(`   Contact image readable: ${contactReadable ? '✅' : '❌'}`);
}

// Summary
console.log('\n📊 Summary:');
if (logoExists && contactExists) {
  console.log('✅ Both images exist and should be accessible');
  console.log('\n💡 If images still don\'t display:');
  console.log('   1. Check browser console for errors');
  console.log('   2. Verify images load in Network tab');
  console.log('   3. Check if CSS is hiding images (opacity, display: none)');
  console.log('   4. Ensure server is running and serving static files');
  console.log('   5. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)');
} else {
  console.log('❌ Some images are missing - check file paths');
}

