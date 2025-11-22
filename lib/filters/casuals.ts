import { Product } from '@/data/products';

export const CASUAL_BRAND_FILTERS = ['Lacoste', 'Timberland', 'Tommy Hilfiggr', 'Boss', 'Other'] as const;

export const DEFAULT_CASUAL_FILTER = CASUAL_BRAND_FILTERS[0];

export type CasualBrandFilter = (typeof CASUAL_BRAND_FILTERS)[number];

const normalize = (value: string | undefined) => value?.toLowerCase() ?? '';

const matches = (product: Product, keywords: string[]) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return keywords.some((keyword) => source.includes(keyword));
};

const isLacoste = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return !source.includes('clarks') && !source.includes('clarks official') && matches(product, ['lacoste']);
};

const isTimberland = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return !source.includes('clarks') && !source.includes('clarks official') && matches(product, ['timberland', 'timba']);
};

const isTommyHilfiggr = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return !source.includes('clarks') && !source.includes('clarks official') && matches(product, ['tommy', 'hilfig']);
};

const isBoss = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return !source.includes('clarks') && !source.includes('clarks official') && matches(product, ['boss', 'hugo']);
};

const isOther = (product: Product) => {
  if (isLacoste(product) || isTimberland(product) || isTommyHilfiggr(product) || isBoss(product)) {
    return false;
  }
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return !source.includes('clarks') && 
         !source.includes('clarks official') &&
         (source.includes('casual') || source.includes('loaf') || source.includes('open') || source.includes('flop'));
};

export const filterCasualProducts = (products: Product[], filter: CasualBrandFilter): Product[] => {
  if (filter === 'Lacoste') {
    return products.filter(isLacoste);
  }

  if (filter === 'Timberland') {
    return products.filter(isTimberland);
  }

  if (filter === 'Tommy Hilfiggr') {
    return products.filter(isTommyHilfiggr);
  }

  if (filter === 'Boss') {
    return products.filter(isBoss);
  }

  if (filter === 'Other') {
    return products.filter(isOther);
  }

  // Default: return empty array (should not happen with restricted filters)
  return [];
};

export const hasCasualMatches = (products: Product[], filter: CasualBrandFilter) => {
  return filterCasualProducts(products, filter).length > 0;
};


