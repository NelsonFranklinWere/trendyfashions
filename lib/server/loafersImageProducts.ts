import fs from 'fs';
import path from 'path';

import type { Product } from '@/data/products';

const LOAFERS_DIR = path.join(process.cwd(), 'public', 'images', 'loafers');

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
    return 'Loafer';
  }

  return cleaned
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ');
};

const buildId = (fileName: string): string => {
  const stem = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  return `loafer-auto-${stem.replace(/[^a-z0-9]+/g, '-')}`;
};

const sanitizeDescription = (name: string): string => {
  return `${name} — Quality loafer shoes from Trendy Fashion Zone`;
};

const DEFAULT_PRICE = 2800;

export const getLoafersImageProducts = (): Product[] => {
  if (!fs.existsSync(LOAFERS_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(LOAFERS_DIR)
    .filter((file) => file.match(/\.(jpg|jpeg|png|webp)$/i))
    .sort((a, b) => a.localeCompare(b));

  return files.map((file) => {
    const name = formatName(file);
    const nameLower = name.toLowerCase();
    
    // Determine if it's Timberland or Lacoste
    let category = 'officials';
    if (nameLower.includes('timberland') || nameLower.includes('timba')) {
      category = 'casuals';
    }
    
    return {
      id: buildId(file),
      name,
      description: sanitizeDescription(name),
      price: DEFAULT_PRICE,
      image: `/images/loafers/${file}`,
      category,
      gender: 'Men',
      tags: ['loafer'],
    } satisfies Product;
  });
};
