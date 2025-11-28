import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import CategoryCard from '@/components/CategoryCard';
import { categories, Product } from '@/data/products';
import { getAllProducts } from '@/lib/server/getAllProducts';

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
        title="Explore Our Exclusive Shoe Collections | Trendy Fashion Zone"
        description="Discover styles that define comfort, confidence, and class. Browse our complete collection of sneakers, officials, casuals, Airforce, Airmax, and Jordans."
        canonical="https://trendyfashionzone.online/collections"
        openGraph={{
          url: 'https://trendyfashionzone.online/collections',
          title: 'Explore Our Exclusive Shoe Collections | Trendy Fashion Zone',
          description:
            'Discover styles that define comfort, confidence, and class. Browse our complete collection.',
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
              Explore Our Exclusive Shoe Collections
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-text font-body max-w-3xl mx-auto font-medium">
              Discover styles that define comfort, confidence, and class.
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
    const allProducts = getAllProducts();
    return {
      props: {
        allProducts,
      },
    };
  } catch (error) {
    console.error('Error loading products:', error);
    return {
      props: {
        allProducts: [],
      },
    };
  }
};

export default Collections;

