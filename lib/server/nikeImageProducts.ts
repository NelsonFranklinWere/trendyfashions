import fs from 'fs';
import path from 'path';

import type { Product } from '@/data/products';

const NIKE_DIR = path.join(process.cwd(), 'public', 'images', 'Nike');

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
    return 'Nike';
  }

  return cleaned
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ');
};

const buildId = (fileName: string): string => {
  const stem = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  return `nike-auto-${stem.replace(/[^a-z0-9]+/g, '-')}`;
};

const sanitizeDescription = (name: string): string => {
  return `${name} — Quality Nike sneakers from Trendy Fashion Zone`;
};

const DEFAULT_PRICE = 3500;

export const getNikeImageProducts = (): Product[] => {
  if (!fs.existsSync(NIKE_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(NIKE_DIR)
    .filter((file) => file.match(/\.(jpg|jpeg|png|webp)$/i))
    .sort((a, b) => a.localeCompare(b));

  return files.map((file) => {
    const name = formatName(file);
    
    return {
      id: buildId(file),
      name,
      description: sanitizeDescription(name),
      price: DEFAULT_PRICE,
      image: `/images/Nike/${file}`,
      category: 'sneakers',
      gender: 'Men',
    } satisfies Product;
  });
};
