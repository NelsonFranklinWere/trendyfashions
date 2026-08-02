import { GetStaticProps } from 'next';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import CategoryCard from '@/components/CategoryCard';
import AsyncProductSearch from '@/components/AsyncProductSearch';
import { categories } from '@/data/products';
import {
  siteConfig,
  nairobiSearchPhrases,
  collectionsIndexSeo,
} from '@/lib/seo/config';

const Collections = () => {
  return (
    <>
      <NextSeo
        title={collectionsIndexSeo.title}
        description={collectionsIndexSeo.description}
        canonical={`${siteConfig.url}/collections`}
        openGraph={{
          url: `${siteConfig.url}/collections`,
          title: collectionsIndexSeo.title,
          description: collectionsIndexSeo.description.slice(0, 200),
          type: 'website',
          locale: 'en_KE',
          site_name: siteConfig.name,
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: nairobiSearchPhrases.join(', '),
          },
        ]}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: collectionsIndexSeo.h1,
              description: collectionsIndexSeo.description,
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
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Collections',
                    item: `${siteConfig.url}/collections`,
                  },
                ],
              },
              mainEntity: {
                '@type': 'ItemList',
                name: 'Product Categories',
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
      </Head>

      <div className="bg-gradient-to-b from-light/30 to-white py-8 sm:py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto relative z-20"
          >
            <AsyncProductSearch placeholder="Search for shoes, sneakers, brands…" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-3 sm:mb-4">
              {collectionsIndexSeo.h1}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-text font-body max-w-3xl mx-auto font-medium">
              {collectionsIndexSeo.subheading}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { STATIC_REVALIDATE_SECONDS } = await import('@/lib/server/staticConfig');
  return {
    props: {},
    revalidate: STATIC_REVALIDATE_SECONDS,
  };
};

export default Collections;
