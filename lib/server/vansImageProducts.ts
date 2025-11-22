import fs from 'fs';
import path from 'path';

import type { Product } from '@/data/products';

const VANS_DIR = path.join(process.cwd(), 'public', 'images', 'vans');

const formatName = (fileName: string): string => {
  const base = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  
  // Remove trailing numbers but preserve category keywords
  let name = base.replace(/\d+$/, '').trim();
  
  // Handle specific patterns
  if (name.toLowerCase().startsWith('skatervans')) {
    name = 'Skater Vans';
  } else if (name.toLowerCase().startsWith('vancodra')) {
    name = 'Vans Codra';
  } else if (name.toLowerCase().startsWith('vansoffthewall')) {
    name = 'Vans Off The Wall';
  } else {
    // General formatting: add spaces before capital letters, remove numbers
    name = name
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
      .replace(/[-_]+/g, ' ')
      .replace(/\d+/g, '') // Remove all numbers
      .replace(/\s+/g, ' ')
      .trim();
    
    // Capitalize first letter of each word
    name = name
      .split(' ')
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
      .join(' ');
  }

  if (!name) {
    return 'Vans Shoe';
  }

  return name;
};

const buildId = (fileName: string): string => {
  const stem = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
  return `vans-auto-${stem.replace(/[^a-z0-9]+/g, '-')}`;
};

const sanitizeDescription = (name: string): string => {
  return `${name} — Classic Vans sneakers and customized designs from Trendy Fashion Zone`;
};

const getPrice = (fileName: string): number => {
  const lowerFileName = fileName.toLowerCase();
  // Skater Vans = 3000
  if (lowerFileName.startsWith('skatervans')) {
    return 3000;
  }
  // All others (Codra, Off the Wall, Custom) = 1800
  return 1800;
};

export const getVansImageProducts = (): Product[] => {
  try {
    if (!fs.existsSync(VANS_DIR)) {
      return [];
    }

    const files = fs
      .readdirSync(VANS_DIR)
      .filter((file) => file.match(/\.(jpg|jpeg|png|webp)$/i))
      .sort((a, b) => a.localeCompare(b));

    return files.map((file) => {
      const name = formatName(file);
      return {
        id: buildId(file),
        name,
        description: sanitizeDescription(name),
        price: getPrice(file),
        image: `/images/vans/${file}`,
        category: 'vans',
        gender: 'Unisex',
      } satisfies Product;
    });
  } catch (error) {
    console.error('Error loading vans images:', error);
    return [];
  }
};

