import { Product } from '@/data/products';
import { getCatalogAllProducts } from './categoryCatalog';
import { isBuildProductCacheReady, primeBuildProductCache } from './buildProductCache';

/**
 * All products for search (from pre-built catalog, not per-row queries).
 */
export async function getAllProducts(): Promise<Product[]> {
  if (!isBuildProductCacheReady()) {
    await primeBuildProductCache();
  }
  return getCatalogAllProducts();
}
