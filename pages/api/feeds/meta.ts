import type { NextApiRequest, NextApiResponse } from 'next';
import { loadFeedProducts } from '@/lib/catalog/loadFeedProducts';
import { buildMetaCatalogJson } from '@/lib/catalog/metaCatalogFeed';

/**
 * Meta Commerce / Catalogue product feed (JSON).
 * Register in Meta Commerce Manager: https://trendyfashionzone.co.ke/api/feeds/meta
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const force = req.query.refresh === '1';
    const products = await loadFeedProducts(force);
    const payload = buildMetaCatalogJson(products);

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(payload);
  } catch (error) {
    console.error('[feeds/meta]', error);
    return res.status(500).json({ error: 'Feed unavailable' });
  }
}
