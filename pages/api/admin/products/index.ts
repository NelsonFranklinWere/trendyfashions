import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Require authentication for all operations
  const isAuthenticated = await requireAuth(req, res);
  if (!isAuthenticated) {
    return;
  }

  if (req.method === 'GET') {
    try {
      const { category, subcategory } = req.query;

      let query = supabaseAdmin.from('products').select('*').order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category as string);
      }
      if (subcategory) {
        query = query.eq('subcategory', subcategory as string);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return res.status(200).json({ products: data || [] });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: error.message || 'Failed to fetch products' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, description, price, image, category, subcategory, gender, tags, featured } = req.body;

      if (!name || !description || !price || !image || !category || !subcategory) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { data, error } = await supabaseAdmin
        .from('products')
        .insert([
          {
            name,
            description,
            price: parseFloat(price),
            image,
            category,
            subcategory,
            gender: gender || null,
            tags: tags || [],
            featured: featured || false,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return res.status(201).json({ product: data });
    } catch (error: any) {
      console.error('Error creating product:', error);
      return res.status(500).json({ error: error.message || 'Failed to create product' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
