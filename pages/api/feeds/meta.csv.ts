/**
 * Full catalog Meta feed ending in .csv
 * Public URL: https://trendyfashionzone.co.ke/api/feeds/meta.csv
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { loadFeedProducts } from '@/lib/catalog/loadFeedProducts';
import { buildMetaCatalogCsv } from '@/lib/catalog/metaCatalogFeed';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end('Method not allowed');
  }

  try {
    const force = req.query.refresh === '1';
    const products = await loadFeedProducts(force);
    const csv = buildMetaCatalogCsv(products);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="meta-catalog.csv"');
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).send(csv);
  } catch (error) {
    console.error('[feeds/meta.csv]', error);
    return res.status(500).send('Feed unavailable');
  }
}
