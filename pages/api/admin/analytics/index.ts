import type { NextApiResponse } from 'next';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { getAnalyticsSummary } from '@/lib/db/analytics';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const ok = await requireAuth(req, res);
  if (!ok) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const summary = await getAnalyticsSummary();
    return res.status(200).json(summary);
  } catch (error: any) {
    console.error('[api/admin/analytics]', error);
    return res.status(500).json({ error: error.message || 'Failed to load analytics' });
  }
}
