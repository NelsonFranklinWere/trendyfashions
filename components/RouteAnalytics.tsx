'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { trackPageView } from '@/lib/analytics/google';
import { trackMetaPageView } from '@/lib/analytics/meta';

/** Fire analytics page views on client-side route changes. */
export default function RouteAnalytics() {
  const router = useRouter();
  const lastPath = useRef<string>('');

  useEffect(() => {
    const onRoute = (url: string) => {
      const path = url.split('?')[0];
      if (path === lastPath.current) return;
      lastPath.current = path;
      trackPageView(path);
      trackMetaPageView();
    };

    if (router.isReady) onRoute(router.asPath);
    router.events.on('routeChangeComplete', onRoute);
    return () => router.events.off('routeChangeComplete', onRoute);
  }, [router]);

  return null;
}
