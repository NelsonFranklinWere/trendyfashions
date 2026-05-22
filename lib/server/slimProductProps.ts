import type { Product } from '@/data/products';

const MAX_DESC = 100;

/** Shorter strings in page JSON → faster client navigation and hydration. */
export function slimProduct(p: Product): Product {
  const desc = p.description || '';
  return {
    ...p,
    description:
      desc.length > MAX_DESC ? `${desc.slice(0, MAX_DESC).trim()}…` : desc,
  };
}

export function slimProductList(products: Product[]): Product[] {
  return products.map(slimProduct);
}
