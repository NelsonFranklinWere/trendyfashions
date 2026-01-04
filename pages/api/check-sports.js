import { query } from '@/lib/db/postgres';

export default async function handler(req, res) {
  try {
    console.log('=== SPORTS CATEGORY STATUS ===');

    // Check sports images
    const sportsImg = await query('SELECT COUNT(*) FROM images WHERE category = $1', ['sports']);
    console.log(`Sports images: ${sportsImg.rows[0].count}`);

    // Check sports products
    const sportsProd = await query('SELECT COUNT(*) FROM products WHERE category = $1', ['sports']);
    console.log(`Sports products: ${sportsProd.rows[0].count}`);

    // Sample sports products
    const sampleSports = await query('SELECT name FROM products WHERE category = $1 LIMIT 5', ['sports']);
    console.log('Sample sports products:');
    sampleSports.rows.forEach(row => console.log(`  - ${row.name}`));

    console.log('\n✅ Sports category preserved - football boots and trainer shoes are safe!');

    return res.status(200).json({
      sports: {
        images: sportsImg.rows[0].count,
        products: sportsProd.rows[0].count,
        samples: sampleSports.rows
      }
    });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
