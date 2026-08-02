import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import ScrollableProductRow from '@/components/ScrollableProductRow';
import { formatPrice, getCategoryBySlug, getWhatsAppLink } from '@/data/products';
import type { Product } from '@/data/products';
import { collectionPath, resolveCollectionSlug } from '@/lib/routes/collectionLinks';
import { getProductById } from '@/lib/server/getProductById';
import { getRelatedProductSections } from '@/lib/server/relatedProducts';
import { slimProduct, slimProductList } from '@/lib/server/slimProductProps';
import { STATIC_REVALIDATE_SECONDS } from '@/lib/server/staticConfig';
import { absoluteImageUrl, productPageUrl } from '@/lib/catalog/feedUtils';
import { productToLineItem } from '@/lib/analytics/items';
import { trackViewItem } from '@/lib/analytics/google';
import { trackMetaViewContent, trackMetaMessaging } from '@/lib/analytics/meta';
import FastLink from '@/components/FastLink';
import { getProductBrand, isSaleProduct } from '@/lib/products/flags';
import { trackProductPageView } from '@/components/SiteViewTracker';

interface ProductPageProps {
  product: Product;
  youMayAlsoLike: Product[];
  whatOthersLookFor: Product[];
}

export default function ProductPage({
  product,
  youMayAlsoLike,
  whatOthersLookFor,
}: ProductPageProps) {
  const collectionSlug = resolveCollectionSlug(product.category);
  const category = collectionSlug ? getCategoryBySlug(collectionSlug) : null;
  const brand = getProductBrand(product);
  const isSale = isSaleProduct(product);
  const whatsappLink = getWhatsAppLink(product.name, product.price);
  const cardVariant = isSale ? 'sale' : 'default';
  const browseHref = collectionSlug ? collectionPath(collectionSlug) : '/collections';
  const browseLabel = category ? `View all ${category.name}` : 'Browse collections';

  useEffect(() => {
    const line = productToLineItem(product);
    trackViewItem(line);
    trackMetaViewContent(line);
    trackProductPageView(product.id, product.name);
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
        <meta property="og:image" content={absoluteImageUrl(product.fullImageUrl || product.image)} />
        <meta property="product:price:amount" content={String(product.price)} />
        <meta property="product:price:currency" content="KES" />
        {brand && <meta property="product:brand" content={brand} />}
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
                <FastLink href={collectionPath(collectionSlug)} className="hover:text-secondary">
                  {category.name}
                </FastLink>
                <span>/</span>
              </>
            )}
            <span className="text-primary font-medium truncate">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="max-w-md mx-auto lg:max-w-none w-full">
              <ProductCard product={product} priority variant={cardVariant} className="shadow-medium" />
            </div>
            <div>
              {brand && brand !== 'Trendy Fashion Zone' && (
                <p className="text-xs uppercase tracking-wider text-secondary font-semibold mb-2">
                  {brand}
                </p>
              )}
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
                {product.name}
              </h1>
              <p className="mt-3 text-2xl font-bold text-secondary">{formatPrice(product.price)}</p>
              {product.gender && (
                <p className="mt-2 text-sm text-text">For: {product.gender}</p>
              )}
              {product.description && (
                <div className="mt-6">
                  <h2 className="text-sm font-heading font-semibold text-primary mb-2">
                    Product details
                  </h2>
                  <p className="text-text font-body leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
              <div className="mt-4 text-sm text-text/80 space-y-1">
                {product.category && (
                  <p>
                    Category:{' '}
                    <span className="font-medium text-primary capitalize">{product.category}</span>
                  </p>
                )}
                {product.subcategory && (
                  <p>
                    Brand / type:{' '}
                    <span className="font-medium text-primary">{product.subcategory}</span>
                  </p>
                )}
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackMetaMessaging('whatsapp_pdp')}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-secondary px-5 py-3 text-secondary font-semibold hover:bg-secondary/5"
              >
                Chat on WhatsApp
              </a>

              {category && collectionSlug && (
                <FastLink
                  href={collectionPath(collectionSlug)}
                  className="block mt-6 text-secondary font-semibold hover:underline"
                >
                  View more in {category.name} →
                </FastLink>
              )}
            </div>
          </div>
        </div>
      </div>

      {youMayAlsoLike.length > 0 && (
        <ScrollableProductRow
          title="You may also like"
          description="Similar styles from the same collection and brand."
          products={youMayAlsoLike}
          viewAllHref={browseHref}
          viewAllLabel={browseLabel}
          maxItems={8}
          className="bg-white"
        />
      )}

      {whatOthersLookFor.length > 0 && (
        <ScrollableProductRow
          title="What others look for"
          description="More pairs shoppers browse next at Trendy Fashion Zone."
          products={whatOthersLookFor}
          viewAllHref="/collections"
          viewAllLabel="Browse all"
          maxItems={8}
          className="bg-light/30"
        />
      )}
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

  const { youMayAlsoLike, whatOthersLookFor } = getRelatedProductSections(product);

  return {
    props: {
      product: slimProduct(product),
      youMayAlsoLike: slimProductList(youMayAlsoLike),
      whatOthersLookFor: slimProductList(whatOthersLookFor),
    },
    revalidate: STATIC_REVALIDATE_SECONDS,
  };
};
