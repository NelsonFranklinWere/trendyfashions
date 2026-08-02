import type { Product } from '@/data/products';

const MAX_DESC = 100;

/** Drop keys with undefined (Next.js getStaticProps cannot JSON-serialize them). */
function withoutUndefined<T extends Record<string, unknown>>(obj: T): T {
  const next = { ...obj };
  for (const key of Object.keys(next)) {
    if (next[key] === undefined) {
      delete next[key];
    }
  }
  return next;
}

/** Shorter strings in page JSON → faster client navigation and hydration. */
export function slimProduct(p: Product): Product {
  const desc = p.description || '';
  const { listedAt: _listedAt, ...rest } = p as Product & { listedAt?: string };
  return withoutUndefined({
    ...rest,
    description:
      desc.length > MAX_DESC ? `${desc.slice(0, MAX_DESC).trim()}…` : desc,
  }) as Product;
}

export function slimProductList(products: Product[]): Product[] {
  return products.map(slimProduct);
}

/** Sanitize any product tree used in getStaticProps. */
export function jsonSafeProducts(products: Product[]): Product[] {
  return slimProductList(products || []).map((p) => withoutUndefined({ ...p }) as Product);
}
