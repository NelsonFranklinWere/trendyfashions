import type { NextApiResponse } from 'next';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { deleteCaseStudy, updateCaseStudy } from '@/lib/db/content';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const isAuthenticated = await requireAuth(req, res);
  if (!isAuthenticated) return;

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Case study ID is required' });
  }

  if (req.method === 'PUT') {
    try {
      const caseStudy = await updateCaseStudy(id, req.body || {});
      if (!caseStudy) return res.status(404).json({ error: 'Case study not found' });
      return res.status(200).json({ caseStudy });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to update case study' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const ok = await deleteCaseStudy(id);
      if (!ok) return res.status(404).json({ error: 'Case study not found' });
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to delete case study' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
