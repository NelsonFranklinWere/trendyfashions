import type { NextApiRequest, NextApiResponse } from 'next';
import { loadSaleFeedProducts } from '@/lib/catalog/loadFeedProducts';
import { buildMetaCatalogCsv } from '@/lib/catalog/metaCatalogFeed';

/**
 * Shortcut URL for Meta Commerce Manager — On Sale / Meta Ads products only (CSV).
 * Paste: https://trendyfashionzone.co.ke/api/feeds/meta-sale.csv
 *
 * Note: only products marked On Sale in /admin/sale appear here.
 * Full shop catalog: https://trendyfashionzone.co.ke/api/feeds/meta.csv
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end('Method not allowed');
  }

  try {
    const force = req.query.refresh === '1';
    const products = await loadSaleFeedProducts(force);
    const csv = buildMetaCatalogCsv(products);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="meta-sale-products.csv"');
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).send(csv);
  } catch (error) {
    console.error('[feeds/meta-sale]', error);
    return res.status(500).send('Feed unavailable');
  }
}
