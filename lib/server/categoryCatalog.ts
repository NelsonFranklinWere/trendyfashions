import type { Product } from '@/data/products';
import { buildCategoryBucketsFromBulk } from '@/lib/server/dbImageProducts';

function getImageIdentityKey(image: string | undefined | null): string {
  if (!image) return '';
  const normalized = String(image).trim().toLowerCase();
  if (!normalized) return '';
  try {
    if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
      const url = new URL(normalized);
      return decodeURIComponent(url.pathname).replace(/\/+/g, '/');
    }
  } catch {
    // ignore
  }
  const withoutQuery = normalized.split('?')[0].split('#')[0];
  return decodeURIComponent(withoutQuery).replace(/\/+/g, '/');
}

function mergeDbPriority(dbProducts: Product[]): Product[] {
  const productMap = new Map<string, Product>();
  for (const p of dbProducts) {
    if (p?.image) {
      const key = getImageIdentityKey(p.image);
      if (key) productMap.set(key, p);
    }
  }
  return Array.from(productMap.values());
}

function mergeCategories(categories: string[]): Product[] {
  const combined: Product[] = [];
  for (const cat of categories) {
    combined.push(...(categoryBuckets.products.get(cat) || []));
    combined.push(...(categoryBuckets.images.get(cat) || []));
  }
  return mergeDbPriority(combined);
}

function isValidDisplayProduct(p: Product | null | undefined): boolean {
  if (!p?.id || !p?.name || !p?.image || p.price == null) return false;
  if (p.image === 'null' || !String(p.image).trim()) return false;
  const img = p.image.trim();
  if (img.startsWith('http://') || img.startsWith('https://')) {
    try {
      new URL(img);
      return true;
    } catch {
      return false;
    }
  }
  if (img.startsWith('/')) return true;
  return false;
}

function filterValid(products: Product[]): Product[] {
  return products.filter(isValidDisplayProduct);
}

const categoryBuckets = {
  products: new Map<string, Product[]>(),
  images: new Map<string, Product[]>(),
};

let catalogBySlug = new Map<string, Product[]>();
let catalogAllProducts: Product[] = [];
let catalogBuilt = false;

const CAROUSEL_SLUGS = ['officials', 'casual', 'sneakers', 'sports', 'loafers', 'sandals', 'vans'] as const;

/**
 * Build all category lists from bulk catalog (single in-memory pass).
 */
