import { VALID_COLLECTION_SLUGS } from '@/lib/routes/collectionLinks';

/** Routes prefetched after idle so clicks feel instant (~1s or less). */
export const PREFETCH_ROUTES: string[] = [
  '/',
  '/collections',
  '/contact',
  ...VALID_COLLECTION_SLUGS.map((slug) => `/collections/${slug}`),
];
