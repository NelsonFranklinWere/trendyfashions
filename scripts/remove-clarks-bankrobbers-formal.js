const fs = require('fs');
const path = require('path');

const FORMAL_DIR = path.join(process.cwd(), 'public', 'images', 'formal');
const OTHER_DIR = path.join(process.cwd(), 'public', 'images', 'other');

// Ensure other directory exists
if (!fs.existsSync(OTHER_DIR)) {
  fs.mkdirSync(OTHER_DIR, { recursive: true });
}

console.log('🔄 Removing clarks bankrobbers and clarks formal from formal folder...\n');

if (!fs.existsSync(FORMAL_DIR)) {
  console.log('❌ Formal directory does not exist');
  process.exit(1);
}

const files = fs.readdirSync(FORMAL_DIR)
  .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

let moved = 0;
let deleted = 0;

files.forEach(file => {
  const lower = file.toLowerCase();
  const filePath = path.join(FORMAL_DIR, file);
  
  // Check if it's bankrobbers or clarksformal
  if (lower.includes('bankrobber') || lower.includes('clarksformal')) {
    const targetPath = path.join(OTHER_DIR, file);
    
    // If target exists, delete the source
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(filePath);
      console.log(`  🗑️  Deleted (duplicate): ${file}`);
      deleted++;
    } else {
      // Move to other folder
      fs.renameSync(filePath, targetPath);
      console.log(`  ✅ Moved to other/: ${file}`);
      moved++;
    }
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Moved: ${moved}`);
console.log(`   Deleted: ${deleted}`);
console.log(`\n✅ Complete!`);

