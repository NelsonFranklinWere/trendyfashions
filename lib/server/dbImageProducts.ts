import { supabaseAdmin } from '@/lib/supabase/server';
import type { Product } from '@/data/products';
import { filterValidProducts } from './validateProduct';

interface DbImage {
  id: string;
  category: string;
  subcategory: string;
  filename: string;
  url: string;
  storage_path: string;
  thumbnail_url?: string;
  uploaded_at: string;
  uploaded_by?: string;
  file_size?: number;
  mime_type?: string;
  width?: number;
  height?: number;
  // Optional fields that may exist if database schema was updated
  name?: string;
  price?: number;
  description?: string;
}

// Map category slugs to database category values
const categoryMapping: Record<string, string> = {
  // New simplified categories - these are the only ones used now
  'mens-officials': 'mens-officials',
  'mens-nike': 'mens-nike',
  'sports': 'sports',
  'mens-style': 'mens-style',
  'vans': 'vans',
  'sneakers': 'sneakers',
  // Legacy mappings for backward compatibility (old products)
  officials: 'mens-officials',
  formal: 'mens-officials',
  casuals: 'mens-casuals',
  'mens-casuals': 'mens-casuals',
  casual: 'mens-casuals',
  nike: 'mens-nike',
  airmax: 'sneakers',
  airforce: 'sneakers',
  jordan: 'sneakers',
  custom: 'mens-style',
  customized: 'mens-style',
  'mens-loafers': 'mens-officials',
  loafers: 'mens-officials',
};

