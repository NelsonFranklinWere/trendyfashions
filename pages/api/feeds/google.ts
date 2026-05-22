import type { NextApiRequest, NextApiResponse } from 'next';
import { loadFeedProducts } from '@/lib/catalog/loadFeedProducts';
import { buildGoogleMerchantRss } from '@/lib/catalog/googleMerchantFeed';

/**
 * Google Merchant Center product feed (RSS 2.0 + Google namespace).
 * Register in Merchant Center: https://trendyfashionzone.co.ke/api/feeds/google
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method not allowed');
  }

  try {
    const force = req.query.refresh === '1';
    const products = await loadFeedProducts(force);
    const xml = buildGoogleMerchantRss(products);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(xml);
  } catch (error) {
    console.error('[feeds/google]', error);
    return res.status(500).send('<?xml version="1.0"?><error>Feed unavailable</error>');
  }
}
