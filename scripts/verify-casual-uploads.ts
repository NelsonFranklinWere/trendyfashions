import { createClient } from '@supabase/supabase-js';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local');
try {
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      process.env[key.trim()] = value;
    }
  });
} catch (error) {
  console.error('⚠️  Could not load .env.local, using process.env');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function verifyCasualUploads() {
  console.log('🔍 Checking casual category uploads in database...\n');

  try {
    // Check images table for 'casual' category
    console.log('📋 Checking images table for "casual" category:');
    const { data: casualImages, error: imagesError } = await supabaseAdmin
      .from('images')
      .select('*')
      .eq('category', 'casual')
      .order('uploaded_at', { ascending: false });

    if (imagesError) {
      console.error('❌ Error fetching from images table:', imagesError);
    } else {
      console.log(`✅ Found ${casualImages?.length || 0} images in images table with category='casual'`);
      if (casualImages && casualImages.length > 0) {
        console.log('\n📸 Recent uploads:');
        casualImages.slice(0, 10).forEach((img, idx) => {
          console.log(`  ${idx + 1}. ${img.filename || 'N/A'}`);
          console.log(`     Subcategory: ${img.subcategory || 'N/A'}`);
          console.log(`     Uploaded: ${img.uploaded_at || 'N/A'}`);
          console.log(`     URL: ${img.url || 'N/A'}`);
          console.log('');
        });
      }
    }

    // Check products table for 'casual' category
    console.log('\n📋 Checking products table for "casual" category:');
    const { data: casualProducts, error: productsError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('category', 'casual')
      .order('created_at', { ascending: false });

    if (productsError) {
      console.error('❌ Error fetching from products table:', productsError);
    } else {
      console.log(`✅ Found ${casualProducts?.length || 0} products in products table with category='casual'`);
      if (casualProducts && casualProducts.length > 0) {
        console.log('\n🛍️  Recent products:');
        casualProducts.slice(0, 10).forEach((prod, idx) => {
          console.log(`  ${idx + 1}. ${prod.name || 'N/A'}`);
          console.log(`     Price: KES ${prod.price || 'N/A'}`);
          console.log(`     Category: ${prod.category || 'N/A'}`);
          console.log(`     Created: ${prod.created_at || 'N/A'}`);
          console.log(`     Image: ${prod.image || 'N/A'}`);
          console.log('');
        });
      }
    }

    // Also check for legacy 'casuals' category (should be mapped to 'casual')
    console.log('\n📋 Checking for legacy "casuals" category (should be mapped):');
    const { data: casualsImages, error: casualsImagesError } = await supabaseAdmin
      .from('images')
      .select('*')
      .eq('category', 'casuals')
      .order('uploaded_at', { ascending: false });

    if (casualsImagesError) {
      console.error('❌ Error fetching casuals images:', casualsImagesError);
    } else {
      if (casualsImages && casualsImages.length > 0) {
        console.log(`⚠️  Found ${casualsImages.length} images with legacy category='casuals' (should be 'casual')`);
        casualsImages.forEach((img, idx) => {
          console.log(`  ${idx + 1}. ${img.filename || 'N/A'} (category: ${img.category})`);
        });
      } else {
        console.log('✅ No legacy "casuals" category found (good - all should be "casual")');
      }
    }

    const { data: casualsProducts, error: casualsProductsError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('category', 'casuals')
      .order('created_at', { ascending: false });

    if (casualsProductsError) {
      console.error('❌ Error fetching casuals products:', casualsProductsError);
    } else {
      if (casualsProducts && casualsProducts.length > 0) {
        console.log(`⚠️  Found ${casualsProducts.length} products with legacy category='casuals' (should be 'casual')`);
        casualsProducts.forEach((prod, idx) => {
          console.log(`  ${idx + 1}. ${prod.name || 'N/A'} (category: ${prod.category})`);
        });
      } else {
        console.log('✅ No legacy "casuals" products found (good - all should be "casual")');
      }
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`   Images table (category='casual'): ${casualImages?.length || 0} entries`);
    console.log(`   Products table (category='casual'): ${casualProducts?.length || 0} entries`);
    console.log(`   Legacy 'casuals' images: ${casualsImages?.length || 0} entries`);
    console.log(`   Legacy 'casuals' products: ${casualsProducts?.length || 0} entries`);
    
    if ((casualImages && casualImages.length > 0) || (casualProducts && casualProducts.length > 0)) {
      console.log('\n✅ Casual category uploads are being saved to the database correctly!');
    } else {
      console.log('\n⚠️  No casual category uploads found. Make sure you:');
      console.log('   1. Selected "Casual" category in the admin upload page');
      console.log('   2. Successfully uploaded the images');
      console.log('   3. Created products from the uploaded images (if needed)');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

verifyCasualUploads();

