import { Product } from '@/data/products';

export const OFFICIAL_SUBCATEGORY_FILTERS = ['Boots', 'Empire', 'Mules', 'Casuals', 'Other'] as const;

export const DEFAULT_OFFICIAL_FILTER = OFFICIAL_SUBCATEGORY_FILTERS[0];

export type OfficialFilter = (typeof OFFICIAL_SUBCATEGORY_FILTERS)[number];

const normalize = (value: string | undefined) => value?.toLowerCase() ?? '';

// CRITICAL: Only images from officials folder or officials category should be shown in officials
const isFormalImage = (product: Product) => {
  // First check if product category is 'officials' (from database or filesystem)
  if (product.category === 'officials') {
    return true;
  }
  
  const imagePath = normalize(product.image);
  // Check for local filesystem path or Supabase Storage URL with officials category
  // Also accept products that come from getOfficialImageProducts (they should all be valid)
  return imagePath.includes('/images/officials/') || 
         imagePath.includes('/officials/') ||
         imagePath.includes('officials'); // Supabase storage path
};

// Helper to check if product has subcategory in tags (from database)
const hasSubcategory = (product: Product, subcategory: string): boolean => {
  if (product.tags && product.tags.length > 0) {
    return product.tags.some(tag => normalize(tag) === normalize(subcategory));
  }
  return false;
};

const isClarks = (product: Product) => {
  if (!isFormalImage(product)) return false;
  // Check subcategory from database first
  if (hasSubcategory(product, 'Clarks')) return true;
  // Fallback to filename/image path matching
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('clark') || source.includes('clarks official');
};

const isBoots = (product: Product) => {
  if (!isFormalImage(product)) return false;
  // Check subcategory from database first
  if (hasSubcategory(product, 'Boots')) return true;
  // Fallback to filename/image path matching
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('boot');
};

const isEmpire = (product: Product) => {
  if (!isFormalImage(product)) return false;
  // Check subcategory from database first
  if (hasSubcategory(product, 'Empire')) return true;
  // Fallback to filename/image path matching
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('empire');
};

const isCasuals = (product: Product) => {
  // For "Casuals" under Officials: show casual products (excluding Clarks) from the formal folder
  if (!isFormalImage(product)) return false;
  // Check subcategory from database first
  if (hasSubcategory(product, 'Casuals')) {
    // Make sure it's not Clarks
    if (hasSubcategory(product, 'Clarks')) return false;
    return true;
  }
  // Fallback to filename/image path matching
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('casual') && !source.includes('clark') && !source.includes('clarks official');
};

const isMules = (product: Product) => {
  if (!isFormalImage(product)) return false;
  // Check subcategory from database first
  if (hasSubcategory(product, 'Mules')) return true;
  // Fallback to filename/image path matching
  const source = `${normalize(product.name)} ${normalize(product.description)} ${normalize(product.image)}`;
  return source.includes('mule');
};

const isOther = (product: Product) => {
  if (!isFormalImage(product)) return false;
  // Other includes products that don't match Boots, Empire, Casuals, Mules, or Clarks
  return !isBoots(product) && 
         !isEmpire(product) && 
         !isCasuals(product) && 
         !isMules(product) && 
         !isClarks(product);
};

export const filterOfficialsProducts = (products: Product[], filter: OfficialFilter): Product[] => {
  // First, ensure ALL products are from officials folder/category
  // If products are already from getOfficialImageProducts, they should all be valid
  const formalProducts = products.filter(isFormalImage);
  
  // If no products pass the formal check, but we have products with category 'officials', use those
  const validProducts = formalProducts.length > 0 ? formalProducts : 
                        products.filter(p => p.category === 'officials');

  // If no valid products, return empty array
  if (validProducts.length === 0) {
    return [];
  }

  if (filter === 'Boots') {
    const boots = validProducts.filter(isBoots);
    return boots;
  }

  if (filter === 'Empire') {
    const empire = validProducts.filter(isEmpire);
    return empire;
  }

  if (filter === 'Mules') {
    const mules = validProducts.filter(isMules);
    return mules;
  }

  if (filter === 'Casuals') {
    const casuals = validProducts.filter(isCasuals);
    return casuals;
  }

  if (filter === 'Other') {
    const other = validProducts.filter(isOther);
    return other;
  }

  // Default: return all valid products
  return validProducts;
};

export const hasOfficialMatches = (products: Product[], filter: OfficialFilter) => {
  // First check if we have any products with category 'officials'
  const officialsProducts = products.filter(p => p.category === 'officials');
  if (officialsProducts.length === 0) {
    // If no products with category 'officials', check by image path
    const hasOfficialsImages = products.some(p => {
      const imagePath = normalize(p.image);
      return imagePath.includes('/images/officials/') || 
             imagePath.includes('/officials/') ||
             imagePath.includes('officials');
    });
    if (!hasOfficialsImages) return false;
  }
  
  // Now check if the specific filter has matches
  const filtered = filterOfficialsProducts(products, filter);
  const hasMatches = filtered.length > 0;
  
  return hasMatches;
};


