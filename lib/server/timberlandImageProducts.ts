import fs from 'fs';
import path from 'path';

import type { Product } from '@/data/products';

const TIMBERLAND_DIR = path.join(process.cwd(), 'public', 'images', 'timberland');

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
    return 'Timberland';
  }

  return cleaned
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ');
};

const buildId = (fileName: string): string => {
  const stem = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  return `timberland-auto-${stem.replace(/[^a-z0-9]+/g, '-')}`;
};

const sanitizeDescription = (name: string): string => {
  return `${name} — Quality Timberland casual shoes from Trendy Fashion Zone`;
};

const DEFAULT_PRICE = 2800;

export const getTimberlandImageProducts = (): Product[] => {
  if (!fs.existsSync(TIMBERLAND_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(TIMBERLAND_DIR)
    .filter((file) => file.match(/\.(jpg|jpeg|png|webp)$/i))
    .sort((a, b) => a.localeCompare(b));

  return files.map((file) => {
    const name = formatName(file);
    return {
      id: buildId(file),
      name,
      description: sanitizeDescription(name),
      price: DEFAULT_PRICE,
      image: `/images/timberland/${file}`,
      category: 'casual',
      gender: 'Unisex',
    } satisfies Product;
  });
};

