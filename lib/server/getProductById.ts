import type { Product } from '@/data/products';
import { primeBuildProductCache } from '@/lib/server/buildProductCache';
import { getCatalogAllProducts, rebuildCategoryCatalog } from '@/lib/server/categoryCatalog';

export async function getProductById(id: string): Promise<Product | null> {
  if (!id?.trim()) return null;
  await primeBuildProductCache();
  rebuildCategoryCatalog();
  const normalized = id.trim();
  return getCatalogAllProducts().find((p) => p.id === normalized) ?? null;
}
