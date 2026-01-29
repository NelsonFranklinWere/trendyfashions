import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/server/getAllProducts';
import {
  getProductsByCategory,
  getCategoryBySlug,
  categories,
  Product,
} from '@/data/products';
import {
  DEFAULT_OFFICIAL_FILTER,
  OFFICIAL_SUBCATEGORY_FILTERS,
  OfficialFilter,
  filterOfficialsProducts,
  hasOfficialMatches,
} from '@/lib/filters/officials';
import {
  DEFAULT_SNEAKER_FILTER,
  SNEAKER_SUBCATEGORY_FILTERS,
  SneakerFilter,
  filterSneakerProducts,
  hasSneakerMatches,
} from '@/lib/filters/sneakers';
import {
  CASUAL_BRAND_FILTERS,
  DEFAULT_CASUAL_FILTER,
  CasualBrandFilter,
  filterCasualProducts,
  hasCasualMatches,
} from '@/lib/filters/casuals';
import {
  VANS_SUBCATEGORY_FILTERS,
  DEFAULT_VANS_FILTER,
  VansFilter,
  filterVansProducts,
  hasVansMatches,
} from '@/lib/filters/vans';
import {
  JORDAN_SUBCATEGORY_FILTERS,
  DEFAULT_JORDAN_FILTER,
  JordanFilter,
  filterJordanProducts,
  hasJordanMatches,
} from '@/lib/filters/jordan';
import {
  AIRMAX_SUBCATEGORY_FILTERS,
  DEFAULT_AIRMAX_FILTER,
  AirmaxFilter,
  filterAirmaxProducts,
  hasAirmaxMatches,
} from '@/lib/filters/airmax';
import { getCasualImageProducts } from '@/lib/server/casualImageProducts';
import { getOfficialImageProducts } from '@/lib/server/officialImageProducts';
import { getVansImageProducts } from '@/lib/server/vansImageProducts';
import { getAirmaxImageProducts } from '@/lib/server/airmaxImageProducts';
import { getAirforceImageProducts } from '@/lib/server/airforceImageProducts';
import { getJordanImageProducts } from '@/lib/server/jordanImageProducts';
import { getSneakersImageProducts } from '@/lib/server/sneakersImageProducts';
import { getNewBalanceImageProducts } from '@/lib/server/newbalanceImageProducts';
import { getCustomizedImageProducts } from '@/lib/server/customizedImageProducts';
import { getTimberlandImageProducts } from '@/lib/server/timberlandImageProducts';
import { getLoafersImageProducts } from '@/lib/server/loafersImageProducts';
import { getNikeImageProducts } from '@/lib/server/nikeImageProducts';
import { getSportsImageProducts } from '@/lib/server/sportsImageProducts';
import { getRandomProductsFromAllCategories } from '@/lib/server/getRandomProductsFromAllCategories';
import RandomProductsCarousel from '@/components/RandomProductsCarousel';
import { siteConfig, getCategoryKeywords, getCategoryTitle, getCategoryDescription } from '@/lib/seo/config';

// Get customer-focused header text for each category (2 lines max)
function getCategorySalesHeader(categorySlug: string): string {
  const headers: Record<string, string> = {
    'mens-officials': 'Find Your Perfect Office Shoes',
    'mens-nike': 'Discover Authentic Nike Styles',
    'sports': 'Choose Your Athletic Footwear',
    'vans': 'Browse Customized Vans Collection',
    'sneakers': 'Find Your Ideal Sneakers',
    'mens-casuals': 'Select Your Casual Footwear',
    'loafers': 'Discover Elegant Loafers Collection',
    'sandals': 'Find Comfortable Sandals for Every Occasion',
  };
  return headers[categorySlug] || `Browse ${categorySlug.replace(/-/g, ' ')} Collection`;
}

// Get customer-focused description text for each category (2 lines max, guiding tone)
function getCategorySalesDescription(categorySlug: string): string {
  const descriptions: Record<string, string> = {
    'mens-officials': 'Quality office shoes that match your professional needs. Find comfort and style for your workday.',
    'mens-nike': 'Original Nike shoes from Air Force to Air Max. Browse styles that fit your lifestyle.',
    'sports': 'Performance footwear for your active pursuits. Choose what works for your training and games.',
    'vans': 'Customized Vans that express your individuality. See designs that match your style.',
    'sneakers': 'Classic and modern sneakers in various styles. Find the pair that feels right for you.',
    'mens-casuals': 'Comfortable casual shoes for everyday wear. Select what fits your daily routine.',
    'loafers': 'Elegant loafers for professional and casual occasions. Discover timeless style and comfort.',
    'sandals': 'Comfortable sandals perfect for warm weather. Find the ideal pair for your casual needs.',
  };
  return descriptions[categorySlug] || `Browse quality ${categorySlug.replace(/-/g, ' ')} options that suit your needs.`;
}

