import fs from 'fs';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

// Map categories to their subcategories
const CATEGORY_SUBCATEGORIES: Record<string, string[]> = {
  officials: ['Boots', 'Empire', 'Casuals', 'Mules', 'Clarks'],
  sneakers: ['Addidas Campus', 'Addidas Samba', 'Valentino', 'Nike S', 'Nike SB', 'Nike Cortex', 'Nike TN', 'Nike Shox', 'Nike Zoom', 'New Balance'],
  vans: ['Custom', 'Codra', 'Skater', 'Off the Wall'],
  jordan: ['Jordan 1', 'Jordan 3', 'Jordan 4', 'Jordan 9', 'Jordan 11', 'Jordan 14'],
  airmax: ['AirMax 1', 'Airmax 97', 'Airmax 95', 'Airmax 90', 'Airmax Portal', 'Airmax'],
  airforce: ['Airforce'], // Single subcategory
  casuals: ['Casuals'], // Single subcategory
  custom: ['Custom'], // Single subcategory
};

// Map category folders to category names
const FOLDER_TO_CATEGORY: Record<string, string> = {
  formal: 'officials',
  sneakers: 'sneakers',
  vans: 'vans',
  jordan: 'jordan',
  airmax: 'airmax',
  airforce: 'airforce',
  casual: 'casuals',
  customized: 'custom',
};

// Helper to determine subcategory from filename
function getSubcategoryFromFilename(filename: string, category: string): string | null {
  const lower = filename.toLowerCase();
  
  if (category === 'officials') {
    if (lower.includes('boot') || lower.includes('timberland')) return 'Boots';
    if (lower.includes('empire')) return 'Empire';
    if (lower.includes('clark')) return 'Clarks';
    if (lower.includes('mule')) return 'Mules';
    if (lower.includes('casual')) return 'Casuals';
    return 'Boots'; // Default
  }
  
  if (category === 'sneakers') {
    if (lower.includes('campus') && !lower.includes('samba')) return 'Addidas Campus';
    if (lower.includes('samba')) return 'Addidas Samba';
    if (lower.includes('valentino')) return 'Valentino';
    if ((lower.includes('nike') && lower.includes('s.') && !lower.includes('sb')) || lower.includes('nike--s')) return 'Nike S';
    if (lower.includes('sb') || lower.includes('dunk')) return 'Nike SB';
    if (lower.includes('cortex')) return 'Nike Cortex';
    if (lower.includes('tn') && !lower.includes('cortex')) return 'Nike TN';
    if (lower.includes('shox')) return 'Nike Shox';
    if (lower.includes('zoom')) return 'Nike Zoom';
    if (lower.includes('new balance') || lower.includes('newbalance') || lower.includes('nb')) return 'New Balance';
    return 'Addidas Campus'; // Default
  }
  
  if (category === 'vans') {
    if (lower.includes('custom')) return 'Custom';
    if (lower.includes('codra')) return 'Codra';
    if (lower.includes('skater')) return 'Skater';
    if (lower.includes('off the wall') || lower.includes('offthewall')) return 'Off the Wall';
    return 'Custom'; // Default
  }
  
  if (category === 'jordan') {
    if (lower.includes('j1') || (lower.includes('jordan') && lower.includes('1') && !lower.includes('11') && !lower.includes('14'))) return 'Jordan 1';
    if (lower.includes('j3') || (lower.includes('jordan') && lower.includes('3'))) return 'Jordan 3';
    if (lower.includes('j4') || (lower.includes('jordan') && lower.includes('4'))) return 'Jordan 4';
    if (lower.includes('j9') || (lower.includes('jordan') && lower.includes('9'))) return 'Jordan 9';
    if (lower.includes('j11') || (lower.includes('jordan') && lower.includes('11'))) return 'Jordan 11';
    if (lower.includes('j14') || (lower.includes('jordan') && lower.includes('14'))) return 'Jordan 14';
    return 'Jordan 1'; // Default
  }
  
  if (category === 'airmax') {
    if ((lower.includes('airmax 1') || lower.includes('air-max-1')) && !lower.includes('90') && !lower.includes('95') && !lower.includes('97')) return 'AirMax 1';
    if (lower.includes('airmax 97') || lower.includes('airmax97') || lower.includes('nikeairmax1')) return 'Airmax 97';
    if (lower.includes('airmax 95') || lower.includes('airmax95')) return 'Airmax 95';
    if (lower.includes('airmax 90') || lower.includes('airmax90')) return 'Airmax 90';
    if (lower.includes('portal')) return 'Airmax Portal';
    if (lower.includes('airmax') || lower.includes('air max')) return 'Airmax';
    return 'Airmax'; // Default
  }
  
  if (category === 'airforce') return 'Airforce';
  if (category === 'casuals') return 'Casuals';
  if (category === 'custom') return 'Custom';
  
  return null;
}

