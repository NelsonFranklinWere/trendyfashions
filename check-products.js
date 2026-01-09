const { query } = require('./lib/db/postgres');

async function checkProducts() {
  try {
    // Check empire officials
    const empireProducts = await query('SELECT name FROM products WHERE category = $1 AND name ILIKE $2 LIMIT 5', ['officials', '%empire%']);
    console.log('Empire Officials:');
    empireProducts.rows.forEach(row => console.log(`  - ${row.name}`));

    // Check lacoste products
    const lacosteProducts = await query('SELECT name FROM products WHERE category = $1 AND name ILIKE $2 LIMIT 5', ['casual', '%lacoste%']);
    console.log('\nLacoste Casuals:');
    lacosteProducts.rows.forEach(row => console.log(`  - ${row.name}`));

    // Check loafers
    const loaferProducts = await query('SELECT name FROM products WHERE category = $1 LIMIT 5', ['loafers']);
    console.log('\nLoafers:');
    loaferProducts.rows.forEach(row => console.log(`  - ${row.name}`));

    // Check boots
    const bootProducts = await query('SELECT name FROM products WHERE category = $1 AND name ILIKE $2 LIMIT 5', ['officials', '%boot%']);
    console.log('\nOfficial Boots:');
    bootProducts.rows.forEach(row => console.log(`  - ${row.name}`));

  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkProducts();
