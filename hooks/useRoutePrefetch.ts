'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { PREFETCH_ROUTES } from '@/lib/routes/prefetchRoutes';

/**
 * Prefetch main storefront routes during browser idle time.
 */
export function useRoutePrefetch(): void {
  const router = useRouter();

  useEffect(() => {
    const prefetchAll = () => {
      for (const path of PREFETCH_ROUTES) {
        if (path !== router.asPath.split('?')[0]) {
          void router.prefetch(path);
        }
      }
    };

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(prefetchAll, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }

    const t = window.setTimeout(prefetchAll, 400);
    return () => window.clearTimeout(t);
  }, [router]);
}
