import FastLink from '@/components/FastLink';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import LazyProductGrid from '@/components/LazyProductGrid';
import AsyncProductSearch from '@/components/AsyncProductSearch';
import { getCategoryBySlug, Product } from '@/data/products';
import { toLocalImageSrc } from '@/lib/images/uploadUrls';
import RandomProductsCarousel from '@/components/RandomProductsCarousel';
import { filterProductsByCollectionFilter } from '@/lib/filters/collectionFilters';
import { COLLECTION_FILTER_OPTIONS } from '@/data/categories-structure';
import { VALID_COLLECTION_SLUGS } from '@/lib/routes/collectionLinks';
import {
  siteConfig,
  getCategoryKeywords,
  getCategorySeoTitle,
  getCategorySeoDescription,
  getCategoryPageH1,
  getCategoryPageSubheading,
} from '@/lib/seo/config';
import { cn } from '@/lib/utils';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { createProductRotator, SALE_ROTATE_MS } from '@/lib/products/rotateSale';

interface CategoryPageProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
  products: Product[];
  randomProducts: Product[];
  allProducts: Pick<Product, 'id' | 'name' | 'image' | 'category' | 'price' | 'description'>[];
}

const CategoryPage = ({ category, products, randomProducts }: CategoryPageProps) => {
  const router = useRouter();
  const { filter, gender } = router.query;

  const safeCategory = category || { slug: '', name: '', description: '', id: '' };
  const safeProducts = products || [];
  const isSale = safeCategory.slug === 'sale';

  const filterOptions = COLLECTION_FILTER_OPTIONS[safeCategory.slug] || ['All'];
  const activeFilter =
    typeof filter === 'string' && filter.trim() ? filter.trim() : 'All';
  const genderFilter = typeof gender === 'string' ? gender : undefined;

  const queryFilteredProducts = useMemo(
    () =>
      filterProductsByCollectionFilter(safeProducts, activeFilter, {
        gender: genderFilter,
      }),
    [safeProducts, activeFilter, genderFilter],
  );

  // Sale page: reshuffle positions every 2 minutes so ad landings never fix one product on top
  const [displayProducts, setDisplayProducts] = useState(queryFilteredProducts);
  useEffect(() => {
    if (!isSale) {
      setDisplayProducts(queryFilteredProducts);
      return;
    }
    return createProductRotator(queryFilteredProducts, SALE_ROTATE_MS, setDisplayProducts);
  }, [queryFilteredProducts, isSale]);

  const gridProducts = isSale ? displayProducts : queryFilteredProducts;

  const priceValidUntil = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  }, []);

  const schemaProducts = useMemo(() => {
    const list = queryFilteredProducts.length > 0 ? queryFilteredProducts : safeProducts;
    return list.slice(0, 10);
  }, [queryFilteredProducts, safeProducts]);

  if (!safeCategory?.name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text">Category not found</p>
      </div>
    );
  }

  const setFilter = (next: string) => {
    const query: Record<string, string> = {};
    if (next && next !== 'All') query.filter = next;
    if (genderFilter) query.gender = genderFilter;
    router.push(
      {
        pathname: `/collections/${safeCategory.slug}`,
        query,
      },
      undefined,
      { shallow: true },
    );
  };

  const lcpPreloadImages = queryFilteredProducts
    .slice(0, 2)
    .map((p) => toLocalImageSrc(p.image) || p.image)
    .filter((src): src is string => typeof src === 'string' && src.length > 0);

  return (
    <>
      <Head>
        {lcpPreloadImages.map((src) => (
          <link key={src} rel="preload" as="image" href={src} fetchPriority="high" />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: safeCategory.name,
              description: safeCategory.description,
              url: `${siteConfig.url}/collections/${safeCategory.slug}`,
              mainEntity: {
                '@type': 'ItemList',
                itemListElement: schemaProducts.map((p, i) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  name: p.name,
                  url: `${siteConfig.url}/products/${encodeURIComponent(p.id)}`,
                })),
              },
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'KES',
                lowPrice:
                  schemaProducts.length > 0
                    ? Math.min(...schemaProducts.map((p) => p.price))
                    : 0,
                highPrice:
                  schemaProducts.length > 0
                    ? Math.max(...schemaProducts.map((p) => p.price))
                    : 0,
                priceValidUntil,
              },
            }),
          }}
        />
      </Head>
      <NextSeo
        title={
          isSale
            ? `Products on sale right now | ${siteConfig.name}`
            : getCategorySeoTitle(safeCategory.slug, safeCategory.name)
        }
        description={
          isSale
            ? 'Products on sale right now at Trendy Fashion Zone — order on WhatsApp.'
            : getCategorySeoDescription(
                safeCategory.slug,
                safeCategory.name,
                safeCategory.description,
              )
        }
        canonical={`${siteConfig.url}/collections/${safeCategory.slug}`}
        openGraph={{
          url: `${siteConfig.url}/collections/${safeCategory.slug}`,
          title: isSale
            ? `Products on sale right now | ${siteConfig.name}`
            : getCategorySeoTitle(safeCategory.slug, safeCategory.name),
          description: isSale
            ? 'Products on sale right now at Trendy Fashion Zone — order on WhatsApp.'
            : getCategorySeoDescription(
                safeCategory.slug,
                safeCategory.name,
                safeCategory.description,
              ).slice(0, 200),
          type: 'website',
          locale: 'en_KE',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: getCategoryKeywords(safeCategory.slug),
          },
        ]}
      />

      <div className="bg-gradient-to-b from-light/40 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-10"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-primary mb-2">
              {isSale
                ? 'Products on sale right now'
                : getCategoryPageH1(safeCategory.slug, safeCategory.name)}
            </h1>
            {!isSale && (
              <p className="text-sm md:text-base text-text font-body max-w-2xl mx-auto">
                {getCategoryPageSubheading(safeCategory.slug, safeCategory.description)}
              </p>
            )}
            {isSale && (
              <p className="text-sm md:text-base text-text font-body max-w-xl mx-auto">
                Current sale picks — tap to view details or order on WhatsApp.
              </p>
            )}

            {!isSale && (
              <div className="mt-6 max-w-lg mx-auto relative z-20">
                <AsyncProductSearch
                  placeholder={`Search in ${safeCategory.name}…`}
                  categoryHint={safeCategory.name}
                />
              </div>
            )}
          </motion.div>

          {/* Horizontal brand / type filters */}
          {filterOptions.length > 1 && (
            <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-thin justify-start md:justify-center">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFilter(opt)}
                  className={cn(
                    'flex-shrink-0 rounded-full px-4 py-2 text-sm font-body font-medium transition-all whitespace-nowrap',
                    activeFilter === opt || (opt === 'All' && activeFilter === 'All')
                      ? 'bg-secondary text-white shadow-medium'
                      : 'bg-white text-text border border-light hover:bg-light',
                  )}
                  aria-pressed={activeFilter === opt}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {activeFilter !== 'All' && (
            <p className="mb-6 text-center text-sm text-text font-body">
              Showing: <span className="font-semibold text-primary">{activeFilter}</span>
              {genderFilter ? (
                <>
                  {' '}
                  · <span className="font-semibold text-primary">{genderFilter}</span>
                </>
              ) : null}
              {' · '}
              <button
                type="button"
                onClick={() => setFilter('All')}
                className="text-secondary hover:underline"
              >
                Clear
              </button>
            </p>
          )}

          {gridProducts.length > 0 ? (
            <LazyProductGrid
              products={gridProducts}
              variant={isSale ? 'sale' : 'default'}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8"
              initialCount={isSale ? 24 : 12}
              batchSize={16}
            />
          ) : (
            <div className="text-center py-16">
              <p className="text-text font-body text-lg">
                {isSale
                  ? 'No products on sale right now. Add them from Admin → Sale.'
                  : `No products found${activeFilter !== 'All' ? ` for “${activeFilter}”` : ''}.`}
              </p>
              {safeCategory.slug === 'clothing' && (
                <p className="mt-2 text-sm text-text/70">
                  Add clothing items in Admin → Products (category Clothing, set Men/Women + type).
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {randomProducts?.length > 0 && !isSale && (
        <RandomProductsCarousel products={randomProducts} />
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = VALID_COLLECTION_SLUGS.map((slug) => ({
    params: { category: slug },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const { STATIC_REVALIDATE_SECONDS } = await import('@/lib/server/staticConfig');
    const { resolveCollectionSlug } = await import('@/lib/routes/collectionLinks');
    const rawSlug = params?.category as string;
    const categorySlug = resolveCollectionSlug(rawSlug);
    const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

    // Fallback meta for slugs not in storefrontCollectionMeta cards list edges
    const meta =
      category ||
      (categorySlug
        ? {
            id: categorySlug,
            name: categorySlug
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' '),
            slug: categorySlug,
            description: `Shop ${categorySlug} at Trendy Fashion Zone`,
            image: '/logo/Logo.jpg',
            featured: true,
          }
        : null);

    if (!meta || !categorySlug) {
      return { notFound: true };
    }

    const { loadCategoryPageProps } = await import('@/lib/server/getCategoryStaticProps');
    const { products, randomProducts, allProducts } = await loadCategoryPageProps(categorySlug);

    // Sale / Meta catalog changes often — refresh faster so admin picks show quickly
    const revalidate =
      categorySlug === 'sale' || categorySlug === 'new-arrivals'
        ? 60
        : STATIC_REVALIDATE_SECONDS;

    return {
      props: {
        category: {
          id: meta.id,
          name: meta.name,
          slug: meta.slug,
          description: meta.description,
        },
        products,
        randomProducts,
        allProducts,
      },
      revalidate,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Error in getStaticProps:', error);
    }
    return { notFound: true };
  }
};

export default CategoryPage;
