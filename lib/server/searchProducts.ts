import type { Product } from '@/data/products';
import { primeBuildProductCache } from '@/lib/server/buildProductCache';
import { getCatalogAllProducts, rebuildCategoryCatalog } from '@/lib/server/categoryCatalog';
import { toLocalImageSrc, toThumbnailSrc } from '@/lib/images/uploadUrls';
import { query } from '@/lib/db/postgres';
import type { ProductSearchHit } from '@/lib/search/types';

export type { ProductSearchHit };
function scoreProduct(product: Product, terms: string[]): number {
  const name = (product.name || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();
  const sub = (product.subcategory || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const tags = (product.tags || []).join(' ').toLowerCase();
  let score = 0;

  for (const term of terms) {
    if (name === term) score += 100;
    else if (name.startsWith(term)) score += 60;
    else if (name.includes(term)) score += 40;
    if (brand.includes(term)) score += 25;
    if (sub.includes(term)) score += 20;
    if (cat.includes(term)) score += 10;
    if (tags.includes(term)) score += 12;
    if (desc.includes(term)) score += 5;
  }
  return score;
}

function toHit(product: Product): ProductSearchHit {
  const image =
    toThumbnailSrc(product.image) || toLocalImageSrc(product.image) || product.image;
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image,
    category: product.category,
    brand: product.brand || product.subcategory || undefined,
    href: `/products/${encodeURIComponent(product.id)}`,
  };
}

/**
 * Async product search for typeahead — catalog first, DB fallback.
 */
export async function searchProducts(
  rawQuery: string,
  limit = 12,
): Promise<ProductSearchHit[]> {
  const q = rawQuery.trim().toLowerCase();
  if (q.length < 1) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const max = Math.min(Math.max(limit, 1), 24);

  try {
    await primeBuildProductCache();
    rebuildCategoryCatalog();
    const catalog = getCatalogAllProducts();
    if (catalog.length > 0) {
      const ranked = catalog
        .map((p) => ({ p, score: scoreProduct(p, terms) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name))
        .slice(0, max)
        .map((x) => toHit(x.p));
      if (ranked.length > 0) return ranked;
    }
  } catch {
    // fall through to SQL
  }

  try {
    const like = `%${q}%`;
    const result = await query<{
      id: string;
      name: string;
      description: string | null;
      price: number;
      image: string;
      category: string;
      subcategory: string | null;
    }>(
      `SELECT id, name, description, price, image, category, subcategory
       FROM products
       WHERE name ILIKE $1
          OR description ILIKE $1
          OR category ILIKE $1
          OR COALESCE(subcategory, '') ILIKE $1
       ORDER BY
         CASE WHEN lower(name) = lower($2) THEN 0
              WHEN lower(name) LIKE lower($2) || '%' THEN 1
              ELSE 2 END,
         name ASC
       LIMIT $3`,
      [like, q, max],
    );

    return result.rows.map((row) => {
      const image = toThumbnailSrc(row.image) || toLocalImageSrc(row.image) || row.image;
      return {
        id: `product-${row.id}`,
        name: row.name,
        price: Number(row.price),
        image,
        category: row.category,
        brand: row.subcategory || undefined,
        href: `/products/${encodeURIComponent(`product-${row.id}`)}`,
      };
    });
  } catch {
    return [];
  }
}
