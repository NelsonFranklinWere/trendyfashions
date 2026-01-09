import { query } from '@/lib/db/postgres';

export default async function handler(req, res) {
  try {
    // Check Clarks officials
    const clarksProducts = await query('SELECT name FROM products WHERE category = $1 AND name ILIKE $2 LIMIT 5', ['officials', '%clarks%']);
    console.log('Clarks Officials:');
    clarksProducts.rows.forEach(row => console.log(`  - ${row.name}`));

    // Check Empire officials
    const empireProducts = await query('SELECT name FROM products WHERE category = $1 AND name ILIKE $2 LIMIT 5', ['officials', '%empire%']);
    console.log('\nEmpire Officials:');
    empireProducts.rows.forEach(row => console.log(`  - ${row.name}`));

    // Check Boots
    const bootsProducts = await query('SELECT name FROM products WHERE category = $1 AND name ILIKE $2 LIMIT 5', ['officials', '%boot%']);
    console.log('\nBoots:');
    bootsProducts.rows.forEach(row => console.log(`  - ${row.name}`));

    return res.status(200).json({
      clarks: clarksProducts.rows,
      empire: empireProducts.rows,
      boots: bootsProducts.rows
    });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
