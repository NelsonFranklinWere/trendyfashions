import { supabaseAdmin } from '@/lib/supabase/server';
import type { Product } from '@/data/products';

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
}

// Map category slugs to database category values
const categoryMapping: Record<string, string> = {
  officials: 'officials',
  formal: 'officials',
  sneakers: 'sneakers',
  casuals: 'casuals',
  casual: 'casuals',
  airmax: 'airmax',
  airforce: 'airforce',
  jordan: 'jordan',
  vans: 'vans',
  custom: 'custom',
  customized: 'custom',
};

// Helper to format product name from filename and subcategory
const formatProductName = (filename: string, subcategory: string, category: string): string => {
  const lowerFilename = filename.toLowerCase();
  const lowerSubcategory = subcategory.toLowerCase();

  // For officials category, use subcategory-specific naming
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

  // Default: format filename
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
  if (category === 'jordan') return 3300;
  if (category === 'airforce') return 3200;
  if (category === 'casuals' || category === 'sneakers') return 3000;
  
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
  const name = formatProductName(dbImage.filename, dbImage.subcategory, category);
  const productCategory = mapToProductCategory(category);
  
  // Use thumbnail URL if available for faster initial load, fallback to full URL
  const imageUrl = dbImage.thumbnail_url || dbImage.url;
  
  return {
    id: `db-${dbImage.id}`,
    name,
    description: generateDescription(name, dbImage.subcategory, category),
    price: getPrice(category, dbImage.subcategory),
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
 */
export async function getDbImageProducts(category: string): Promise<Product[]> {
  try {
    const dbCategory = categoryMapping[category] || category;
    
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
      return [];
    }

    return data.map((img, index) => dbImageToProduct(img as DbImage, index));
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
 * Get all products from database
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

