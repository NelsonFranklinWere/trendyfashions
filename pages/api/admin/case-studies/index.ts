import type { NextApiResponse } from 'next';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { createCaseStudy, getCaseStudies } from '@/lib/db/content';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const isAuthenticated = await requireAuth(req, res);
  if (!isAuthenticated) return;

  if (req.method === 'GET') {
    try {
      const caseStudies = await getCaseStudies(false);
      return res.status(200).json({ caseStudies });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to fetch case studies' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, slug, client_name, summary, challenge, solution, outcome, cover_image, published } = req.body || {};
      if (!title || !slug) {
        return res.status(400).json({ error: 'title and slug are required' });
      }

      const caseStudy = await createCaseStudy({
        title,
        slug,
        client_name,
        summary,
        challenge,
        solution,
        outcome,
        cover_image,
        published: Boolean(published),
      });

      return res.status(201).json({ caseStudy });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to create case study' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
