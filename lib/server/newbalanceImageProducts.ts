import fs from 'fs';
import path from 'path';

import type { Product } from '@/data/products';

const NEWBALANCE_DIR = path.join(process.cwd(), 'public', 'images', 'newbalance');

const formatName = (fileName: string): string => {
  const base = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const lowerBase = base.toLowerCase();
  
  // Handle New Balance 1000 specifically
  if (lowerBase.includes('1000')) {
    return 'New Balance 1000';
  }
  
  // Handle New Balance 530 specifically
  if (lowerBase.includes('530')) {
    return 'New Balance 530';
  }
  
  const spaced = base
    .replace(/[-_@]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const cleaned = spaced
    .replace(/\s+\d+$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return 'New Balance';
  }

  return cleaned
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ');
};

const buildId = (fileName: string): string => {
  const stem = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  return `newbalance-auto-${stem.replace(/[^a-z0-9]+/g, '-')}`;
};

const sanitizeDescription = (name: string): string => {
  return `${name} — Classic and modern New Balance sneakers from Trendy Fashion Zone`;
};

const NEW_BALANCE_1000_PRICE = 4000;
const DEFAULT_NEW_BALANCE_PRICE = 3800;

const getPrice = (productName: string): number => {
  if (productName === 'New Balance 1000') {
    return NEW_BALANCE_1000_PRICE;
  }
  return DEFAULT_NEW_BALANCE_PRICE;
};

export const getNewBalanceImageProducts = (): Product[] => {
  if (!fs.existsSync(NEWBALANCE_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(NEWBALANCE_DIR)
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
      image: `/images/newbalance/${file}`,
      category: 'casual',
      gender: 'Unisex',
    } satisfies Product;
  });
};

