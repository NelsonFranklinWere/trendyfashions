import fs from 'fs';
import path from 'path';

import type { Product } from '@/data/products';

const OFFICIALS_DIR = path.join(process.cwd(), 'public', 'images', 'officials');

const isBoot = (fileName: string): boolean => {
  return fileName.toLowerCase().includes('boot');
};

const isEmpire = (fileName: string): boolean => {
  return fileName.toLowerCase().includes('empire');
};

const isCasual = (fileName: string): boolean => {
  const lower = fileName.toLowerCase();
  return lower.includes('casual') && !lower.includes('clark');
};

const isMule = (fileName: string): boolean => {
  return fileName.toLowerCase().includes('mule');
};

const isClarks = (fileName: string): boolean => {
  const lower = fileName.toLowerCase();
  return (lower.includes('clark') || lower.includes('clarks official')) && 
         !lower.includes('clarksformal');
};

const formatName = (fileName: string): string => {
  // Boots are always named "Official Boots"
  if (isBoot(fileName)) {
    return 'Official Boots';
  }
  
  // Empire products are always named "Empire Leather"
  if (isEmpire(fileName)) {
    return 'Empire Leather';
  }
  
  // Casual products are always named "Casual"
  if (isCasual(fileName)) {
    return 'Casual';
  }
  
  // Mules are always named "Mules"
  if (isMule(fileName)) {
    return 'Mules';
  }
  
  // Clarks products are always named "Clarks Official"
  if (isClarks(fileName)) {
    return 'Clarks Official';
  }

  const base = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const spaced = base
    .replace(/[-_@]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Remove trailing numbers but keep meaningful numbers
  const cleaned = spaced
    .replace(/\s+\d+$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return 'Official Shoe';
  }

  return cleaned
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ');
};

const buildId = (fileName: string): string => {
  const stem = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  return `official-auto-${stem.replace(/[^a-z0-9]+/g, '-')}`;
};

// Attractive descriptions for Official Boots
const bootDescriptions = [
  'Premium quality official boots for the professional workplace. Durable construction meets sophisticated style.',
  'Classic official boots designed for comfort and elegance. Perfect for business meetings and formal occasions.',
  'Stylish official boots that command respect in any professional setting. Quality craftsmanship you can trust.',
  'Professional official boots with timeless design. Step into confidence with these premium workplace essentials.',
  'Elegant official boots built for the modern professional. Comfort and style in perfect harmony.',
  'Premium official boots that elevate your professional wardrobe. Quality materials and expert craftsmanship.',
  'Sophisticated official boots for the discerning professional. Stand out with style and durability.',
  'Classic official boots that never go out of style. Perfect blend of comfort, quality, and elegance.',
  'Professional official boots designed for success. Experience unmatched comfort with head-turning aesthetics.',
  'Timeless official boots for the career-focused individual. Quality you can feel, style you can see.',
  'Premium official boots with attention to detail. The perfect footwear for serious professionals.',
  'Elegant official boots that make a statement. Built for comfort, designed for success.',
  'Stylish official boots for the modern workplace. Quality craftsmanship meets professional elegance.',
  'Classic official boots that reflect your professionalism. Comfort and durability in one perfect package.',
  'Sophisticated official boots for those who demand the best. Premium materials and expert design.',
];

const getBootDescription = (index: number): string => {
  return bootDescriptions[index % bootDescriptions.length];
};

// Attractive descriptions for Empire Leather
const empireDescriptions = [
  'Premium Empire leather shoes for the sophisticated professional. Classic elegance meets modern comfort.',
  'Timeless Empire leather design that never goes out of style. Perfect for business and formal occasions.',
  'Elegant Empire leather shoes crafted with attention to detail. Quality materials and expert craftsmanship.',
  'Classic Empire leather for the discerning professional. Step into confidence with these premium shoes.',
  'Sophisticated Empire leather shoes that elevate your wardrobe. Comfort and style in perfect harmony.',
  'Premium Empire leather with timeless appeal. Built for professionals who demand the best.',
  'Stylish Empire leather shoes that command respect. Quality craftsmanship you can trust.',
  'Elegant Empire leather designed for success. Experience unmatched comfort with head-turning aesthetics.',
  'Classic Empire leather that reflects your professionalism. Durable construction meets sophisticated style.',
  'Premium Empire leather shoes for the modern workplace. Quality you can feel, style you can see.',
  'Timeless Empire leather with expert design. The perfect footwear for serious professionals.',
  'Sophisticated Empire leather that makes a statement. Built for comfort, designed for success.',
  'Elegant Empire leather shoes for those who appreciate quality. Premium materials and classic design.',
  'Classic Empire leather that never disappoints. Perfect blend of comfort, quality, and elegance.',
  'Premium Empire leather shoes for the career-focused individual. Stand out with style and durability.',
];

const getEmpireDescription = (index: number): string => {
  return empireDescriptions[index % empireDescriptions.length];
};

// Attractive descriptions for Casual
const casualDescriptions = [
  'Stylish casual shoes perfect for the modern professional. Comfort meets elegance in every step.',
  'Versatile casual footwear that transitions from office to weekend. Quality craftsmanship and timeless design.',
  'Classic casual shoes for the style-conscious professional. Perfect blend of comfort and sophistication.',
  'Elegant casual footwear that elevates your everyday look. Premium materials and expert design.',
  'Sophisticated casual shoes for the discerning professional. Step into style with confidence.',
  'Timeless casual design that never goes out of fashion. Quality you can feel, comfort you can trust.',
  'Premium casual shoes built for comfort and style. Perfect for the modern workplace.',
  'Classic casual footwear that reflects your personal style. Durable construction meets elegant design.',
  'Stylish casual shoes for the professional on the go. Comfort and elegance in perfect harmony.',
  'Versatile casual design that adapts to any occasion. Quality materials and expert craftsmanship.',
  'Elegant casual shoes that make a statement. Built for comfort, designed for success.',
  'Sophisticated casual footwear for those who appreciate quality. Premium materials and timeless appeal.',
  'Classic casual shoes that never disappoint. Perfect blend of style, comfort, and durability.',
  'Premium casual design for the career-focused individual. Stand out with elegance and quality.',
  'Timeless casual shoes that elevate your wardrobe. Experience unmatched comfort with head-turning style.',
];

const getCasualDescription = (index: number): string => {
  return casualDescriptions[index % casualDescriptions.length];
};

// Attractive descriptions for Mules
const muleDescriptions = [
  'Comfortable mules perfect for the modern professional. Easy slip-on design meets elegant style.',
  'Classic mules that combine convenience with sophistication. Perfect for busy professionals on the go.',
  'Stylish mules designed for comfort and ease. Quality craftsmanship in a timeless design.',
  'Elegant mules that elevate your professional look. Slip into style with these premium shoes.',
  'Sophisticated mules for the discerning gentleman. Comfort and elegance in one perfect package.',
  'Premium mules built for the modern workplace. Easy to wear, hard to forget.',
  'Timeless mule design that never goes out of style. Quality materials and expert craftsmanship.',
  'Classic mules that reflect your personal style. Comfort meets sophistication effortlessly.',
  'Stylish mules for the professional who values convenience. Step into elegance with ease.',
  'Elegant mules that make a statement. Built for comfort, designed for success.',
  'Sophisticated mules for those who appreciate quality. Premium materials and classic design.',
  'Comfortable mules that never disappoint. Perfect blend of style, comfort, and durability.',
  'Premium mule design for the career-focused individual. Stand out with elegance and quality.',
  'Timeless mules that elevate your wardrobe. Experience unmatched comfort with head-turning style.',
  'Classic mules for the modern professional. Quality you can feel, style you can see.',
];

const getMuleDescription = (index: number): string => {
  return muleDescriptions[index % muleDescriptions.length];
};

// Attractive descriptions for Clarks Official
const clarksDescriptions = [
  'Premium Clarks Official shoes for the distinguished professional. Timeless British craftsmanship meets modern style.',
  'Classic Clarks Official design that never goes out of fashion. Perfect for business and formal occasions.',
  'Elegant Clarks Official shoes crafted with attention to detail. Quality materials and expert British craftsmanship.',
  'Sophisticated Clarks Official for the discerning professional. Step into confidence with these premium shoes.',
  'Timeless Clarks Official shoes that elevate your wardrobe. Comfort and style in perfect harmony.',
  'Premium Clarks Official with classic British appeal. Built for professionals who demand the best.',
  'Stylish Clarks Official shoes that command respect. Quality craftsmanship you can trust.',
  'Elegant Clarks Official designed for success. Experience unmatched comfort with head-turning aesthetics.',
  'Classic Clarks Official that reflects your professionalism. Durable construction meets sophisticated style.',
  'Premium Clarks Official shoes for the modern workplace. Quality you can feel, style you can see.',
  'Timeless Clarks Official with expert British design. The perfect footwear for serious professionals.',
  'Sophisticated Clarks Official that makes a statement. Built for comfort, designed for success.',
  'Elegant Clarks Official shoes for those who appreciate quality. Premium materials and classic design.',
  'Classic Clarks Official that never disappoints. Perfect blend of comfort, quality, and elegance.',
  'Premium Clarks Official shoes for the career-focused individual. Stand out with style and durability.',
];

const getClarksDescription = (index: number): string => {
  return clarksDescriptions[index % clarksDescriptions.length];
};

const sanitizeDescription = (name: string, fileName: string, index: number): string => {
  // Boots get special descriptions
  if (isBoot(fileName)) {
    return getBootDescription(index);
  }
  // Empire products get special descriptions
  if (isEmpire(fileName)) {
    return getEmpireDescription(index);
  }
  // Casual products get special descriptions
  if (isCasual(fileName)) {
    return getCasualDescription(index);
  }
  // Mules get special descriptions
  if (isMule(fileName)) {
    return getMuleDescription(index);
  }
  // Clarks products get special descriptions
  if (isClarks(fileName)) {
    return getClarksDescription(index);
  }
  return `${name} — Professional office and formal shoes from Trendy Fashion Zone`;
};

const DEFAULT_PRICE = 2800;
const BOOT_PRICE = 4700;
const CASUAL_PRICE = 3500;
const MULE_PRICE = 2500;
const CLARKS_PRICE = 4500;

// Legacy filesystem-based function (kept for fallback)
const getOfficialImageProductsFromFS = (): Product[] => {
  try {
    if (!fs.existsSync(OFFICIALS_DIR)) {
      return [];
    }

    let files = fs
      .readdirSync(OFFICIALS_DIR)
      .filter((file) => file.match(/\.(jpg|jpeg|png|webp)$/i))
      .filter((file) => {
        const lower = file.toLowerCase();
        // Only exclude clearly invalid files
        return !lower.includes('bankrobber') && 
               !lower.includes('clarksformal') &&
               !lower.includes('contact'); // Exclude contact/info images like ClarksContact.jpg
      })
      .filter((file) => {
        // Verify file actually exists before including it
        const filePath = path.join(OFFICIALS_DIR, file);
        return fs.existsSync(filePath);
      })
      .sort((a, b) => a.localeCompare(b));

    return files.map((file, index) => {
      const name = formatName(file);
      const isBootProduct = isBoot(file);
      const isCasualProduct = isCasual(file);
      const isMuleProduct = isMule(file);
      const isClarksProduct = isClarks(file);
      const isEmpireProduct = isEmpire(file);
      // Boots are 4700, clarks are 4500, casuals are 3500, mules are 2500, empire and others are 2800
      const price = isBootProduct ? BOOT_PRICE : 
                    (isClarksProduct ? CLARKS_PRICE :
                    (isCasualProduct ? CASUAL_PRICE : 
                    (isMuleProduct ? MULE_PRICE : DEFAULT_PRICE)));
      
      // Determine subcategory for tags
      // Priority: Boots > Empire > Casuals > Mules > Clarks > Other
      let subcategory: string | undefined;
      if (isBootProduct) subcategory = 'Boots';
      else if (isEmpireProduct) subcategory = 'Empire';
      else if (isCasualProduct) subcategory = 'Casuals';
      else if (isMuleProduct) subcategory = 'Mules';
      else if (isClarksProduct) subcategory = 'Clarks';
      else subcategory = 'Other'; // All other products go to "Other"
      
      return {
        id: buildId(file),
        name,
        description: sanitizeDescription(name, file, index),
        price,
        image: `/images/officials/${file}`,
        category: 'officials',
        gender: 'Men',
        tags: subcategory ? [subcategory] : undefined,
      } satisfies Product;
    });
  } catch (error) {
    console.error('Error loading official images from filesystem:', error);
    return [];
  }
};

// Main function: fetch from database, fallback to filesystem
export const getOfficialImageProducts = async (): Promise<Product[]> => {
  try {
    // Try database first
    const { getDbImageProducts } = await import('./dbImageProducts');
    const dbProducts = await getDbImageProducts('officials');
    
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts;
    }
    
    // Fallback to filesystem
    console.warn('No products found in database, falling back to filesystem');
    return getOfficialImageProductsFromFS();
  } catch (error) {
    console.error('Error loading official images from database, falling back to filesystem:', error);
    return getOfficialImageProductsFromFS();
  }
};