// Helper to format product name from filename and subcategory
const formatProductName = (filename: string, subcategory: string, category: string): string => {
  const lowerFilename = filename.toLowerCase();
  const lowerSubcategory = subcategory.toLowerCase();

  // Generic category/subcategory names to ignore (use filename instead)
  const genericNames = [
    'custom', 'customized', 'jordan', 'sports', 'casual', 'casuals', 
    'sneakers', 'airmax', 'airforce', 'vans', 'officials', 'formal',
    'running', 'boots', 'mules', 'empire', 'clarks'
  ];

  // PRIORITY 1: Use subcategory if it's meaningful (not generic)
  // This is the name the user uploaded the product with
  if (subcategory && subcategory.trim() && 
      subcategory.length > 2 &&
      !genericNames.includes(lowerSubcategory) &&
      !/^\d+$/.test(subcategory.trim())) { // Not just a number
    return subcategory.trim();
  }

  // For officials category, use subcategory-specific naming (fallback)
  if (category === 'officials') {
    if (lowerSubcategory === 'empire') {
      return 'Empire Leather';
    } else if (lowerSubcategory === 'boots') {
      return 'Official Boots';
    } else if (lowerSubcategory === 'clarks') {
      return 'Clarks Official';
    } else if (lowerSubcategory === 'mules') {
      return 'Mules';
    } else if (lowerSubcategory === 'casuals') {
      return 'Casual';
    }
  }

  // For Jordan category, preserve Jordan model numbers (especially Jordan 11)
  if (category === 'jordan') {
    // If subcategory contains meaningful content, use it (might be the actual product name)
    if (subcategory && subcategory.trim() && 
        subcategory.toLowerCase() !== 'jordan' && 
        subcategory.toLowerCase() !== 'sports' &&
        subcategory.length > 2) {
      return subcategory.trim();
    }
    
    const base = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const lowerBase = base.toLowerCase();
    
    // Handle Jordan 11 specifically
    if (lowerBase.includes('jordan11') || lowerBase.includes('jordan 11') || lowerBase.includes('j11')) {
      // Extract colorway or variant if present
      const parts = base.replace(/jordan11|jordan-11|j11|thumb-|\d+-/gi, '').trim();
      if (parts && parts.length > 0) {
        const variant = parts.replace(/[-_@]+/g, ' ').trim();
        return variant ? `Jordan 11 ${variant.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}` : 'Jordan 11';
      }
      return 'Jordan 11';
    }
    
    // Handle other Jordan models
    if (lowerBase.includes('jordan1') || lowerBase.includes('jordan 1') || lowerBase.includes('j1')) {
      return 'Jordan 1';
    }
    if (lowerBase.includes('jordan3') || lowerBase.includes('jordan 3') || lowerBase.includes('j3')) {
      return 'Jordan 3';
    }
    if (lowerBase.includes('jordan4') || lowerBase.includes('jordan 4') || lowerBase.includes('j4')) {
      return 'Jordan 4';
    }
    if (lowerBase.includes('jordan9') || lowerBase.includes('jordan 9') || lowerBase.includes('j9')) {
      return 'Jordan 9';
    }
    if (lowerBase.includes('jordan14') || lowerBase.includes('jordan 14') || lowerBase.includes('j14')) {
      return 'Jordan 14';
    }
    
    // General Jordan - preserve more of the filename
    const spaced = base.replace(/[-_@]+/g, ' ').replace(/\s+/g, ' ').trim();
    return spaced
      .split(' ')
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
      .join(' ');
  }

  // For custom category, preserve the filename better (don't strip too much)
  if (category === 'custom' || category === 'customized') {
    // If subcategory has meaningful content (not just "Custom" or a number), use it as the name
    if (subcategory && subcategory.trim() && 
        subcategory.toLowerCase() !== 'custom' && 
        subcategory.toLowerCase() !== 'customized' &&
        !/^\d+$/.test(subcategory.trim()) && // Not just a number
        subcategory.length > 2) {
      return subcategory.trim();
    }
    
    const base = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    // Remove common prefixes like "thumb-", timestamps, and IDs
    let cleaned = base.replace(/^thumb-|\d{13}-|\d{10}-/gi, '').trim();
    
    // If after cleaning it's just a number or empty, try to use subcategory or a default
    if (!cleaned || /^\d+$/.test(cleaned)) {
      if (subcategory && subcategory.trim() && subcategory.length > 2) {
        return subcategory.trim();
      }
      return 'Custom Product';
    }
    
    // Replace underscores and dashes with spaces, but preserve the structure
    const spaced = cleaned.replace(/[-_@]+/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Format the filename preserving more detail
    return spaced
      .split(' ')
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
      .join(' ');
  }

  // Default: format filename (for other categories)
  const base = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const spaced = base.replace(/[-_@]+/g, ' ').replace(/\s+/g, ' ').trim();
  const cleaned = spaced.replace(/\s+\d+$/, '').trim();
  
  if (!cleaned) {
    return category === 'officials' ? 'Official Shoe' : 'Product';
  }

  return cleaned
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ');
};

// Helper to generate product description
const generateDescription = (name: string, subcategory: string, category: string): string => {
  if (category === 'officials') {
    if (subcategory === 'Empire') {
      return 'Premium Empire leather shoes for the sophisticated professional. Classic elegance meets modern comfort.';
    } else if (subcategory === 'Boots') {
      return 'Premium quality official boots for the professional workplace. Durable construction meets sophisticated style.';
    } else if (subcategory === 'Clarks') {
      return 'Premium Clarks Official shoes for the distinguished professional. Timeless British craftsmanship meets modern style.';
    } else if (subcategory === 'Mules') {
      return 'Comfortable mules perfect for the modern professional. Easy slip-on design meets elegant style.';
    } else if (subcategory === 'Casuals') {
      return 'Stylish casual shoes perfect for the modern professional. Comfort meets elegance in every step.';
    }
  }
  return `${name} — Quality ${category} shoes from Trendy Fashion Zone`;
};

// Helper to determine price based on category and subcategory
const getPrice = (category: string, subcategory: string): number => {
  if (category === 'officials') {
    if (subcategory === 'Boots') return 4700;
    if (subcategory === 'Clarks') return 4500;
    if (subcategory === 'Casuals') return 3500;
    if (subcategory === 'Mules') return 2500;
    // Empire and others
    return 2800;
  }
  
  if (category === 'airmax') return 3700;
  if (category === 'jordan') {
    // Check for Jordan 11 specifically
    const nameLower = (subcategory || '').toLowerCase();
    if (nameLower.includes('jordan 11') || nameLower.includes('jordan11') || nameLower.includes('j11')) {
      return 3500;
    }
    return 3300;
  }
  if (category === 'airforce') return 3200;
  if (category === 'casuals' || category === 'sneakers') return 3000;
  
  // Check for Converse products - price 1900
  const nameLower = (subcategory || '').toLowerCase();
  const categoryLower = (category || '').toLowerCase();
  if (nameLower.includes('converse') || categoryLower.includes('converse')) {
    return 1900;
  }
  
  // Check for New Balance products
  if (nameLower.includes('new balance') || nameLower.includes('newbalance') || nameLower.includes('nb')) {
    // New Balance 1000 = 4000
    if (nameLower.includes('1000')) {
      return 4000;
    }
    // Other New Balance = 3800
    return 3800;
  }
  
  return 2800; // default
};

// Helper to determine gender based on category
const getGender = (category: string): 'Men' | 'Unisex' => {
  if (category === 'officials') return 'Men';
  return 'Unisex';
};

// Helper to map category to product category format
const mapToProductCategory = (category: string): string => {
  const mapping: Record<string, string> = {
    officials: 'officials',
    sneakers: 'casual',
    casuals: 'casual',
    airmax: 'running',
    airforce: 'customized',
    jordan: 'sports',
    vans: 'casual',
    custom: 'customized',
  };
  return mapping[category] || category;
};

// Convert database image to Product
const dbImageToProduct = (dbImage: DbImage, index: number): Product => {
  const category = categoryMapping[dbImage.category] || dbImage.category;
  const productCategory = mapToProductCategory(category);
  
  // PRIORITY: Use name from database if available (the name user uploaded)
  // Otherwise, use subcategory if meaningful, or format from filename
  let name: string;
  if (dbImage.name && dbImage.name.trim() && dbImage.name.length > 0) {
    // Use the name field from database (exact name user uploaded)
    name = dbImage.name.trim();
  } else {
    // Fallback to formatting from subcategory/filename
    name = formatProductName(dbImage.filename, dbImage.subcategory, category);
  }
  
  // PRIORITY: Use price from database if available (the price user uploaded)
  // Otherwise, calculate based on category/subcategory
  let price: number;
  const productName = dbImage.name || formatProductName(dbImage.filename, dbImage.subcategory, category);
  const nameLower = productName.toLowerCase();
  
  if (dbImage.price !== undefined && dbImage.price !== null && dbImage.price > 0) {
    // Use the price field from database, but override for specific products
    price = Number(dbImage.price);
    const descLower = (dbImage.description || '').toLowerCase();
    // Converse = 1900
    if (nameLower.includes('converse') || descLower.includes('converse')) {
      price = 1900;
    }
    // New Balance 1000 = 4000
    else if ((nameLower.includes('new balance') || nameLower.includes('newbalance') || nameLower.includes('nb')) && 
             (nameLower.includes('1000') || descLower.includes('1000'))) {
      price = 4000;
    }
    // Other New Balance = 3800
    else if (nameLower.includes('new balance') || nameLower.includes('newbalance') || nameLower.includes('nb')) {
      price = 3800;
    }
    // Jordan 11 = 3500
    else if ((nameLower.includes('jordan 11') || nameLower.includes('jordan11') || nameLower.includes('j11')) ||
             (descLower.includes('jordan 11') || descLower.includes('jordan11') || descLower.includes('j11'))) {
      price = 3500;
    }
  } else {
    // Fallback to calculated price
    const descLower = (dbImage.description || '').toLowerCase();
    // Converse = 1900
    if (nameLower.includes('converse') || descLower.includes('converse')) {
      price = 1900;
    }
    // New Balance 1000 = 4000
    else if ((nameLower.includes('new balance') || nameLower.includes('newbalance') || nameLower.includes('nb')) && 
             (nameLower.includes('1000') || descLower.includes('1000'))) {
      price = 4000;
    }
    // Other New Balance = 3800
    else if (nameLower.includes('new balance') || nameLower.includes('newbalance') || nameLower.includes('nb')) {
      price = 3800;
    }
    // Jordan 11 = 3500
    else if ((nameLower.includes('jordan 11') || nameLower.includes('jordan11') || nameLower.includes('j11')) ||
             (descLower.includes('jordan 11') || descLower.includes('jordan11') || descLower.includes('j11'))) {
      price = 3500;
    }
    else {
      price = getPrice(category, dbImage.subcategory);
    }
  }
  
  // Use thumbnail URL if available for faster initial load, fallback to full URL
  let imageUrl = dbImage.thumbnail_url || dbImage.url;
  
  // Validate URL - ensure it's a valid string and not empty
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    console.warn(`Invalid image URL for product ${dbImage.id} (${dbImage.filename}): URL is missing or invalid`);
    throw new Error(`Invalid image URL for product ${dbImage.id}`);
  }
  
  // Ensure Supabase URLs are public (remove any signed token if present, use public URL)
  // Supabase Storage public URLs should work directly with Next.js Image
  if (imageUrl.includes('supabase.co') || imageUrl.includes('supabase.in')) {
    // If URL contains a signed token, we might need to use the public URL
    // For now, use the URL as-is since it should be public
    imageUrl = imageUrl.trim();
  }
  
  return {
    id: `db-${dbImage.id}`,
    name,
    description: generateDescription(name, dbImage.subcategory, category),
    price,
    image: imageUrl, // Use thumbnail for faster loading, full URL for high-res
    // For officials category, keep it as 'officials' for filtering, not mapped to 'formal'
    category: category === 'officials' ? 'officials' : productCategory,
    gender: getGender(category),
    // Store subcategory in tags for filtering (tags is an optional array in Product interface)
    tags: [dbImage.subcategory],
    // Store full URL separately for high-res display when needed
    ...(dbImage.thumbnail_url && { fullImageUrl: dbImage.url }),
  } as Product & { fullImageUrl?: string };
};