export function rebuildCategoryCatalog(): void {
  categoryBuckets.products.clear();
  categoryBuckets.images.clear();

  const buckets = buildCategoryBucketsFromBulk();
  if (!buckets) {
    catalogBuilt = false;
    return;
  }

  for (const [cat, list] of buckets.products) {
    categoryBuckets.products.set(cat, list);
  }
  for (const [cat, list] of buckets.images) {
    categoryBuckets.images.set(cat, list);
  }

  const officials = filterValid(mergeCategories(['officials', 'mens-officials'])).slice(2);

  const casualMerged = mergeCategories(['casual']);
  const sneakersForPuma = mergeCategories(['sneakers']);
  const casualRaw = [
    ...casualMerged,
    ...sneakersForPuma.filter((p) => (p.name || '').toLowerCase().includes('puma')),
  ];
  const seenCasual = new Set<string>();
  let casual = casualRaw.filter((p) => {
    if (!p?.image || seenCasual.has(p.image)) return false;
    seenCasual.add(p.image);
    const nameLower = (p.name || '').toLowerCase();
    const descLower = (p.description || '').toLowerCase();
    const categoryLower = (p.category || '').toLowerCase();
    const imageLower = (p.image || '').toLowerCase();
    if (nameLower.includes('sandal') || descLower.includes('sandal') || imageLower.includes('sandal'))
      return true;
    if (nameLower.includes('lacoste')) return true;
    if (
      (nameLower.includes('timberland') || nameLower.includes('timba') || categoryLower === 'timberland') &&
      !nameLower.includes('extreme') &&
      !descLower.includes('extreme') &&
      !imageLower.includes('extreme')
    )
      return true;
    if (nameLower.includes('boss')) return true;
    if (nameLower.includes('puma')) return true;
    if (categoryLower === 'casuals' || categoryLower === 'casual') return true;
    return false;
  });
  casual = casual.map((p) => {
    const nameLower = (p.name || '').toLowerCase();
    const descLower = (p.description || '').toLowerCase();
    const isTimberland =
      nameLower.includes('timberland') ||
      nameLower.includes('timba') ||
      descLower.includes('timberland') ||
      descLower.includes('timba');
    const isLacoste = nameLower.includes('lacoste') || descLower.includes('lacoste');
    const isPuma = nameLower.includes('puma') || descLower.includes('puma');
    const isBoss = nameLower.includes('boss') || descLower.includes('boss');
    if (isTimberland || isLacoste || isPuma || isBoss) return { ...p, price: 3200 };
    return p;
  });
  if (casual.length > 20) casual = casual.slice(0, -20);

  const sneakers = filterValid(
    mergeCategories(['sneakers', 'airforce', 'jordan', 'airmax']).filter((p) => {
      const categoryLower = (p.category || '').toLowerCase();
      const nameLower = (p.name || '').toLowerCase();
      const imageLower = (p.image || '').toLowerCase();
      if (categoryLower === 'sneakers') return true;
      if (nameLower.includes('converse') || imageLower.includes('converse')) return true;
      if (p.image.startsWith('http'))
        return ['sneakers', 'airforce', 'jordan', 'airmax'].includes(categoryLower);
      return (
        imageLower.includes('/images/airforce/') ||
        imageLower.includes('/images/jordan/') ||
        imageLower.includes('/images/airmax/') ||
        imageLower.includes('/images/newbalance/') ||
        imageLower.includes('/images/sneakers/')
      );
    }),
  );

  const sports = filterValid(
    mergeCategories(['sports']).filter((p) => {
      const categoryLower = (p.category || '').toLowerCase();
      const imageLower = (p.image || '').toLowerCase();
      return categoryLower === 'sports' || imageLower.includes('/images/sports/');
    }),
  );

  const loafers = filterValid(mergeCategories(['loafers']));
  const sandals = filterValid(mergeCategories(['sandals']));
  const vans = filterValid(mergeCategories(['vans']));

  catalogBySlug = new Map([
    ['officials', officials],
    ['mens-officials', officials],
    ['casual', casual],
    ['mens-casuals', casual],
    ['casuals', casual],
    ['sneakers', sneakers],
    ['sports', sports],
    ['loafers', loafers],
    ['mens-loafers', loafers],
    ['sandals', sandals],
    ['vans', vans],
  ]);

  const allMap = new Map<string, Product>();
  for (const list of catalogBySlug.values()) {
    for (const p of list) {
      const key = getImageIdentityKey(p.image);
      if (key && !allMap.has(key)) allMap.set(key, p);
    }
  }
  catalogAllProducts = filterValid(Array.from(allMap.values()));
  catalogBuilt = true;
}

export function getCategoryPageProducts(slug: string): Product[] {
  if (!catalogBuilt) return [];
  return catalogBySlug.get(slug) || [];
}

export function getCatalogAllProducts(): Product[] {
  return catalogAllProducts;
}

export function getCatalogSearchIndex(): Pick<Product, 'id' | 'name' | 'image' | 'category' | 'price'>[] {
  return catalogAllProducts.map((p) => ({
    id: p.id,
    name: p.name,
    image: p.image,
    category: p.category,
    price: p.price,
  }));
}

export function getCatalogRandomProducts(count: number): Product[] {
  const map = new Map<string, Product>();
  for (const slug of CAROUSEL_SLUGS) {
    for (const p of catalogBySlug.get(slug) || []) {
      if (p.image && !map.has(p.image)) map.set(p.image, p);
    }
  }
  const shuffled = Array.from(map.values()).sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function isCategoryCatalogBuilt(): boolean {
  return catalogBuilt;
}

export function resetCategoryCatalog(): void {
  catalogBySlug.clear();
  catalogAllProducts = [];
  catalogBuilt = false;
  categoryBuckets.products.clear();
  categoryBuckets.images.clear();
}
