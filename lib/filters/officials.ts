import { Product } from '@/data/products';

export const OFFICIAL_SUBCATEGORY_FILTERS = ['Boots', 'Empire', 'Casuals', 'Mules', 'Clarks'] as const;

export const DEFAULT_OFFICIAL_FILTER = OFFICIAL_SUBCATEGORY_FILTERS[0];

export type OfficialFilter = (typeof OFFICIAL_SUBCATEGORY_FILTERS)[number];

const normalize = (value: string | undefined) => value?.toLowerCase() ?? '';

const isBoots = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('boot') || source.includes('timber');
};

const isEmpire = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('empire');
};

const isCasuals = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return (
    source.includes('casual') ||
    source.includes('loafer') ||
    source.includes('slip-on') ||
    source.includes('slip on')
  );
};

const isMules = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('mule');
};

const isClarks = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('clark');
};

export const filterOfficialsProducts = (products: Product[], filter: OfficialFilter): Product[] => {
  if (filter === 'Boots') {
    return products.filter(isBoots);
  }

  if (filter === 'Empire') {
    return products.filter(isEmpire);
  }

  if (filter === 'Casuals') {
    return products.filter(isCasuals);
  }

  if (filter === 'Mules') {
    return products.filter(isMules);
  }

  if (filter === 'Clarks') {
    return products.filter(isClarks);
  }

  return products;
};

export const hasOfficialMatches = (products: Product[], filter: OfficialFilter) => {
  return filterOfficialsProducts(products, filter).length > 0;
};