/**
 * Get products from database for a specific category
 * PRIORITY: Try products table first (has exact names/prices), fallback to images table
 */
export async function getDbImageProducts(category: string): Promise<Product[]> {
  try {
    const dbCategory = categoryMapping[category] || category;
    
    // FIRST: Try products table (same as admin section - has exact names and prices)
    const productsFromTable = await getDbProducts(category);
    if (productsFromTable.length > 0) {
      console.log(`Found ${productsFromTable.length} products from products table for category: ${category}`);
      if (productsFromTable.length > 0) {
        console.log(`Sample product: "${productsFromTable[0].name}" (KES ${productsFromTable[0].price})`);
      }
      return productsFromTable;
    }
    
    // FALLBACK: Try images table (legacy)
    const { data, error } = await supabaseAdmin
      .from('images')
      .select('*')
      .eq('category', dbCategory)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error(`Error fetching ${category} products from database:`, error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log(`No database products found for category: ${category} (mapped to: ${dbCategory})`);
      return [];
    }

    console.log(`Found ${data.length} database images for category: ${category} (fallback to images table)`);
    const products: Product[] = [];
    
    for (const img of data) {
      try {
        // Filter out Jordan 11 products
        const nameLower = ((img as DbImage).name || '').toLowerCase();
        const descLower = ((img as DbImage).description || '').toLowerCase();
        const filenameLower = ((img as DbImage).filename || '').toLowerCase();
        const isJordan11 = nameLower.includes('jordan 11') || 
                          nameLower.includes('jordan11') || 
                          nameLower.includes('j11') ||
                          descLower.includes('jordan 11') || 
                          descLower.includes('jordan11') || 
                          descLower.includes('j11') ||
                          filenameLower.includes('jordan 11') || 
                          filenameLower.includes('jordan11') || 
                          filenameLower.includes('j11');
        if (isJordan11) {
          continue; // Skip Jordan 11 products
        }
        
        const product = dbImageToProduct(img as DbImage, 0);
        products.push(product);
      } catch (error) {
        console.warn(`Skipping product ${img.id} (${img.filename}) due to error:`, error);
        // Continue with next product
      }
    }
    
    // Filter out products with invalid images
    const validProducts = filterValidProducts(products);
    
    // Log first product for debugging
    if (validProducts.length > 0) {
      const sample = validProducts[0];
      console.log(`Sample database product: "${sample.name}" (KES ${sample.price}), image: ${sample.image}`);
      // Log if using database name/price vs calculated
      const firstDbImage = data[0] as DbImage;
      if (firstDbImage.name) {
        console.log(`  ✓ Using database name: "${firstDbImage.name}"`);
      }
      if (firstDbImage.price !== undefined && firstDbImage.price !== null) {
        console.log(`  ✓ Using database price: KES ${firstDbImage.price}`);
      }
    } else if (data.length > 0) {
      console.warn(`All ${data.length} database products were filtered out due to invalid image URLs`);
    }
    
    return validProducts;
  } catch (error) {
    console.error(`Error loading ${category} products from database:`, error);
    return [];
  }
}

