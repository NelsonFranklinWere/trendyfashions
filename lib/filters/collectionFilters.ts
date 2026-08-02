import type { Product } from '@/data/products';
import { matchesNavQueryFilter } from '@/lib/filters/navQueryFilter';

const FILTER_TERMS: Record<string, string[]> = {
  clarks: ['clarks', 'clark'],
  'john fosters': ['john foster', 'fosters', 'john-foster'],
  boots: ['boot', 'boots'],
  empire: ['empire'],
  lacoste: ['lacoste'],
  timberland: ['timberland', 'timba'],
  boss: ['boss'],
  nike: ['nike'],
  adidas: ['adidas', 'addidas'],
  puma: ['puma'],
  jordan: ['jordan'],
  'new balance': ['new balance', 'newbalance', 'nb '],
  running: ['running'],
  training: ['training', 'gym'],
  football: ['football', 'soccer'],
  trail: ['trail', 'outdoor'],
  trousers: ['trouser', 'trousers', 'pants'],
  shirts: ['shirt', 'shirts'],
  'official shirts': ['official shirt', 'official shirts', 'dress shirt'],
  casual: ['casual'],
  'polo shirts': ['polo', 'polo shirt', 'polo shirts'],
  shorts: ['short', 'shorts'],
  dresses: ['dress', 'dresses'],
  tracksuits: ['tracksuit', 'tracksuits', 'track suit', 'track suits', 'jogger', 'joggers'],
  other: [],
};

function haystack(product: Product): string {
  return [
    product.name,
    product.description,
    product.image,
    product.subcategory,
    product.brand,
    ...(product.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

/**
 * Client filter for horizontal brand/type buttons on collection pages.
 * "All" returns the full list. "Other" excludes known branded matches.
 */
export function filterProductsByCollectionFilter(
  products: Product[],
  filterParam: string | undefined,
  options?: { gender?: string },
): Product[] {
  let list = products;

  if (options?.gender) {
    const g = options.gender.toLowerCase();
    list = list.filter((p) => {
      const pg = (p.gender || '').toLowerCase();
      if (!pg) return true;
      if (g === 'men') return pg === 'men' || pg === 'unisex';
      if (g === 'women') return pg === 'women' || pg === 'unisex';
      return true;
    });
  }

  if (!filterParam || !filterParam.trim() || filterParam.toLowerCase() === 'all') {
    return list;
  }

  const key = filterParam.toLowerCase().trim();

  // Prefer existing nav alias matcher, then structured brand terms
  const viaNav = list.filter((p) => matchesNavQueryFilter(p, filterParam));
  if (viaNav.length > 0 && key !== 'other') {
    return viaNav;
  }

  if (key === 'other') {
    const known = Object.entries(FILTER_TERMS)
      .filter(([k]) => k !== 'other' && k !== 'casual')
      .flatMap(([, terms]) => terms);
    return list.filter((p) => {
      const text = haystack(p);
      return !known.some((term) => text.includes(term));
    });
  }

  const terms = FILTER_TERMS[key] || [key];
  return list.filter((p) => {
    const text = haystack(p);
    return terms.some((term) => text.includes(term));
  });
}
