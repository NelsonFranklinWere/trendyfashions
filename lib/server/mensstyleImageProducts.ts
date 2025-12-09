import fs from 'fs';
import path from 'path';

import type { Product } from '@/data/products';

const MENSTYLE_DIR = path.join(process.cwd(), 'public', 'images', 'Mensstyle');

const formatName = (fileName: string): string => {
  const base = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const spaced = base
    .replace(/[-_@]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const cleaned = spaced
    .replace(/\s+\d+$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return 'Men\'s Style';
  }

  return cleaned
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ');
};

const buildId = (fileName: string): string => {
  const stem = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  return `mensstyle-auto-${stem.replace(/[^a-z0-9]+/g, '-')}`;
};

const sanitizeDescription = (name: string): string => {
  return `${name} — Quality stylish men's footwear from Trendy Fashion Zone`;
};

const DEFAULT_PRICE = 4200;

export const getMensstyleImageProducts = (): Product[] => {
  if (!fs.existsSync(MENSTYLE_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(MENSTYLE_DIR)
    .filter((file) => file.match(/\.(jpg|jpeg|png|webp)$/i))
    .sort((a, b) => a.localeCompare(b));

  return files.map((file) => {
    const name = formatName(file);
    const nameLower = name.toLowerCase();
    
    // Determine category based on name
    let category = 'casuals';
    if (nameLower.includes('timberland') || nameLower.includes('timba')) {
      category = 'casuals';
    }
    
    return {
      id: buildId(file),
      name,
      description: sanitizeDescription(name),
      price: DEFAULT_PRICE,
      image: `/images/Mensstyle/${file}`,
      category,
      gender: 'Men',
    } satisfies Product;
  });
};
