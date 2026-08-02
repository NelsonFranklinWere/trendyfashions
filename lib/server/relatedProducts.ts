import type { Product } from '@/data/products';
import { getProductBrand } from '@/lib/products/flags';
import {
  getCatalogAllProducts,
  getCategoryPageProducts,
} from '@/lib/server/categoryCatalog';
import { resolveCollectionSlug } from '@/lib/routes/collectionLinks';

const DEFAULT_COUNT = 8;

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Stable pseudo-shuffle so ISR props stay consistent for a given seed. */
function stablePick(products: Product[], seed: string, count: number): Product[] {
  if (products.length === 0 || count <= 0) return [];
  return [...products]
    .map((p) => ({ p, score: hashSeed(`${seed}|${p.id}`) }))
    .sort((a, b) => a.score - b.score || a.p.id.localeCompare(b.p.id))
    .slice(0, count)
    .map(({ p }) => p);
}

function sameCollectionAs(product: Product): Product[] {
  const slug = resolveCollectionSlug(product.category);
  if (slug) {
    const fromSlug = getCategoryPageProducts(slug);
    if (fromSlug.length > 0) return fromSlug;
  }
  const cat = (product.category || '').toLowerCase();
  return getCatalogAllProducts().filter((p) => (p.category || '').toLowerCase() === cat);
}

function excludeSelf(list: Product[], product: Product): Product[] {
  const id = product.id;
  const img = product.image;
  return list.filter((p) => p.id !== id && (!img || p.image !== img));
}

function brandKey(p: Product): string {
  return getProductBrand(p).toLowerCase().trim();
}

/**
 * Similar items: same brand/type first, then same collection, then catalog fill.
 */
export function getYouMayAlsoLike(
  product: Product,
  count: number = DEFAULT_COUNT,
): Product[] {
  const brand = brandKey(product);
  const sub = (product.subcategory || '').toLowerCase().trim();
  const peers = excludeSelf(sameCollectionAs(product), product);
  const all = excludeSelf(getCatalogAllProducts(), product);

  const sameBrand = peers.filter((p) => brand && brandKey(p) === brand);
  const sameSub = peers.filter(
    (p) => sub && (p.subcategory || '').toLowerCase().trim() === sub,
  );
  const sameCat = peers;

  const picked: Product[] = [];
  const seen = new Set<string>();

  const take = (pool: Product[], n: number, seedSuffix: string) => {
    for (const p of stablePick(pool, `${product.id}:${seedSuffix}`, n * 2)) {
      if (picked.length >= n) break;
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      picked.push(p);
    }
  };

  take(sameBrand, Math.min(4, count), 'brand');
  take(sameSub, count, 'sub');
  take(sameCat, count, 'cat');
  take(all, count, 'all');

  return picked.slice(0, count);
}

/**
 * Browse discovery: other shoppers often land on sale, new, and related category items.
 */
export function getWhatOthersLookFor(
  product: Product,
  count: number = DEFAULT_COUNT,
  avoidIds: Set<string> = new Set(),
): Product[] {
  const all = excludeSelf(getCatalogAllProducts(), product).filter((p) => !avoidIds.has(p.id));
  const peers = excludeSelf(sameCollectionAs(product), product).filter((p) => !avoidIds.has(p.id));

  const brand = brandKey(product);
  // Prefer different brand in same collection + a mix of sale-tagged / other collections
  const differentBrand = peers.filter((p) => !brand || brandKey(p) !== brand);
  const salePool = all.filter((p) => (p.tags || []).some((t) => /sale|meta/i.test(String(t))));
  const newPool = all.filter((p) =>
    (p.tags || []).some((t) => /new arrival|new-arrival|^new$/i.test(String(t).trim())),
  );

  const picked: Product[] = [];
  const seen = new Set<string>();

  const take = (pool: Product[], n: number, seedSuffix: string) => {
    for (const p of stablePick(pool, `${product.id}:others:${seedSuffix}`, n * 2)) {
      if (picked.length >= n) break;
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      picked.push(p);
    }
  };

  take(differentBrand, Math.min(4, count), 'diff');
  take(salePool, Math.min(2, count), 'sale');
  take(newPool, Math.min(2, count), 'new');
  take(peers, count, 'peers');
  take(all, count, 'all');

  return picked.slice(0, count);
}

export function getRelatedProductSections(product: Product): {
  youMayAlsoLike: Product[];
  whatOthersLookFor: Product[];
} {
  const youMayAlsoLike = getYouMayAlsoLike(product, DEFAULT_COUNT);
  const avoid = new Set(youMayAlsoLike.map((p) => p.id));
  const whatOthersLookFor = getWhatOthersLookFor(product, DEFAULT_COUNT, avoid);
  return { youMayAlsoLike, whatOthersLookFor };
}
