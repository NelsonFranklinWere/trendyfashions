import type { NextApiRequest, NextApiResponse } from 'next';
import { clearFeedCache, loadFeedProducts } from '@/lib/catalog/loadFeedProducts';
import { primeBuildProductCache } from '@/lib/server/buildProductCache';

/**
 * Warm product catalog + feed cache (Vercel Cron or external scheduler).
 * Set CRON_SECRET and call: GET /api/cron/refresh-catalog?secret=YOUR_SECRET
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.CRON_SECRET;
  const provided = (req.query.secret as string) || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (secret && provided !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    clearFeedCache();
    await primeBuildProductCache();
    const products = await loadFeedProducts(true);
    return res.status(200).json({
      ok: true,
      productCount: products.length,
      refreshedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Refresh failed';
    console.error('[cron/refresh-catalog]', error);
    return res.status(500).json({ ok: false, error: message });
  }
}
