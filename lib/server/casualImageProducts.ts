import fs from 'fs';
import path from 'path';

import type { Product } from '@/data/products';

const CASUAL_DIR = path.join(process.cwd(), 'public', 'images', 'casual');

const formatName = (fileName: string): string => {
  const base = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const spaced = base
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ') // collapse double spaces
    .trim();
  const withoutDigits = spaced.replace(/[0-9]+/g, '').replace(/\s+/g, ' ').trim();

  if (!withoutDigits) {
    return 'Casual Shoe';
  }

  return withoutDigits
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
};

const buildId = (fileName: string): string => {
  const stem = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  return `casual-auto-${stem.replace(/[^a-z0-9]+/g, '-')}`;
};

const sanitizeDescription = (name: string): string => {
  return `${name} — Quality casual shoes from Trendy Fashion Zone`;
};

const DEFAULT_PRICE = 3000;

export const getCasualImageProducts = (): Product[] => {
  try {
    if (!fs.existsSync(CASUAL_DIR)) {
      return [];
    }

    const excluded = new Set([
      'cortexnike-10.jpg',
      'cortexnike-11.jpg',
      'cortexnike-12.jpg',
    ]);

    const files = fs
      .readdirSync(CASUAL_DIR)
      .filter((file) => file.match(/\.(jpg|jpeg|png|webp)$/i))
      .filter((file) => !excluded.has(file.toLowerCase()))
      .sort((a, b) => a.localeCompare(b));

    return files
      .map((file) => {
        const name = formatName(file);
        const lower = name.toLowerCase();
        const shouldInclude =
          !lower.includes('clarks') &&
          !lower.includes('clarks official') &&
          (
            lower.includes('casual') ||
            lower.includes('timberland') ||
            lower.includes('timba') ||
            lower.includes('lacoste') ||
            lower.includes('tommy') ||
            lower.includes('hilfig') ||
            lower.includes('boss')
          );

        return { file, name, shouldInclude };
      })
      .filter(({ shouldInclude }) => shouldInclude)
      .filter(({ file }) => {
        // Verify file actually exists before including it
        const filePath = path.join(CASUAL_DIR, file);
        return fs.existsSync(filePath);
      })
      .map(({ file, name }) => {
        return {
          id: buildId(file),
          name,
          description: sanitizeDescription(name),
          price: DEFAULT_PRICE,
          image: `/images/casual/${file}`,
          category: 'casual',
          gender: 'Unisex',
        } satisfies Product;
      });
  } catch (error) {
    console.error('Error loading casual images:', error);
    return [];
  }
};


