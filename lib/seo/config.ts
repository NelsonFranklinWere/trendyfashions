/**
 * SEO Configuration for Trendy Fashion Zone
 * Optimized for Nairobi, Kenya shoe searches
 * Based on how people search: brand names, categories, location, price, quality
 */

export const siteConfig = {
  name: 'Trendy Fashion Zone',
  url: 'https://trendyfashionzone.co.ke',
  description: 'Best sellers and quality original shoes in Nairobi. Authentic Nike, Jordan, Airforce, Airmax, Clarks, Vans, and more. Located on Moi Avenue. 5+ years trusted.',
  location: {
    city: 'Nairobi',
    area: 'Moi Avenue',
    country: 'Kenya',
    address: 'Moi Avenue, Nairobi, Kenya',
  },
  contact: {
    phone: '+254743869564',
    whatsapp: '254743869564',
  },
  social: {
    twitter: '@TrendyFashionZone',
  },
};

/**
 * Nairobi-specific search patterns and keywords
 * Based on how people in Nairobi search for shoes:
 * 1. Brand + Location: "Nike Airforce Nairobi", "Jordan shoes Kenya"
 * 2. Category + Location: "official shoes Nairobi", "sneakers Kenya"
 * 3. Quality + Location: "original shoes Nairobi", "authentic sneakers Kenya"
 * 4. Price-conscious: "affordable shoes Nairobi", "cheap original shoes"
 * 5. Location-based: "shoe shop Moi Avenue", "best shoe store Nairobi"
 * 6. Specific products: "loafers Nairobi", "football boots Kenya"
 */
export const nairobiKeywords = {
  // Primary brand keywords (high search volume)
  brands: [
    'Nike Airforce Nairobi',
    'Nike Airforce Kenya',
    'Jordan shoes Nairobi',
    'Jordan shoes Kenya',
    'Clarks officials Nairobi',
    'Clarks shoes Kenya',
    'Vans Nairobi',
    'Vans Kenya',
    'Airmax Nairobi',
    'Airmax Kenya',
    'New Balance Nairobi',
    'Converse Nairobi',
    'Nike SB Dunks Nairobi',
    'Nike Shox Nairobi',
  ],
  
  // Category keywords (medium-high search volume)
  categories: [
    'official shoes Nairobi',
    'official shoes Kenya',
    'casual shoes Nairobi',
    'casual shoes Kenya',
    'sneakers Nairobi',
    'sneakers Kenya',
    'sports shoes Nairobi',
    'sports shoes Kenya',
    'loafers Nairobi',
    'loafers Kenya',
    'football boots Nairobi',
    'football boots Kenya',
    'trainers Nairobi',
    'trainers Kenya',
  ],
  
  // Quality-focused keywords (high intent)
  quality: [
    'original shoes Nairobi',
    'original shoes Kenya',
    'authentic sneakers Nairobi',
    'authentic sneakers Kenya',
    'quality shoes Nairobi',
    'quality shoes Kenya',
    'genuine shoes Nairobi',
    'best sellers shoes Nairobi',
  ],
  
  // Location-based keywords (local SEO)
  location: [
    'shoe shop Moi Avenue',
    'shoe store Moi Avenue',
    'best shoe store Nairobi',
    'shoe shop Nairobi CBD',
    'shoe shop near me Nairobi',
    'Moi Avenue shoe shop',
    'shoe store Nairobi city center',
  ],
  
  // Price-conscious keywords
  price: [
    'affordable shoes Nairobi',
    'cheap original shoes Kenya',
    'best price shoes Nairobi',
    'discount shoes Nairobi',
  ],
  
  // Product-specific keywords
  products: [
    'Nike Airforce 1 Nairobi',
    'Air Jordan Nairobi',
    'Clarks desert boots Nairobi',
    'Timberland boots Nairobi',
    'Lacoste casuals Nairobi',
    'Tommy Hilfiger shoes Nairobi',
  ],
};

/**
 * Category-specific SEO keywords
 */
export const categoryKeywords: Record<string, string[]> = {
  'mens-officials': [
    'official shoes Nairobi',
    'Clarks officials Nairobi',
    'formal shoes Nairobi',
    'office shoes Nairobi',
    'professional shoes Nairobi',
    'Clarks shoes Kenya',
    'best official shoes Nairobi',
  ],
  'mens-casuals': [
    'casual shoes Nairobi',
    'casual shoes Kenya',
    'Lacoste casuals Nairobi',
    'Timberland casuals Nairobi',
    'Tommy Hilfiger shoes Nairobi',
    'stylish casual shoes Nairobi',
  ],
  'sneakers': [
    'sneakers Nairobi',
    'sneakers Kenya',
    'Nike Airforce Nairobi',
    'Jordan shoes Nairobi',
    'Airmax Nairobi',
    'New Balance Nairobi',
    'Converse Nairobi',
    'best sneakers Nairobi',
  ],
  'sports': [
    'sports shoes Nairobi',
    'football boots Nairobi',
    'football boots Kenya',
    'trainers Nairobi',
    'athletic shoes Nairobi',
    'F50 football boots Nairobi',
    'sports footwear Nairobi',
  ],
  'mens-nike': [
    'Nike shoes Nairobi',
    'Nike Kenya',
    'Nike SB Dunks Nairobi',
    'Nike Shox Nairobi',
    'Nike Ultra Nairobi',
    'Nike S Nairobi',
    'Nike Airforce Nairobi',
    'best Nike shoes Nairobi',
  ],
  'mens-style': [
    'stylish shoes Nairobi',
    'mens style shoes Nairobi',
    'fashion shoes Nairobi',
    'trendy shoes Nairobi',
    'Dior shoes Nairobi',
    'premium shoes Nairobi',
  ],
  'mens-loafers': [
    'loafers Nairobi',
    'loafers Kenya',
    'mens loafers Nairobi',
    'slip-on shoes Nairobi',
    'classic loafers Nairobi',
  ],
  'vans': [
    'Vans Nairobi',
    'Vans Kenya',
    'Vans sneakers Nairobi',
    'Vans customized Nairobi',
    'Vans shoes Kenya',
  ],
};

/**
 * Generate SEO keywords string for a category
 */
export const getCategoryKeywords = (categorySlug: string): string => {
  const keywords = categoryKeywords[categorySlug] || [];
  const baseKeywords = [
    'shoes Nairobi',
    'shoes Kenya',
    'quality original shoes',
    'authentic shoes',
    'best sellers',
  ];
  return [...keywords, ...baseKeywords].join(', ');
};

/**
 * Generate SEO title for a category
 */
export const getCategoryTitle = (categoryName: string): string => {
  return `${categoryName} | Quality Original Shoes Nairobi | Trendy Fashion Zone`;
};

/**
 * Generate SEO description for a category
 */
export const getCategoryDescription = (
  categoryName: string,
  categoryDescription: string
): string => {
  return `Shop best sellers and quality original ${categoryName.toLowerCase()} in Nairobi. ${categoryDescription} Authentic brands, premium quality, trusted by thousands. Located on Moi Avenue. Free delivery available.`;
};

