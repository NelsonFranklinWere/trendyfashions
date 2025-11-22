const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

// Function to move file
function moveFile(filePath, targetFolder) {
  const filename = path.basename(filePath);
  const targetPath = path.join(targetFolder, filename);

  if (path.dirname(filePath) === targetFolder) {
    return { moved: false, reason: 'already in target' };
  }

  if (fs.existsSync(targetPath)) {
    return { moved: false, reason: 'exists' };
  }

  try {
    fs.renameSync(filePath, targetPath);
    return { moved: true };
  } catch (error) {
    return { moved: false, reason: error.message };
  }
}

// Function to rename file
function renameFile(filePath, newName) {
  const dir = path.dirname(filePath);
  const newPath = path.join(dir, newName);
  
  if (fs.existsSync(newPath)) {
    return { renamed: false, reason: 'target exists' };
  }

  try {
    fs.renameSync(filePath, newPath);
    return { renamed: true, newPath };
  } catch (error) {
    return { renamed: false, reason: error.message };
  }
}

console.log('🔄 Finalizing image organization...\n');

// 1. Move official/clarks images from casual to formal
console.log('📁 Moving official/clarks images from casual to formal...');
const casualDir = path.join(IMAGES_DIR, 'casual');
if (fs.existsSync(casualDir)) {
  const casualFiles = fs.readdirSync(casualDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map(file => path.join(casualDir, file));

  let moved = 0;
  casualFiles.forEach(filePath => {
    const filename = path.basename(filePath);
    const lower = filename.toLowerCase();
    
    if (lower.includes('official') || lower.includes('clarks') || lower.includes('lacosteofficial')) {
      const result = moveFile(filePath, path.join(IMAGES_DIR, 'formal'));
      if (result.moved) {
        console.log(`  ✅ ${filename} → formal/`);
        moved++;
      }
    }
  });
  console.log(`  Moved ${moved} files\n`);
}

// 2. Move airforce images from sneakers to customized
console.log('📁 Moving airforce images from sneakers to customized...');
const sneakersDir = path.join(IMAGES_DIR, 'sneakers');
if (fs.existsSync(sneakersDir)) {
  const sneakersFiles = fs.readdirSync(sneakersDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map(file => path.join(sneakersDir, file));

  let moved = 0;
  sneakersFiles.forEach(filePath => {
    const filename = path.basename(filePath);
    const lower = filename.toLowerCase();
    
    if (lower.includes('airforce') || lower.includes('air-force') || lower.includes('af1')) {
      const result = moveFile(filePath, path.join(IMAGES_DIR, 'customized'));
      if (result.moved) {
        console.log(`  ✅ ${filename} → customized/`);
        moved++;
      }
    }
  });
  console.log(`  Moved ${moved} files\n`);
}

// 3. Move Loafers folder contents to appropriate folders
console.log('📁 Organizing Loafers folder...');
const loafersDir = path.join(IMAGES_DIR, 'Loafers');
if (fs.existsSync(loafersDir)) {
  const loafersFiles = fs.readdirSync(loafersDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map(file => path.join(loafersDir, file));

  let movedToFormal = 0;
  let movedToCasual = 0;
  
  loafersFiles.forEach(filePath => {
    const filename = path.basename(filePath);
    const lower = filename.toLowerCase();
    
    // Loafers with official/clarks go to formal, others to casual
    if (lower.includes('official') || lower.includes('clarks') || lower.includes('lacoste')) {
      const result = moveFile(filePath, path.join(IMAGES_DIR, 'formal'));
      if (result.moved) {
        console.log(`  ✅ ${filename} → formal/`);
        movedToFormal++;
      }
    } else {
      const result = moveFile(filePath, path.join(IMAGES_DIR, 'casual'));
      if (result.moved) {
        console.log(`  ✅ ${filename} → casual/`);
        movedToCasual++;
      }
    }
  });
  
  console.log(`  Moved ${movedToFormal} to formal, ${movedToCasual} to casual`);
  
  // Remove Loafers folder if empty
  try {
    const remaining = fs.readdirSync(loafersDir);
    if (remaining.length === 0) {
      fs.rmdirSync(loafersDir);
      console.log(`  ✅ Removed empty Loafers folder\n`);
    } else {
      console.log(`  ⚠️  Loafers folder still has ${remaining.length} files\n`);
    }
  } catch (error) {
    console.log(`  ⚠️  Could not remove Loafers folder\n`);
  }
}

// 4. Rename clarks official images in formal folder
console.log('📝 Renaming clarks official images...');
const formalDir = path.join(IMAGES_DIR, 'formal');
if (fs.existsSync(formalDir)) {
  const formalFiles = fs.readdirSync(formalDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map(file => path.join(formalDir, file));

  let renamed = 0;
  formalFiles.forEach(filePath => {
    const filename = path.basename(filePath);
    const lower = filename.toLowerCase();
    
    // Rename clarksofficials to clarks-officials
    if (lower.includes('clarksofficials') && !lower.includes('clarks-officials') && !lower.includes('clarksofficialls')) {
      const newName = filename.replace(/clarksofficials/gi, 'ClarksOfficials');
      const result = renameFile(filePath, newName);
      if (result.renamed) {
        console.log(`  ✅ ${filename} → ${newName}`);
        renamed++;
      }
    }
  });
  console.log(`  Renamed ${renamed} files\n`);
}

// 5. Check for any remaining misplaced images
console.log('🔍 Checking for misplaced images...');
const categories = ['casual', 'sneakers', 'customized', 'running', 'sports'];
let totalMisplaced = 0;

categories.forEach(category => {
  const categoryDir = path.join(IMAGES_DIR, category);
  if (!fs.existsSync(categoryDir)) return;
  
  const files = fs.readdirSync(categoryDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map(file => path.join(categoryDir, file));

  files.forEach(filePath => {
    const filename = path.basename(filePath);
    const lower = filename.toLowerCase();
    let shouldMove = false;
    let targetFolder = null;

    if (category === 'casual') {
      if (lower.includes('official') || lower.includes('clarks') || lower.includes('lacosteofficial')) {
        shouldMove = true;
        targetFolder = path.join(IMAGES_DIR, 'formal');
      }
    } else if (category === 'sneakers') {
      if (lower.includes('airforce') || lower.includes('air-force') || lower.includes('af1')) {
        shouldMove = true;
        targetFolder = path.join(IMAGES_DIR, 'customized');
      }
    }

    if (shouldMove && targetFolder) {
      const result = moveFile(filePath, targetFolder);
      if (result.moved) {
        console.log(`  ✅ ${filename} from ${category}/ → ${path.basename(targetFolder)}/`);
        totalMisplaced++;
      }
    }
  });
});

if (totalMisplaced === 0) {
  console.log('  ✅ No misplaced images found\n');
} else {
  console.log(`  Moved ${totalMisplaced} misplaced images\n`);
}

console.log('✅ Finalization complete!');

