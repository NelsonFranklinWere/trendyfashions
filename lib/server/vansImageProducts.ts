import fs from 'fs';
import path from 'path';

import type { Product } from '@/data/products';

const VANS_DIR = path.join(process.cwd(), 'public', 'images', 'vans');

const formatName = (fileName: string): string => {
  const base = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const lowerBase = base.toLowerCase();
  
  // Handle Skater Vans FIRST (before other vans patterns)
  if (lowerBase.startsWith('skatervans') || lowerBase.includes('skater')) {
    return 'Vans Skater';
  }
  
  // Handle Vans Off The Wall
  if (lowerBase.startsWith('vansoffthewall') || lowerBase.includes('offthewall') || lowerBase.includes('off the wall')) {
    return 'Vans Off The Wall';
  }
  
  // Handle Vans Codra
  if (lowerBase.startsWith('vancodra') || lowerBase.includes('codra')) {
    return 'Vans Codra';
  }
  
  // Handle Custom/Customized Vans
  if (lowerBase.includes('custom') || lowerBase.includes('customized') || lowerBase.includes('customised')) {
    return 'Vans Custom';
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
    return 'Vans';
  }

  return cleaned
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ');
};

const buildId = (fileName: string): string => {
  const stem = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  return `vans-auto-${stem.replace(/[^a-z0-9]+/g, '-')}`;
};

// Attractive descriptions for Vans
const vansDescriptions = [
  'Classic Vans sneakers for the modern lifestyle. Timeless design meets contemporary comfort and style.',
  'Iconic Vans collection that never goes out of fashion. Perfect for everyday wear and casual occasions.',
  'Timeless Vans design built for comfort and durability. Quality materials and expert craftsmanship.',
  'Classic Vans that elevate your casual wardrobe. Step into style with these versatile kicks.',
  'Premium Vans collection for the style-conscious individual. Comfort and elegance in perfect harmony.',
  'Iconic Vans design that reflects your personal style. Quality you can feel, comfort you can trust.',
  'Timeless Vans built for the modern lifestyle. Perfect blend of style, comfort, and durability.',
  'Classic Vans collection that makes a statement. Built for everyday adventures and casual elegance.',
  'Premium Vans for those who appreciate quality. Expert craftsmanship meets contemporary design.',
  'Iconic Vans style that never disappoints. Experience unmatched comfort with head-turning aesthetics.',
  'Timeless Vans design for the active individual. Quality materials and expert engineering.',
  'Classic Vans that elevate your everyday look. Premium quality meets street style excellence.',
  'Premium Vans collection for the modern trendsetter. Stand out with style and sophistication.',
  'Iconic Vans design that commands respect. Quality craftsmanship meets urban street style.',
  'Timeless Vans that reflect your lifestyle. Perfect blend of comfort, quality, and contemporary appeal.',
];

const getVansDescription = (index: number): string => {
  return vansDescriptions[index % vansDescriptions.length];
};

const DEFAULT_PRICE = 1800;
const SKATER_PRICE = 3000;
const CODRA_PRICE = 1900;

const getPrice = (fileName: string, productName: string): number => {
  // Skater Vans = 3000
  if (productName === 'Vans Skater') {
    return SKATER_PRICE;
  }
  // Codra Vans = 1900
  if (productName === 'Vans Codra') {
    return CODRA_PRICE;
  }
  // All others (Off the Wall, Custom) = 1800
  return DEFAULT_PRICE;
};

export const getVansImageProducts = (): Product[] => {
  try {
    if (!fs.existsSync(VANS_DIR)) {
      return [];
    }

    const files = fs
      .readdirSync(VANS_DIR)
      .filter((file) => file.match(/\.(jpg|jpeg|png|webp)$/i))
      .sort((a, b) => a.localeCompare(b));

    return files.map((file, index) => {
      const name = formatName(file);
      const price = getPrice(file, name);
      return {
        id: buildId(file),
        name,
        description: getVansDescription(index),
        price,
        image: `/images/vans/${file}`,
        category: 'vans',
        gender: 'Unisex',
      } satisfies Product;
    });
  } catch (error) {
    console.error('Error loading vans images:', error);
    return [];
  }
};

