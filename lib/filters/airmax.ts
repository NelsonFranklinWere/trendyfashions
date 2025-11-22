import { Product } from '@/data/products';

export const AIRMAX_SUBCATEGORY_FILTERS = ['AirMax 1', 'Airmax 97', 'Airmax 95', 'Airmax 90', 'Airmax'] as const;

export const DEFAULT_AIRMAX_FILTER = AIRMAX_SUBCATEGORY_FILTERS[0];

export type AirmaxFilter = (typeof AIRMAX_SUBCATEGORY_FILTERS)[number];

const normalize = (value: string | undefined) => value?.toLowerCase() ?? '';

const isAirmax1 = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  // Exclude NikeAirMax1.jpg - it belongs to Airmax 97
  if (source.includes('nikeairmax1')) {
    return false;
  }
  // Match airmax 1, air-max-1, airmax1, air-max1, but exclude 90, 95, 97
  return (source.includes('airmax 1') || 
          source.includes('air-max-1') || 
          source.includes('airmax1') || 
          source.includes('air-max1')) &&
         !source.includes('90') &&
         !source.includes('95') &&
         !source.includes('97');
};

const isAirmax97 = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  // Include NikeAirMax1.jpg in Airmax 97
  return source.includes('nikeairmax1') ||
         source.includes('airmax 97') || 
         source.includes('air-max97') || 
         source.includes('airmax97') ||
         source.includes('air-max 97');
};

const isAirmax95 = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('airmax 95') || 
         source.includes('airmax95') ||
         source.includes('air-max95') ||
         source.includes('air-max 95');
};

const isAirmax90 = (product: Product) => {
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('airmax 90') || 
         source.includes('airmax90') ||
         source.includes('air-max90') ||
         source.includes('air-max 90');
};

const isAirmax = (product: Product) => {
  // General Airmax products that don't match specific models
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  const hasAirmax = source.includes('airmax') || source.includes('air max') || source.includes('air-max');
  // Exclude if it matches specific models
  return hasAirmax && 
         !isAirmax1(product) && 
         !isAirmax97(product) && 
         !isAirmax95(product) && 
         !isAirmax90(product);
};

export const filterAirmaxProducts = (products: Product[], filter: AirmaxFilter): Product[] => {
  if (filter === 'AirMax 1') {
    return products.filter(isAirmax1);
  }

  if (filter === 'Airmax 97') {
    return products.filter(isAirmax97);
  }

  if (filter === 'Airmax 95') {
    return products.filter(isAirmax95);
  }

  if (filter === 'Airmax 90') {
    return products.filter(isAirmax90);
  }

  if (filter === 'Airmax') {
    return products.filter(isAirmax);
  }

  // Default: return empty array (should not happen with restricted filters)
  return [];
};

export const hasAirmaxMatches = (products: Product[], filter: AirmaxFilter): boolean => {
  return filterAirmaxProducts(products, filter).length > 0;
};

