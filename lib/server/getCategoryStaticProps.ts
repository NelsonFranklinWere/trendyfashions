import { primeBuildProductCache } from '@/lib/server/buildProductCache';
import {
  getCatalogRandomProducts,
  getCatalogSearchIndex,
  getCategoryPageProducts,
} from '@/lib/server/categoryCatalog';
import type { Product } from '@/data/products';
import { slimProductList } from '@/lib/server/slimProductProps';

export type CategorySearchItem = Pick<Product, 'id' | 'name' | 'image' | 'category' | 'price'>;

export type CategoryPageData = {
  products: Product[];
  randomProducts: Product[];
  allProducts: CategorySearchItem[];
};

/**
 * Load category page data: 2 bulk DB queries + in-memory grouping (no per-photo queries).
 */
export async function loadCategoryPageProps(categorySlug: string): Promise<CategoryPageData> {
  await primeBuildProductCache();

  const products = slimProductList(getCategoryPageProducts(categorySlug));
  const randomProducts = slimProductList(getCatalogRandomProducts(12));
  const allProducts = getCatalogSearchIndex();

  return { products, randomProducts, allProducts };
}
