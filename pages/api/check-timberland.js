import { query } from '@/lib/db/postgres';

export default async function handler(req, res) {
  try {
    // Check Timberland casuals
    const timberlandCasuals = await query('SELECT name FROM products WHERE category = $1 AND name ILIKE $2 LIMIT 5', ['casual', '%timberland%']);
    console.log('Timberland Casuals:');
    timberlandCasuals.rows.forEach(row => console.log(`  - ${row.name}`));

    // Check official casuals
    const officialCasuals = await query('SELECT name FROM products WHERE category = $1 AND name ILIKE $2 LIMIT 5', ['casual', '%casual official%']);
    console.log('\nOfficial Casuals:');
    officialCasuals.rows.forEach(row => console.log(`  - ${row.name}`));

    return res.status(200).json({
      timberlandCasuals: timberlandCasuals.rows,
      officialCasuals: officialCasuals.rows
    });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
