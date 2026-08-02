'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const SESSION_KEY = 'tfz_session_id';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = window.localStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `s_${Date.now()}`;
  }
}

function trackView(payload: {
  path: string;
  productId?: string;
  productName?: string;
  eventType?: 'page_view' | 'product_view';
}) {
  try {
    const body = JSON.stringify({
      ...payload,
      sessionId: getSessionId(),
    });
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/view', blob);
      return;
    }
    void fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {
    // ignore
  }
}

/** First-party page + product view beacon for admin analytics. */
export default function SiteViewTracker() {
  const router = useRouter();
  const last = useRef('');

  useEffect(() => {
    const send = (url: string) => {
      const path = url.split('?')[0];
      if (!path || path === last.current) return;
      if (path.startsWith('/admin') || path.startsWith('/api')) return;
      last.current = path;

      if (path.startsWith('/products/')) {
        const productId = decodeURIComponent(path.replace('/products/', ''));
        trackView({
          path,
          productId,
          eventType: 'product_view',
        });
      } else {
        trackView({ path, eventType: 'page_view' });
      }
    };

    if (router.isReady) send(router.asPath);
    router.events.on('routeChangeComplete', send);
    return () => router.events.off('routeChangeComplete', send);
  }, [router]);

  return null;
}

/** Call from product detail when name is known for richer admin stats. */
export function trackProductPageView(productId: string, productName: string) {
  trackView({
    path: `/products/${encodeURIComponent(productId)}`,
    productId,
    productName,
    eventType: 'product_view',
  });
}
