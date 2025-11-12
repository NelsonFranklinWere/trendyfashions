import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import CategoryFilter, { FilterType } from '@/components/CategoryFilter';
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
  SNEAKER_BRAND_FILTERS,
  SneakerBrandFilter,
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
import { getCasualImageProducts } from '@/lib/server/casualImageProducts';

interface CategoryPageProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
  products: Product[];
}

const CategoryPage = ({ category, products }: CategoryPageProps) => {
  const isOfficials = category.slug === 'officials';
  const isSneakers = category.slug === 'sneakers';
  const isCasuals = category.slug === 'casuals';
  const [activeFilter, setActiveFilter] = useState<FilterType>(
    isOfficials
      ? (DEFAULT_OFFICIAL_FILTER as FilterType)
      : isSneakers
        ? (DEFAULT_SNEAKER_FILTER as FilterType)
        : isCasuals
          ? (DEFAULT_CASUAL_FILTER as FilterType)
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
      const filters = SNEAKER_BRAND_FILTERS.filter((filter) =>
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

    const filters: FilterType[] = ['All'];
    const hasMen = products.some((p) => p.gender === 'Men');
    const hasNewArrivals = products.some((p) =>
      p.tags?.includes('New Arrivals')
    );

    if (hasMen) filters.push('Men');
    if (hasNewArrivals) filters.push('New Arrivals');

    return filters;
  }, [products, isOfficials, isSneakers, isCasuals]);

  useEffect(() => {
    if (!availableFilters.includes(activeFilter)) {
      const fallback = isOfficials
        ? (availableFilters[0] ?? (DEFAULT_OFFICIAL_FILTER as FilterType))
        : isSneakers
          ? (availableFilters[0] ?? (DEFAULT_SNEAKER_FILTER as FilterType))
          : isCasuals
            ? (availableFilters[0] ?? (DEFAULT_CASUAL_FILTER as FilterType))
            : 'All';
      setActiveFilter(fallback);
    }
  }, [availableFilters, activeFilter, isOfficials, isSneakers, isCasuals]);

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
        (activeFilter as SneakerBrandFilter) ?? DEFAULT_SNEAKER_FILTER
      );
    }

    if (isCasuals) {
      return filterCasualProducts(
        products,
        (activeFilter as CasualBrandFilter) ?? DEFAULT_CASUAL_FILTER
      );
    }

    if (activeFilter === 'All') return products;
    if (activeFilter === 'Men') return products.filter((p) => p.gender === 'Men');
    if (activeFilter === 'New Arrivals')
      return products.filter((p) => p.tags?.includes('New Arrivals'));
    return products;
  }, [products, activeFilter, isOfficials, isSneakers, isCasuals]);

  return (
    <>
      <NextSeo
        title={`${category.name} Collection | Trendy Fashion Zone`}
        description={category.description}
        canonical={`https://trendyfashionzone.online/collections/${category.slug}`}
        openGraph={{
          url: `https://trendyfashionzone.online/collections/${category.slug}`,
          title: `${category.name} Collection | Trendy Fashion Zone`,
          description: category.description,
        }}
      />

      <div className="bg-gradient-to-b from-light/30 to-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-4">
              {category.name} Collection
            </h1>
            <p className="text-lg md:text-xl text-text font-body max-w-3xl mx-auto font-medium">
              {category.description}
            </p>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
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
  } else {
    products = getProductsByCategory(categorySlug);
  }

  return {
    props: {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
      products,
    },
  };
};

export default CategoryPage;

