import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import CategoryCard from '@/components/CategoryCard';
import { categories, Product } from '@/data/products';
import { getAllProducts } from '@/lib/server/getAllProducts';
import { siteConfig, nairobiKeywords } from '@/lib/seo/config';

interface CollectionsProps {
  allProducts: Product[];
}

const Collections = ({ allProducts }: CollectionsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    return allProducts.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const descMatch = product.description?.toLowerCase().includes(query);
      return nameMatch || descMatch;
    });
  }, [searchQuery, allProducts]);

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

  return (
    <>
      <NextSeo
        title="Shoe Collections | Quality Original Shoes Nairobi | Trendy Fashion Zone"
        description="Browse all shoe collections in Nairobi. Nike Airforce, Jordan shoes, Airmax, Clarks officials, Vans, sneakers, casuals, loafers, sports shoes. Quality original shoes, authentic brands. Located on Moi Avenue. Free delivery."
        canonical={`${siteConfig.url}/collections`}
        openGraph={{
          url: `${siteConfig.url}/collections`,
          title: 'Shoe Collections | Quality Original Shoes Nairobi | Trendy Fashion Zone',
          description: 'Browse all shoe collections in Nairobi. Nike Airforce, Jordan shoes, Airmax, Clarks officials, Vans, sneakers, casuals, loafers, sports shoes. Located on Moi Avenue.',
          type: 'website',
          locale: 'en_KE',
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: siteConfig.social.twitter,
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: [
              ...nairobiKeywords.brands.slice(0, 6),
              ...nairobiKeywords.categories,
              ...nairobiKeywords.quality.slice(0, 3),
              'shoe collections Nairobi',
              'all shoe categories Nairobi',
            ].join(', '),
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
            '@id': `${siteConfig.url}/collections#webpage`,
            name: 'Shoe Collections - Quality Original Shoes Nairobi',
            description: 'Browse all shoe collections in Nairobi. Nike Airforce, Jordan shoes, Airmax, Clarks officials, Vans, sneakers, casuals, loafers, sports shoes. Quality original shoes, authentic brands.',
            url: `${siteConfig.url}/collections`,
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
              ],
            },
            mainEntity: {
              '@type': 'ItemList',
              name: 'Shoe Categories',
              numberOfItems: categories.length,
              itemListElement: categories.map((category, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'CollectionPage',
                  name: category.name,
                  url: `${siteConfig.url}/collections/${category.slug}`,
                  description: category.description,
                },
              })),
            },
          }),
        }}
      />

      <div className="bg-gradient-to-b from-light/30 to-white py-8 sm:py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar - Top */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12 md:mb-16"
          >
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for shoes, sneakers, brands..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-12 sm:pl-14 rounded-full text-primary font-body text-sm sm:text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-secondary shadow-lg"
                />
                <svg
                  className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-primary/60"
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
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50"
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
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl z-50 p-4"
                  >
                    <p className="text-center text-text text-sm">No products found matching &quot;{searchQuery}&quot;</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-3 sm:mb-4">
              Best Sellers & Quality Original Shoes Collections
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-text font-body max-w-3xl mx-auto font-medium">
              Browse best sellers and quality original shoes. Authentic brands, premium quality, trending footwear - trusted by thousands in Nairobi.
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<CollectionsProps> = async () => {
  try {
    const allProducts = await getAllProducts();
    return {
      props: {
        allProducts,
      },
    };
  } catch (error) {
    // Silently fail in development to prevent Fast Refresh reloads
    if (process.env.NODE_ENV === 'production') {
      console.error('Error loading products:', error);
    }
    return {
      props: {
        allProducts: [],
      },
      // Enable ISR even on error to allow recovery
    };
  }
};

export default Collections;

