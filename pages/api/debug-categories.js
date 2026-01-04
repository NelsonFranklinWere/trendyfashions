import { query } from '@/lib/db/postgres';

export default async function handler(req, res) {
  try {
    console.log('=== DEBUGGING CATEGORIES ===');

    // Check all categories in database
    const imgResult = await query('SELECT category, COUNT(*) FROM images GROUP BY category ORDER BY category');
    console.log('Images table:');
    imgResult.rows.forEach(row => console.log(`  ${row.category}: ${row.count}`));

    const prodResult = await query('SELECT category, COUNT(*) FROM products GROUP BY category ORDER BY category');
    console.log('Products table:');
    prodResult.rows.forEach(row => console.log(`  ${row.category}: ${row.count}`));

    // Check officials specifically
    const officials = await query('SELECT name, image FROM products WHERE category = $1 LIMIT 3', ['officials']);
    console.log('\nOfficials products:');
    officials.rows.forEach(row => console.log(`  - ${row.name}: ${row.image}`));

    // Check casuals specifically
    const casuals = await query('SELECT name, image FROM products WHERE category = $1 LIMIT 3', ['casual']);
    console.log('\nCasuals products:');
    casuals.rows.forEach(row => console.log(`  - ${row.name}: ${row.image}`));

    // Check loafers specifically
    const loafers = await query('SELECT name, image FROM products WHERE category = $1 LIMIT 3', ['loafers']);
    console.log('\nLoafers products:');
    loafers.rows.forEach(row => console.log(`  - ${row.name}: ${row.image}`));

    return res.status(200).json({
      images: imgResult.rows,
      products: prodResult.rows,
      officials: officials.rows,
      casuals: casuals.rows,
      loafers: loafers.rows
    });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
