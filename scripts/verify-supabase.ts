// Quick verification script to test Supabase connection
// Usage: npx ts-node --esm scripts/verify-supabase.ts

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

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
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
const supabaseAdmin = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

async function verifySupabase() {
  console.log('🔍 Verifying Supabase Configuration...\n');

  // Check environment variables
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('📋 Environment Variables:');
  console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${hasUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${hasAnonKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${hasServiceKey ? '✅ Set' : '❌ Missing (REQUIRED for admin)'}\n`);

  if (!hasUrl || !hasAnonKey) {
    console.error('❌ Missing required environment variables!');
    process.exit(1);
  }

  // Test client connection
  try {
    console.log('🔌 Testing client connection (anon key)...');
    if (!supabase) throw new Error('Client not initialized');
    const { data, error } = await supabase.from('products').select('count').limit(1);
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    console.log('   ✅ Client connection successful\n');
  } catch (error: any) {
    console.error(`   ❌ Client connection failed: ${error.message}\n`);
  }

  // Test admin connection
  if (hasServiceKey) {
    try {
      console.log('🔌 Testing admin connection (service role key)...');
      if (!supabaseAdmin) throw new Error('Admin client not initialized');
      const { data, error } = await supabaseAdmin.from('products').select('count').limit(1);
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      console.log('   ✅ Admin connection successful\n');
    } catch (error: any) {
      console.error(`   ❌ Admin connection failed: ${error.message}\n`);
    }

    // Check tables exist
    console.log('📊 Checking database tables...');
    const tables = ['products', 'images', 'admin_users', 'admin_sessions'];
    for (const table of tables) {
      try {
        if (!supabaseAdmin) throw new Error('Admin client not initialized');
        const { error } = await supabaseAdmin.from(table).select('count').limit(1);
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        console.log(`   ✅ Table '${table}' exists`);
      } catch (error: any) {
        console.log(`   ❌ Table '${table}' missing or inaccessible: ${error.message}`);
      }
    }
    console.log('');

    // Check storage bucket
    console.log('🗄️  Checking storage bucket...');
    try {
      if (!supabaseAdmin) throw new Error('Admin client not initialized');
      const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
      if (error) throw error;
      const imagesBucket = buckets?.find(b => b.name === 'images');
      if (imagesBucket) {
        console.log(`   ✅ Storage bucket 'images' exists`);
        console.log(`   ${imagesBucket.public ? '✅ Public' : '⚠️  Private'} bucket`);
      } else {
        console.log(`   ❌ Storage bucket 'images' not found`);
        console.log(`   💡 Create it in Supabase Dashboard → Storage → New bucket`);
      }
    } catch (error: any) {
      console.error(`   ❌ Storage check failed: ${error.message}`);
    }
    console.log('');

    // Check admin users
    console.log('👤 Checking admin users...');
    try {
      if (!supabaseAdmin) throw new Error('Admin client not initialized');
      const { data: users, error } = await supabaseAdmin.from('admin_users').select('email, is_active').limit(5);
      if (error) throw error;
      if (users && users.length > 0) {
        console.log(`   ✅ Found ${users.length} admin user(s):`);
        users.forEach((u: any) => {
          console.log(`      - ${u.email} (${u.is_active ? 'active' : 'inactive'})`);
        });
      } else {
        console.log(`   ⚠️  No admin users found`);
        console.log(`   💡 Run: npx ts-node --esm scripts/setup-admin.ts`);
      }
    } catch (error: any) {
      console.error(`   ❌ Failed to check admin users: ${error.message}`);
    }
  } else {
    console.log('⚠️  Skipping admin checks (service role key not set)\n');
  }

  console.log('\n✅ Verification complete!');
  if (!hasServiceKey) {
    console.log('\n⚠️  IMPORTANT: Set SUPABASE_SERVICE_ROLE_KEY in .env.local for admin features');
  }
}

verifySupabase().catch(console.error);