/**
 * Get products from database for a specific category and subcategory
 */
export async function getDbImageProductsBySubcategory(
  category: string,
  subcategory: string
): Promise<Product[]> {
  try {
    const dbCategory = categoryMapping[category] || category;
    
    const { data, error } = await supabaseAdmin
      .from('images')
      .select('*')
      .eq('category', dbCategory)
      .eq('subcategory', subcategory)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error(`Error fetching ${category}/${subcategory} products from database:`, error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((img, index) => dbImageToProduct(img as DbImage, index));
  } catch (error) {
    console.error(`Error loading ${category}/${subcategory} products from database:`, error);
    return [];
  }
}

/**
 * Get products from the products table (same as admin section)
 * This uses the exact names and prices uploaded by the user
 */
export async function getDbProducts(category?: string): Promise<Product[]> {
  try {
    let query = supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      const dbCategory = categoryMapping[category] || category;
      query = query.eq('category', dbCategory);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products from database:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Convert database products to Product format and filter out Jordan 11 and invalid products
    const mappedProducts = data
      .filter((product: any) => {
        // Filter out Jordan 11 products
        const nameLower = (product.name || '').toLowerCase();
        const descLower = (product.description || '').toLowerCase();
        const imageLower = (product.image || '').toLowerCase();
        const isJordan11 = nameLower.includes('jordan 11') || 
                          nameLower.includes('jordan11') || 
                          nameLower.includes('j11') ||
                          descLower.includes('jordan 11') || 
                          descLower.includes('jordan11') || 
                          descLower.includes('j11') ||
                          imageLower.includes('jordan 11') || 
                          imageLower.includes('jordan11') || 
                          imageLower.includes('j11');
        return !isJordan11;
      })
      .map((product: any) => {
        // Set price based on product type, overriding database price if needed
        let price = Number(product.price);
        const nameLower = (product.name || '').toLowerCase();
        const descLower = (product.description || '').toLowerCase();
        
        // Converse = 1900
        if (nameLower.includes('converse') || descLower.includes('converse')) {
          price = 1900;
        }
        // New Balance 1000 = 4000
        else if ((nameLower.includes('new balance') || nameLower.includes('newbalance') || nameLower.includes('nb')) && 
                 (nameLower.includes('1000') || descLower.includes('1000'))) {
          price = 4000;
        }
        // Other New Balance = 3800
        else if (nameLower.includes('new balance') || nameLower.includes('newbalance') || nameLower.includes('nb')) {
          price = 3800;
        }
        // Jordan 11 = 3500
        else if ((nameLower.includes('jordan 11') || nameLower.includes('jordan11') || nameLower.includes('j11')) ||
                 (descLower.includes('jordan 11') || descLower.includes('jordan11') || descLower.includes('j11'))) {
          price = 3500;
        }
        
        return {
          id: `product-${product.id}`,
          name: product.name,
          description: product.description || `${product.name} — Quality ${product.category} shoes from Trendy Fashion Zone`,
          price,
          image: product.image,
          category: mapToProductCategory(product.category) || product.category,
          gender: (product.gender as 'Men' | 'Unisex') || 'Unisex',
          tags: product.tags || (product.subcategory ? [product.subcategory] : undefined),
          featured: product.featured || false,
        } satisfies Product;
      });
    
    // Filter out products with invalid images
    return filterValidProducts(mappedProducts);
  } catch (error) {
    console.error('Error loading products from database:', error);
    return [];
  }
}

/**
 * Get all products from database (images table - legacy)
 */
export async function getAllDbImageProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('images')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching all products from database:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((img, index) => dbImageToProduct(img as DbImage, index));
  } catch (error) {
    console.error('Error loading all products from database:', error);
    return [];
  }
}

