import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, subcategory } = req.query;

    let query = supabaseAdmin.from('images').select('*').order('uploaded_at', { ascending: false });

    if (category) {
      query = query.eq('category', category as string);
    }

    if (subcategory) {
      query = query.eq('subcategory', subcategory as string);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch images', details: error.message });
    }

    return res.status(200).json({ images: data || [] });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
