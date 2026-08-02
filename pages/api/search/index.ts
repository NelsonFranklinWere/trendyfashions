import type { NextApiRequest, NextApiResponse } from 'next';
import { searchProducts } from '@/lib/server/searchProducts';

/**
 * GET /api/search?q=clarks&limit=12
 * Async typeahead search for products.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const q = typeof req.query.q === 'string' ? req.query.q : '';
  const limitRaw = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 12;
  const limit = Number.isFinite(limitRaw) ? limitRaw : 12;

  if (!q.trim()) {
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    return res.status(200).json({ query: '', results: [], count: 0 });
  }

  try {
    const results = await searchProducts(q, limit);
    res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=30');
    return res.status(200).json({
      query: q.trim(),
      results,
      count: results.length,
    });
  } catch (error) {
    console.error('[api/search]', error);
    return res.status(500).json({ error: 'Search failed', results: [], count: 0 });
  }
}
