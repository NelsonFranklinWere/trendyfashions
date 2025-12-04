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
import { getCustomizedImageProducts } from '@/lib/server/customizedImageProducts';
import { getRandomProductsFromAllCategories } from '@/lib/server/getRandomProductsFromAllCategories';
import RandomProductsCarousel from '@/components/RandomProductsCarousel';

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
  const isOfficials = category.slug === 'officials';
  const isSneakers = category.slug === 'sneakers';
  const isCasuals = category.slug === 'casuals';
  const isVans = category.slug === 'vans';
  const isJordan = category.slug === 'jordan';
  const isAirmax = category.slug === 'airmax';
  const [activeFilter, setActiveFilter] = useState<FilterType>(
    isOfficials
      ? (DEFAULT_OFFICIAL_FILTER as FilterType)
      : isSneakers
        ? (DEFAULT_SNEAKER_FILTER as FilterType)
        : isCasuals
          ? (DEFAULT_CASUAL_FILTER as FilterType)
          : isVans
            ? (DEFAULT_VANS_FILTER as FilterType)
            : isJordan
              ? (DEFAULT_JORDAN_FILTER as FilterType)
              : isAirmax
                ? (DEFAULT_AIRMAX_FILTER as FilterType)
                : 'All'
  );

  // Get available filters based on products
  const availableFilters: FilterType[] = useMemo(() => {
    if (isOfficials) {
      const filters = OFFICIAL_SUBCATEGORY_FILTERS.filter(
        (filter) => filterOfficialsProducts(products, filter).length > 0
      ) as FilterType[];
      return filters.length > 0 ? filters : ([DEFAULT_OFFICIAL_FILTER] as FilterType[]);
    }

    if (isSneakers) {
      const filters = SNEAKER_SUBCATEGORY_FILTERS.filter((filter) =>
        hasSneakerMatches(products, filter)
      ) as FilterType[];
      return filters.length > 0 ? filters : ([DEFAULT_SNEAKER_FILTER] as FilterType[]);
    }

    if (isCasuals) {
      const filters = CASUAL_BRAND_FILTERS.filter((filter) =>
        hasCasualMatches(products, filter)
      ) as FilterType[];
      return filters.length > 0 ? filters : ([DEFAULT_CASUAL_FILTER] as FilterType[]);
    }

    if (isVans) {
      const filters = VANS_SUBCATEGORY_FILTERS.filter((filter) =>
        hasVansMatches(products, filter)
      ) as FilterType[];
      return filters.length > 0 ? filters : ([DEFAULT_VANS_FILTER] as FilterType[]);
    }

    if (isJordan) {
      const filters = JORDAN_SUBCATEGORY_FILTERS.filter((filter) =>
        hasJordanMatches(products, filter)
      ) as FilterType[];
      return filters.length > 0 ? filters : ([DEFAULT_JORDAN_FILTER] as FilterType[]);
    }

    if (isAirmax) {
      const filters = AIRMAX_SUBCATEGORY_FILTERS.filter((filter) =>
        hasAirmaxMatches(products, filter)
      ) as FilterType[];
      return filters.length > 0 ? filters : ([DEFAULT_AIRMAX_FILTER] as FilterType[]);
    }

    const filters: FilterType[] = ['All'];
    const hasMen = products.some((p) => p.gender === 'Men');
    const hasNewArrivals = products.some((p) =>
      p.tags?.includes('New Arrivals')
    );

    if (hasMen) filters.push('Men');
    if (hasNewArrivals) filters.push('New Arrivals');

    return filters;
  }, [products, isOfficials, isSneakers, isCasuals, isVans, isJordan, isAirmax]);

  useEffect(() => {
    if (!availableFilters.includes(activeFilter)) {
      const fallback = isOfficials
        ? (availableFilters[0] ?? (DEFAULT_OFFICIAL_FILTER as FilterType))
        : isSneakers
          ? (availableFilters[0] ?? (DEFAULT_SNEAKER_FILTER as FilterType))
          : isCasuals
            ? (availableFilters[0] ?? (DEFAULT_CASUAL_FILTER as FilterType))
            : isVans
              ? (availableFilters[0] ?? (DEFAULT_VANS_FILTER as FilterType))
              : isJordan
                ? (availableFilters[0] ?? (DEFAULT_JORDAN_FILTER as FilterType))
                : isAirmax
                  ? (availableFilters[0] ?? (DEFAULT_AIRMAX_FILTER as FilterType))
                  : 'All';
      setActiveFilter(fallback);
    }
  }, [availableFilters, activeFilter, isOfficials, isSneakers, isCasuals, isVans, isJordan, isAirmax]);

  // Filter products based on active filter
  const filteredProducts = useMemo(() => {
    if (isOfficials) {
      return filterOfficialsProducts(
        products,
        (activeFilter as OfficialFilter) ?? DEFAULT_OFFICIAL_FILTER
      );
    }

    if (isSneakers) {
      return filterSneakerProducts(
        products,
        (activeFilter as SneakerFilter) ?? DEFAULT_SNEAKER_FILTER
      );
    }

    if (isCasuals) {
      return filterCasualProducts(
        products,
        (activeFilter as CasualBrandFilter) ?? DEFAULT_CASUAL_FILTER
      );
    }

    if (isVans) {
      return filterVansProducts(
        products,
        (activeFilter as VansFilter) ?? DEFAULT_VANS_FILTER
      );
    }

    if (isJordan) {
      return filterJordanProducts(
        products,
        (activeFilter as JordanFilter) ?? DEFAULT_JORDAN_FILTER
      );
    }

    if (isAirmax) {
      return filterAirmaxProducts(
        products,
        (activeFilter as AirmaxFilter) ?? DEFAULT_AIRMAX_FILTER
      );
    }

    if (activeFilter === 'All') return products;
    if (activeFilter === 'Men') return products.filter((p) => p.gender === 'Men');
    if (activeFilter === 'New Arrivals')
      return products.filter((p) => p.tags?.includes('New Arrivals'));
    return products;
  }, [products, activeFilter, isOfficials, isSneakers, isCasuals, isVans, isJordan, isAirmax]);

  return (
    <>
      <NextSeo
        title={`Best Sellers: ${category.name} | Quality Original Shoes Nairobi | Trendy Fashion Zone`}
        description={`Shop best sellers and quality original ${category.name.toLowerCase()} shoes in Nairobi. ${category.description} Authentic brands, premium quality, trusted by thousands.`}
        canonical={`https://trendyfashionzone.co.ke/collections/${category.slug}`}
        openGraph={{
          url: `https://trendyfashionzone.co.ke/collections/${category.slug}`,
          title: `Best Sellers: ${category.name} | Quality Original Shoes Nairobi`,
          description: `Shop best sellers and quality original ${category.name.toLowerCase()} shoes. ${category.description}`,
          type: 'website',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: `best sellers ${category.name.toLowerCase()} Nairobi, quality original ${category.name.toLowerCase()} Kenya, authentic ${category.name.toLowerCase()} shoes, ${category.name.toLowerCase()} best sellers, trending ${category.name.toLowerCase()} footwear`,
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${category.name} Collection - Best Sellers`,
            description: `Best sellers and quality original ${category.name.toLowerCase()} shoes in Nairobi. ${category.description}`,
            url: `https://trendyfashionzone.co.ke/collections/${category.slug}`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trendyfashionzone.co.ke' },
                { '@type': 'ListItem', position: 2, name: 'Collections', item: 'https://trendyfashionzone.co.ke/collections' },
                { '@type': 'ListItem', position: 3, name: category.name, item: `https://trendyfashionzone.co.ke/collections/${category.slug}` },
              ],
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
                  Best Sellers: {category.name} Collection
                </h1>
                <p className="text-lg md:text-xl text-text font-body max-w-3xl font-medium">
                  Quality original {category.name.toLowerCase()} shoes - {category.description}
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

          {/* Filters */}
          {availableFilters.length > 1 && (
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

    if (categorySlug === 'casuals') {
      const autoProducts = getCasualImageProducts();
      products = autoProducts.length > 0 ? autoProducts : getProductsByCategory(categorySlug);
    } else if (categorySlug === 'officials') {
      // Load all images from formal folder for officials
      const autoProducts = getOfficialImageProducts();
      products = autoProducts.length > 0 ? autoProducts : getProductsByCategory(categorySlug);
    } else if (categorySlug === 'vans') {
      // Load all images from vans folder
      const autoProducts = getVansImageProducts();
      products = autoProducts.length > 0 ? autoProducts : getProductsByCategory(categorySlug);
    } else if (categorySlug === 'airmax') {
      // Load all images from airmax folder
      const autoProducts = getAirmaxImageProducts();
      products = autoProducts.length > 0 ? autoProducts : getProductsByCategory(categorySlug);
    } else if (categorySlug === 'airforce') {
      // Load all images from airforce folder
      const autoProducts = getAirforceImageProducts();
      products = autoProducts.length > 0 ? autoProducts : getProductsByCategory(categorySlug);
    } else if (categorySlug === 'jordan') {
      // Load all images from jordan folder
      const autoProducts = getJordanImageProducts();
      products = autoProducts.length > 0 ? autoProducts : getProductsByCategory(categorySlug);
    } else if (categorySlug === 'sneakers') {
      // Load all images from sneakers folder
      const autoProducts = getSneakersImageProducts();
      products = autoProducts.length > 0 ? autoProducts : getProductsByCategory(categorySlug);
    } else if (categorySlug === 'custom') {
      // Load all images from customized folder
      const autoProducts = getCustomizedImageProducts();
      products = autoProducts.length > 0 ? autoProducts : getProductsByCategory(categorySlug);
    } else {
      products = getProductsByCategory(categorySlug);
    }

    // Get random products from all categories for the carousel
    const randomProducts = getRandomProductsFromAllCategories(30);
    
    // Get all products for search
    const allProducts = getAllProducts();

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

