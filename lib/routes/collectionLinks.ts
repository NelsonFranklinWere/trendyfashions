/**
 * Canonical collection URLs — use everywhere (navbar, homepage, footer).
 * Slugs must match getStaticPaths in pages/collections/[category].tsx.
 */
export const VALID_COLLECTION_SLUGS = [
  'officials',
  'loafers',
  'sandals',
  'casual',
  'sneakers',
  'sports',
  'vans',
] as const;

export type CollectionSlug = (typeof VALID_COLLECTION_SLUGS)[number];

/** Legacy paths → canonical slug */
export const COLLECTION_SLUG_ALIASES: Record<string, CollectionSlug> = {
  'mens-officials': 'officials',
  'mens-casuals': 'casual',
  casuals: 'casual',
  'mens-loafers': 'loafers',
  'mens-nike': 'sneakers',
  nike: 'sneakers',
  airforce: 'sneakers',
  jordan: 'sneakers',
  airmax: 'sneakers',
};

export function resolveCollectionSlug(slug: string): CollectionSlug | null {
  const normalized = slug?.toLowerCase().trim();
  if (!normalized) return null;
  if (VALID_COLLECTION_SLUGS.includes(normalized as CollectionSlug)) {
    return normalized as CollectionSlug;
  }
  return COLLECTION_SLUG_ALIASES[normalized] || null;
}

export function collectionPath(slug: CollectionSlug, filter?: string): string {
  const base = `/collections/${slug}`;
  if (!filter?.trim()) return base;
  return `${base}?filter=${encodeURIComponent(filter.trim())}`;
}

/** Paths that should 301 redirect to a canonical collection URL */
export const LEGACY_COLLECTION_REDIRECTS: Record<string, string> = {
  '/collections/mens-officials': '/collections/officials',
  '/collections/mens-loafers': '/collections/loafers',
  '/collections/mens-casuals': '/collections/casual',
  '/collections/casuals': '/collections/casual',
  '/collections/mens-shoes': '/collections/officials',
  '/collections/mens-nike': '/collections/sneakers?filter=Nike',
  '/collections/nike': '/collections/sneakers?filter=Nike',
  '/collections/new-arrivals': '/collections',
  '/collections/best-sellers': '/collections',
  '/collections/offers-discounts': '/collections',
  '/collections/unisex-collection': '/collections',
};
