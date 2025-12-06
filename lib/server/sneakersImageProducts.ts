import fs from 'fs';
import path from 'path';

import type { Product } from '@/data/products';

const SNEAKERS_DIR = path.join(process.cwd(), 'public', 'images', 'sneakers');

const formatName = (fileName: string): string => {
  const base = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const lowerBase = base.toLowerCase();
  
  // Handle Addidas Campus (exclude Nike Shox)
  if (lowerBase.includes('campus') && (lowerBase.includes('adidas') || lowerBase.includes('addidas') || lowerBase.startsWith('campus')) &&
      !lowerBase.includes('shox')) {
    return 'Addidas Campus';
  }
  
  // Handle Addidas Samba (exclude Nike Shox)
  if (lowerBase.includes('samba') && !lowerBase.includes('shox')) {
    return 'Addidas Samba';
  }
  
  // Handle Valentino (exclude Nike Shox)
  if (lowerBase.includes('valentino') && !lowerBase.includes('shox')) {
    return 'Valentino';
  }
  
  // Handle Nike Shox FIRST (before Nike S to avoid misclassification)
  if (lowerBase.includes('shox')) {
    return 'Nike Shox';
  }
  
  // Handle Nike Zoom (before Nike S)
  if (lowerBase.includes('zoom')) {
    return 'Nike Zoom';
  }
  
  // Handle Nike TN (before Nike S)
  // Exclude Nike Shox
  if (lowerBase.includes('tn') && (lowerBase.includes('nike') || lowerBase.startsWith('tn')) &&
      !lowerBase.includes('shox')) {
    return 'Nike TN';
  }
  
  // Handle Nike SB (before Nike S)
  // Exclude Nike Shox and Valentino
  if ((lowerBase.includes('sb') || (lowerBase.includes('nike') && lowerBase.includes('sb')) || lowerBase.includes('dunk')) &&
      !lowerBase.includes('shox') && !lowerBase.includes('valentino')) {
    return 'Nike SB';
  }
  
  // Handle Nike Cortex (before Nike S, exclude Nike Shox)
  if (lowerBase.includes('cortex') && !lowerBase.includes('shox')) {
    return 'Nike Cortex';
  }
  
  // Handle Nike S (Nike--S.1, Nike S, etc.)
  // Exclude Nike SB, Nike Shox, Nike Zoom, Nike TN, and Valentino
  if ((lowerBase.includes('nike') && lowerBase.includes('s.') && 
       !lowerBase.includes('sb') && !lowerBase.includes('shox') && 
       !lowerBase.includes('zoom') && !lowerBase.includes('tn') && 
       !lowerBase.includes('cortex') && !lowerBase.includes('valentino')) ||
      ((lowerBase.includes('nike--s') || (lowerBase.includes('nike') && lowerBase.match(/\bnike\s*s\b/))) &&
       !lowerBase.includes('sb') && !lowerBase.includes('shox') && 
       !lowerBase.includes('zoom') && !lowerBase.includes('tn') && 
       !lowerBase.includes('cortex') && !lowerBase.includes('valentino'))) {
    return 'Nike S';
  }
  
  // Handle New Balance (exclude Nike Shox)
  if ((lowerBase.includes('new balance') || lowerBase.includes('newbalance') || lowerBase.includes('nb') || lowerBase.startsWith('nb')) &&
      !lowerBase.includes('shox')) {
    return 'New Balance';
  }
  
  // Handle other Adidas products (exclude Nike Shox)
  if ((lowerBase.includes('adidas') || lowerBase.includes('addidas')) && !lowerBase.includes('shox')) {
    // Handle Adidas-Special
    if (lowerBase.includes('special')) {
      return 'Addidas Special';
    }
    
    // Handle AdidasGazele -> Addidas Gazelle
    if (lowerBase.includes('gazelle') || lowerBase.includes('gazele')) {
      return 'Addidas Gazelle';
    }
    
    // Default Adidas
    return 'Addidas';
  }
  
  // For other products, use original logic
  const spaced = base
    .replace(/[-_@]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const cleaned = spaced
    .replace(/\s+\d+$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return 'Sneaker';
  }

  return cleaned
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ');
};

const buildId = (fileName: string): string => {
  const stem = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  return `sneaker-auto-${stem.replace(/[^a-z0-9]+/g, '-')}`;
};

// Attractive descriptions for Sneakers
const sneakerDescriptions = [
  'Premium sneakers for the modern lifestyle. Classic design meets contemporary comfort and style.',
  'Iconic sneaker collection that never goes out of fashion. Perfect for everyday wear and casual occasions.',
  'Timeless sneaker design built for comfort and durability. Quality materials and expert craftsmanship.',
  'Classic sneakers that elevate your casual wardrobe. Step into style with these versatile kicks.',
  'Premium sneaker collection for the style-conscious individual. Comfort and elegance in perfect harmony.',
  'Iconic sneaker design that reflects your personal style. Quality you can feel, comfort you can trust.',
  'Timeless sneakers built for the modern lifestyle. Perfect blend of style, comfort, and durability.',
  'Classic sneaker collection that makes a statement. Built for everyday adventures and casual elegance.',
  'Premium sneakers for those who appreciate quality. Expert craftsmanship meets contemporary design.',
  'Iconic sneaker style that never disappoints. Experience unmatched comfort with head-turning aesthetics.',
  'Timeless sneaker design for the active individual. Quality materials and expert engineering.',
  'Classic sneakers that elevate your everyday look. Premium quality meets street style excellence.',
  'Premium sneaker collection for the modern trendsetter. Stand out with style and sophistication.',
  'Iconic sneaker design that commands respect. Quality craftsmanship meets urban street style.',
  'Timeless sneakers that reflect your lifestyle. Perfect blend of comfort, quality, and contemporary appeal.',
];

const getSneakerDescription = (index: number): string => {
  return sneakerDescriptions[index % sneakerDescriptions.length];
};

const DEFAULT_PRICE = 2800;
const ADDIDAS_CAMPUS_PRICE = 3200;
const VALENTINO_PRICE = 3200;
const NIKE_S_PRICE = 3500;
const NIKE_CORTEX_PRICE = 3500;
const NIKE_SB_PRICE = 3500;
const NIKE_TN_PRICE = 3500;
const NIKE_SHOX_PRICE = 4200;
const NIKE_ZOOM_PRICE = 3200;
const ADDIDAS_SAMBA_PRICE = 3000;

const getPrice = (fileName: string, productName: string): number => {
  // Addidas Samba products - all priced at 3000
  if (productName === 'Addidas Samba') {
    return ADDIDAS_SAMBA_PRICE;
  }
  // Nike S products = 3500
  if (productName === 'Nike S') {
    return NIKE_S_PRICE;
  }
  // Nike SB products = 3500
  if (productName === 'Nike SB') {
    return NIKE_SB_PRICE;
  }
  // Nike Cortex products = 3500
  if (productName === 'Nike Cortex') {
    return NIKE_CORTEX_PRICE;
  }
  // Nike TN products = 3500
  if (productName === 'Nike TN') {
    return NIKE_TN_PRICE;
  }
  // Nike Shox products = 4200
  if (productName === 'Nike Shox') {
    return NIKE_SHOX_PRICE;
  }
  // Nike Zoom products = 3200
  if (productName === 'Nike Zoom') {
    return NIKE_ZOOM_PRICE;
  }
  // Addidas Campus products = 3200
  if (productName === 'Addidas Campus') {
    return ADDIDAS_CAMPUS_PRICE;
  }
  // Valentino products = 3200
  if (productName === 'Valentino') {
    return VALENTINO_PRICE;
  }
  return DEFAULT_PRICE;
};

export const getSneakersImageProducts = (): Product[] => {
  try {
    if (!fs.existsSync(SNEAKERS_DIR)) {
      return [];
    }

    const files = fs
      .readdirSync(SNEAKERS_DIR)
      .filter((file) => file.match(/\.(jpg|jpeg|png|webp)$/i))
      .filter((file) => {
        // Verify file actually exists before including it
        const filePath = path.join(SNEAKERS_DIR, file);
        return fs.existsSync(filePath);
      })
      .sort((a, b) => a.localeCompare(b));

    return files.map((file, index) => {
      const name = formatName(file);
      const price = getPrice(file, name);
      return {
        id: buildId(file),
        name,
        description: getSneakerDescription(index),
        price,
        image: `/images/sneakers/${file}`,
        category: 'casual',
        gender: 'Unisex',
      } satisfies Product;
    });
  } catch (error) {
    console.error('Error loading sneakers images:', error);
    return [];
  }
};

