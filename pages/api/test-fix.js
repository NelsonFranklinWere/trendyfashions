import { query } from '@/lib/db/postgres';
import { getDbProducts } from '@/lib/server/dbImageProducts';
import { filterValidProducts } from '@/lib/server/validateProduct';

export default async function handler(req, res) {
  try {
    console.log('=== TESTING OFFICIALS FIX ===');

    // Check raw database products
    const dbProducts = await query('SELECT id, name FROM products WHERE category = $1 LIMIT 3', ['officials']);
    console.log('Raw officials from database:', dbProducts.rows.length);

    // Check what getDbProducts returns
    const getDbProductsResult = await getDbProducts('officials');
    console.log('getDbProducts result:', getDbProductsResult.length);

    // Check what filterValidProducts does
    const filteredProducts = filterValidProducts(getDbProductsResult);
    console.log('After filterValidProducts:', filteredProducts.length);

    return res.status(200).json({
      rawDatabase: dbProducts.rows.length,
      getDbProducts: getDbProductsResult.length,
      filteredValid: filteredProducts.length,
      fixed: filteredProducts.length > 0
    });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
