// Script to set up initial admin user
// Usage: npx ts-node --esm scripts/setup-admin.ts [email] [password] [name]

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Load environment variables from .env.local
try {
  const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch (e) {
  console.warn('Could not load .env.local file');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

async function setupAdmin() {
  const email = process.argv[2] || 'admin@trendyfashionzone.co.ke';
  const password = process.argv[3] || 'admin123';
  const name = process.argv[4] || 'Admin User';

  console.log(`Setting up admin user: ${email}`);

  try {
    const passwordHash = await hashPassword(password);

    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('User already exists. Updating password...');
      const { error: updateError } = await supabaseAdmin
        .from('admin_users')
        .update({ 
          password_hash: passwordHash,
          is_active: true 
        })
        .eq('email', email);

      if (updateError) {
        console.error('Error updating user:', updateError);
        process.exit(1);
      }
      console.log('✅ Password updated successfully!');
    } else {
      const { error: insertError } = await supabaseAdmin
        .from('admin_users')
        .insert({
          email,
          password_hash: passwordHash,
          name,
          role: 'admin',
          is_active: true,
        });

      if (insertError) {
        console.error('Error creating user:', insertError);
        process.exit(1);
      }
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n📧 Login credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setupAdmin();
