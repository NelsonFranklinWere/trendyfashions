import { Product } from '@/data/products';

export const OFFICIAL_SUBCATEGORY_FILTERS = ['Boots', 'Empire', 'Casuals', 'Mules', 'Clarks'] as const;

export const DEFAULT_OFFICIAL_FILTER = OFFICIAL_SUBCATEGORY_FILTERS[0];

export type OfficialFilter = (typeof OFFICIAL_SUBCATEGORY_FILTERS)[number];

const normalize = (value: string | undefined) => value?.toLowerCase() ?? '';

// CRITICAL: Only images from formal folder or officials category should be shown in officials
const isFormalImage = (product: Product) => {
  const imagePath = normalize(product.image);
  // Check for local filesystem path or Supabase Storage URL with officials category
  return imagePath.includes('/images/formal/') || 
         imagePath.includes('/officials/') ||
         (product.category === 'officials');
};

const isClarks = (product: Product) => {
  if (!isFormalImage(product)) return false;
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('clark') || source.includes('clarks official');
};

const isBoots = (product: Product) => {
  if (!isFormalImage(product)) return false;
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('boot');
};

const isEmpire = (product: Product) => {
  if (!isFormalImage(product)) return false;
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('empire');
};

const isCasuals = (product: Product) => {
  // For "Casuals" under Officials: show casual products (excluding Clarks) from the formal folder
  if (!isFormalImage(product)) return false;
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('casual') && !source.includes('clark') && !source.includes('clarks official');
};

const isMules = (product: Product) => {
  if (!isFormalImage(product)) return false;
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('mule');
};

export const filterOfficialsProducts = (products: Product[], filter: OfficialFilter): Product[] => {
  // First, ensure ALL products are from formal folder only
  const formalProducts = products.filter(isFormalImage);

  if (filter === 'Boots') {
    return formalProducts.filter(isBoots);
  }

  if (filter === 'Empire') {
    return formalProducts.filter(isEmpire);
  }

  if (filter === 'Casuals') {
    return formalProducts.filter(isCasuals);
  }

  if (filter === 'Mules') {
    return formalProducts.filter(isMules);
  }

  if (filter === 'Clarks') {
    return formalProducts.filter(isClarks);
  }

  // Default: return all formal images
  return formalProducts;
};

export const hasOfficialMatches = (products: Product[], filter: OfficialFilter) => {
  return filterOfficialsProducts(products, filter).length > 0;
};


