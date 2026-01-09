// Simple JavaScript version to create admin user
// Usage: node scripts/create-admin-user.js [email] [password] [name]

require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createAdminUser() {
  const email = process.argv[2] || 'admin@trendyfashionzone.co.ke';
  const password = process.argv[3] || 'Trendy@Admin';
  const name = process.argv[4] || 'Admin User';

  console.log(`Creating admin user: ${email}`);

  try {
    // Check if user already exists
    const checkResult = await pool.query(
      'SELECT * FROM admin_users WHERE email = $1',
      [email.toLowerCase()]
    );

    const passwordHash = await bcrypt.hash(password, 10);

    if (checkResult.rows.length > 0) {
      console.log('User already exists. Updating password...');
      await pool.query(
        'UPDATE admin_users SET password_hash = $1, updated_at = NOW() WHERE email = $2',
        [passwordHash, email.toLowerCase()]
      );
      console.log('✅ Password updated successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
    } else {
      const result = await pool.query(
        `INSERT INTO admin_users (email, password_hash, name, role, is_active)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, name, role`,
        [email.toLowerCase(), passwordHash, name, 'admin', true]
      );
      console.log('✅ Admin user created successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('User ID:', result.rows[0].id);
    }
  } catch (error) {
    console.error('Error creating/updating user:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createAdminUser().catch(console.error);

