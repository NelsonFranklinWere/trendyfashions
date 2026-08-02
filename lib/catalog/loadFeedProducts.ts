import type { Product } from '@/data/products';
import { primeBuildProductCache } from '@/lib/server/buildProductCache';
import {
  getCatalogAllProducts,
  getCategoryPageProducts,
  rebuildCategoryCatalog,
} from '@/lib/server/categoryCatalog';
import { toFeedProduct, type FeedProduct } from '@/lib/catalog/feedUtils';

let feedCache: { products: FeedProduct[]; builtAt: number } | null = null;
let saleFeedCache: { products: FeedProduct[]; builtAt: number } | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour in-memory

function mapProductsToFeed(raw: Product[]): FeedProduct[] {
  const seen = new Set<string>();
  const feed: FeedProduct[] = [];
  for (const p of raw) {
    if (seen.has(p.id)) continue;
    const row = toFeedProduct(p);
    if (!row) continue;
    seen.add(p.id);
    feed.push(row);
  }
  return feed;
}

/**
 * Load all valid catalog products for merchant feeds (Google + Meta).
 */
export async function loadFeedProducts(force = false): Promise<FeedProduct[]> {
  const now = Date.now();
  if (!force && feedCache && now - feedCache.builtAt < CACHE_TTL_MS) {
    return feedCache.products;
  }

  await primeBuildProductCache();
  rebuildCategoryCatalog();
  const feed = mapProductsToFeed(getCatalogAllProducts());

  feedCache = { products: feed, builtAt: now };
  return feed;
}

/**
 * Sale / Meta Ads products only — same set as /collections/sale.
 */
export async function loadSaleFeedProducts(force = false): Promise<FeedProduct[]> {
  const now = Date.now();
  if (!force && saleFeedCache && now - saleFeedCache.builtAt < 60_000) {
    return saleFeedCache.products;
  }

  // Rebuild so admin-tagged Sale products are included immediately
  const { clearBuildProductCache } = await import('@/lib/server/buildProductCache');
  clearBuildProductCache();
  await primeBuildProductCache();
  rebuildCategoryCatalog();

  const fromSalePage = getCategoryPageProducts('sale');
  const feed = mapProductsToFeed(fromSalePage);
  saleFeedCache = { products: feed, builtAt: now };
  return feed;
}

export function clearFeedCache(): void {
  feedCache = null;
  saleFeedCache = null;
}
