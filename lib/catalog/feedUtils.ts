import type { Product } from '@/data/products';
import { siteConfig } from '@/lib/seo/config';
import { collectionPath, resolveCollectionSlug, type CollectionSlug } from '@/lib/routes/collectionLinks';

export type FeedProduct = {
  id: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  price: number;
  currency: string;
  availability: 'in stock' | 'out of stock';
  condition: 'new';
  brand: string;
  category: string;
  collectionSlug: string;
  googleProductCategory: string;
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url).replace(/\/$/, '');

const BRAND_PATTERNS: [RegExp, string][] = [
  [/nike/i, 'Nike'],
  [/adidas/i, 'Adidas'],
  [/puma/i, 'Puma'],
  [/clarks/i, 'Clarks'],
  [/timberland|timba/i, 'Timberland'],
  [/lacoste/i, 'Lacoste'],
  [/converse/i, 'Converse'],
  [/jordan/i, 'Jordan'],
  [/vans/i, 'Vans'],
  [/empire/i, 'Empire'],
  [/boss/i, 'Hugo Boss'],
  [/new balance/i, 'New Balance'],
];

export function getSiteUrl(): string {
  return SITE_URL;
}

export function productPageUrl(productId: string): string {
  return `${SITE_URL}/products/${encodeURIComponent(productId)}`;
}

export function absoluteImageUrl(image: string): string {
  const trimmed = (image || '').trim();
  if (!trimmed) return `${SITE_URL}/logo/Logo.jpg`;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/')) return `${SITE_URL}${trimmed}`;
  return `${SITE_URL}/${trimmed}`;
}

export function detectBrand(product: Product): string {
  const haystack = `${product.name} ${product.subcategory || ''} ${(product.tags || []).join(' ')}`;
  for (const [pattern, brand] of BRAND_PATTERNS) {
    if (pattern.test(haystack)) return brand;
  }
  return 'Trendy Fashion Zone';
}

export function resolveCollectionSlugForProduct(product: Product): CollectionSlug | null {
  return resolveCollectionSlug(product.category || '');
}

export function collectionUrlForProduct(product: Product): string {
  const slug = resolveCollectionSlugForProduct(product);
  if (!slug) return `${SITE_URL}/collections`;
  return `${SITE_URL}${collectionPath(slug)}`;
}

/** Google taxonomy: Apparel & Accessories > Shoes */
const GOOGLE_SHOES_CATEGORY = '187';

export function toFeedProduct(product: Product): FeedProduct | null {
  if (!product?.id || !product?.name || !product?.image || product.price == null) return null;

  const collectionSlug = resolveCollectionSlugForProduct(product) || product.category || 'collections';
  const description =
    (product.description || product.name).trim().slice(0, 5000) || product.name;

  return {
    id: product.id,
    title: product.name.slice(0, 150),
    description,
    link: productPageUrl(product.id),
    imageLink: absoluteImageUrl(product.image),
    price: Number(product.price),
    currency: 'KES',
    availability: 'in stock',
    condition: 'new',
    brand: detectBrand(product),
    category: collectionSlug,
    collectionSlug,
    googleProductCategory: GOOGLE_SHOES_CATEGORY,
  };
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function formatGooglePrice(price: number, currency = 'KES'): string {
  return `${price.toFixed(2)} ${currency}`;
}

export function formatMetaPrice(price: number, currency = 'KES'): string {
  return `${price.toFixed(2)} ${currency}`;
}
