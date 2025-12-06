import { hashPassword } from '../lib/auth/admin';
import { supabaseAdmin } from '../lib/supabase/server';

async function createAdminUser() {
  const email = process.argv[2] || 'admin@trendyfashionzone.co.ke';
  const password = process.argv[3] || 'Trendy@Admin';
  const name = process.argv[4] || 'Admin User';

  console.log(`Creating admin user: ${email}`);

  const passwordHash = await hashPassword(password);

  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .insert({
      email,
      password_hash: passwordHash,
      name,
      role: 'admin',
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      console.log('User already exists. Updating password...');
      const { error: updateError } = await supabaseAdmin
        .from('admin_users')
        .update({ password_hash: passwordHash })
        .eq('email', email);

      if (updateError) {
        console.error('Error updating user:', updateError);
        process.exit(1);
      }
      console.log('Password updated successfully!');
    } else {
      console.error('Error creating user:', error);
      process.exit(1);
    }
  } else {
    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
  }
}

createAdminUser().catch(console.error);
