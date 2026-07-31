import type { NextApiResponse } from 'next';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { getAllOrdersForAdmin } from '@/lib/db/orders';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const isAuthenticated = await requireAuth(req, res);
  if (!isAuthenticated) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const orders = await getAllOrdersForAdmin();
    return res.status(200).json({ orders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch orders';
    return res.status(500).json({ error: message });
  }
}