interface ImageStats {
  category: string;
  subcategory: string;
  total: number;
  kept: number;
  deleted: number;
  files: string[];
}

function reduceImagesTo6PerSubcategory(): void {
  console.log('🔄 Reducing images to 6 per subcategory...\n');
  
  const stats: ImageStats[] = [];
  const deletedFiles: string[] = [];
  
  // Process each category folder
  Object.entries(FOLDER_TO_CATEGORY).forEach(([folder, category]) => {
    const folderPath = path.join(IMAGES_DIR, folder);
    
    if (!fs.existsSync(folderPath)) {
      console.log(`⚠️  Folder not found: ${folder}`);
      return;
    }
    
    const files = fs.readdirSync(folderPath)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => path.join(folderPath, file))
      .filter(filePath => fs.statSync(filePath).isFile());
    
    // Group files by subcategory
    const subcategoryGroups: Record<string, string[]> = {};
    
    files.forEach(filePath => {
      const filename = path.basename(filePath);
      const subcategory = getSubcategoryFromFilename(filename, category);
      
      if (subcategory) {
        if (!subcategoryGroups[subcategory]) {
          subcategoryGroups[subcategory] = [];
        }
        subcategoryGroups[subcategory].push(filePath);
      }
    });
    
    // Process each subcategory
    Object.entries(subcategoryGroups).forEach(([subcategory, filePaths]) => {
      const sorted = filePaths.sort(); // Sort alphabetically for consistency
      const keep = sorted.slice(0, 6);
      const deleteList = sorted.slice(6);
      
      stats.push({
        category,
        subcategory,
        total: sorted.length,
        kept: keep.length,
        deleted: deleteList.length,
        files: keep.map(f => path.basename(f)),
      });
      
      // Delete excess files
      deleteList.forEach(filePath => {
        try {
          fs.unlinkSync(filePath);
          deletedFiles.push(filePath);
          console.log(`❌ Deleted: ${path.relative(IMAGES_DIR, filePath)}`);
        } catch (error) {
          console.error(`⚠️  Failed to delete ${filePath}:`, error);
        }
      });
      
      if (keep.length > 0) {
        console.log(`✅ Kept ${keep.length}/${sorted.length} images for ${category}/${subcategory}`);
      }
    });
  });
  
  // Print summary
  console.log('\n📊 Summary:');
  console.log('─'.repeat(80));
  stats.forEach(stat => {
    console.log(`${stat.category}/${stat.subcategory}: ${stat.kept} kept, ${stat.deleted} deleted (${stat.total} total)`);
  });
  
  const totalKept = stats.reduce((sum, s) => sum + s.kept, 0);
  const totalDeleted = stats.reduce((sum, s) => sum + s.deleted, 0);
  const totalFiles = stats.reduce((sum, s) => sum + s.total, 0);
  
  console.log('─'.repeat(80));
  console.log(`Total: ${totalKept} kept, ${totalDeleted} deleted (${totalFiles} total)`);
  console.log(`\n✅ Image reduction complete!`);
  
  // Save deletion log
  const logPath = path.join(process.cwd(), 'scripts', 'deleted-images.log');
  fs.writeFileSync(logPath, deletedFiles.join('\n'), 'utf-8');
  console.log(`📝 Deletion log saved to: ${logPath}`);
}

// Run the script
reduceImagesTo6PerSubcategory();

export { reduceImagesTo6PerSubcategory };
