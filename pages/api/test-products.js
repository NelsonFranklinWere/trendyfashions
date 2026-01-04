import { query } from '@/lib/db/postgres';

export default async function handler(req, res) {
  try {
    // Test if products are accessible
    const officials = await query('SELECT COUNT(*) FROM products WHERE category = $1', ['officials']);
    const casuals = await query('SELECT COUNT(*) FROM products WHERE category = $1', ['casual']);
    const loafers = await query('SELECT COUNT(*) FROM products WHERE category = $1', ['loafers']);

    return res.status(200).json({
      officials: officials.rows[0].count,
      casuals: casuals.rows[0].count,
      loafers: loafers.rows[0].count,
      message: 'Products count check'
    });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
