import { query } from '@/lib/db/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== CURRENT DATABASE CATEGORIES ===');
    const imgResult = await query('SELECT category, COUNT(*) FROM images GROUP BY category ORDER BY category');
    console.log('Images table:');
    imgResult.rows.forEach(row => console.log(`  ${row.category}: ${row.count}`));

    const prodResult = await query('SELECT category, COUNT(*) FROM products GROUP BY category ORDER BY category');
    console.log('Products table:');
    prodResult.rows.forEach(row => console.log(`  ${row.category}: ${row.count}`));

    // Delete mens-style category
    const categoriesToDelete = ['mens-style'];

    console.log('\n=== DELETING MENS-STYLE CATEGORY ===');
    console.log('Categories to delete:', categoriesToDelete.join(', '));

    // Delete from images table
    const imgDel = await query('DELETE FROM images WHERE category = ANY($1)', [categoriesToDelete]);
    console.log(`\n✅ Deleted ${imgDel.rowCount} records from images table`);

    // Delete from products table
    const prodDel = await query('DELETE FROM products WHERE category = ANY($1)', [categoriesToDelete]);
    console.log(`✅ Deleted ${prodDel.rowCount} records from products table`);

    // Show remaining
    console.log('\n=== REMAINING CATEGORIES ===');
    const remainingImg = await query('SELECT category, COUNT(*) FROM images GROUP BY category ORDER BY category');
    console.log('Images table:');
    remainingImg.rows.forEach(row => console.log(`  ${row.category}: ${row.count}`));

    const remainingProd = await query('SELECT category, COUNT(*) FROM products GROUP BY category ORDER BY category');
    console.log('Products table:');
    remainingProd.rows.forEach(row => console.log(`  ${row.category}: ${row.count}`));

    return res.status(200).json({
      success: true,
      message: `Deleted ${imgDel.rowCount} images and ${prodDel.rowCount} products from mens-style category`,
      remaining: {
        images: remainingImg.rows,
        products: remainingProd.rows
      }
    });

  } catch (err) {
    console.error('Database error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
