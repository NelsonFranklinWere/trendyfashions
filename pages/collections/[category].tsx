import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import CategoryFilter, { FilterType } from '@/components/CategoryFilter';
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
import { getMensstyleImageProducts } from '@/lib/server/mensstyleImageProducts';
import { getNikeImageProducts } from '@/lib/server/nikeImageProducts';
import { getSportsImageProducts } from '@/lib/server/sportsImageProducts';
import { getRandomProductsFromAllCategories } from '@/lib/server/getRandomProductsFromAllCategories';
import RandomProductsCarousel from '@/components/RandomProductsCarousel';
import { siteConfig, getCategoryKeywords, getCategoryTitle, getCategoryDescription } from '@/lib/seo/config';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Safety checks - use default values instead of early return
  const safeCategory = category || { slug: '', name: '', description: '' };
  const safeProducts = products || [];
  const safeAllProducts = allProducts || [];

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
  
  const [activeFilter, setActiveFilter] = useState<FilterType>(() => {
    try {
      if (isOfficials) return DEFAULT_OFFICIAL_FILTER as FilterType;
      if (isSneakers) return DEFAULT_SNEAKER_FILTER as FilterType;
      if (isCasuals) return DEFAULT_CASUAL_FILTER as FilterType;
      if (isVans) return DEFAULT_VANS_FILTER as FilterType;
      if (isJordan) return DEFAULT_JORDAN_FILTER as FilterType;
      if (isAirmax) return DEFAULT_AIRMAX_FILTER as FilterType;
      return 'All';
    } catch (error) {
      console.error('Error setting initial filter:', error);
      return 'All';
    }
  });

  // Get available filters based on products
  const availableFilters: FilterType[] = useMemo(() => {
    try {
      if (!safeProducts || !Array.isArray(safeProducts)) {
        return ['All'] as FilterType[];
      }

      // Only show gender and tags filters, no subcategory filters
      const filters: FilterType[] = ['All'];
      const hasMen = safeProducts.some((p) => p.gender === 'Men');
      const hasNewArrivals = safeProducts.some((p) =>
        p.tags?.includes('New Arrivals')
      );

      if (hasMen) filters.push('Men');
      if (hasNewArrivals) filters.push('New Arrivals');

      return filters;
    } catch (error) {
      console.error('Error computing available filters:', error);
      return ['All'] as FilterType[]; // Return default filter as fallback
    }
  }, [safeProducts]);

  useEffect(() => {
    if (!availableFilters.includes(activeFilter)) {
      setActiveFilter(availableFilters[0] ?? 'All');
    }
  }, [availableFilters, activeFilter]);

  // Show all products in category without subcategory filtering
  const filteredProducts = useMemo(() => {
    try {
      if (!safeProducts || !Array.isArray(safeProducts)) {
        return [];
      }

      // For mens-officials, show all products without any filtering
      if (isMensOfficials) {
        return safeProducts;
      }

      // Show all products in the category, only filter by gender/tags if needed
      let products = safeProducts;

      // Apply gender filter if active
      if (activeFilter === 'Men') {
        products = products.filter((p) => p.gender === 'Men');
      }

      // Apply New Arrivals filter if active
      if (activeFilter === 'New Arrivals') {
        products = products.filter((p) => p.tags?.includes('New Arrivals'));
      }

      return products;
    } catch (error) {
      console.error('Error filtering products:', error);
      return safeProducts; // Return all products as fallback
    }
  }, [safeProducts, activeFilter, isMensOfficials]);

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
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-2">
                  Best Sellers: {safeCategory.name} Collection
                </h1>
                <p className="text-lg md:text-xl text-text font-body max-w-3xl font-medium">
                  Quality original {safeCategory.name.toLowerCase()} shoes - {safeCategory.description}
                </p>
              </div>
              
              {/* Search Bar - Top Right */}
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

          {/* Filters - Hide for mens-officials */}
          {!isMensOfficials && isOfficials && availableFilters.length > 0 && (
            <CategoryFilter
              filters={availableFilters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          )}
          {!isMensOfficials && !isOfficials && availableFilters.length > 1 && (
            <CategoryFilter
              filters={availableFilters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
              {filteredProducts.map((product, index) => (
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
    if (categorySlug === 'mens-officials') {
      // Get ALL officials products from database (Boots, Empire, Mules, Casuals, Clarks, etc.)
      // No subcategory filtering - all official shoes display together
      const dbProducts = await getDbProducts('officials');
      const dbImageProducts = await getDbImageProducts('officials');
      const autoProducts = await getOfficialImageProducts();
      
      // Combine all sources - database products take priority (keep uploaded names/descriptions/prices)
      products = mergeProductsWithDbPriority(
        [...dbProducts, ...dbImageProducts],
        autoProducts
      );
      
      // Final fallback to static products if database is empty
      if (products.length === 0) {
        products = getProductsByCategory('officials');
      }
    } else if (categorySlug === 'mens-casuals') {
      // Get all casuals products: Lacoste, Timberland, Boss, casuals images, and Puma shoes
      const casualsDbProducts = await getDbProducts('casuals');
      const casualsDbImageProducts = await getDbImageProducts('casuals');
      const casualsFsProducts = getCasualImageProducts();
      
      // Get Timberland products
      const timberlandProducts = getTimberlandImageProducts();
      
      // Get Timberland products from Mensstyle folder
      const mensstyleProducts = getMensstyleImageProducts();
      const timberlandFromMensstyle = mensstyleProducts.filter(p => {
        if (!p || !p.image) return false;
        const nameLower = (p.name || '').toLowerCase();
        return nameLower.includes('timberland') || nameLower.includes('timba');
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
        [...casualsFsProducts, ...timberlandProducts, ...timberlandFromMensstyle, ...pumaProducts]
      );
      
      // Filter to include only: Lacoste, Timberland, Boss, casuals, and Puma
      const seen = new Set<string>();
      products = allCasuals.filter(p => {
        if (!p || !p.image) return false;
        if (seen.has(p.image)) return false;
        seen.add(p.image);
        
        const nameLower = (p.name || '').toLowerCase();
        const categoryLower = (p.category || '').toLowerCase();
        
        // Include Lacoste products
        if (nameLower.includes('lacoste')) {
          return true;
        }
        
        // Include Timberland products
        if (nameLower.includes('timberland') || nameLower.includes('timba') || categoryLower === 'timberland') {
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
      });
      
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
        
        // Validate image exists for local images
        if (p.image.startsWith('/images/')) {
          try {
            const imagePath = path.join(process.cwd(), 'public', p.image);
            if (!fs.existsSync(imagePath)) {
              return false;
            }
          } catch {
            return false;
          }
        } else if (p.image.startsWith('http://') || p.image.startsWith('https://')) {
          // Validate URL format for external images
          try {
            new URL(p.image);
          } catch {
            return false;
          }
        } else {
          return false;
        }
        
        const nameLower = (p.name || '').toLowerCase();
        const imageLower = (p.image || '').toLowerCase();
        
        // Include Converse products
        if (nameLower.includes('converse') || imageLower.includes('converse')) {
          return true;
        }
        
        // Include all airforce, jordan, airmax, newbalance products
        return imageLower.includes('/images/airforce/') ||
               imageLower.includes('/images/jordan/') ||
               imageLower.includes('/images/airmax/') ||
               imageLower.includes('/images/newbalance/') ||
               imageLower.includes('/images/sneakers/') ||
               imageLower.includes('/images/Sneakers/');
      });
    } else if (categorySlug === 'sports') {
      // Get all products from sports folder
      const sportsFsProducts = getSportsImageProducts().filter(p => 
        p.image && (p.image.startsWith('/images/sports/') || p.image.startsWith('/images/Sports/'))
      );
      
      // Get all products from other sources to filter for football boots, trainers, and Nike Zoom
      const allProductsList = await getAllProducts();
      const sneakersDbProducts = await getDbProducts('sneakers');
      const sneakersDbImageProducts = await getDbImageProducts('sneakers');
      const sneakersFsProducts = getSneakersImageProducts();
      
      // Combine all products - database products take priority
      const allSneakersDb = [...sneakersDbProducts, ...sneakersDbImageProducts];
      const allSneakersFs = [...sneakersFsProducts];
      const mergedSneakers = mergeProductsWithDbPriority(allSneakersDb, allSneakersFs);
      
      // Combine with allProductsList (which already has database priority)
      const allProducts = [...allProductsList, ...mergedSneakers];
      
      // Filter for football boots, trainers, and Nike Zoom
      const fs = await import('fs');
      const path = await import('path');
      const seen = new Set<string>();
      const filteredProducts = allProducts.filter(p => {
        if (!p || !p.image || !p.id || !p.name || !p.price) return false;
        if (p.image === 'null' || p.image.trim() === '') return false;
        if (seen.has(p.image)) return false;
        seen.add(p.image);
        
        // Validate image exists for local images
        if (p.image.startsWith('/images/')) {
          try {
            const imagePath = path.join(process.cwd(), 'public', p.image);
            if (!fs.existsSync(imagePath)) {
              return false;
            }
          } catch {
            return false;
          }
        } else if (p.image.startsWith('http://') || p.image.startsWith('https://')) {
          // Validate URL format for external images
          try {
            new URL(p.image);
          } catch {
            return false;
          }
        } else {
          return false;
        }
        
        const nameLower = (p.name || '').toLowerCase();
        const descLower = (p.description || '').toLowerCase();
        const imageLower = (p.image || '').toLowerCase();
        
        // Include football boots
        if (nameLower.includes('football') || nameLower.includes('football boot') ||
            descLower.includes('football') || descLower.includes('football boot') ||
            imageLower.includes('football') || imageLower.includes('boot')) {
          return true;
        }
        
        // Include trainers
        if (nameLower.includes('trainer') || nameLower.includes('training') ||
            descLower.includes('trainer') || descLower.includes('training') ||
            imageLower.includes('trainer')) {
          return true;
        }
        
        // Include Nike Zoom
        if (nameLower.includes('nike zoom') || nameLower.includes('zoom') ||
            descLower.includes('nike zoom') || descLower.includes('zoom') ||
            imageLower.includes('zoom')) {
          return true;
        }
        
        return false;
      });
      
      // Combine sports folder products with filtered products, removing duplicates
      const allSportsProducts = [...sportsFsProducts, ...filteredProducts];
      const finalSeen = new Set<string>();
      products = allSportsProducts.filter(p => {
        if (!p || !p.image) return false;
        if (finalSeen.has(p.image)) return false;
        finalSeen.add(p.image);
        
        // Exclude official boots
        const nameLower = (p.name || '').toLowerCase();
        const descLower = (p.description || '').toLowerCase();
        if (nameLower.includes('official boot') || descLower.includes('official boot')) {
          return false;
        }
        
        return true;
      });
      
      // Update prices for football boots and trainers
      products = products.map(p => {
        const nameLower = (p.name || '').toLowerCase();
        const isFootballBoot = nameLower.includes('football') || nameLower.includes('boot') || 
                              (p.image || '').toLowerCase().includes('football') ||
                              (p.image || '').toLowerCase().includes('boot');
        const isTrainer = nameLower.includes('trainer') || nameLower.includes('tainer') ||
                         (p.image || '').toLowerCase().includes('trainer');
        
        if (isFootballBoot && !nameLower.includes('f50')) {
          return { ...p, price: 5500 };
        }
        if (isTrainer) {
          return { ...p, price: 2500 };
        }
        return p;
      });
    } else if (categorySlug === 'mens-nike') {
      // Get all products and filter by name containing "nike"
      const allProductsList = await getAllProducts();
      // Also get from sneakers, airforce, airmax categories
      const sneakersDbProducts = await getDbProducts('sneakers');
      const sneakersDbImageProducts = await getDbImageProducts('sneakers');
      const sneakersFsProducts = getSneakersImageProducts();
      const airforceDbProducts = await getDbProducts('airforce');
      const airforceDbImageProducts = await getDbImageProducts('airforce');
      const airmaxDbProducts = await getDbProducts('airmax');
      const airmaxDbImageProducts = await getDbImageProducts('airmax');
      const nikeFsProducts = getNikeImageProducts();
      
      // Combine all Nike-related products - database products take priority
      const allNikeDb = [
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
        
        // Exclude Dior products (migrate to mens-style)
        const nameLower = (p.name || '').toLowerCase();
        const imageLower = (p.image || '').toLowerCase();
        if (nameLower.includes('dior') || imageLower.includes('dior')) {
          return false;
        }
        
        const descLower = (p.description || '').toLowerCase();
        
        // Check if image is from Nike folder
        const isFromNikeFolder = imageLower.includes('/images/nike/');
        
        // Include all Nike products
        const isNike = nameLower.includes('nike') || 
                       descLower.includes('nike') ||
                       p.category === 'airforce' || 
                       p.category === 'airmax' ||
                       p.category === 'sneakers' ||
                       isFromNikeFolder;
        
        // Specifically include Nike SB, Nike S, Nike Shox, and Nike Ultra products
        const isNikeSB = nameLower.includes('nike sb') || 
                        nameLower.includes('nikesb') ||
                        nameLower.includes('sb dunk') ||
                        (nameLower.includes('sb') && nameLower.includes('nike')) ||
                        (nameLower.includes('dunk') && !nameLower.includes('shox')) ||
                        (imageLower.includes('sb') && imageLower.includes('nike'));
        
        const isNikeS = (nameLower.includes('nike s') && !nameLower.includes('sb') && !nameLower.includes('shox') && !nameLower.includes('zoom') && !nameLower.includes('tn') && !nameLower.includes('cortex') && !nameLower.includes('ultra')) ||
                        nameLower.includes('nike--s') ||
                        (nameLower.includes('nike') && nameLower.includes('s.')) ||
                        (imageLower.includes('nike') && imageLower.includes('s.'));
        
        const isNikeShox = nameLower.includes('nike shox') || 
                          nameLower.includes('shox') ||
                          imageLower.includes('shox');
        
        const isNikeUltra = nameLower.includes('nike ultra') || 
                           (nameLower.includes('ultra') && nameLower.includes('nike')) ||
                           (imageLower.includes('ultra') && imageLower.includes('nike'));
        
        return isNike || isNikeSB || isNikeS || isNikeShox || isNikeUltra;
      });
    } else if (categorySlug === 'mens-style') {
      // Get database products first (priority - keep uploaded names/descriptions/prices)
      const dbProducts = await getDbProducts('mens-style');
      const dbImageProducts = await getDbImageProducts('mens-style');
      
      // Get products from mensstyle folder
      const mensstyleProducts = getMensstyleImageProducts().filter(p => 
        p.image && (p.image.startsWith('/images/Mensstyle/') || p.image.startsWith('/images/mensstyle/'))
      );
      
      // Get Dior products from Nike folder
      const nikeProducts = getNikeImageProducts();
      const diorProducts = nikeProducts.filter(p => {
        if (!p || !p.image) return false;
        const nameLower = (p.name || '').toLowerCase();
        const imageLower = (p.image || '').toLowerCase();
        return nameLower.includes('dior') || imageLower.includes('dior');
      });
      
      // Combine all - database products take priority
      products = mergeProductsWithDbPriority(
        [...dbProducts, ...dbImageProducts],
        [...mensstyleProducts, ...diorProducts]
      );
    } else if (categorySlug === 'mens-loafers') {
      // Get database products first (priority - keep uploaded names/descriptions/prices)
      const dbProducts = await getDbProducts('loafers');
      const dbImageProducts = await getDbImageProducts('loafers');
      
      // Get products directly from loafers folder
      const fsProducts = getLoafersImageProducts().filter(p => 
        p.image && p.image.startsWith('/images/loafers/')
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
      } else if (categorySlug === 'officials') {
        const dbProducts = await getDbProducts('officials');
        const dbImageProducts = await getDbImageProducts('officials');
        const autoProducts = await getOfficialImageProducts();
        products = mergeProductsWithDbPriority(
          [...dbProducts, ...dbImageProducts],
          autoProducts
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
      
      // For local images, verify file exists
      if (p.image.startsWith('/images/')) {
        try {
          const imagePath = path.join(process.cwd(), 'public', p.image);
          return fs.existsSync(imagePath);
        } catch {
          return false;
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
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
    };
  }
};

export default CategoryPage;

