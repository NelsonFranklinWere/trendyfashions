const { query } = require('./lib/db/postgres');

async function checkAndDelete() {
  try {
    console.log('=== CURRENT DATABASE CATEGORIES ===');
    const imgResult = await query('SELECT category, COUNT(*) FROM images GROUP BY category ORDER BY category');
    console.log('Images table:');
    imgResult.rows.forEach(row => console.log(`  ${row.category}: ${row.count}`));

    const prodResult = await query('SELECT category, COUNT(*) FROM products GROUP BY category ORDER BY category');
    console.log('Products table:');
    prodResult.rows.forEach(row => console.log(`  ${row.category}: ${row.count}`));

    // Delete unwanted categories
    const categoriesToDelete = ['sneakers', 'nike', 'custom', 'customized'];

    console.log('\n=== DELETING CATEGORIES ===');
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

  } catch (err) {
    console.error('Database error:', err.message);
  }
}

checkAndDelete();
