'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Thin top bar on route change — instant feedback while the next page loads.
 */
export default function RouteProgress() {
  const router = useRouter();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const start = () => setActive(true);
    const done = () => setActive(false);

    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', done);
    router.events.on('routeChangeError', done);

    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', done);
      router.events.off('routeChangeError', done);
    };
  }, [router.events]);

  return (
    <div
      aria-hidden
      className={`route-progress ${active ? 'route-progress--active' : ''}`}
    />
  );
}
