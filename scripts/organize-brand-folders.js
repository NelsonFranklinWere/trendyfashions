const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

// Create brand folders
const brandFolders = {
  airmax: path.join(IMAGES_DIR, 'airmax'),
  airforce: path.join(IMAGES_DIR, 'airforce'),
  jordan: path.join(IMAGES_DIR, 'jordan'),
  newbalance: path.join(IMAGES_DIR, 'newbalance'),
  timberland: path.join(IMAGES_DIR, 'timberland'),
};

// Create folders
Object.values(brandFolders).forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`✅ Created folder: ${path.basename(folder)}`);
  }
});

console.log('\n🔄 Organizing brand images...\n');

// Function to move file
function moveFile(filePath, targetFolder, brandName) {
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

// Scan all folders for brand images
const foldersToScan = ['sneakers', 'casual', 'customized', 'running', 'sports', 'other', 'formal'];
const stats = {
  airmax: 0,
  airforce: 0,
  jordan: 0,
  newbalance: 0,
  timberland: 0,
};

foldersToScan.forEach(folder => {
  const folderPath = path.join(IMAGES_DIR, folder);
  if (!fs.existsSync(folderPath)) return;

  const files = fs.readdirSync(folderPath)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map(file => path.join(folderPath, file))
    .filter(filePath => {
      try {
        return fs.statSync(filePath).isFile();
      } catch {
        return false;
      }
    });

  files.forEach(filePath => {
    const filename = path.basename(filePath);
    const lower = filename.toLowerCase();
    const normalized = lower.replace(/[^a-z0-9]/g, '');

    // AIRMAX - from running, sneakers, casual (but not from formal)
    if (folder !== 'formal' && (
      lower.includes('airmax') ||
      lower.includes('air-max') ||
      lower.includes('airmax95') ||
      normalized.includes('airmax')
    )) {
      const result = moveFile(filePath, brandFolders.airmax, 'airmax');
      if (result.moved) {
        console.log(`✅ Airmax: ${folder}/${filename} → airmax/`);
        stats.airmax++;
      }
    }

    // AIRFORCE - from customized, sneakers, casual (but not from formal)
    if (folder !== 'formal' && (
      lower.includes('airforce') ||
      lower.includes('air-force') ||
      lower.includes('airforcecustom') ||
      lower.includes('af1') ||
      normalized.includes('airforce')
    )) {
      const result = moveFile(filePath, brandFolders.airforce, 'airforce');
      if (result.moved) {
        console.log(`✅ Airforce: ${folder}/${filename} → airforce/`);
        stats.airforce++;
      }
    }

    // JORDAN - from sports, sneakers, casual (but not from formal)
    if (folder !== 'formal' && (
      lower.includes('jordan') ||
      lower.includes('jordann') ||
      lower.includes('j11') ||
      lower.includes('j14') ||
      lower.includes('j2') && !lower.includes('j21') && !lower.includes('j22') ||
      lower.includes('j3') ||
      lower.includes('j4') ||
      lower.includes('j7') ||
      lower.includes('j9')
    )) {
      const result = moveFile(filePath, brandFolders.jordan, 'jordan');
      if (result.moved) {
        console.log(`✅ Jordan: ${folder}/${filename} → jordan/`);
        stats.jordan++;
      }
    }

    // NEW BALANCE - from sneakers, casual (but not from formal)
    if (folder !== 'formal' && (
      lower.includes('newbalance') ||
      lower.includes('new-balance') ||
      lower.includes('newbalancee') ||
      lower.includes('nbalance') ||
      lower.includes('nb') && !lower.includes('nike')
    )) {
      const result = moveFile(filePath, brandFolders.newbalance, 'newbalance');
      if (result.moved) {
        console.log(`✅ New Balance: ${folder}/${filename} → newbalance/`);
        stats.newbalance++;
      }
    }

    // TIMBERLAND - from casual, other (but NOT from formal)
    if (folder !== 'formal' && (
      lower.includes('timberland') ||
      lower.includes('timba') ||
      lower.includes('timber')
    ) && !lower.includes('official') && !lower.includes('loafer') && !lower.includes('boot') && !lower.includes('formal')) {
      const result = moveFile(filePath, brandFolders.timberland, 'timberland');
      if (result.moved) {
        console.log(`✅ Timberland: ${folder}/${filename} → timberland/`);
        stats.timberland++;
      }
    }
  });
});

console.log('\n📊 Summary:');
console.log(`   Airmax: ${stats.airmax}`);
console.log(`   Airforce: ${stats.airforce}`);
console.log(`   Jordan: ${stats.jordan}`);
console.log(`   New Balance: ${stats.newbalance}`);
console.log(`   Timberland: ${stats.timberland}`);
console.log(`\n✅ Organization complete!`);

