import { getAllImagesBulk, getAllProductsBulk } from '@/lib/db/bulk';
import { rebuildCategoryCatalog, resetCategoryCatalog } from '@/lib/server/categoryCatalog';
import { setBulkCatalogData } from '@/lib/server/dbImageProducts';

let cacheReady = false;
let loadPromise: Promise<void> | null = null;

/**
 * One-time load per build/ISR request: 2 parallel DB queries for all catalog data.
 */
export async function primeBuildProductCache(): Promise<void> {
  if (cacheReady) return;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const [products, images] = await Promise.all([
      getAllProductsBulk(),
      getAllImagesBulk(),
    ]);
    setBulkCatalogData(products, images);
    rebuildCategoryCatalog();
    cacheReady = true;
  })();

  return loadPromise;
}

export function isBuildProductCacheReady(): boolean {
  return cacheReady;
}

export function clearBuildProductCache(): void {
  cacheReady = false;
  loadPromise = null;
  setBulkCatalogData(null, null);
  resetCategoryCatalog();
}
