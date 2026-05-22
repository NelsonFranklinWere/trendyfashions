import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import FastLink from '@/components/FastLink';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import {
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
import RandomProductsCarousel from '@/components/RandomProductsCarousel';
import { filterProductsByNavQuery } from '@/lib/filters/navQueryFilter';
import {
  siteConfig,
  getCategoryKeywords,
  getCategorySeoTitle,
  getCategorySeoDescription,
  getCategoryPageH1,
  getCategoryPageSubheading,
} from '@/lib/seo/config';

interface CategoryPageProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
  products: Product[];
  randomProducts: Product[];
  allProducts: Pick<Product, 'id' | 'name' | 'image' | 'category' | 'price'>[];
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

  const queryFilteredProducts = useMemo(() => {
    if (!filter || !Array.isArray(safeProducts)) {
      return safeProducts;
    }
    return filterProductsByNavQuery(safeProducts, filter.toString());
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
  const priceValidUntil = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  }, []);

  // Show all products in category - no filtering applied
  const filteredProducts = useMemo(() => {
    try {
      if (!safeProducts || !Array.isArray(safeProducts)) {
        return [];
      }
      // Return all products without any filtering
      return safeProducts;
    } catch (error) {
      // Silently fail in development to prevent Fast Refresh reloads
      if (process.env.NODE_ENV === 'production') {
        console.error('Error loading products:', error);
      }
      return safeProducts; // Return all products as fallback
    }
  }, [safeProducts]);
  const schemaProducts = useMemo(() => {
    if (safeProducts.length > 0) return safeProducts.slice(0, 10);
    const fallback = safeAllProducts
      .filter((product) => product?.category === safeCategory.slug)
      .slice(0, 10);
    if (fallback.length > 0) return fallback;
    return [
      {
        id: `${safeCategory.slug}-featured`,
        name: `${safeCategory.name} Collection`,
        description: safeCategory.description,
        image: '/logo/Logo.jpg',
        price: 3200,
        category: safeCategory.slug,
      } as Product,
    ];
  }, [safeProducts, safeAllProducts, safeCategory.slug]);

  // Safety check - ensure we have valid data
  if (!safeCategory || !safeCategory.name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text">Category not found</p>
      </div>
    );
  }

  const lcpPreloadImages = queryFilteredProducts
    .slice(0, 12)
    .map((p) => p.image)
    .filter((src): src is string => typeof src === 'string' && src.startsWith('http'));

  return (
    <>
      <Head>
        {lcpPreloadImages.map((src) => (
          <link key={src} rel="preload" as="image" href={src} fetchPriority="high" />
        ))}
      </Head>
      <NextSeo
        title={getCategorySeoTitle(safeCategory.slug, safeCategory.name)}
        description={getCategorySeoDescription(safeCategory.slug, safeCategory.name, safeCategory.description)}
        canonical={`https://trendyfashionzone.co.ke/collections/${safeCategory.slug}`}
        openGraph={{
          url: `https://trendyfashionzone.co.ke/collections/${safeCategory.slug}`,
          title: getCategorySeoTitle(safeCategory.slug, safeCategory.name),
          description: getCategorySeoDescription(safeCategory.slug, safeCategory.name, safeCategory.description).slice(0, 200),
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
            name: `${safeCategory.name} Collection - Best Sellers Nairobi`,
            description: getCategorySeoDescription(safeCategory.slug, safeCategory.name, safeCategory.description),
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
              numberOfItems: schemaProducts.length,
              itemListElement: schemaProducts.map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Product',
                  name: product.name,
                  description: product.description,
                  image: product.image.startsWith('http') ? product.image : `${siteConfig.url}${product.image}`,
                  sku: product.id,
                  category: safeCategory.name,
                  brand: {
                    '@type': 'Brand',
                    name: 'Trendy Fashion Zone',
                  },
                  offers: {
                    '@type': 'Offer',
                    price: product.price.toString(),
                    priceCurrency: 'KES',
                    availability: 'https://schema.org/InStock',
                    url: `${siteConfig.url}/collections/${safeCategory.slug}`,
                    itemCondition: 'https://schema.org/NewCondition',
                    priceValidUntil,
                    seller: {
                      '@type': 'Organization',
                      name: siteConfig.name,
                      url: siteConfig.url,
                    },
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
            <FastLink
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
            </FastLink>
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
                  {getCategoryPageH1(safeCategory.slug, safeCategory.name)}
                </h1>
                <p className="text-base md:text-lg text-text font-body max-w-3xl leading-relaxed">
                  {getCategoryPageSubheading(safeCategory.slug, safeCategory.name)}
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
                            <FastLink
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
                            </FastLink>
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

          {filter && (
            <p className="mb-6 text-sm text-text font-body">
              Showing results for:{' '}
              <span className="font-semibold text-primary">{filter.toString()}</span>
              {' · '}
              <FastLink href={`/collections/${safeCategory.slug}`} className="text-secondary hover:underline">
                View all in {safeCategory.name}
              </FastLink>
            </p>
          )}

          {/* Products Grid */}
          {queryFilteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
              {queryFilteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 8}
                  className="animate-fade-in"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text font-body text-lg">
                {filter
                  ? `No products match "${filter.toString()}" in ${safeCategory.name}.`
                  : `No products found in this category.`}
              </p>
              {filter && (
                <FastLink
                  href={`/collections/${safeCategory.slug}`}
                  className="inline-block mt-4 text-secondary font-semibold hover:underline"
                >
                  View all {safeCategory.name}
                </FastLink>
              )}
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
    const { STATIC_REVALIDATE_SECONDS } = await import('@/lib/server/staticConfig');
    const { resolveCollectionSlug } = await import('@/lib/routes/collectionLinks');
    const rawSlug = params?.category as string;
    const categorySlug = resolveCollectionSlug(rawSlug);
    const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

    if (!category || !categorySlug) {
      return { notFound: true };
    }

    const { loadCategoryPageProps } = await import('@/lib/server/getCategoryStaticProps');
    const { products, randomProducts, allProducts } = await loadCategoryPageProps(categorySlug);

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
      revalidate: STATIC_REVALIDATE_SECONDS,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Error in getStaticProps:', error);
    }
    return { notFound: true };
  }
};


export default CategoryPage;

