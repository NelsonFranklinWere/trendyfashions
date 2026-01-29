import { getImages } from '@/lib/db/images';
import { getProducts } from '@/lib/db/products';
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
// All working categories: officials, casual, loafers, sandals, sports, vans, sneakers
const categoryMapping: Record<string, string> = {
  // Working categories
  'officials': 'officials',
  'casual': 'casual',
  'loafers': 'loafers',
  'sandals': 'sandals',
  'sports': 'sports',
  'vans': 'vans',
  'sneakers': 'sneakers',
  // Legacy mappings for backward compatibility
  'mens-officials': 'officials',
  'mens-official': 'officials',
  formal: 'officials',
  casuals: 'casual',
  'mens-casuals': 'casual',
  'mens-loafers': 'loafers',
  'mens-nike': 'nike',
  airmax: 'sneakers',
  airforce: 'sneakers',
  jordan: 'sneakers',
};

// Helper to format product name from filename (no subcategory)
const formatProductName = (filename: string, category: string): string => {
  const lowerFilename = filename.toLowerCase();

  // For officials category, check filename for specific brands
  if (category === 'officials') {
    // Check filename for Dr. Martens first
    if (lowerFilename.includes('dr.martens') || lowerFilename.includes('drmartens') || lowerFilename.includes('dr martens') ||
        lowerFilename.includes('martens') || lowerFilename.includes('dr martin')) {
      return 'Dr. Martens';
    }
    if (lowerFilename.includes('empire')) {
      return 'Empire Leather';
    } else if (lowerFilename.includes('boots')) {
      return 'Official Boots';
    } else if (lowerFilename.includes('clarks')) {
      return 'Clarks Official';
    } else if (lowerFilename.includes('mules')) {
      return 'Mules';
    }
  }

  // For Jordan category, preserve Jordan model numbers (especially Jordan 11)
  if (category === 'jordan' || category === 'sneakers') {
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

  // For custom/customized category, preserve the filename better
  if (category === 'custom' || category === 'customized') {
    const base = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    // Remove common prefixes like "thumb-", timestamps, and IDs
    let cleaned = base.replace(/^thumb-|\d{13}-|\d{10}-/gi, '').trim();
    
    // If after cleaning it's just a number or empty, use default
    if (!cleaned || /^\d+$/.test(cleaned)) {
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

// Helper to generate product description (no subcategory)
const generateDescription = (name: string, category: string): string => {
  if (category === 'officials') {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('empire')) {
      return 'Premium Empire leather shoes for the sophisticated professional. Classic elegance meets modern comfort.';
    } else if (nameLower.includes('boots')) {
      return 'Premium quality official boots for the professional workplace. Durable construction meets sophisticated style.';
    } else if (nameLower.includes('clarks')) {
      return 'Premium Clarks Official shoes for the distinguished professional. Timeless British craftsmanship meets modern style.';
    } else if (nameLower.includes('mules')) {
      return 'Comfortable mules perfect for the modern professional. Easy slip-on design meets elegant style.';
    }
  }
  return `${name} — Quality ${category} shoes from Trendy Fashion Zone`;
};

// Helper to determine price based on category and name (no subcategory)
const getPrice = (category: string, name?: string): number => {
  const nameLower = (name || '').toLowerCase();
  const categoryLower = (category || '').toLowerCase();
  
  // Check for officials category (both 'officials' and 'mens-officials')
  if (category === 'officials') {
    // Check for Dr. Martens first (by name)
    if (nameLower.includes('dr.martens') || nameLower.includes('drmartens') || nameLower.includes('dr martens') ||
        nameLower.includes('martens') || nameLower.includes('dr martin')) {
      return 4200;
    }
    if (nameLower.includes('boots')) return 4700;
    if (nameLower.includes('clarks')) return 4500;
    if (nameLower.includes('empire')) return 3000;
    if (nameLower.includes('mules')) return 2500;
    // Others
    return 2800;
  }
  
  if (category === 'airmax') return 3700;
  if (category === 'jordan' || category === 'sneakers') {
    // Check for Jordan 11 specifically
    if (nameLower.includes('jordan 11') || nameLower.includes('jordan11') || nameLower.includes('j11')) {
      return 3500;
    }
    return 3300;
  }
  if (category === 'airforce') return 3200;
  if (category === 'casual' || category === 'casuals' || category === 'sneakers') return 3000;
  
  // Check for Timberland, Lacoste, Puma, Boss in casual category - price 3200
  if (categoryLower === 'casual' || categoryLower === 'casuals' || categoryLower === 'mens-casual') {
    if (nameLower.includes('timberland') || nameLower.includes('timba') ||
        nameLower.includes('lacoste') ||
        nameLower.includes('puma') ||
        nameLower.includes('boss')) {
      return 3200;
    }
  }
  
  // Check for Converse products - price 1900
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
  // Preserve the 8 new categories as-is
  const newCategories = ['officials', 'casual', 'loafers', 'sports', 'vans'];
  if (newCategories.includes(category)) {
    return category;
  }
  
  // Legacy mapping for old categories
  const mapping: Record<string, string> = {
    officials: 'officials',
    formal: 'officials',
    casuals: 'casual',
    'mens-casuals': 'casual',
    'mens-loafers': 'loafers',
    'mens-nike': 'nike',
    airmax: 'sneakers',
    airforce: 'sneakers',
    jordan: 'sneakers',
  };
  return mapping[category] || category;
};

// Convert database image to Product
const dbImageToProduct = (dbImage: DbImage, index: number): Product => {
  const category = categoryMapping[dbImage.category] || dbImage.category;
  const productCategory = mapToProductCategory(category);
  
  // PRIORITY: Use name from database if available (the name user uploaded)
  // Otherwise, format from filename
  let name: string;
  if (dbImage.name && dbImage.name.trim() && dbImage.name.length > 0) {
    // Use the name field from database (exact name user uploaded)
    name = dbImage.name.trim();
  } else {
    // Fallback to formatting from filename
    name = formatProductName(dbImage.filename, category);
  }
  
  // PRIORITY: Use price from database if available (the exact price user uploaded)
  // Otherwise, calculate based on category and name
  let price: number;
  
  if (dbImage.price !== undefined && dbImage.price !== null && dbImage.price > 0) {
    // Use the exact price field from database (no overrides)
    price = Number(dbImage.price);
  } else {
    // Fallback to calculated price only if no price was uploaded
    price = getPrice(category, name);
  }
  
  // Override price for specific brands in casual category: Timberland, Lacoste, Puma, Boss = 3200
  if (category === 'casual' || category === 'casuals' || category === 'mens-casual') {
    const nameLower = name.toLowerCase();
    const descLower = (dbImage.description || '').toLowerCase();
    
    const isTimberland = nameLower.includes('timberland') || nameLower.includes('timba') || 
                        descLower.includes('timberland') || descLower.includes('timba');
    const isLacoste = nameLower.includes('lacoste') || descLower.includes('lacoste');
    const isPuma = nameLower.includes('puma') || descLower.includes('puma');
    const isBoss = nameLower.includes('boss') || descLower.includes('boss');
    
    if (isTimberland || isLacoste || isPuma || isBoss) {
      price = 3200;
    }
  }
  
  // Use thumbnail URL if available for faster initial load, fallback to full URL
  let imageUrl = dbImage.thumbnail_url || dbImage.url;
  
  // Validate URL - ensure it's a valid string and not empty
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    console.warn(`Invalid image URL for product ${dbImage.id} (${dbImage.filename}): URL is missing or invalid`);
    throw new Error(`Invalid image URL for product ${dbImage.id}`);
  }
  
  // DigitalOcean Spaces CDN URLs are already optimized and public
  // No special handling needed - they work directly with Next.js Image
  imageUrl = imageUrl.trim();
  
  // PRIORITY: Use description from database if available (the exact description user uploaded)
  // Otherwise, generate from name and category
  let description: string;
  if (dbImage.description && dbImage.description.trim() && dbImage.description.length > 0) {
    // Use the exact description field from database
    description = dbImage.description.trim();
  } else {
    // Fallback to generated description
    description = generateDescription(name, category);
  }
  
  return {
    id: `db-${dbImage.id}`,
    name,
    description,
    price,
    image: imageUrl, // Use thumbnail for faster loading, full URL for high-res
    // For officials category, keep it as 'officials' for filtering, not mapped to 'formal'
    category: category === 'officials' ? 'officials' : productCategory,
    gender: getGender(category),
    // No tags - we don't use subcategories anymore
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
    let categories = [dbCategory];
    const data = await getImages({
      category: dbCategory,
      orderBy: 'uploaded_at',
      order: 'desc',
    });

    // Filter by category
    const filteredData = data.filter(img => img.category === dbCategory);

    if (!filteredData || filteredData.length === 0) {
      console.log(`No database products found for category: ${category} (mapped to: ${dbCategory})`);
      return [];
    }

    console.log(`Found ${filteredData.length} database images for category: ${category} (fallback to images table)`);
    const products: Product[] = [];
    
    for (const img of filteredData) {
      try {
        const nameLower = ((img as DbImage).name || '').toLowerCase();
        const descLower = ((img as DbImage).description || '').toLowerCase();
        const filenameLower = ((img as DbImage).filename || '').toLowerCase();
        const subcategoryLower = ((img as DbImage).subcategory || '').toLowerCase();
        
        // Filter out Jordan 11 products
        const isJordan11 = nameLower.includes('jordan 11') || 
                          nameLower.includes('jordan11') || 
                          nameLower.includes('j11') ||
                          descLower.includes('jordan 11') || 
                          descLower.includes('jordan11') || 
                          descLower.includes('j11') ||
                          filenameLower.includes('jordan 11') || 
                          filenameLower.includes('jordan11') || 
                          filenameLower.includes('j11');
        
        // Filter out Dr. Martens products (will be uploaded fresh via admin)
        const isDrMartens = nameLower.includes('dr.martens') || 
                           nameLower.includes('drmartens') || 
                           nameLower.includes('dr martens') ||
                           nameLower.includes('martens') ||
                           nameLower.includes('dr martin') ||
                           descLower.includes('dr.martens') || 
                           descLower.includes('drmartens') || 
                           descLower.includes('dr martens') ||
                           descLower.includes('martens') ||
                           filenameLower.includes('dr.martens') || 
                           filenameLower.includes('drmartens') || 
                           filenameLower.includes('dr martens') ||
                           filenameLower.includes('martens') ||
                           subcategoryLower.includes('dr.martens') || 
                           subcategoryLower.includes('drmartens') || 
                           subcategoryLower.includes('dr martens') ||
                           subcategoryLower.includes('martens');
        
        if (isJordan11 || isDrMartens) {
          continue; // Skip Jordan 11 and Dr. Martens products
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
    
    const data = await getImages({
      category: dbCategory,
      subcategory: subcategory,
      orderBy: 'uploaded_at',
      order: 'desc',
    });

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
    let dbCategory: string | undefined;
    if (category) {
      dbCategory = categoryMapping[category] || category;
    }

    let data = await getProducts({
      category: dbCategory,
      orderBy: 'created_at',
      order: 'desc',
    });


    if (!data || data.length === 0) {
      return [];
    }

    // Convert database products to Product format and filter out Jordan 11, Dr. Martens, and invalid products
    const mappedProducts = data
      .filter((product: any) => {
        const nameLower = (product.name || '').toLowerCase();
        const descLower = (product.description || '').toLowerCase();
        const imageLower = (product.image || '').toLowerCase();
        
        // Filter out Jordan 11 products
        const isJordan11 = nameLower.includes('jordan 11') || 
                          nameLower.includes('jordan11') || 
                          nameLower.includes('j11') ||
                          descLower.includes('jordan 11') || 
                          descLower.includes('jordan11') || 
                          descLower.includes('j11') ||
                          imageLower.includes('jordan 11') || 
                          imageLower.includes('jordan11') || 
                          imageLower.includes('j11');
        
        // Filter out Dr. Martens products (will be uploaded fresh via admin)
        const isDrMartens = nameLower.includes('dr.martens') || 
                           nameLower.includes('drmartens') || 
                           nameLower.includes('dr martens') ||
                           nameLower.includes('martens') ||
                           nameLower.includes('dr martin') ||
                           descLower.includes('dr.martens') || 
                           descLower.includes('drmartens') || 
                           descLower.includes('dr martens') ||
                           descLower.includes('martens') ||
                           imageLower.includes('dr.martens') || 
                           imageLower.includes('drmartens') || 
                           imageLower.includes('dr martens') ||
                           imageLower.includes('martens');
        
        // Filter out screenshot images
        // Log bank robbers products for debugging
        if (nameLower.includes('bank robber') || nameLower.includes('bankrobber') || 
            descLower.includes('bank robber') || descLower.includes('bankrobber') ||
            imageLower.includes('bank robber') || imageLower.includes('bankrobber')) {
          console.log(`[Bank Robbers] Found product: "${product.name}" in category: "${product.category}"`);
        }
        
        return !isJordan11 && !isDrMartens;
      })
      .map((product: any) => {
        // Use the exact price from database (no overrides)
        const price = product.price !== undefined && product.price !== null && product.price > 0 
          ? Number(product.price) 
          : getPrice(product.category, product.name);
        
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
    const data = await getImages({
      orderBy: 'uploaded_at',
      order: 'desc',
    });

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((img, index) => dbImageToProduct(img as DbImage, index));
  } catch (error) {
    console.error('Error loading all products from database:', error);
    return [];
  }
}

