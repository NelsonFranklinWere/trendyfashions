import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deleteDrMartensProducts() {
  try {
    console.log('🔍 Searching for Dr. Martens products in database...\n');

    // Search in products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, image, category')
      .or('name.ilike.%martens%,name.ilike.%dr.martens%,name.ilike.%drmartens%,description.ilike.%martens%,image.ilike.%martens%');

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return;
    }

    console.log(`Found ${products?.length || 0} Dr. Martens products in products table`);

    if (products && products.length > 0) {
      console.log('\nProducts to delete:');
      products.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name} (ID: ${p.id}, Category: ${p.category})`);
      });

      // Delete from products table
      const productIds = products.map(p => p.id);
      const { error: deleteProductsError } = await supabase
        .from('products')
        .delete()
        .in('id', productIds);

      if (deleteProductsError) {
        console.error('Error deleting products:', deleteProductsError);
      } else {
        console.log(`\n✅ Deleted ${products.length} products from products table`);
      }
    }

    // Search in images table
    const { data: images, error: imagesError } = await supabase
      .from('images')
      .select('id, filename, category, subcategory')
      .or('filename.ilike.%martens%,filename.ilike.%dr.martens%,filename.ilike.%drmartens%,name.ilike.%martens%,subcategory.ilike.%martens%');

    if (imagesError) {
      console.error('Error fetching images:', imagesError);
      return;
    }

    console.log(`\nFound ${images?.length || 0} Dr. Martens images in images table`);

    if (images && images.length > 0) {
      console.log('\nImages to delete:');
      images.forEach((img, i) => {
        console.log(`${i + 1}. ${img.filename} (ID: ${img.id}, Category: ${img.category})`);
      });

      // Delete from images table
      const imageIds = images.map(img => img.id);
      const { error: deleteImagesError } = await supabase
        .from('images')
        .delete()
        .in('id', imageIds);

      if (deleteImagesError) {
        console.error('Error deleting images:', deleteImagesError);
      } else {
        console.log(`\n✅ Deleted ${images.length} images from images table`);
      }
    }

    const totalDeleted = (products?.length || 0) + (images?.length || 0);
    console.log(`\n🎉 Total deleted: ${totalDeleted} Dr. Martens entries`);
    
    if (totalDeleted === 0) {
      console.log('No Dr. Martens products found in database.');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

deleteDrMartensProducts();

