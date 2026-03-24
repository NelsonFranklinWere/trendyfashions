import type { NextApiResponse } from 'next';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { getPaymentsWithOrders } from '@/lib/db/orders';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const isAuthenticated = await requireAuth(req, res);
  if (!isAuthenticated) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const payments = await getPaymentsWithOrders();
    return res.status(200).json({ payments });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch payments' });
  }
}

