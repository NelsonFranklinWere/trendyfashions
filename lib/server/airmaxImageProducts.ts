import fs from 'fs';
import path from 'path';

import type { Product } from '@/data/products';

const AIRMAX_DIR = path.join(process.cwd(), 'public', 'images', 'airmax');

const formatName = (fileName: string): string => {
  const base = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const lowerBase = base.toLowerCase();
  
  // Remove trailing numbers and dots (e.g., .1, .2, (2), etc.)
  let cleaned = base
    .replace(/\s*\([0-9]+\)/g, '') // Remove (2), (3), etc.
    .replace(/\.\d+$/g, '') // Remove trailing .1, .2, etc.
    .replace(/\.+$/g, ''); // Remove trailing dots
  
  // Handle Air Max 1
  if (lowerBase.includes('air-max-1') || lowerBase.includes('air-max1') || 
      (lowerBase.includes('airmax') && lowerBase.includes('1') && 
       !lowerBase.includes('90') && !lowerBase.includes('95') && !lowerBase.includes('97'))) {
    return 'Air Max 1';
  }
  
  // Handle Air Max 97
  if (lowerBase.includes('airmax97') || lowerBase.includes('air-max97') || 
      lowerBase.includes('air-max-97') || lowerBase.includes('nikeairmax1')) {
    return 'Air Max 97';
  }
  
  // Handle Air Max 95
  if (lowerBase.includes('airmax95') || lowerBase.includes('air-max95') || 
      lowerBase.includes('air-max-95')) {
    return 'Air Max 95';
  }
  
  // Handle Air Max 90
  if (lowerBase.includes('airmax90') || lowerBase.includes('air-max90') || 
      lowerBase.includes('air-max-90')) {
    return 'Air Max 90';
  }
  
  // General Air Max (remove numbers, add spaces)
  cleaned = cleaned
    .replace(/[-_]+/g, ' ') // Replace dashes/underscores with spaces
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
    .replace(/\d+/g, '') // Remove all numbers
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
  
  // Capitalize properly
  if (cleaned.toLowerCase().includes('airmax') || cleaned.toLowerCase().includes('air max')) {
    return 'Air Max';
  }
  
  if (!cleaned) {
    return 'Air Max';
  }
  
  return cleaned
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const buildId = (fileName: string): string => {
  const stem = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  return `airmax-auto-${stem.replace(/[^a-z0-9]+/g, '-')}`;
};

// Attractive descriptions for Airmax products
const airmaxDescriptions = [
  'Premium Nike Air Max sneakers for the modern athlete. Iconic design meets cutting-edge comfort technology.',
  'Classic Air Max style that never goes out of fashion. Perfect for running, training, and everyday wear.',
  'Legendary Air Max collection with visible air cushioning. Experience unmatched comfort and performance.',
  'Iconic Air Max sneakers built for style and performance. Quality craftsmanship meets athletic excellence.',
  'Timeless Air Max design for the active lifestyle. Step into comfort with these premium running shoes.',
  'Premium Air Max collection that elevates your athletic game. Quality materials and expert engineering.',
  'Classic Air Max sneakers that make a statement. Built for performance, styled for the streets.',
  'Legendary Air Max with visible air technology. Experience the perfect blend of comfort and style.',
  'Iconic Air Max design for the modern runner. Premium quality meets athletic innovation.',
  'Timeless Air Max collection that reflects your active lifestyle. Quality you can feel, performance you can trust.',
  'Premium Air Max sneakers built for excellence. Step into greatness with these legendary kicks.',
  'Classic Air Max style that commands respect. Quality craftsmanship meets athletic heritage.',
  'Legendary Air Max with attention to detail. The ultimate sneaker for serious athletes.',
  'Iconic Air Max collection for those who demand the best. Premium materials and expert design.',
  'Timeless Air Max sneakers that never disappoint. Perfect blend of style, comfort, and performance.',
];

const getAirmaxDescription = (index: number): string => {
  return airmaxDescriptions[index % airmaxDescriptions.length];
};

const DEFAULT_PRICE = 3000;

export const getAirmaxImageProducts = (): Product[] => {
  try {
    if (!fs.existsSync(AIRMAX_DIR)) {
      return [];
    }

    const files = fs
      .readdirSync(AIRMAX_DIR)
      .filter((file) => file.match(/\.(jpg|jpeg|png|webp)$/i))
      .sort((a, b) => a.localeCompare(b));

    return files.map((file, index) => {
      const name = formatName(file);
      return {
        id: buildId(file),
        name,
        description: getAirmaxDescription(index),
        price: DEFAULT_PRICE,
        image: `/images/airmax/${file}`,
        category: 'running',
        gender: 'Unisex',
      } satisfies Product;
    });
  } catch (error) {
    console.error('Error loading airmax images:', error);
    return [];
  }
};

