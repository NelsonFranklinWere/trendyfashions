import fs from 'fs';
import path from 'path';

import type { Product } from '@/data/products';

const CUSTOMIZED_DIR = path.join(process.cwd(), 'public', 'images', 'customized');

const formatName = (fileName: string): string => {
  const base = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const lowerBase = base.toLowerCase();
  
  // Remove trailing numbers and dots
  let cleaned = base
    .replace(/\s*\([0-9]+\)/g, '') // Remove (2), (3), etc.
    .replace(/[-_@]+/g, ' ') // Replace dashes/underscores with spaces
    .replace(/\d+/g, '') // Remove all numbers
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
  
  // Handle specific product types
  if (lowerBase.includes('clarks')) {
    return 'Clarks Custom';
  }
  
  if (lowerBase.includes('dior')) {
    return 'Dior Custom';
  }
  
  if (lowerBase.includes('cactus') || lowerBase.includes('cacti')) {
    return 'Cactus Jack Custom';
  }
  
  if (lowerBase.includes('lv') || lowerBase.includes('louis vuitton')) {
    return 'Louis Vuitton Custom';
  }
  
  if (lowerBase.includes('cortex')) {
    return 'Cortex Custom';
  }
  
  // General custom product
  if (!cleaned) {
    return 'Custom Product';
  }
  
  return cleaned
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') + ' Custom';
};

const buildId = (fileName: string): string => {
  const stem = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  return `customized-auto-${stem.replace(/[^a-z0-9]+/g, '-')}`;
};

// Attractive descriptions for Custom products
const customDescriptions = [
  'Exclusive custom designs crafted with attention to detail. Premium quality meets unique personalization.',
  'Handcrafted custom products that reflect your individual style. Quality materials and expert craftsmanship.',
  'Unique custom designs that set you apart. Experience premium quality with personalized touches.',
  'Premium custom products tailored to your preferences. Stand out with these exclusive designs.',
  'Artistic custom creations for the discerning customer. Quality craftsmanship meets innovative design.',
  'Exclusive custom products that make a statement. Premium materials and expert attention to detail.',
  'Unique custom designs that reflect your personality. Quality you can feel, style you can see.',
  'Handcrafted custom products for the style-conscious. Experience the perfect blend of quality and uniqueness.',
  'Premium custom designs that elevate your collection. Expert craftsmanship meets personalized style.',
  'Exclusive custom products that command attention. Quality materials and innovative design.',
];

const getCustomDescription = (index: number): string => {
  return customDescriptions[index % customDescriptions.length];
};

const DEFAULT_PRICE = 3000;

export const getCustomizedImageProducts = (): Product[] => {
  try {
    if (!fs.existsSync(CUSTOMIZED_DIR)) {
      return [];
    }

    const files = fs
      .readdirSync(CUSTOMIZED_DIR)
      .filter((file) => file.match(/\.(jpg|jpeg|png|webp)$/i))
      .sort((a, b) => a.localeCompare(b));

    return files.map((file, index) => {
      const name = formatName(file);
      return {
        id: buildId(file),
        name,
        description: getCustomDescription(index),
        price: DEFAULT_PRICE,
        image: `/images/customized/${file}`,
        category: 'custom',
        gender: 'Unisex',
      } satisfies Product;
    });
  } catch (error) {
    console.error('Error loading customized images:', error);
    return [];
  }
};

