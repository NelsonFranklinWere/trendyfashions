import { hashPassword } from '../lib/auth/admin';
import { createAdminUser as createAdminUserDb, getAdminUserByEmail, updateAdminUser } from '../lib/db/admin';
import 'dotenv/config';

async function createAdminUser() {
  const email = process.argv[2] || 'admin@trendyfashionzone.co.ke';
  const password = process.argv[3] || 'Trendy@Admin';
  const name = process.argv[4] || 'Admin User';

  console.log(`Creating admin user: ${email}`);

  try {
    // Check if user already exists
    const existingUser = await getAdminUserByEmail(email);

    if (existingUser) {
      console.log('User already exists. Updating password...');
      const passwordHash = await hashPassword(password);
      await updateAdminUser(existingUser.id, { password_hash: passwordHash });
      console.log('Password updated successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
    } else {
      const passwordHash = await hashPassword(password);
      const user = await createAdminUserDb({
        email,
        password_hash: passwordHash,
        name,
        role: 'admin',
      });
      console.log('Admin user created successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('User ID:', user.id);
    }
  } catch (error: any) {
    console.error('Error creating/updating user:', error.message);
    process.exit(1);
  }
}

createAdminUser().catch(console.error);
