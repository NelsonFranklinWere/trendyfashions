import type { Product } from '@/data/products';
import { detectBrand } from '@/lib/catalog/feedUtils';

export function productHasTag(product: Product, tag: string): boolean {
  const target = tag.toLowerCase().trim();
  return (product.tags || []).some((t) => String(t).toLowerCase().trim() === target);
}

/** Products marked for Sale / Meta ads campaigns */
export function isSaleProduct(product: Product): boolean {
  if (!product) return false;
  if (product.category === 'sale') return true;
  return (product.tags || []).some((t) => {
    const v = String(t).toLowerCase().trim();
    return v === 'sale' || v === 'meta ads' || v === 'meta-ads' || v === 'on sale' || v === 'ads';
  });
}

export function isNewArrivalProduct(product: Product): boolean {
  if (!product) return false;
  return (product.tags || []).some((t) => {
    const v = String(t).toLowerCase().trim();
    return v === 'new arrivals' || v === 'new arrival' || v === 'new' || v === 'new-arrivals';
  });
}

export function getProductBrand(product: Product): string {
  if (product.brand && product.brand.trim()) return product.brand.trim();
  return detectBrand(product);
}

export function ensureSaleTag(tags: string[] | null | undefined, onSale: boolean): string[] {
  const next = [...(tags || [])].filter(
    (t) => !['sale', 'meta ads', 'meta-ads', 'on sale', 'ads'].includes(String(t).toLowerCase().trim()),
  );
  if (onSale) next.push('Sale');
  return next;
}

export function ensureNewArrivalTag(tags: string[] | null | undefined, isNew: boolean): string[] {
  const next = [...(tags || [])].filter((t) => {
    const v = String(t).toLowerCase().trim();
    return !['new arrivals', 'new arrival', 'new', 'new-arrivals'].includes(v);
  });
  if (isNew) next.push('New Arrivals');
  return next;
}
