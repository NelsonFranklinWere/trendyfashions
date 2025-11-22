import fs from 'fs';
import path from 'path';

import type { Product } from '@/data/products';

const JORDAN_DIR = path.join(process.cwd(), 'public', 'images', 'jordan');

const formatName = (fileName: string): string => {
  const base = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const lowerBase = base.toLowerCase();
  
  // Remove trailing numbers and dots (e.g., .1, .2, (2), etc.)
  let cleaned = base
    .replace(/\s*\([0-9]+\)/g, '') // Remove (2), (3), etc.
    .replace(/\.\d+$/g, '') // Remove trailing .1, .2, etc.
    .replace(/\.+$/g, ''); // Remove trailing dots
  
  // Handle Jordan 1 (exclude 11 and 14)
  if ((lowerBase.includes('jordan1') || lowerBase.includes('jordan 1') || lowerBase.includes('j1')) &&
      !lowerBase.includes('jordan11') && !lowerBase.includes('jordan14') &&
      !lowerBase.includes('j11') && !lowerBase.includes('j14')) {
    return 'Jordan 1';
  }
  
  // Handle Jordan 3
  if (lowerBase.includes('jordan3') || lowerBase.includes('jordan 3') || lowerBase.includes('j3')) {
    return 'Jordan 3';
  }
  
  // Handle Jordan 4
  if (lowerBase.includes('jordan4') || lowerBase.includes('jordan 4') || lowerBase.includes('j4') ||
      lowerBase.includes('jordan04') || lowerBase.includes('jordan-4')) {
    return 'Jordan 4';
  }
  
  // Handle Jordan 9
  if (lowerBase.includes('jordan9') || lowerBase.includes('jordan 9') || lowerBase.includes('j9')) {
    return 'Jordan 9';
  }
  
  // Handle Jordan 11
  if (lowerBase.includes('jordan11') || lowerBase.includes('jordan 11') || lowerBase.includes('j11')) {
    return 'Jordan 11';
  }
  
  // Handle Jordan 14
  if (lowerBase.includes('jordan14') || lowerBase.includes('jordan 14') || lowerBase.includes('j14')) {
    return 'Jordan 14';
  }
  
  // General Jordan (remove numbers, add spaces)
  cleaned = cleaned
    .replace(/[-_@]+/g, ' ') // Replace dashes/underscores with spaces
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
    .replace(/\d+/g, '') // Remove all numbers
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
  
  // Capitalize properly
  if (cleaned.toLowerCase().includes('jordan')) {
    return 'Jordan';
  }
  
  if (!cleaned) {
    return 'Jordan';
  }
  
  return cleaned
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const buildId = (fileName: string): string => {
  const stem = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  return `jordan-auto-${stem.replace(/[^a-z0-9]+/g, '-')}`;
};

// Attractive descriptions for Jordan products
const jordanDescriptions = [
  'Iconic Air Jordan sneakers that define street style. Premium quality meets legendary basketball heritage.',
  'Classic Jordan design that never goes out of fashion. Step into greatness with these legendary sneakers.',
  'Premium Air Jordan collection for the sneaker enthusiast. Quality craftsmanship and timeless appeal.',
  'Legendary Jordan sneakers that make a statement. Built for style, designed for the court and street.',
  'Iconic Air Jordan with authentic design details. Experience the legacy of basketball greatness.',
  'Classic Jordan sneakers that elevate your style. Premium materials and expert craftsmanship.',
  'Timeless Air Jordan design for the modern sneakerhead. Quality you can feel, style you can see.',
  'Legendary Jordan collection that commands respect. Step into history with these iconic kicks.',
  'Premium Air Jordan sneakers for the discerning collector. Authentic design meets modern comfort.',
  'Iconic Jordan style that never disappoints. Perfect blend of heritage, quality, and street appeal.',
  'Classic Air Jordan sneakers built for performance and style. The ultimate basketball-inspired footwear.',
  'Legendary Jordan design that reflects your passion. Premium quality and authentic basketball heritage.',
  'Timeless Air Jordan collection for the true sneaker enthusiast. Experience the legacy firsthand.',
  'Iconic Jordan sneakers that make a statement. Built for the court, styled for the streets.',
  'Premium Air Jordan with attention to detail. Quality craftsmanship meets legendary basketball design.',
];

const getJordanDescription = (index: number): string => {
  return jordanDescriptions[index % jordanDescriptions.length];
};

const DEFAULT_PRICE = 3500;

export const getJordanImageProducts = (): Product[] => {
  try {
    if (!fs.existsSync(JORDAN_DIR)) {
      return [];
    }

    const files = fs
      .readdirSync(JORDAN_DIR)
      .filter((file) => file.match(/\.(jpg|jpeg|png|webp)$/i))
      .sort((a, b) => a.localeCompare(b));

    return files.map((file, index) => {
      const name = formatName(file);
      return {
        id: buildId(file),
        name,
        description: getJordanDescription(index),
        price: DEFAULT_PRICE,
        image: `/images/jordan/${file}`,
        category: 'sports',
        gender: 'Unisex',
      } satisfies Product;
    });
  } catch (error) {
    console.error('Error loading jordan images:', error);
    return [];
  }
};

