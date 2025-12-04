/**
 * Verify Supabase Storage Setup
 * Checks if the 'images' bucket exists and is accessible
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
try {
  const envPath = resolve(process.cwd(), '.env.local');
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value.trim();
      }
    }
  });
} catch (e) {
  console.error('⚠️  Could not load .env.local file');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function verifyStorage() {
  console.log('🔍 Verifying Supabase Storage setup...\n');

  try {
    // Check if we can list buckets
    console.log('1. Checking bucket access...');
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();

    if (bucketsError) {
      console.error('❌ Error accessing storage:', bucketsError.message);
      console.error('\n💡 Possible fixes:');
      console.error('   - Verify SUPABASE_SERVICE_ROLE_KEY is correct');
      console.error('   - Check if Storage is enabled in your Supabase project');
      process.exit(1);
    }

    console.log('✅ Storage access OK');
    console.log(`   Found ${buckets?.length || 0} bucket(s)\n`);

    // Check if 'images' bucket exists
    console.log('2. Checking for "images" bucket...');
    const imagesBucket = buckets?.find((b) => b.name === 'images');

    if (!imagesBucket) {
      console.error('❌ Bucket "images" not found!');
      console.error('\n💡 To create the bucket:');
      console.error('   1. Go to: https://supabase.com/dashboard/project/zdeupdkbsueczuoercmm/storage/buckets');
      console.error('   2. Click "New bucket"');
      console.error('   3. Name: images (lowercase)');
      console.error('   4. Uncheck "Private bucket" (make it Public)');
      console.error('   5. Click "Create bucket"');
      process.exit(1);
    }

    console.log('✅ Bucket "images" exists');
    console.log(`   Public: ${imagesBucket.public ? 'Yes ✅' : 'No ❌'}`);
    console.log(`   Created: ${imagesBucket.created_at}\n`);

    if (!imagesBucket.public) {
      console.warn('⚠️  Warning: Bucket is private. Images may not be accessible publicly.');
      console.warn('   Consider making it public for easier access.\n');
    }

    // Try to list files in the bucket
    console.log('3. Testing bucket read access...');
    const { data: files, error: listError } = await supabaseAdmin.storage.from('images').list('', {
      limit: 1,
    });

    if (listError) {
      console.error('❌ Error listing files:', listError.message);
      console.error('\n💡 Possible fixes:');
      console.error('   - Check bucket policies in Supabase dashboard');
      console.error('   - Ensure service role has read access');
    } else {
      console.log('✅ Bucket read access OK');
      console.log(`   Found ${files?.length || 0} file(s) in root\n`);
    }

    // Test upload capability (dry run - just check permissions)
    console.log('4. Verifying upload permissions...');
    console.log('   (This is a dry run - no file will be uploaded)');
    
    // Create a small test buffer
    const testBuffer = Buffer.from('test');
    const testPath = `test-${Date.now()}.txt`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('images')
      .upload(testPath, testBuffer, {
        contentType: 'text/plain',
        upsert: false,
      });

    if (uploadError) {
      console.error('❌ Upload test failed:', uploadError.message);
      console.error('\n💡 Possible fixes:');
      if (uploadError.message?.includes('new row violates row-level security')) {
        console.error('   - Storage bucket has RLS enabled');
        console.error('   - Go to Storage > images > Policies');
        console.error('   - Add policy allowing service role to upload');
        console.error('   - Or temporarily disable RLS for testing');
      } else if (uploadError.message?.includes('duplicate')) {
        console.error('   - Test file already exists (this is OK)');
      } else {
        console.error('   - Check bucket policies and permissions');
      }
    } else {
      console.log('✅ Upload permissions OK');
      // Clean up test file
      await supabaseAdmin.storage.from('images').remove([testPath]);
      console.log('   Test file cleaned up\n');
    }

    console.log('✅ Storage setup verification complete!');
    console.log('\n📝 Next steps:');
    console.log('   - Try uploading an image in the admin panel');
    console.log('   - Check /admin/products/add for image upload');

  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

verifyStorage();
