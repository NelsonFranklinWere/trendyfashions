import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

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

async function deleteScreenshotImages() {
  console.log('🔍 Searching for screenshot images in officials category...\n');

  try {
    // Search for images with "screenshot" in filename or name
    const { data: images, error: fetchError } = await supabaseAdmin
      .from('images')
      .select('*')
      .or('category.eq.officials,category.eq.mens-officials')
      .ilike('filename', '%screenshot%');

    if (fetchError) {
      console.error('❌ Error fetching images:', fetchError);
      return;
    }

    if (!images || images.length === 0) {
      // Try searching in products table too
      const { data: products, error: productError } = await supabaseAdmin
        .from('products')
        .select('*')
        .or('category.eq.officials,category.eq.mens-officials')
        .ilike('name', '%screenshot%');

      if (productError) {
        console.error('❌ Error fetching products:', productError);
        return;
      }

      if (!products || products.length === 0) {
        // Try searching by image URL
        const { data: allImages, error: allError } = await supabaseAdmin
          .from('images')
          .select('*')
          .or('category.eq.officials,category.eq.mens-officials');

        if (allError) {
          console.error('❌ Error fetching all images:', allError);
          return;
        }

        if (allImages && allImages.length > 0) {
          console.log(`\n📋 Found ${allImages.length} images in officials category:`);
          allImages.forEach((img, idx) => {
            console.log(`  ${idx + 1}. ${img.filename} (${img.url})`);
          });
          console.log('\n⚠️  No screenshot images found. Please check the list above and identify the screenshot image.');
          return;
        }
      } else {
        console.log(`\n📋 Found ${products.length} screenshot products:`);
        products.forEach((prod, idx) => {
          console.log(`  ${idx + 1}. ${prod.name} (${prod.image})`);
        });

        // Delete from products table
        for (const product of products) {
          const { error: deleteError } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', product.id);

          if (deleteError) {
            console.error(`❌ Error deleting product ${product.id}:`, deleteError);
          } else {
            console.log(`✅ Deleted product: ${product.name}`);
            
            // Also try to delete from storage if it's a Supabase URL
            if (product.image && product.image.includes('supabase.co')) {
              const urlParts = product.image.split('/');
              const storagePath = urlParts.slice(urlParts.indexOf('images') + 1).join('/');
              const { error: storageError } = await supabaseAdmin.storage
                .from('images')
                .remove([storagePath]);

              if (storageError) {
                console.warn(`⚠️  Could not delete from storage: ${storageError.message}`);
              } else {
                console.log(`✅ Deleted from storage: ${storagePath}`);
              }
            }
          }
        }
        return;
      }
    }

    console.log(`\n📋 Found ${images.length} screenshot image(s):`);
    images.forEach((img, idx) => {
      console.log(`  ${idx + 1}. ${img.filename} (${img.url})`);
    });

    // Delete from images table
    for (const image of images) {
      const { error: deleteError } = await supabaseAdmin
        .from('images')
        .delete()
        .eq('id', image.id);

      if (deleteError) {
        console.error(`❌ Error deleting image ${image.id}:`, deleteError);
      } else {
        console.log(`✅ Deleted image: ${image.filename}`);
        
        // Also delete from storage
        if (image.storage_path) {
          const { error: storageError } = await supabaseAdmin.storage
            .from('images')
            .remove([image.storage_path]);

          if (storageError) {
            console.warn(`⚠️  Could not delete from storage: ${storageError.message}`);
          } else {
            console.log(`✅ Deleted from storage: ${image.storage_path}`);
          }
        }

        // Delete thumbnail if exists
        if (image.thumbnail_url) {
          const thumbPath = image.thumbnail_url.split('/').slice(-3).join('/');
          const { error: thumbError } = await supabaseAdmin.storage
            .from('images')
            .remove([thumbPath]);

          if (thumbError) {
            console.warn(`⚠️  Could not delete thumbnail: ${thumbError.message}`);
          }
        }
      }
    }

    console.log('\n✅ Done! Screenshot images deleted from database and storage.');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

deleteScreenshotImages();

