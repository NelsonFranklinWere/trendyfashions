import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { formatPrice, getCategoryBySlug } from '@/data/products';
import type { Product } from '@/data/products';
import { collectionPath, resolveCollectionSlug } from '@/lib/routes/collectionLinks';
import { getProductById } from '@/lib/server/getProductById';
import { STATIC_REVALIDATE_SECONDS } from '@/lib/server/staticConfig';
import { absoluteImageUrl, collectionUrlForProduct, productPageUrl } from '@/lib/catalog/feedUtils';
import { productToLineItem } from '@/lib/analytics/items';
import { trackViewItem } from '@/lib/analytics/google';
import { trackMetaViewContent } from '@/lib/analytics/meta';
import FastLink from '@/components/FastLink';

interface ProductPageProps {
  product: Product;
}

export default function ProductPage({ product }: ProductPageProps) {
  const collectionSlug = resolveCollectionSlug(product.category);
  const category = collectionSlug ? getCategoryBySlug(collectionSlug) : null;

  useEffect(() => {
    const line = productToLineItem(product);
    trackViewItem(line);
    trackMetaViewContent(line);
  }, [product]);

  const canonical = productPageUrl(product.id);

  return (
    <>
      <Head>
        <title>{`${product.name} | Trendy Fashion Zone`}</title>
        <meta name="description" content={product.description || product.name} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product.name} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={absoluteImageUrl(product.image)} />
        <meta property="product:price:amount" content={String(product.price)} />
        <meta property="product:price:currency" content="KES" />
      </Head>

      <div className="bg-gradient-to-b from-light/30 to-white py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-text font-body">
            <FastLink href="/" className="hover:text-secondary">
              Home
            </FastLink>
            <span>/</span>
            {category && collectionSlug && (
              <>
                <FastLink
                  href={collectionPath(collectionSlug)}
                  className="hover:text-secondary"
                >
                  {category.name}
                </FastLink>
                <span>/</span>
              </>
            )}
            <span className="text-primary font-medium truncate">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="max-w-md mx-auto lg:max-w-none w-full">
              <ProductCard product={product} priority className="shadow-medium" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
                {product.name}
              </h1>
              <p className="mt-3 text-2xl font-bold text-secondary">{formatPrice(product.price)}</p>
              {product.description && (
                <p className="mt-4 text-text font-body leading-relaxed">{product.description}</p>
              )}
              {category && collectionSlug && (
                <FastLink
                  href={collectionPath(collectionSlug)}
                  className="inline-block mt-6 text-secondary font-semibold hover:underline"
                >
                  View more in {category.name} →
                </FastLink>
              )}
              <p className="mt-4 text-xs text-text/60">
                Collection:{' '}
                <Link href={collectionUrlForProduct(product)} className="underline">
                  {product.category}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

export const getStaticProps: GetStaticProps<ProductPageProps> = async ({ params }) => {
  const id = params?.id as string;
  const product = await getProductById(id);
  if (!product) return { notFound: true };

  return {
    props: { product },
    revalidate: STATIC_REVALIDATE_SECONDS,
  };
};
