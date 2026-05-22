import { Product } from '@/data/products';
import { getCatalogRandomProducts } from './categoryCatalog';
import { isBuildProductCacheReady, primeBuildProductCache } from './buildProductCache';

/**
 * Carousel products from pre-grouped catalog (no extra DB round-trips).
 */
export async function getRandomProductsFromAllCategories(count: number = 30): Promise<Product[]> {
  if (!isBuildProductCacheReady()) {
    await primeBuildProductCache();
  }
  return getCatalogRandomProducts(count);
}
