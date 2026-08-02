import type { NextApiRequest, NextApiResponse } from 'next';
import { recordPageEvent } from '@/lib/db/analytics';

const RATE = new Map<string, { count: number; reset: number }>();

function rateLimit(key: string, max = 40, windowMs = 60_000): boolean {
  const now = Date.now();
  const cur = RATE.get(key);
  if (!cur || now > cur.reset) {
    RATE.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (cur.count >= max) return false;
  cur.count += 1;
  return true;
}

/**
 * POST /api/analytics/view
 * Public lightweight first-party page/product view tracker.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    'unknown';

  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const path = typeof body.path === 'string' ? body.path : '/';
    if (!path.startsWith('/')) {
      return res.status(400).json({ error: 'Invalid path' });
    }

    // Skip noisy admin/api noise if somehow sent
    if (path.startsWith('/api') || path.startsWith('/admin') || path.startsWith('/_next')) {
      return res.status(200).json({ ok: true, skipped: true });
    }

    const eventType =
      body.eventType === 'product_view' || path.startsWith('/products/')
        ? 'product_view'
        : 'page_view';

    let productId =
      typeof body.productId === 'string' ? body.productId : null;
    if (!productId && path.startsWith('/products/')) {
      productId = decodeURIComponent(path.replace('/products/', '').split('?')[0] || '') || null;
    }

    await recordPageEvent({
      path: path.split('?')[0],
      productId,
      productName: typeof body.productName === 'string' ? body.productName : null,
      eventType,
      sessionId: typeof body.sessionId === 'string' ? body.sessionId : null,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[api/analytics/view]', error);
    // Don't break the storefront if analytics fails
    return res.status(200).json({ ok: false });
  }
}
