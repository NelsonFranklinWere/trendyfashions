import { Product } from '@/data/products';

export const VANS_SUBCATEGORY_FILTERS = ['Custom', 'Codra', 'Skater', 'Off the Wall'] as const;

export const DEFAULT_VANS_FILTER = VANS_SUBCATEGORY_FILTERS[0];

export type VansFilter = (typeof VANS_SUBCATEGORY_FILTERS)[number];

const normalize = (value: string | undefined) => value?.toLowerCase() ?? '';

const matches = (product: Product, keywords: string[]) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return keywords.some((keyword) => source.includes(keyword));
};

const isCustom = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('custom') || 
         source.includes('customized') || 
         source.includes('customised') ||
         source.includes('customm');
};

const isCodra = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  // Strict: must contain codra, must NOT contain skater or off the wall
  return source.includes('codra') && 
         !source.includes('skater') && 
         !source.includes('off the wall') &&
         !source.includes('offthewall') &&
         !source.includes('custom');
};

const isSkater = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  // Strict: must contain skater, must NOT contain codra or off the wall
  return source.includes('skater') && 
         !source.includes('codra') && 
         !source.includes('off the wall') &&
         !source.includes('offthewall') &&
         !source.includes('custom');
};

const isOffTheWall = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('off the wall') || 
         source.includes('offthewall') ||
         source.includes('ofthewal');
};

export const filterVansProducts = (products: Product[], filter: VansFilter): Product[] => {
  if (filter === 'Custom') {
    return products.filter(isCustom);
  }

  if (filter === 'Codra') {
    return products.filter(isCodra);
  }

  if (filter === 'Skater') {
    return products.filter(isSkater);
  }

  if (filter === 'Off the Wall') {
    return products.filter(isOffTheWall);
  }

  // Default: return empty array (should not happen with restricted filters)
  return [];
};

export const hasVansMatches = (products: Product[], filter: VansFilter): boolean => {
  return filterVansProducts(products, filter).length > 0;
};

