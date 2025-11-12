import { Product } from '@/data/products';

export const SNEAKER_BRAND_FILTERS = ['Adidas', 'New Balance', 'Nike'] as const;

export const DEFAULT_SNEAKER_FILTER = SNEAKER_BRAND_FILTERS[0];

export type SneakerBrandFilter = (typeof SNEAKER_BRAND_FILTERS)[number];

const normalize = (value: string | undefined) => value?.toLowerCase() ?? '';

const getSearchSource = (product: Product) => {
  return `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
};

const includesAny = (source: string, keywords: string[]) => {
  return keywords.some((keyword) => source.includes(keyword));
};

const isAdidas = (product: Product) => {
  const source = getSearchSource(product);
  return includesAny(source, [
    'adidas',
    'addidas',
    'adi',
    'samba',
    'campus',
    'gazelle',
    'gazele',
    'spezi',
    'special',
  ]);
};

const isNewBalance = (product: Product) => {
  const source = getSearchSource(product);
  return includesAny(source, ['new balance', 'new-balance', 'newbalance', ' nb', 'nb ', 'nb-', 'nb530', 'nb5']);
};

const isNike = (product: Product) => {
  const source = getSearchSource(product);
  return includesAny(source, [
    'nike',
    'sike',
    'air max',
    'airmax',
    'air force',
    'af1',
    'tn',
    'sb',
    'dunk',
    'shox',
    'portal',
    'cortex',
  ]);
};

export const filterSneakerProducts = (products: Product[], filter: SneakerBrandFilter): Product[] => {
  if (filter === 'Adidas') {
    return products.filter(isAdidas);
  }

  if (filter === 'New Balance') {
    return products.filter(isNewBalance);
  }

  if (filter === 'Nike') {
    return products.filter(isNike);
  }

  return products;
};

export const hasSneakerMatches = (products: Product[], filter: SneakerBrandFilter): boolean => {
  return filterSneakerProducts(products, filter).length > 0;
};

