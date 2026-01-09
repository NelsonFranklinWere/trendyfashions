import fs from 'fs';
import path from 'path';

import type { Product } from '@/data/products';

const SPORTS_DIR = path.join(process.cwd(), 'public', 'images', 'sports');

const formatName = (fileName: string): string => {
  const base = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const lowerBase = base.toLowerCase();
  
  // Handle F50 football boots
  if (lowerBase.includes('f50') || lowerBase.includes('f-50')) {
    return 'F50 Football Boots';
  }
  
  // Handle football boots
  if (lowerBase.includes('football') || lowerBase.includes('footbal') || lowerBase.includes('boot')) {
    return 'Football Boots';
  }
  
  // Handle IMG files - rename to Trainer
  if (lowerBase.startsWith('img') || lowerBase.includes('img-')) {
    return 'Trainer';
  }
  
  // Handle trainers
  if (lowerBase.includes('trainer') || lowerBase.includes('tainer') || lowerBase.includes('training')) {
    return 'Trainer';
  }
  
  // Handle Nike trainers specifically
  if (lowerBase.includes('niketrainer') || lowerBase.includes('nike trainer')) {
    return 'Nike Trainer';
  }
  
  // Handle Zoom products
  if (lowerBase.includes('zoom')) {
    return 'Nike Zoom';
  }
  
  // Handle Running shoes
  if (lowerBase.includes('running')) {
    return 'Running Shoes';
  }
  
  // Handle Salomon
  if (lowerBase.includes('salomon')) {
    return 'Salomon';
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
    return 'Sports Shoes';
  }

  return cleaned
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ');
};

const buildId = (fileName: string): string => {
  const stem = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  return `sports-auto-${stem.replace(/[^a-z0-9]+/g, '-')}`;
};

const sanitizeDescription = (name: string): string => {
  return `${name} — Quality sports footwear from Trendy Fashion Zone`;
};

const DEFAULT_PRICE = 3500;
const F50_PRICE = 5500;
const FOOTBALL_BOOTS_PRICE = 5500;
const TRAINER_PRICE = 2500;

const getPrice = (productName: string): number => {
  // F50 Football Boots = 5500
  if (productName === 'F50 Football Boots') {
    return F50_PRICE;
  }
  // Football Boots = 5500
  if (productName === 'Football Boots') {
    return FOOTBALL_BOOTS_PRICE;
  }
  // Trainers = 2500
  if (productName === 'Trainer' || productName === 'Nike Trainer') {
    return TRAINER_PRICE;
  }
  // All others = 3500
  return DEFAULT_PRICE;
};

export const getSportsImageProducts = (): Product[] => {
  if (!fs.existsSync(SPORTS_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(SPORTS_DIR)
    .filter((file) => file.match(/\.(jpg|jpeg|png|webp)$/i))
    .sort((a, b) => a.localeCompare(b));

  return files.map((file) => {
    const name = formatName(file);
    const price = getPrice(name);
    return {
      id: buildId(file),
      name,
      description: sanitizeDescription(name),
      price,
      image: `/images/sports/${file}`,
      category: 'sports',
      gender: 'Unisex',
    } satisfies Product;
  });
};

