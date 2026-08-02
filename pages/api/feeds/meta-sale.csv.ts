/**
 * Meta sale feed at a URL ending in .csv (some Commerce Manager setups require this).
 * Public URL: https://trendyfashionzone.co.ke/api/feeds/meta-sale.csv
 *
 * Implemented via next.config rewrite → /api/feeds/meta-sale
 * This file also exists so the route resolves if rewrites are skipped.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from './meta-sale';

export default function csvHandler(req: NextApiRequest, res: NextApiResponse) {
  return handler(req, res);
}
