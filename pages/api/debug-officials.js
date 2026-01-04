import { query } from '@/lib/db/postgres';
import { getDbProducts } from '@/lib/server/dbImageProducts';
import { filterValidProducts } from '@/lib/server/validateProduct';

export default async function handler(req, res) {
  try {
    console.log('=== DEBUGGING OFFICIALS DISPLAY ===');

    // Check raw database products
    const dbProducts = await query('SELECT id, name, image, category FROM products WHERE category = $1 LIMIT 5', ['officials']);
    console.log('Raw officials from database:', dbProducts.rows.length);

    // Check what getDbProducts returns
    const getDbProductsResult = await getDbProducts('officials');
    console.log('getDbProducts result:', getDbProductsResult.length);

    // Debug the getProducts call
    const { getProducts } = await import('@/lib/db/products');
    const rawGetProducts = await getProducts({ category: 'officials' });
    console.log('Raw getProducts result:', rawGetProducts.length);

    // Check what filterValidProducts does
    const filteredProducts = filterValidProducts(getDbProductsResult);
    console.log('After filterValidProducts:', filteredProducts.length);

    // Sample of filtered products
    const samples = filteredProducts.slice(0, 3).map(p => ({
      id: p.id,
      name: p.name,
      image: p.image?.substring(0, 50) + '...',
      price: p.price
    }));

    return res.status(200).json({
      rawDatabase: dbProducts.rows.length,
      getDbProducts: getDbProductsResult.length,
      filteredValid: filteredProducts.length,
      samples: samples,
      hasProducts: filteredProducts.length > 0
    });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
