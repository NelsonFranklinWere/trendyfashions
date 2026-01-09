const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

// Ensure all required folders exist
const folders = {
  formal: path.join(IMAGES_DIR, 'formal'),
  casual: path.join(IMAGES_DIR, 'casual'),
  customized: path.join(IMAGES_DIR, 'customized'),
  sneakers: path.join(IMAGES_DIR, 'sneakers'),
  running: path.join(IMAGES_DIR, 'running'),
  sports: path.join(IMAGES_DIR, 'sports'),
  other: path.join(IMAGES_DIR, 'other'),
  logos: path.join(IMAGES_DIR, 'logos'),
};

// Create folders if they don't exist
Object.values(folders).forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// Normalize filename for matching
const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

// Determine target folder based on filename
function getTargetFolder(filename) {
  const lower = filename.toLowerCase();
  const normalized = normalize(filename);

  // OFFICIAL/FORMAL - Move to formal folder
  if (
    lower.includes('official') ||
    lower.includes('officials') ||
    lower.includes('officiale') ||
    lower.includes('empire') ||
    lower.includes('clarks') ||
    lower.includes('clarksformal') ||
    lower.includes('clarksofficial') ||
    lower.includes('clarksofficialls') ||
    lower.includes('clarksofficials') ||
    lower.includes('dr.martens') ||
    lower.includes('drmartens') ||
    lower.includes('loafer') ||
    lower.includes('mule') ||
    (lower.includes('boot') && (lower.includes('official') || lower.includes('timberland')))
  ) {
    return folders.formal;
  }

  // AIRFORCE - Move to customized folder
  if (
    lower.includes('airforce') ||
    lower.includes('air-force') ||
    lower.includes('af1') ||
    normalized.includes('airforcecustom')
  ) {
    return folders.customized;
  }

  // CASUALS - Move to casual folder
  if (
    lower.includes('casual') ||
    lower.includes('casuals') ||
    lower.includes('cassualss') ||
    (lower.includes('timberland') && !lower.includes('official')) ||
    lower.includes('timba') ||
    (lower.includes('lacoste') && !lower.includes('official')) ||
    lower.includes('tommy') ||
    lower.includes('hilfig') ||
    lower.includes('boss') ||
    lower.includes('flop') ||
    lower.includes('open') ||
    lower.includes('sandals')
  ) {
    return folders.casual;
  }

  // AIRMAX - Move to running folder
  if (
    lower.includes('airmax') ||
    lower.includes('air-max') ||
    lower.includes('airmax95')
  ) {
    return folders.running;
  }

  // SPORTS - Move to sports folder
  if (
    lower.includes('football') ||
    lower.includes('footbalboots') ||
    lower.includes('jordan') ||
    lower.includes('sport')
  ) {
    return folders.sports;
  }

  // SNEAKERS - Move to sneakers folder
  if (
    lower.includes('nike') ||
    lower.includes('adidas') ||
    lower.includes('puma') ||
    lower.includes('converse') ||
    lower.includes('newbalance') ||
    lower.includes('nb') ||
    (lower.includes('vans') && !lower.includes('customized'))
  ) {
    return folders.sneakers;
  }

  // CUSTOMIZED - Move to customized folder
  if (
    lower.includes('customized') ||
    lower.includes('customised') ||
    lower.includes('custom') ||
    lower.includes('dior') ||
    lower.includes('cactus') ||
    lower.includes('jack') ||
    lower.includes('lv') ||
    lower.includes('vuitton')
  ) {
    return folders.customized;
  }

  // Default to other
  return folders.other;
}

// Move file to target folder
function moveFile(filePath, targetFolder) {
  const filename = path.basename(filePath);
  const targetPath = path.join(targetFolder, filename);

  // Skip if already in target folder
  if (path.dirname(filePath) === targetFolder) {
    return { moved: false, reason: 'already in target folder' };
  }

  // Skip if target file already exists
  if (fs.existsSync(targetPath)) {
    return { moved: false, reason: 'target exists' };
  }

  try {
    fs.renameSync(filePath, targetPath);
    return { moved: true, target: targetPath };
  } catch (error) {
    console.error(`❌ Error moving ${filename}:`, error.message);
    return { moved: false, reason: error.message };
  }
}

// Process all image files in images root
function organizeImages() {
  console.log('🔄 Organizing images in public/images root...\n');

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const files = fs.readdirSync(IMAGES_DIR)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    })
    .map(file => path.join(IMAGES_DIR, file))
    .filter(filePath => {
      try {
        return fs.statSync(filePath).isFile();
      } catch {
        return false;
      }
    });

  console.log(`📊 Found ${files.length} images in images root\n`);

  const stats = {
    formal: 0,
    casual: 0,
    customized: 0,
    sneakers: 0,
    running: 0,
    sports: 0,
    other: 0,
    skipped: 0,
  };

  files.forEach(filePath => {
    const filename = path.basename(filePath);
    const targetFolder = getTargetFolder(filename);
    const category = path.basename(targetFolder);

    const result = moveFile(filePath, targetFolder);
    if (result.moved) {
      stats[category]++;
      console.log(`✅ ${filename} → ${category}/`);
    } else if (result.reason === 'target exists') {
      stats.skipped++;
    }
  });

  console.log('\n📊 Summary:');
  console.log(`   Formal: ${stats.formal}`);
  console.log(`   Casual: ${stats.casual}`);
  console.log(`   Customized: ${stats.customized}`);
  console.log(`   Sneakers: ${stats.sneakers}`);
  console.log(`   Running: ${stats.running}`);
  console.log(`   Sports: ${stats.sports}`);
  console.log(`   Other: ${stats.other}`);
  console.log(`   Skipped: ${stats.skipped}`);
  console.log(`\n✅ Organization complete!`);
}

// Run the organization
organizeImages();

