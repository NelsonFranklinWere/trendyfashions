import type { NextApiRequest, NextApiResponse } from 'next';
import { getProducts, createProduct } from '@/lib/db/products';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Require authentication for all operations
  const isAuthenticated = await requireAuth(req, res);
  if (!isAuthenticated) {
    return;
  }

  if (req.method === 'GET') {
    try {
      const { category } = req.query;

      const products = await getProducts({
        category: category as string | undefined,
        orderBy: 'created_at',
        order: 'desc',
      });

      return res.status(200).json({ products });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: error.message || 'Failed to fetch products' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, description, price, image, category, subcategory, gender, tags, featured } = req.body;

      if (!name || !description || !price || !image || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const product = await createProduct({
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        subcategory: subcategory || null,
        gender: gender || null,
        tags: tags || [],
        featured: featured || false,
      });

      return res.status(201).json({ product });
    } catch (error: any) {
      console.error('Error creating product:', error);
      return res.status(500).json({ error: error.message || 'Failed to create product' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
