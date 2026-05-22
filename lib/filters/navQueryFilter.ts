import type { Product } from '@/data/products';

/** Navbar / homepage ?filter= values → search terms on product fields */
const FILTER_ALIASES: Record<string, string[]> = {
  clarks: ['clarks', 'clark'],
  empire: ['empire'],
  boots: ['boot', 'boots'],
  mules: ['mule', 'mules'],
  casuals: ['casual', 'casuals'],
  'john fosters': ['john foster', 'fosters', 'john-foster'],
  'louis vuitton': ['louis vuitton', 'vuitton', 'lv '],
  lacoste: ['lacoste'],
  timberland: ['timberland', 'timba'],
  official: ['official casual', 'official'],
  Official: ['official casual', 'official'],
  nike: ['nike'],
  adidas: ['adidas', 'addidas'],
  puma: ['puma'],
  running: ['running'],
  training: ['training', 'gym'],
  football: ['football', 'soccer'],
  trail: ['trail', 'outdoor'],
  converse: ['converse'],
};

function productSearchText(product: Product): string {
  return `${product.name || ''} ${product.description || ''} ${product.image || ''} ${product.subcategory || ''} ${(product.tags || []).join(' ')}`.toLowerCase();
}

/**
 * Match products for navbar dropdown / view-all ?filter= links.
 */
export function matchesNavQueryFilter(product: Product, filterParam: string): boolean {
  if (!product || !filterParam?.trim()) return true;

  const key = filterParam.toLowerCase().trim();
  const terms = FILTER_ALIASES[key] || [key];

  const text = productSearchText(product);
  return terms.some((term) => text.includes(term));
}

export function filterProductsByNavQuery(products: Product[], filterParam: string | undefined): Product[] {
  if (!filterParam || typeof filterParam !== 'string' || !filterParam.trim()) {
    return products;
  }
  return products.filter((p) => matchesNavQueryFilter(p, filterParam));
}
