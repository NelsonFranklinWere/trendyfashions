import type { NextApiRequest, NextApiResponse } from 'next';
import { loadFeedProducts, loadSaleFeedProducts } from '@/lib/catalog/loadFeedProducts';
import { buildMetaCatalogCsv, buildMetaCatalogJson } from '@/lib/catalog/metaCatalogFeed';

/**
 * Meta Commerce Manager product feed.
 *
 * Sale-only CSV (paste in Commerce Manager URL upload):
 *   https://trendyfashionzone.co.ke/api/feeds/meta-sale.csv
 *
 * Full catalog CSV (all products for sale online):
 *   https://trendyfashionzone.co.ke/api/feeds/meta.csv
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const force = req.query.refresh === '1';
    const collection = String(req.query.collection || req.query.filter || '')
      .toLowerCase()
      .trim();
    const isSale = collection === 'sale' || collection === 'meta' || collection === 'ads';

    const formatRaw = String(req.query.format || (isSale ? 'csv' : 'json')).toLowerCase();
    const format = formatRaw === 'json' ? 'json' : 'csv';

    const products = isSale
      ? await loadSaleFeedProducts(force)
      : await loadFeedProducts(force);

    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');

    if (format === 'csv') {
      const csv = buildMetaCatalogCsv(products);
      const filename = isSale ? 'meta-sale-products.csv' : 'meta-catalog.csv';
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      if (req.method === 'HEAD') return res.status(200).end();
      return res.status(200).send(csv);
    }

    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).json(buildMetaCatalogJson(products));
  } catch (error) {
    console.error('[feeds/meta]', error);
    return res.status(500).json({ error: 'Feed unavailable' });
  }
}