/**
 * Helper function to merge products with database products taking priority
 * Database products (uploaded via admin) keep their uploaded name, description, and price
 * Filesystem products are used as fallback for images not in database
 */
function mergeProductsWithDbPriority(dbProducts: Product[], fsProducts: Product[]): Product[] {
  const productMap = new Map<string, Product>();
  
  // First, add all database products (they have priority)
  dbProducts.forEach(p => {
    if (p && p.image) {
      productMap.set(p.image, p);
    }
  });
  
  // Then, add filesystem products only if image doesn't exist in database
  fsProducts.forEach(p => {
    if (p && p.image && !productMap.has(p.image)) {
      productMap.set(p.image, p);
    }
  });
  
  return Array.from(productMap.values());
}

interface CategoryPageProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
  products: Product[];
  randomProducts: Product[];
  allProducts: Product[];
}

const CategoryPage = ({ category, products, randomProducts, allProducts }: CategoryPageProps) => {
  const router = useRouter();
  const { filter } = router.query;
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Safety checks - use default values instead of early return
  const safeCategory = category || { slug: '', name: '', description: '' };
  const safeProducts = products || [];
  const safeAllProducts = allProducts || [];

  // Filter products based on query parameter
  const queryFilteredProducts = useMemo(() => {
    if (!filter || !Array.isArray(safeProducts)) {
      return safeProducts;
    }

    const filterValue = filter.toString().toLowerCase().trim();
    return safeProducts.filter((product) => {
      if (!product) return false;
      const nameMatch = product.name?.toLowerCase().includes(filterValue) || false;
      const descMatch = product.description?.toLowerCase().includes(filterValue) || false;
      const imageMatch = product.image?.toLowerCase().includes(filterValue.replace(/\s+/g, '-')) || false;
      const subcategoryMatch = product.subcategory?.toLowerCase().includes(filterValue) || false;
      return nameMatch || descMatch || imageMatch || subcategoryMatch;
    });
  }, [filter, safeProducts]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !safeAllProducts || !Array.isArray(safeAllProducts)) {
      return [];
    }

    try {
      const query = searchQuery.toLowerCase().trim();
      return safeAllProducts.filter((product) => {
        if (!product) return false;
        const nameMatch = product.name?.toLowerCase().includes(query) || false;
        const descMatch = product.description?.toLowerCase().includes(query) || false;
        return nameMatch || descMatch;
      });
    } catch (error) {
      console.error('Error filtering search results:', error);
      return [];
    }
  }, [searchQuery, safeAllProducts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.length > 0);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSearchResults(false), 200);
  };

  const handleSearchFocus = () => {
    if (searchQuery.length > 0) {
      setShowSearchResults(true);
    }
  };
  const isOfficials = safeCategory?.slug === 'officials';
  const isSneakers = safeCategory?.slug === 'sneakers';
  const isCasuals = safeCategory?.slug === 'casuals';
  const isVans = safeCategory?.slug === 'vans';
  const isJordan = safeCategory?.slug === 'jordan';
  const isAirmax = safeCategory?.slug === 'airmax';
  const isMensOfficials = safeCategory?.slug === 'mens-officials';

  // Show all products in category - no filtering applied
  const filteredProducts = useMemo(() => {
    try {
      if (!safeProducts || !Array.isArray(safeProducts)) {
        return [];
      }
      // Return all products without any filtering
      return safeProducts;
    } catch (error) {
      console.error('Error loading products:', error);
      return safeProducts; // Return all products as fallback
    }
  }, [safeProducts]);

  // Safety check - ensure we have valid data
  if (!safeCategory || !safeCategory.name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text">Category not found</p>
      </div>
    );
  }

  return (
    <>
      <NextSeo
        title={`${safeCategory.name} | Quality Original Shoes Nairobi | Trendy Fashion Zone`}
        description={`Shop best sellers and quality original ${safeCategory.name.toLowerCase()} in Nairobi. ${safeCategory.description} Authentic brands, premium quality, trusted by thousands. Located on Moi Avenue. Free delivery available. Best prices in Nairobi.`}
        canonical={`https://trendyfashionzone.co.ke/collections/${safeCategory.slug}`}
        openGraph={{
          url: `https://trendyfashionzone.co.ke/collections/${safeCategory.slug}`,
          title: `${safeCategory.name} | Quality Original Shoes Nairobi | Trendy Fashion Zone`,
          description: `Shop best sellers and quality original ${safeCategory.name.toLowerCase()} in Nairobi. ${safeCategory.description} Located on Moi Avenue.`,
          type: 'website',
          locale: 'en_KE',
          images: safeCategory && 'image' in safeCategory ? [
            {
              url: `https://trendyfashionzone.co.ke${safeCategory.image}`,
              width: 1200,
              height: 630,
              alt: `${safeCategory.name} - Quality Original Shoes Nairobi`,
            },
          ] : [],
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: '@TrendyFashionZone',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: getCategoryKeywords(safeCategory.slug),
          },
          {
            name: 'robots',
            content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
          {
            name: 'geo.region',
            content: 'KE-110',
          },
          {
            name: 'geo.placename',
            content: 'Nairobi',
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': `${siteConfig.url}/collections/${safeCategory.slug}#webpage`,
            name: `${safeCategory.name} Collection - Best Sellers`,
            description: getCategoryDescription(safeCategory.name, safeCategory.description),
            url: `${siteConfig.url}/collections/${safeCategory.slug}`,
            inLanguage: 'en-KE',
            isPartOf: {
              '@type': 'WebSite',
              name: siteConfig.name,
              url: siteConfig.url,
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
                { '@type': 'ListItem', position: 2, name: 'Collections', item: `${siteConfig.url}/collections` },
                { '@type': 'ListItem', position: 3, name: safeCategory.name, item: `${siteConfig.url}/collections/${safeCategory.slug}` },
              ],
            },
            mainEntity: {
              '@type': 'ItemList',
              name: `${safeCategory.name} Products`,
              numberOfItems: products.length,
              itemListElement: products.slice(0, 10).map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Product',
                  name: product.name,
                  description: product.description,
                  image: product.image.startsWith('http') ? product.image : `${siteConfig.url}${product.image}`,
                  offers: {
                    '@type': 'Offer',
                    price: product.price,
                    priceCurrency: 'KES',
                    availability: 'https://schema.org/InStock',
                    url: `${siteConfig.url}/collections/${safeCategory.slug}`,
                  },
                },
              })),
            },
          }),
        }}
      />

      <div className="bg-gradient-to-b from-light/30 to-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-text hover:text-primary font-body font-medium transition-colors duration-200 group"
            >
              <svg
                className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to Collections</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              {/* Center-aligned Header */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-2">
                  {getCategorySalesHeader(safeCategory.slug)}
                </h1>
                <p className="text-base md:text-lg text-text font-body max-w-3xl leading-relaxed">
                  {getCategorySalesDescription(safeCategory.slug)}
                </p>
              </div>
              
              {/* Search Bar - Right Side */}
              <div className="relative w-full md:w-80 flex-shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    className="w-full px-4 py-2 pl-10 pr-4 rounded-lg text-primary font-body text-sm focus:outline-none focus:ring-2 focus:ring-secondary border border-light shadow-sm"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showSearchResults && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50 border border-light"
                    >
                      <div className="p-2">
                        <p className="px-4 py-2 text-sm font-semibold text-primary border-b">
                          Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
                        </p>
                        <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                          {searchResults.slice(0, 10).map((product) => (
                            <Link
                              key={product.id}
                              href={`/collections/${product.category}`}
                              className="flex items-center gap-3 p-3 hover:bg-light/50 rounded-lg transition-colors"
                            >
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded flex-shrink-0"
                                quality={75}
                                sizes="64px"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-primary truncate text-sm">{product.name}</p>
                                <p className="text-xs text-text/70 truncate">{product.description}</p>
                                <p className="text-xs font-bold text-secondary">KES {product.price.toLocaleString()}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        {searchResults.length > 10 && (
                          <div className="px-4 py-2 text-center text-sm text-primary border-t">
                            <p>And {searchResults.length - 10} more...</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                  {showSearchResults && searchQuery.length > 0 && searchResults.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl z-50 p-4 border border-light"
                    >
                      <p className="text-center text-text text-sm">No products found matching &quot;{searchQuery}&quot;</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Filters removed - all products display openly */}

          {/* Products Grid */}
          {queryFilteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
              {queryFilteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="animate-fade-in"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text font-body text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Random Products Carousel - Just above footer */}
      {randomProducts.length > 0 && (
        <RandomProductsCarousel products={randomProducts} />
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = categories.map((category) => ({
    params: { category: category.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const categorySlug = params?.category as string;
    
    const category = getCategoryBySlug(categorySlug);

    if (!category) {
      return {
        notFound: true,
      };
    }

    let products: Product[] = [];

    // Try database first, fallback to filesystem
    const { getDbImageProducts, getDbProducts } = await import('@/lib/server/dbImageProducts');
    
    // New collection structure - fetch from database with uploaded names/descriptions
    if (categorySlug === 'officials' || categorySlug === 'mens-officials') {
      // Get ALL officials products from database (Boots, Empire, Mules, Casuals, Clarks, etc.)
      // No subcategory filtering - all official shoes display together
      // Try both 'officials' and 'mens-officials' to catch all uploaded products
      const dbProductsOfficials = await getDbProducts('officials');
      const dbImageProductsOfficials = await getDbImageProducts('officials');
      const dbProductsMensOfficials = await getDbProducts('mens-officials');
      const dbImageProductsMensOfficials = await getDbImageProducts('mens-officials');
      const autoProducts = await getOfficialImageProducts();
      
      // Combine all database sources
      const dbProducts = [...dbProductsOfficials, ...dbProductsMensOfficials];
      const dbImageProducts = [...dbImageProductsOfficials, ...dbImageProductsMensOfficials];
      
      // Log for debugging
      console.log(`[Officials Category] Found ${dbProducts.length} products from products table`);
      console.log(`[Officials Category] Found ${dbImageProducts.length} products from images table`);
      if (dbProducts.length > 0) {
        console.log(`[Officials Category] Sample product: "${dbProducts[0].name}" (category: ${dbProducts[0].category})`);
      }
      
      // Combine all sources - database products take priority (keep uploaded names/descriptions/prices)
      const allProducts = mergeProductsWithDbPriority(
        [...dbProducts, ...dbImageProducts],
        autoProducts
      );
      
      // Remove first two products permanently
      products = allProducts.slice(2);
      
      // Final fallback to static products if database is empty
      if (products.length === 0) {
        products = getProductsByCategory('officials');
      }
    } else if (categorySlug === 'casual' || categorySlug === 'mens-casuals') {
      // Get all casuals products: Lacoste, Timberland, Boss, casuals images, Puma shoes, and Sandals
      // Use 'casual' for database queries (admin uploads use 'casual')
      const casualsDbProducts = await getDbProducts('casual');
      const casualsDbImageProducts = await getDbImageProducts('casual');
      
      // Log for debugging
      console.log(`[Casual Category] Found ${casualsDbProducts.length} products from products table`);
      console.log(`[Casual Category] Found ${casualsDbImageProducts.length} products from images table`);
      if (casualsDbProducts.length > 0) {
        console.log(`[Casual Category] Sample product: "${casualsDbProducts[0].name}" (category: ${casualsDbProducts[0].category})`);
      }
      const casualsFsProducts = getCasualImageProducts();
      
      // Get Timberland products (EXCLUDE Timberland Extreme - those go to mens-style)
      const timberlandProducts = getTimberlandImageProducts().filter(p => {
        if (!p) return false;
        const nameLower = (p.name || '').toLowerCase();
        const descLower = (p.description || '').toLowerCase();
        const imageLower = (p.image || '').toLowerCase();
        return !nameLower.includes('extreme') && !descLower.includes('extreme') && !imageLower.includes('extreme');
      });
      
      
      
      // Get Puma products from sneakers category
      const sneakersDbProducts = await getDbProducts('sneakers');
      const sneakersDbImageProducts = await getDbImageProducts('sneakers');
      const sneakersFsProducts = getSneakersImageProducts();
      const allSneakers = [...sneakersDbProducts, ...sneakersDbImageProducts, ...sneakersFsProducts];
      const pumaProducts = allSneakers.filter(p => {
        if (!p) return false;
        const nameLower = (p.name || '').toLowerCase();
        return nameLower.includes('puma');
      });
      
      // Combine all products - database products take priority
      const allCasuals = mergeProductsWithDbPriority(
        [...casualsDbProducts, ...casualsDbImageProducts],
        [...casualsFsProducts, ...timberlandProducts, ...pumaProducts]
      );
      
      // Filter to include only: Lacoste, Timberland, Boss, casuals, Puma, and Sandals
      // Also set price to 3200 for Timberland, Lacoste, Puma, and Boss products
      const seen = new Set<string>();
      products = allCasuals.filter(p => {
        if (!p || !p.image) return false;
        if (seen.has(p.image)) return false;
        seen.add(p.image);
        
        const nameLower = (p.name || '').toLowerCase();
        const descLower = (p.description || '').toLowerCase();
        const categoryLower = (p.category || '').toLowerCase();
        const imageLower = (p.image || '').toLowerCase();
        
        // Include Sandals products
        if (nameLower.includes('sandal') || descLower.includes('sandal') || imageLower.includes('sandal')) {
          return true;
        }
        
        // Include Lacoste products
        if (nameLower.includes('lacoste')) {
          return true;
        }
        
        // Include Timberland products (EXCLUDE Timberland Extreme - those go to mens-style)
        if ((nameLower.includes('timberland') || nameLower.includes('timba') || categoryLower === 'timberland') &&
            !nameLower.includes('extreme') && !descLower.includes('extreme') && !imageLower.includes('extreme')) {
          return true;
        }
        
        // Include Boss products
        if (nameLower.includes('boss')) {
          return true;
        }
        
        // Include Puma products
        if (nameLower.includes('puma')) {
          return true;
        }
        
        // Include all casuals category products
        if (categoryLower === 'casuals' || categoryLower === 'casual') {
          return true;
        }
        
        return false;
      })
      .map(p => {
        if (!p) return p;
        
        // Set price to 3200 for Timberland, Lacoste, Puma, and Boss products
        const nameLower = (p.name || '').toLowerCase();
        const descLower = (p.description || '').toLowerCase();
        
        const isTimberland = nameLower.includes('timberland') || nameLower.includes('timba') || 
                           descLower.includes('timberland') || descLower.includes('timba');
        const isLacoste = nameLower.includes('lacoste') || descLower.includes('lacoste');
        const isPuma = nameLower.includes('puma') || descLower.includes('puma');
        const isBoss = nameLower.includes('boss') || descLower.includes('boss');
        
        if (isTimberland || isLacoste || isPuma || isBoss) {
          return {
            ...p,
            price: 3200
          };
        }
        
        return p;
      });
      
      // Move the last 20 products from mens-casuals to mens-style
      // Remove them from mens-casuals (they will be added to mens-style in that section)
      if (products.length > 20) {
        products = products.slice(0, -20);
      }
      
      if (products.length === 0) {
        products = getProductsByCategory('casuals');
      }
    } else if (categorySlug === 'sneakers') {
      // Get database products FIRST (priority - these have uploaded names, descriptions, prices)
      const sneakersDbProducts = await getDbProducts('sneakers');
      const sneakersDbImageProducts = await getDbImageProducts('sneakers');
      const airforceDbProducts = await getDbProducts('airforce');
      const airforceDbImageProducts = await getDbImageProducts('airforce');
      const jordanDbProducts = await getDbProducts('jordan');
      const jordanDbImageProducts = await getDbImageProducts('jordan');
      const airmaxDbProducts = await getDbProducts('airmax');
      const airmaxDbImageProducts = await getDbImageProducts('airmax');
      
      // Log for debugging
      console.log(`[Sneakers Category] Found ${sneakersDbProducts.length} products from products table`);
      console.log(`[Sneakers Category] Found ${sneakersDbImageProducts.length} products from images table`);
      if (sneakersDbProducts.length > 0) {
        console.log(`[Sneakers Category] Sample product: "${sneakersDbProducts[0].name}" (category: ${sneakersDbProducts[0].category})`);
      }
      
      // Get filesystem products (fallback - auto-generated names/prices)
      const airforceFsProducts = getAirforceImageProducts();
      const jordanFsProducts = getJordanImageProducts();
      const airmaxFsProducts = getAirmaxImageProducts();
      const newbalanceFsProducts = getNewBalanceImageProducts();
      const sneakersFsProducts = getSneakersImageProducts();
      
      // Combine all products - database products take priority (keep uploaded names/descriptions/prices)
      const allSneakersDb = [
        ...sneakersDbProducts,
        ...sneakersDbImageProducts,
        ...airforceDbProducts,
        ...airforceDbImageProducts,
        ...jordanDbProducts,
        ...jordanDbImageProducts,
        ...airmaxDbProducts,
        ...airmaxDbImageProducts,
      ];
      const allSneakersFs = [
        ...airforceFsProducts,
        ...jordanFsProducts,
        ...airmaxFsProducts,
        ...newbalanceFsProducts,
        ...sneakersFsProducts,
      ];
      
      const mergedProducts = mergeProductsWithDbPriority(allSneakersDb, allSneakersFs);
      
      // Filter to only include products from these categories with valid images
      const fs = await import('fs');
      const path = await import('path');
      products = mergedProducts.filter(p => {
        if (!p || !p.image || !p.id || !p.name || !p.price) return false;
        if (p.image === 'null' || p.image.trim() === '') return false;
        
        // Validate image - allow CDN URLs even if local file doesn't exist
        if (p.image.startsWith('/images/')) {
          // Try both lowercase and capitalized paths for case sensitivity
          try {
            const imagePath = path.join(process.cwd(), 'public', p.image);
            const imagePathAlt = imagePath.replace(/\/images\/([^/]+)/, (match, folder) => {
              const capitalized = folder.charAt(0).toUpperCase() + folder.slice(1).toLowerCase();
              return `/images/${capitalized}`;
            });
            // Allow if either path exists, or allow for CDN fallback
            if (!fs.existsSync(imagePath) && !fs.existsSync(imagePathAlt)) {
              // Don't filter out - might be on DigitalOcean Spaces CDN
              console.warn(`Local image not found: ${p.image}, allowing for CDN fallback`);
            }
          } catch {
            // Allow on error - might be CDN URL
          }
        } else if (p.image.startsWith('http://') || p.image.startsWith('https://')) {
          // Validate URL format for external images (DigitalOcean Spaces, etc.)
          try {
            new URL(p.image);
            // Allow all valid URLs
          } catch {
            return false;
          }
        } else {
          return false;
        }
        
        const nameLower = (p.name || '').toLowerCase();
        const imageLower = (p.image || '').toLowerCase();
        const categoryLower = (p.category || '').toLowerCase();
        
        // PRIORITY: Include products with category='sneakers' (directly uploaded via admin)
        if (categoryLower === 'sneakers') {
          return true;
        }
        
        // Include Converse products
        if (nameLower.includes('converse') || imageLower.includes('converse')) {
          return true;
        }
        
        // Include all airforce, jordan, airmax, newbalance products (legacy filesystem)
        // Also check Supabase URLs for sneakers category
        return imageLower.includes('/images/airforce/') ||
               imageLower.includes('/images/jordan/') ||
               imageLower.includes('/images/airmax/') ||
               imageLower.includes('/images/newbalance/') ||
               imageLower.includes('/images/sneakers/') ||
               imageLower.includes('/images/Sneakers/') ||
               (imageLower.includes('supabase.co') && imageLower.includes('sneakers')) ||
               (imageLower.includes('supabase.in') && imageLower.includes('sneakers'));
      });
    } else if (categorySlug === 'sports') {
      // Get database products first (priority - keep uploaded names/descriptions/prices)
      const sportsDbProducts = await getDbProducts('sports');
      const sportsDbImageProducts = await getDbImageProducts('sports');
      
      // Log for debugging
      console.log(`[Sports Category] Found ${sportsDbProducts.length} products from products table`);
      console.log(`[Sports Category] Found ${sportsDbImageProducts.length} products from images table`);
      if (sportsDbProducts.length > 0) {
        console.log(`[Sports Category] Sample product: "${sportsDbProducts[0].name}" (category: ${sportsDbProducts[0].category})`);
      }
      
      // Get all products from sports folder
      const sportsFsProducts = getSportsImageProducts().filter(p => 
        p.image && (p.image.startsWith('/images/sports/') || p.image.startsWith('/images/Sports/'))
      );
      
      // STRICT: Only include products from sports category
      // Combine sports database products with filesystem products (database priority)
      const mergedSports = mergeProductsWithDbPriority(
        [...sportsDbProducts, ...sportsDbImageProducts],
        sportsFsProducts
      );
      
      // Filter to ensure all products are from sports category
      const fs = await import('fs');
      const path = await import('path');
      const seen = new Set<string>();
      products = mergedSports.filter(p => {
        if (!p || !p.image || !p.id || !p.name || !p.price) return false;
        if (p.image === 'null' || p.image.trim() === '') return false;
        if (seen.has(p.image)) return false;
        seen.add(p.image);
        
        // Validate image - allow CDN URLs even if local file doesn't exist
        if (p.image.startsWith('/images/')) {
          // Try both lowercase and capitalized paths for case sensitivity
          try {
            const imagePath = path.join(process.cwd(), 'public', p.image);
            const imagePathAlt = imagePath.replace(/\/images\/([^/]+)/, (match, folder) => {
              const capitalized = folder.charAt(0).toUpperCase() + folder.slice(1).toLowerCase();
              return `/images/${capitalized}`;
            });
            // Allow if either path exists, or allow for CDN fallback
            if (!fs.existsSync(imagePath) && !fs.existsSync(imagePathAlt)) {
              // Don't filter out - might be on DigitalOcean Spaces CDN
              console.warn(`Local image not found: ${p.image}, allowing for CDN fallback`);
            }
          } catch {
            // Allow on error - might be CDN URL
          }
        } else if (p.image.startsWith('http://') || p.image.startsWith('https://')) {
          // Validate URL format for external images (DigitalOcean Spaces, etc.)
          try {
            new URL(p.image);
            // Allow all valid URLs
          } catch {
            return false;
          }
        } else {
          return false;
        }
        
        const categoryLower = (p.category || '').toLowerCase();
        const imageLower = (p.image || '').toLowerCase();
        
        // STRICT: Only include sports category products
        return categoryLower === 'sports' ||
               imageLower.includes('/images/sports/') || 
               imageLower.includes('/images/Sports/') ||
               (imageLower.includes('supabase.co') && imageLower.includes('/sports/'));
      });
    } else if (categorySlug === 'nike' || categorySlug === 'mens-nike') {
      // Get all products and filter by name containing "nike"
      const allProductsList = await getAllProducts();
      // Also get from nike category (admin uploads use 'nike')
      const nikeDbProducts = await getDbProducts('nike');
      const nikeDbImageProducts = await getDbImageProducts('nike');
      
      // Log for debugging
      console.log(`[Nike Category] Found ${nikeDbProducts.length} products from products table`);
      console.log(`[Nike Category] Found ${nikeDbImageProducts.length} products from images table`);
      if (nikeDbProducts.length > 0) {
        console.log(`[Nike Category] Sample product: "${nikeDbProducts[0].name}" (category: ${nikeDbProducts[0].category})`);
      }
      // Also get from sneakers, airforce, airmax categories (legacy)
      const sneakersDbProducts = await getDbProducts('sneakers');
      const sneakersDbImageProducts = await getDbImageProducts('sneakers');
      const sneakersFsProducts = getSneakersImageProducts();
      const airforceDbProducts = await getDbProducts('airforce');
      const airforceDbImageProducts = await getDbImageProducts('airforce');
      const airmaxDbProducts = await getDbProducts('airmax');
      const airmaxDbImageProducts = await getDbImageProducts('airmax');
      const nikeFsProducts = getNikeImageProducts();
      
      // Combine all Nike-related products - database products take priority
      // Prioritize nike category products first
      const allNikeDb = [
        ...nikeDbProducts,
        ...nikeDbImageProducts,
        ...sneakersDbProducts,
        ...sneakersDbImageProducts,
        ...airforceDbProducts,
        ...airforceDbImageProducts,
        ...airmaxDbProducts,
        ...airmaxDbImageProducts,
      ];
      const allNikeFs = [
        ...sneakersFsProducts,
        ...nikeFsProducts,
      ];
      const mergedNike = mergeProductsWithDbPriority(allNikeDb, allNikeFs);
      
      // Combine with allProductsList (which already has database priority)
      const allNikeProducts = [...allProductsList, ...mergedNike];
      
      // Remove duplicates by image URL - database products already prioritized
      const seen = new Set<string>();
      products = allNikeProducts.filter(p => {
        if (!p || !p.image) return false;
        if (seen.has(p.image)) return false;
        seen.add(p.image);
        
        const nameLower = (p.name || '').toLowerCase();
        const imageLower = (p.image || '').toLowerCase();
        const descLower = (p.description || '').toLowerCase();
        
        // STRICT: Exclude non-Nike products
        // Exclude New Balance
        if (nameLower.includes('new balance') || nameLower.includes('newbalance') || 
            nameLower.includes('nb ') || nameLower.includes(' nb') ||
            descLower.includes('new balance') || descLower.includes('newbalance') ||
            imageLower.includes('newbalance') || imageLower.includes('new-balance')) {
          return false;
        }
        
        // Exclude Adidas/Addidas
        if (nameLower.includes('adidas') || nameLower.includes('addidas') ||
            descLower.includes('adidas') || descLower.includes('addidas') ||
            imageLower.includes('adidas') || imageLower.includes('addidas')) {
          return false;
        }
        
        // Exclude Converse
        if (nameLower.includes('converse') || descLower.includes('converse') || imageLower.includes('converse')) {
          return false;
        }
        
        // Exclude Puma
        if (nameLower.includes('puma') || descLower.includes('puma') || imageLower.includes('puma')) {
          return false;
        }
        
        // Exclude Valentino
        if (nameLower.includes('valentino') || descLower.includes('valentino') || imageLower.includes('valentino')) {
          return false;
        }
        
        // Exclude Dior products (migrate to mens-style)
        if (nameLower.includes('dior') || imageLower.includes('dior')) {
          return false;
        }
        
        // STRICT: Only include products with "nike" in name, description, or from Nike folder
        // Check if image is from Nike folder (capitalized or lowercase)
        const isFromNikeFolder = imageLower.includes('/images/nike/') || imageLower.includes('/images/nike/');
        
        // Must have "nike" in name OR description OR be from Nike folder OR category is 'nike'
        const hasNikeInName = nameLower.includes('nike');
        const hasNikeInDesc = descLower.includes('nike');
        const isNikeCategory = p.category === 'nike';
        const isFromNikeFolderStrict = isFromNikeFolder;
        
        // Allow airforce/airmax categories ONLY if they explicitly have "nike" in name
        const isAirforceAirmax = (p.category === 'airforce' || p.category === 'airmax') && hasNikeInName;
        
        // DO NOT include general 'sneakers' category products - they might be New Balance, Adidas, etc.
        // Only include if explicitly from Nike folder or has Nike in name
        if (p.category === 'sneakers' && !hasNikeInName && !isFromNikeFolderStrict) {
          return false;
        }
        
        // Final check: Must have Nike in name/desc OR be from Nike folder OR be Nike category OR be airforce/airmax with Nike
        return hasNikeInName || hasNikeInDesc || isNikeCategory || isFromNikeFolderStrict || isAirforceAirmax;
      });
    }
 else if (categorySlug === 'loafers' || categorySlug === 'mens-loafers') {
      // Get database products first (priority - keep uploaded names/descriptions/prices)
      // Use 'loafers' for database queries (admin uploads use 'loafers')
      const dbProducts = await getDbProducts('loafers');
      const dbImageProducts = await getDbImageProducts('loafers');
      
      // Log for debugging
      console.log(`[Loafers Category] Found ${dbProducts.length} products from products table`);
      console.log(`[Loafers Category] Found ${dbImageProducts.length} products from images table`);
      if (dbProducts.length > 0) {
        console.log(`[Loafers Category] Sample product: "${dbProducts[0].name}" (category: ${dbProducts[0].category})`);
      }
      
      // Get products directly from loafers folder
      const fsProducts = getLoafersImageProducts().filter(p => 
        p.image && p.image.startsWith('/images/loafers/')
      );
      
      // Combine - database products take priority
      products = mergeProductsWithDbPriority(
        [...dbProducts, ...dbImageProducts],
        fsProducts
      );
    } else if (categorySlug === 'sandals') {
      // Get database products first (priority - keep uploaded names/descriptions/prices)
      const dbProducts = await getDbProducts('sandals');
      const dbImageProducts = await getDbImageProducts('sandals');

      // Log for debugging
      console.log(`[Sandals Category] Found ${dbProducts.length} products from products table`);
      console.log(`[Sandals Category] Found ${dbImageProducts.length} products from images table`);
      if (dbProducts.length > 0) {
        console.log(`[Sandals Category] Sample product: "${dbProducts[0].name}" (category: ${dbProducts[0].category})`);
      }

      // Get products directly from sandals folder (using casual images as fallback)
      const fsProducts = getCasualImageProducts().filter(p =>
        p.image && p.image.startsWith('/images/sandals/')
      );

      // Combine - database products take priority
      products = mergeProductsWithDbPriority(
        [...dbProducts, ...dbImageProducts],
        fsProducts
      );
    } else if (categorySlug === 'vans') {
      // Get database products first (priority - keep uploaded names/descriptions/prices)
      const dbProducts = await getDbProducts('vans');
      const dbImageProducts = await getDbImageProducts('vans');
      
      // Log for debugging
      console.log(`[Vans Category] Found ${dbProducts.length} products from products table`);
      console.log(`[Vans Category] Found ${dbImageProducts.length} products from images table`);
      if (dbProducts.length > 0) {
        console.log(`[Vans Category] Sample product: "${dbProducts[0].name}" (category: ${dbProducts[0].category})`);
      }
      
      // Get products directly from vans folder
      const fsProducts = getVansImageProducts().filter(p => 
        p.image && p.image.startsWith('/images/vans/')
      );
      
      // Combine - database products take priority
      products = mergeProductsWithDbPriority(
        [...dbProducts, ...dbImageProducts],
        fsProducts
      );
    } else {
      // Legacy categories - keep existing logic with database priority
      if (categorySlug === 'casuals') {
        const dbProducts = await getDbProducts('casuals');
        const dbImageProducts = await getDbImageProducts('casuals');
        const fsProducts = getCasualImageProducts();
        products = mergeProductsWithDbPriority(
          [...dbProducts, ...dbImageProducts],
          fsProducts
        );
        if (products.length === 0) {
          products = getProductsByCategory(categorySlug);
        }
      } else {
        // For other legacy categories, try to get database products first
        try {
          const dbProducts = await getDbProducts(categorySlug);
          const dbImageProducts = await getDbImageProducts(categorySlug);
          const staticProducts = getProductsByCategory(categorySlug);
          products = mergeProductsWithDbPriority(
            [...dbProducts, ...dbImageProducts],
            staticProducts
          );
        } catch {
          products = getProductsByCategory(categorySlug);
        }
      }
    }

    // Get random products from all categories for the carousel
    const randomProducts = await getRandomProductsFromAllCategories(30);
    
    // Get all products for search
    const allProducts = await getAllProducts();
    
    // Filter out products with invalid or missing images
    const fs = await import('fs');
    const path = await import('path');
    products = products.filter(p => {
      if (!p || !p.id || !p.name || !p.image || !p.price) return false;
      if (p.image === 'null' || p.image.trim() === '') return false;
      
      // For local images, verify file exists (allow CDN fallback)
      if (p.image.startsWith('/images/')) {
        try {
          const imagePath = path.join(process.cwd(), 'public', p.image);
          const imagePathAlt = imagePath.replace(/\/images\/([^/]+)/, (match, folder) => {
            const capitalized = folder.charAt(0).toUpperCase() + folder.slice(1).toLowerCase();
            return `/images/${capitalized}`;
          });
          // Allow if either path exists, or allow for CDN fallback
          if (fs.existsSync(imagePath) || fs.existsSync(imagePathAlt)) {
            return true;
          }
          // Don't filter out - might be on DigitalOcean Spaces CDN
          return true; // Allow CDN URLs even if local file doesn't exist
        } catch {
          // Allow on error - might be CDN URL
          return true;
        }
      }
      
      // For external URLs, validate URL format
      if (p.image.startsWith('http://') || p.image.startsWith('https://')) {
        try {
          new URL(p.image);
          return true;
        } catch {
          return false;
        }
      }
      
      return false;
    });

    return {
      props: {
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
        },
        products,
        randomProducts,
        allProducts,
      },
      // Enable ISR: regenerate page at most once per 60 seconds
      // This ensures database updates show up on Nike and Sneakers pages
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
    };
  }
};

export default CategoryPage;

