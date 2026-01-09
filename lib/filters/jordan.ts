import { Product } from '@/data/products';

export const JORDAN_SUBCATEGORY_FILTERS = ['Jordan 1', 'Jordan 3', 'Jordan 4', 'Jordan 9', 'Jordan 11', 'Jordan 14'] as const;

export const DEFAULT_JORDAN_FILTER = JORDAN_SUBCATEGORY_FILTERS[0];

export type JordanFilter = (typeof JORDAN_SUBCATEGORY_FILTERS)[number];

const normalize = (value: string | undefined) => value?.toLowerCase() ?? '';

const matches = (product: Product, keywords: string[]) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return keywords.some((keyword) => source.includes(keyword));
};

const isJordan1 = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  // Match j1, jordan 1, jordan1 but exclude j11, j14, jordan11, jordan14
  return (source.includes('j1') || source.includes('jordan 1') || source.includes('jordan1')) && 
         !source.includes('j11') && 
         !source.includes('j14') &&
         !source.includes('jordan11') &&
         !source.includes('jordan14');
};

const isJordan3 = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('j3') || source.includes('jordan 3') || source.includes('jordan3');
};

const isJordan4 = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  // Match j4, jordan 4, jordan4, jordan04, jordan-4
  return source.includes('j4') || 
         source.includes('jordan 4') || 
         source.includes('jordan4') || 
         source.includes('jordan04') ||
         source.includes('jordan-4');
};

const isJordan9 = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('j9') || source.includes('jordan 9') || source.includes('jordan9');
};

const isJordan11 = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('j11') || source.includes('jordan 11') || source.includes('jordan11');
};

const isJordan14 = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('j14') || source.includes('jordan 14') || source.includes('jordan14');
};

export const filterJordanProducts = (products: Product[], filter: JordanFilter): Product[] => {
  if (filter === 'Jordan 1') {
    return products.filter(isJordan1);
  }

  if (filter === 'Jordan 3') {
    return products.filter(isJordan3);
  }

  if (filter === 'Jordan 4') {
    return products.filter(isJordan4);
  }

  if (filter === 'Jordan 9') {
    return products.filter(isJordan9);
  }

  if (filter === 'Jordan 11') {
    return products.filter(isJordan11);
  }

  if (filter === 'Jordan 14') {
    return products.filter(isJordan14);
  }

  // Default: return empty array (should not happen with restricted filters)
  return [];
};

export const hasJordanMatches = (products: Product[], filter: JordanFilter): boolean => {
  return filterJordanProducts(products, filter).length > 0;
};

