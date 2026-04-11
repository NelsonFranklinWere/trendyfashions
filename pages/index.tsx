import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import ScrollableProductRow from '@/components/ScrollableProductRow';
import CircularProductCard from '@/components/CircularProductCard';
import CircularCategoryCard from '@/components/CircularCategoryCard';
import { categories, Product } from '@/data/products';
import { getOfficialImageProducts } from '@/lib/server/officialImageProducts';
import { getCasualImageProducts } from '@/lib/server/casualImageProducts';
import { getLoafersImageProducts } from '@/lib/server/loafersImageProducts';
import { getSportsImageProducts } from '@/lib/server/sportsImageProducts';
import { getVansImageProducts } from '@/lib/server/vansImageProducts';
import { filterOfficialsProducts } from '@/lib/filters/officials';
import { filterCasualProducts } from '@/lib/filters/casuals';
import { siteConfig, nairobiKeywords, nairobiSearchPhrases, homePageSeo } from '@/lib/seo/config';
import { getFAQSchema, getDefaultStoreFAQs, getAggregateReviewSchema, getSpeakableSchema } from '@/lib/seo/structuredData';

interface HomeProps {
  featuredOfficials: Product[];
  featuredClarks: Product[];
  featuredCasuals: Product[];
  featuredLacosteCasuals: Product[];
  featuredTimberlandCasuals: Product[];
  featuredOfficialCasuals: Product[];
  featuredLoafers: Product[];
  featuredEmpireOfficials: Product[];
  featuredOfficialBoots: Product[];
  featuredLacoste: Product[];
  featuredLoafersProducts: Product[];
  featuredClarksOfficials: Product[];
  featuredEmpireOfficialsFiltered: Product[];
  featuredOfficialBootsFiltered: Product[];
  featuredTimberlandCasualsFiltered: Product[];
  featuredOfficialCasualsFiltered: Product[];
  featuredSports: Product[];
  featuredVans: Product[];
  featuredSandals: Product[];
  heroClarks: Product[];
  heroTimberland: Product[];
}

interface HeroCta {
  href: string;
  label: string;
  variant: 'primary' | 'glass';
}

interface HeroSlide {
  image: string;
  title: string;
  accent: string;
  description: string;
  footer: string;
  ctas: [HeroCta, HeroCta];
}

const HERO_SLIDES: HeroSlide[] = [
  {
    image: '/categories/officials/clarks-officials/ClarksContact.jpg',
    title: 'Clarks Originals — Step Into Office-Ready Comfort',
    accent: 'Trendy Fashion Zone',
    description:
      'Authentic Clarks officials and timeless leather style. Trusted quality for Nairobi professionals who want originals that last.',
    footer: '📍 Moi Avenue, Nairobi CBD | 🚚 Free delivery | 💬 WhatsApp us now!',
    ctas: [
      { href: '/collections/mens-officials', label: 'Shop Officials', variant: 'primary' },
      { href: '/collections/casual', label: 'Casuals', variant: 'glass' },
    ],
  },
  {
    image: '/categories/officials/clarks-officials/ClarksOfficials100.jpg',
    title: 'Polished Officials — Boardroom to Client Dinners',
    accent: 'Trendy Fashion Zone',
    description:
      'Premium leather loafers and formal pairs. Look sharp every day with Nike, Jordan, Airmax, Clarks, and Vans — all under one roof.',
    footer: '📍 Moi Avenue, Nairobi CBD | 🚚 Free delivery | 💬 WhatsApp us now!',
    ctas: [
      { href: '/collections/mens-officials?filter=Clarks', label: 'Clarks Officials', variant: 'primary' },
      { href: '/collections/sneakers', label: 'Sneakers', variant: 'glass' },
    ],
  },
  {
    image: '/categories/officials/other-official-shoes/Officialboots2.jpg',
    title: 'Official Boots & Rugged Soles — Built for the Grind',
    accent: 'Trendy Fashion Zone',
    description:
      'Ankle boots and official footwear with grip and comfort. Balance workweek polish with sports and casuals for your off-duty style.',
    footer: '📍 Moi Avenue, Nairobi CBD | 🚚 Free delivery | 💬 WhatsApp us now!',
    ctas: [
      { href: '/collections/mens-officials?filter=Boots', label: 'Official Boots', variant: 'primary' },
      { href: '/collections/sports', label: 'Sports', variant: 'glass' },
    ],
  },
];

const Home = ({
  featuredOfficials,
  featuredClarks,
  featuredCasuals,
  featuredLacosteCasuals,
  featuredTimberlandCasuals,
  featuredOfficialCasuals,
  featuredLoafers,
  featuredEmpireOfficials,
  featuredOfficialBoots,
  featuredLacoste,
  featuredLoafersProducts,
  featuredClarksOfficials,
  featuredEmpireOfficialsFiltered,
  featuredOfficialBootsFiltered,
  featuredTimberlandCasualsFiltered,
  featuredOfficialCasualsFiltered,
  featuredSports,
  featuredVans,
  featuredSandals,
  heroClarks,
  heroTimberland,
}: HomeProps) => {
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  const heroCurrent = HERO_SLIDES[heroSlide];
  const heroThumbImages = useMemo(() => {
    const others = HERO_SLIDES.map((s) => s.image).filter((_, i) => i !== heroSlide);
    return others.slice(0, 2);
  }, [heroSlide]);

  const priceValidUntil = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  }, []);

  const seoProducts = useMemo(
    () =>
      [
        ...featuredOfficials,
        ...featuredClarks,
        ...featuredCasuals,
        ...featuredSports,
        ...featuredVans,
      ]
        .filter((p) => p && p.id && p.name && p.price && p.image)
        .slice(0, 24),
    [featuredOfficials, featuredClarks, featuredCasuals, featuredSports, featuredVans]
  );
  const seoProductsForSchema = useMemo(() => {
    if (seoProducts.length > 0) return seoProducts;
    const fallback = [...heroClarks, ...heroTimberland]
      .filter((p) => p && p.id && p.name && p.price && p.image)
      .slice(0, 24);
    if (fallback.length > 0) return fallback;
    return [
      {
        id: 'featured-store-product',
        name: 'Premium Original Shoes',
        description: 'Quality original shoes in Nairobi from trusted global brands.',
        price: 3200,
        image: '/logo/Logo.jpg',
        category: 'collections',
      } as Product,
    ];
  }, [seoProducts, heroClarks, heroTimberland]);

  return (
    <>
      <NextSeo
        title={homePageSeo.title}
        description={homePageSeo.description}
        canonical={siteConfig.url}
        openGraph={{
          url: siteConfig.url,
          title: homePageSeo.openGraphTitle,
          description: homePageSeo.openGraphDescription,
          images: [
            {
              url: `${siteConfig.url}/images/featured-banner.jpg`,
              width: 1200,
              height: 630,
              alt: 'Best original shoes Nairobi CBD — Trendy Fashion Zone Moi Avenue',
            },
          ],
          siteName: siteConfig.name,
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
              ...nairobiSearchPhrases,
              ...nairobiKeywords.brands.slice(0, 10),
              ...nairobiKeywords.categories.slice(0, 10),
              ...nairobiKeywords.quality.slice(0, 8),
              ...nairobiKeywords.location.slice(0, 6),
              'best sellers shoes Nairobi',
              'affordable shoes Nairobi',
              'shoe shop near me Nairobi',
            ].join(', '),
          },
          {
            name: 'author',
            content: siteConfig.name,
          },
          {
            name: 'robots',
            content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
          {
            name: 'googlebot',
            content: 'index, follow',
          },
          {
            name: 'geo.region',
            content: 'KE-110',
          },
          {
            name: 'geo.placename',
            content: 'Nairobi',
          },
          {
            name: 'geo.position',
            content: '-1.2921;36.8219',
          },
          {
            name: 'ICBM',
            content: '-1.2921, 36.8219',
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ShoeStore',
            '@id': `${siteConfig.url}#store`,
            name: siteConfig.name,
            url: siteConfig.url,
            logo: `${siteConfig.url}/logo/Logo.jpg`,
            image: `${siteConfig.url}/logo/Logo.jpg`,
            description: homePageSeo.description,
            address: {
              '@type': 'PostalAddress',
              streetAddress: siteConfig.location.area,
              addressLocality: siteConfig.location.city,
              addressRegion: 'Nairobi County',
              addressCountry: 'KE',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: -1.2921,
              longitude: 36.8219,
            },
            contactPoint: [
              {
                '@type': 'ContactPoint',
                telephone: siteConfig.contact.phone,
                contactType: 'Customer Service',
                areaServed: 'KE',
                availableLanguage: ['en', 'sw'],
              },
              {
                '@type': 'ContactPoint',
                telephone: `+${siteConfig.contact.whatsapp}`,
                contactType: 'Customer Service',
                areaServed: 'KE',
                availableLanguage: ['en', 'sw'],
              },
            ],
            openingHoursSpecification: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              opens: '09:00',
              closes: '18:00',
            },
            priceRange: 'KES 1,900 - KES 5,500',
            paymentAccepted: 'Cash, M-Pesa, Credit Card',
            currenciesAccepted: 'KES',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: '150',
              bestRating: '5',
              worstRating: '1',
            },
            sameAs: [
              `https://wa.me/${siteConfig.contact.whatsapp}`,
            ],
            areaServed: {
              '@type': 'City',
              name: 'Nairobi',
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Shoes',
              itemListElement: [
                {
                  '@type': 'OfferCatalog',
                  name: 'Sneakers',
                  url: `${siteConfig.url}/collections/sneakers`,
                },
                {
                  '@type': 'OfferCatalog',
                  name: 'Official Shoes',
                  url: `${siteConfig.url}/collections/mens-officials`,
                },
                {
                  '@type': 'OfferCatalog',
                  name: 'Casual Shoes',
                  url: `${siteConfig.url}/collections/casual`,
                },
                {
                  '@type': 'OfferCatalog',
                  name: 'Sports Shoes',
                  url: `${siteConfig.url}/collections/sports`,
                },
              ],
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Trendy Fashion Zone',
            url: 'https://trendyfashionzone.co.ke',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://trendyfashionzone.co.ke/collections?search={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
      {/* FAQ Schema for featured snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFAQSchema(getDefaultStoreFAQs())),
        }}
      />
      {/* Review Schema for trust signals */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getAggregateReviewSchema()),
        }}
      />
      {/* Speakable Schema for voice search & AI citations (GEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSpeakableSchema(['h1', 'h2', '.hero-description'])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Trendy Fashion Zone Featured Products',
            numberOfItems: seoProductsForSchema.length,
            itemListElement: seoProductsForSchema.map((product, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Product',
                name: product.name,
                description: product.description,
                image: product.image.startsWith('http') ? product.image : `${siteConfig.url}${product.image}`,
                sku: product.id,
                category: product.category,
                brand: {
                  '@type': 'Brand',
                  name: 'Trendy Fashion Zone',
                },
                offers: {
                  '@type': 'Offer',
                  url: `${siteConfig.url}/collections/${product.category}`,
                  price: product.price.toString(),
                  priceCurrency: 'KES',
                  availability: 'https://schema.org/InStock',
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
          }),
        }}
      />

      {/* Hero Section — background image carousel */}
      <section className="relative text-white py-12 md:py-20 overflow-hidden min-h-[420px] md:min-h-[480px]">
        <div className="absolute inset-0 z-0">
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
                i === heroSlide ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={slide.image}
                alt=""
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority={i === 0}
                aria-hidden
              />
            </div>
          ))}
          <div
            className="absolute inset-0 z-[2] bg-gradient-to-br from-primary/55 via-primary/45 to-black/50"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-[0.05] z-[3]" aria-hidden />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-14">
            <div className="flex-1 text-left max-w-2xl xl:max-w-3xl min-h-[280px] md:min-h-[240px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroSlide}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="rounded-2xl border border-white/25 bg-black/35 px-5 py-6 sm:px-7 sm:py-8 md:px-8 md:py-9 shadow-xl backdrop-blur-md"
                >
                  <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold mb-4 md:mb-6 text-white drop-shadow-sm">
                    {heroCurrent.title}
                    <br />
                    <span className="text-secondary">{heroCurrent.accent}</span>
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 font-body font-medium leading-relaxed">
                    {heroCurrent.description}
                    <span className="block mt-3 text-sm sm:text-base md:text-lg text-white/90">
                      {heroCurrent.footer}
                    </span>
                  </p>
                </motion.div>
              </AnimatePresence>
              <div
                className="flex flex-wrap gap-2 mt-5"
                role="tablist"
                aria-label="Hero slides"
              >
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === heroSlide}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setHeroSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === heroSlide ? 'w-8 bg-secondary' : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 }}
              className="flex flex-col items-center lg:items-end gap-5 shrink-0 w-full lg:w-auto"
            >
              <div
                className="relative h-[7.5rem] w-[9.75rem] sm:h-[8rem] sm:w-[11rem] mb-1"
                aria-hidden
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroSlide}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0"
                  >
                    <div className="absolute left-0 top-0 z-10">
                      <div className="relative h-[5.25rem] w-[5.25rem] sm:h-24 sm:w-24 rounded-md overflow-hidden shadow-xl ring-2 ring-white/35 -rotate-6">
                        {heroThumbImages[0] && (
                          <Image
                            src={heroThumbImages[0]}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        )}
                      </div>
                    </div>
                    <div className="absolute left-14 top-7 z-20 sm:left-[4.25rem] sm:top-8">
                      <div className="relative h-[5.25rem] w-[5.25rem] sm:h-24 sm:w-24 rounded-md overflow-hidden shadow-xl ring-2 ring-white/35 rotate-[8deg]">
                        {heroThumbImages[1] && (
                          <Image
                            src={heroThumbImages[1]}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroSlide}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-row flex-wrap gap-2 sm:gap-3 justify-center lg:justify-end items-center max-w-[20rem] lg:max-w-none"
                >
                  {heroCurrent.ctas.map((cta, i) => (
                    <Link
                      key={`cta-${heroSlide}-${cta.href}-${i}`}
                      href={cta.href}
                      className={
                        cta.variant === 'primary'
                          ? 'bg-secondary text-white px-5 py-2.5 sm:px-7 sm:py-3 rounded-full font-body font-bold hover:bg-[#d35400] transition-all hover:shadow-2xl text-sm sm:text-base transform hover:scale-105 whitespace-nowrap'
                          : 'bg-white/10 backdrop-blur-sm border border-white/35 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-body font-semibold hover:bg-white/20 transition-all text-sm sm:text-base whitespace-nowrap'
                      }
                    >
                      {cta.label}
                    </Link>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Officials Section — scrollable by category */}
      {featuredOfficials.length > 0 && (
        <ScrollableProductRow
          title="Elevate Your Office Style"
          description="Premium professional shoes that command respect. Quality trusted by thousands of Nairobi professionals."
          viewAllHref="/collections/mens-officials"
          viewAllLabel="View all"
          products={featuredOfficials}
          maxItems={8}
          className="bg-white"
        />
      )}

      {/* Featured Clarks Officials Section — scrollable by category */}
      {featuredClarks.length > 0 && (
        <ScrollableProductRow
          title="Clarks Officials — Most Trusted Professional Shoes"
          description="Join 6,500+ professionals who chose Clarks. Timeless style and original quality for your professional journey."
          viewAllHref="/collections/mens-officials?filter=Clarks"
          viewAllLabel="View all"
          products={featuredClarks}
          maxItems={8}
          className="bg-light/30"
        />
      )}

      {/* Featured Clarks Officials Section - Separate */}
      {featuredClarksOfficials.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 pr-4"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
                  Clarks Officials Collection
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Authentic Clarks professional shoes. Iconic British craftsmanship for the modern professional.
                </p>
              </motion.div>
              <Link
                href="/collections/mens-officials"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                View all officials
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredClarksOfficials.slice(0, 5).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Empire Officials Section - Separate */}
      {featuredEmpireOfficialsFiltered.length > 0 && (
        <section className="py-12 md:py-16 bg-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 pr-4"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
                  Empire Officials Collection
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Premium Empire official shoes. Sophisticated style and exceptional comfort for professional excellence.
                </p>
              </motion.div>
              <Link
                href="/collections/mens-officials"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                View all officials
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredEmpireOfficialsFiltered.slice(0, 5).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Official Boots Section - Separate */}
      {featuredOfficialBootsFiltered.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 pr-4"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
                  Official Boots Collection
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Professional quality official boots. Durable construction with sophisticated styling for the workplace.
                </p>
              </motion.div>
              <Link
                href="/collections/mens-officials"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                View all officials
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredOfficialBootsFiltered.slice(0, 5).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Casuals Section */}
      {featuredCasuals.length > 0 && (
        <section className="py-12 md:py-16 bg-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 pr-4"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
                  Premium Casual Shoes — Make a Statement
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Exclusive Lacoste, Timberland, and Tommy Hilfiger. Original quality that reflects your unique style.
                </p>
              </motion.div>
              <Link
                href="/collections/casual"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                View all
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredCasuals.slice(0, 5).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Lacoste Casuals Section */}
      {featuredLacosteCasuals.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 pr-4"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
                  Lacoste Collection — French Elegance
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Authentic Lacoste casual shoes. Timeless French style meets modern comfort.
                </p>
              </motion.div>
              <Link
                href="/collections/casual"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                View all casuals
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredLacosteCasuals.slice(0, 5).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Timberland Casuals Section */}
      {featuredTimberlandCasuals.length > 0 && (
        <section className="py-12 md:py-16 bg-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 pr-4"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
                  Timberland Collection — Rugged Comfort
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Premium Timberland casual shoes. Built tough, designed for life.
                </p>
              </motion.div>
              <Link
                href="/collections/casual"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                View all casuals
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredTimberlandCasuals.slice(0, 5).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Official Casuals Section */}
      {featuredOfficialCasuals.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 pr-4"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
                  Official Casual Collection
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Premium official casual shoes. Professional quality meets casual comfort.
                </p>
              </motion.div>
              <Link
                href="/collections/casual"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                View all casuals
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredOfficialCasuals.slice(0, 5).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Loafers Section */}
      {featuredLoafers.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 pr-4"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
                  👞 Premium Loafers — Effortless Style
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Classic & modern designs. Original quality loafers that elevate any outfit.
                </p>
              </motion.div>
              <Link
                href="/collections/mens-loafers"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                View all
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredLoafers.slice(0, 10).filter(p => {
                  if (!p || !p.id || !p.name || !p.image || !p.price) return false;
                  // Ensure only loafers products (exclude officials)
                  const imageLower = (p.image || '').toLowerCase();
                  return imageLower.includes('/images/loafers/') || 
                         (p.category && p.category.toLowerCase().includes('loafers'));
                }).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Sports Section */}
      {featuredSports.length > 0 && (
        <section className="py-12 md:py-16 bg-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 pr-4"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
                  ⚽ Sports Footwear — Dominate the Game
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Original football boots & trainers. Performance meets style, trusted by athletes across Nairobi.
                </p>
              </motion.div>
              <Link
                href="/collections/sports"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                View all
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredSports.slice(0, 10).filter(p => {
                  if (!p || !p.id || !p.name || !p.image || !p.price) return false;
                  // Ensure only sports products
                  const imageLower = (p.image || '').toLowerCase();
                  const categoryLower = (p.category || '').toLowerCase();
                  return imageLower.includes('/images/sports/') || 
                         imageLower.includes('/images/Sports/') ||
                         categoryLower === 'sports';
                }).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Empire Officials Section */}
      {featuredEmpireOfficials.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 pr-4"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
                  Empire Officials — Timeless Elegance
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Premium Empire leather shoes for the sophisticated professional. Classic elegance meets modern comfort.
                </p>
              </motion.div>
              <Link
                href="/collections/mens-officials"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                View all officials
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredEmpireOfficials.slice(0, 5).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Official Boots Section */}
      {featuredOfficialBoots.length > 0 && (
        <section className="py-12 md:py-16 bg-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 pr-4"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
                  Official Boots Collection
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Premium quality official boots for the professional workplace. Durable construction meets sophisticated style.
                </p>
              </motion.div>
              <Link
                href="/collections/mens-officials"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                View all officials
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredOfficialBoots.slice(0, 5).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Lacoste Products Section */}
      {featuredLacoste.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 pr-4"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
                  Lacoste Collection — French Heritage
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Authentic Lacoste casual shoes. Timeless French style meets modern comfort and sophistication.
                </p>
              </motion.div>
              <Link
                href="/collections/casual"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                View all casuals
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredLacoste.slice(0, 5).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Timberland Casuals Section - Separate */}
      {featuredTimberlandCasualsFiltered.length > 0 && (
        <section className="py-12 md:py-16 bg-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 pr-4"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
                  Timberland Casuals Collection
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Premium Timberland casual shoes. Rugged style meets urban comfort for the modern lifestyle.
                </p>
              </motion.div>
              <Link
                href="/collections/casual"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                View all casuals
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredTimberlandCasualsFiltered.slice(0, 5).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Official Casuals Section - Separate */}
      {featuredOfficialCasualsFiltered.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 pr-4"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
                  Official Casuals Collection
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Premium official casual shoes. Professional quality meets casual comfort and style.
                </p>
              </motion.div>
              <Link
                href="/collections/casual"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                View all casuals
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredOfficialCasualsFiltered.slice(0, 5).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Loafers Products Section */}
      {featuredLoafersProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 pr-4"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
                  Premium Loafers Collection
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Elegant loafers for the modern gentleman. Comfortable slip-on design with sophisticated styling.
                </p>
              </motion.div>
              <Link
                href="/collections/loafers"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
              >
                View all loafers
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredLoafersProducts.slice(0, 5).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Scrollable Vans Row (uploaded products prioritized) */}
      <ScrollableProductRow
        title="Vans Collection — Express Your Style"
        description="Original Vans in classic & custom designs. Styles that stand out and reflect your unique personality."
        viewAllHref="/collections/vans"
        viewAllLabel="View all"
        products={featuredVans}
        maxItems={10}
        className="bg-light/30"
      />

      {/* Scrollable Sandals Row */}
      <ScrollableProductRow
        title="Sandals Collection — Comfortable Style"
        description="Stay cool with breathable sandals and everyday comfort for Nairobi shoppers."
        viewAllHref="/collections/sandals"
        viewAllLabel="View all sandals"
        products={featuredSandals}
        maxItems={10}
        className="bg-white"
      />

      {/* Main Categories Section - Circular Cards */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-center mb-12"
            >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-4">
              Quality Original Shoes - Best Sellers & Trending Footwear
            </h2>
            <p className="text-lg text-text font-body max-w-2xl mx-auto font-medium">
              Every collection features quality original shoes, best sellers, and trending styles. From office elegance to street-ready sneakers—authentic brands, premium quality, trusted by thousands in Nairobi.
            </p>
          </motion.div>

          {/* Main Category Groups - Circular Cards */}
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
              {categories
                .filter((cat) => cat.featured)
                .map((category, index) => (
                  <CircularCategoryCard
                    key={category.id}
                    category={category}
                    delay={index * 0.1}
                  />
                ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const getImageIdentityKey = (image: string | undefined | null): string => {
      if (!image) return '';
      const normalized = String(image).trim().toLowerCase();
      if (!normalized) return '';
      try {
        if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
          const url = new URL(normalized);
          return decodeURIComponent(url.pathname).replace(/\/+/g, '/');
        }
      } catch {
        // Ignore parse errors and fallback to string-based normalization.
      }
      const withoutQuery = normalized.split('?')[0].split('#')[0];
      return decodeURIComponent(withoutQuery).replace(/\/+/g, '/');
    };

    const fs = await import('fs');
    const path = await import('path');
    
    // Helper to filter out invalid products
    const filterValidProducts = (products: Product[]): Product[] => {
      return products.filter(p => {
        if (!p || p === null || p === undefined) return false;
        if (!p.id || p.id === null || p.id === undefined) return false;
        if (!p.name || p.name === null || p.name === undefined || p.name === 'null' || p.name.trim() === '') return false;
        if (!p.image || p.image === null || p.image === undefined || p.image === 'null' || p.image.trim() === '') return false;
        if (p.price === null || p.price === undefined || isNaN(p.price) || p.price <= 0) return false;
        return true;
      });
    };
    
    // Get database products first (priority - keep uploaded names/descriptions/prices)
    const { getDbProducts, getDbImageProducts } = await import('@/lib/server/dbImageProducts');
    
    // Helper to merge products with database priority
    const mergeWithDbPriority = async (category: string, fsProducts: Product[]): Promise<Product[]> => {
      try {
        const dbProducts = await getDbProducts(category);
        const dbImageProducts = await getDbImageProducts(category);
        const productMap = new Map<string, Product>();
        
        // Add database products first (priority)
        [...dbProducts, ...dbImageProducts].forEach(p => {
          if (p && p.image) {
            const key = getImageIdentityKey(p.image);
            if (key) productMap.set(key, p);
          }
        });
        
        // Add filesystem products only if image doesn't exist in database
        fsProducts.forEach(p => {
          if (p && p.image) {
            const key = getImageIdentityKey(p.image);
            if (key && !productMap.has(key)) {
              productMap.set(key, p);
            }
          }
        });
        
        return Array.from(productMap.values());
      } catch {
        return fsProducts;
      }
    };
    
    // Get products from each category (database first, fallback to filesystem)
    // Use getters that have FS fallback so scroll sections always get products
    const officials = filterValidProducts(await getOfficialImageProducts());
    const casuals = filterValidProducts(await mergeWithDbPriority('casual', getCasualImageProducts()));
    
    // Get loafers products - prioritize database, fallback to filesystem
    const dbLoafers = await getDbProducts('loafers');
    const fsLoafers = await getLoafersImageProducts();
    const loafers = filterValidProducts([...dbLoafers, ...fsLoafers]);
    
    // Sports - STRICT: only from sports category/folder
    const allSports = await mergeWithDbPriority('sports', getSportsImageProducts());
    const sports = filterValidProducts(allSports.filter(p => {
      if (!p || !p.image) return false;
      const categoryLower = (p.category || '').toLowerCase();
      const imageLower = (p.image || '').toLowerCase();
      // Only include sports category products - STRICT
      return categoryLower === 'sports' ||
             imageLower.includes('/images/sports/') || imageLower.includes('/images/Sports/');
    }));
    
    // Vans - STRICT: only from vans category
    const allVans = await mergeWithDbPriority('vans', getVansImageProducts());
    const vans = filterValidProducts(allVans.filter(p => {
      if (!p || !p.image) return false;
      const categoryLower = (p.category || '').toLowerCase();
      const imageLower = (p.image || '').toLowerCase();
      // Only include vans category products - STRICT
      return categoryLower === 'vans' ||
             imageLower.includes('/images/vans/') || imageLower.includes('/images/Vans/');
    }));

    // Sandals - use uploaded products prioritized from DB
    const allSandals = await mergeWithDbPriority('sandals', []);
    const sandals = filterValidProducts(
      allSandals.filter((p) => {
        if (!p || !p.image) return false;
        const categoryLower = (p.category || '').toLowerCase();
        const imageLower = (p.image || '').toLowerCase();
        return categoryLower === 'sandals' || imageLower.includes('/images/sandals/') || imageLower.includes('/images/Sandals/');
      }),
    );

    // Filter Clarks products from officials (manually since 'Clarks' is not in official filters)
    const clarks = filterValidProducts(officials.filter(p => {
      if (p.tags && p.tags.length > 0) {
        return p.tags.some(tag => tag.toLowerCase() === 'clarks');
      }
      const source = `${p.name} ${p.description} ${p.image}`.toLowerCase();
      return source.includes('clark') || source.includes('clarks official');
    }));

    // Filter casual subcategories
    const lacosteCasuals = filterValidProducts(casuals.filter(p => {
      const source = `${p.name} ${p.image}`.toLowerCase();
      return source.includes('lacoste') || p.image?.includes('/images/casual/lacoste-casuals/');
    }));

    const timberlandCasuals = filterValidProducts(casuals.filter(p => {
      const source = `${p.name} ${p.image}`.toLowerCase();
      return (source.includes('timberland') || source.includes('timba')) && !source.includes('timberland boots') ||
             p.image?.includes('/images/casual/timberland-casuals/');
    }));

    const officialCasuals = filterValidProducts(casuals.filter(p => {
      const source = `${p.name} ${p.image}`.toLowerCase();
      return source.includes('casual official') || source.includes('official casual') ||
             p.image?.includes('/images/casual/official-casuals/');
    }));

    // Filter specific product categories
    const empireOfficials = filterValidProducts(officials.filter(p => {
      const source = `${p.name} ${p.image}`.toLowerCase();
      return source.includes('empire') || p.image?.includes('/images/officials/empire-officials/');
    }));

    const officialBoots = filterValidProducts(officials.filter(p => {
      const source = `${p.name} ${p.image}`.toLowerCase();
      return source.includes('boot') || p.image?.includes('/images/officials/') && source.includes('boot');
    }));

    const lacosteProducts = filterValidProducts(casuals.filter(p => {
      const source = `${p.name} ${p.image}`.toLowerCase();
      return source.includes('lacoste') || p.image?.includes('/images/casual/lacoste-casuals/');
    }));

    const loaferProducts = filterValidProducts(loafers.filter(p => {
      return p.category === 'loafers' || p.image?.includes('/images/loafers/');
    }));

    // Filter officials subcategories
    const clarksOfficials = filterValidProducts(officials.filter(p => {
      const source = `${p.name} ${p.image}`.toLowerCase();
      return source.includes('clarks') || p.image?.includes('/images/officials/clarks-officials/');
    }));

    const empireOfficialsFiltered = filterValidProducts(officials.filter(p => {
      const source = `${p.name} ${p.image}`.toLowerCase();
      return source.includes('empire') || p.image?.includes('/images/officials/empire-officials/');
    }));

    const officialBootsFiltered = filterValidProducts(officials.filter(p => {
      const source = `${p.name} ${p.image}`.toLowerCase();
      return source.includes('boot') && !source.includes('timberland') || p.image?.includes('/images/officials/') && source.includes('boot');
    }));

    // Filter casuals subcategories
    const timberlandCasualsFiltered = filterValidProducts(casuals.filter(p => {
      const source = `${p.name} ${p.image}`.toLowerCase();
      return source.includes('timberland') || p.image?.includes('/images/casual/timberland-casuals/');
    }));

    const officialCasualsFiltered = filterValidProducts(casuals.filter(p => {
      const source = `${p.name} ${p.image}`.toLowerCase();
      return source.includes('casual official') || source.includes('official casual') ||
             p.image?.includes('/images/casual/official-casuals/');
    }));
    
    // Filter Timberland casual products
    const timberland = filterValidProducts(filterCasualProducts(casuals, 'Timberland'));

    // Shuffle and select featured products (first 5-8 from each category)
    const shuffle = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    return {
      props: {
        featuredOfficials: shuffle(officials).slice(0, 8),
        featuredClarks: shuffle(clarks).slice(0, 8),
        featuredCasuals: shuffle(casuals).slice(0, 8),
        featuredLacosteCasuals: shuffle(lacosteCasuals).slice(0, 8),
        featuredTimberlandCasuals: shuffle(timberlandCasuals).slice(0, 8),
        featuredOfficialCasuals: shuffle(officialCasuals).slice(0, 8),
        featuredLoafers: shuffle(loafers).slice(0, 10),
        featuredEmpireOfficials: shuffle(empireOfficials).slice(0, 8),
        featuredOfficialBoots: shuffle(officialBoots).slice(0, 8),
        featuredLacoste: shuffle(lacosteProducts).slice(0, 8),
        featuredLoafersProducts: shuffle(loaferProducts).slice(0, 8),
        featuredClarksOfficials: shuffle(clarksOfficials).slice(0, 8),
        featuredEmpireOfficialsFiltered: shuffle(empireOfficialsFiltered).slice(0, 8),
        featuredOfficialBootsFiltered: shuffle(officialBootsFiltered).slice(0, 8),
        featuredTimberlandCasualsFiltered: shuffle(timberlandCasualsFiltered).slice(0, 8),
        featuredOfficialCasualsFiltered: shuffle(officialCasualsFiltered).slice(0, 8),
        featuredSports: shuffle(sports).slice(0, 10),
        featuredVans: shuffle(vans).slice(0, 10),
        featuredSandals: shuffle(sandals).slice(0, 10),
        heroClarks: clarks,
        heroTimberland: timberland,
      },
      // Enable ISR: regenerate page at most once per 60 seconds
      // This ensures database updates show up on home page
      revalidate: 60,
    };
  } catch (error) {
    // When DB fails, load from filesystem so scrollable sections still show products
    if (process.env.NODE_ENV === 'production') {
      console.error('Error loading products:', error);
    }
    try {
      const filterValid = (products: Product[]): Product[] =>
        (products || []).filter(p => p && p.id && p.name && p.image && typeof p.price === 'number' && p.price > 0);
      const shuffle = <T,>(arr: T[]): T[] => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      };
      const officials = filterValid(await getOfficialImageProducts());
      const casuals = filterValid(getCasualImageProducts());
      const loafers = filterValid([...getLoafersImageProducts()]);
      const sports = filterValid(getSportsImageProducts().filter(p => (p?.category || '').toLowerCase() === 'sports' || (p?.image || '').toLowerCase().includes('/images/sports/')));
      const vans = filterValid(getVansImageProducts().filter(p => (p?.category || '').toLowerCase() === 'vans' || (p?.image || '').toLowerCase().includes('/images/vans/')));
      const clarks = filterValid(officials.filter(p => `${p.name} ${p.description} ${p.image}`.toLowerCase().includes('clark')));
      const lacosteCasuals = filterValid(casuals.filter(p => `${p.name} ${p.image}`.toLowerCase().includes('lacoste')));
      const timberlandCasuals = filterValid(casuals.filter(p => `${p.name} ${p.image}`.toLowerCase().includes('timberland') || (p?.image || '').includes('timberland')));
      const officialCasuals = filterValid(casuals.filter(p => `${p.name} ${p.image}`.toLowerCase().includes('official casual') || (p?.image || '').includes('official-casuals')));
      const empireOfficials = filterValid(officials.filter(p => `${p.name} ${p.image}`.toLowerCase().includes('empire')));
      const officialBoots = filterValid(officials.filter(p => `${p.name} ${p.image}`.toLowerCase().includes('boot')));
      const lacosteProducts = lacosteCasuals;
      const loaferProducts = filterValid(loafers.filter(p => (p?.category || '').toLowerCase().includes('loafers') || (p?.image || '').includes('/images/loafers/')));
      const clarksOfficials = filterValid(officials.filter(p => `${p.name} ${p.image}`.toLowerCase().includes('clarks')));
      const timberland = filterValid(filterCasualProducts(casuals, 'Timberland'));
      // No filesystem fallback for sandals (uploaded items come from DB).
      const sandals: Product[] = [];
      return {
        props: {
          featuredOfficials: shuffle(officials).slice(0, 8),
          featuredClarks: shuffle(clarks).slice(0, 8),
          featuredCasuals: shuffle(casuals).slice(0, 8),
          featuredLacosteCasuals: shuffle(lacosteCasuals).slice(0, 8),
          featuredTimberlandCasuals: shuffle(timberlandCasuals).slice(0, 8),
          featuredOfficialCasuals: shuffle(officialCasuals).slice(0, 8),
          featuredLoafers: shuffle(loafers).slice(0, 10),
          featuredEmpireOfficials: shuffle(empireOfficials).slice(0, 8),
          featuredOfficialBoots: shuffle(officialBoots).slice(0, 8),
          featuredLacoste: shuffle(lacosteProducts).slice(0, 8),
          featuredLoafersProducts: shuffle(loaferProducts).slice(0, 8),
          featuredClarksOfficials: shuffle(clarksOfficials).slice(0, 8),
          featuredEmpireOfficialsFiltered: shuffle(empireOfficials).slice(0, 8),
          featuredOfficialBootsFiltered: shuffle(officialBoots).slice(0, 8),
          featuredTimberlandCasualsFiltered: shuffle(timberlandCasuals).slice(0, 8),
          featuredOfficialCasualsFiltered: shuffle(officialCasuals).slice(0, 8),
          featuredSports: shuffle(sports).slice(0, 10),
          featuredVans: shuffle(vans).slice(0, 10),
          featuredSandals: shuffle(sandals).slice(0, 10),
          heroClarks: clarks,
          heroTimberland: timberland,
        },
        revalidate: 60,
      };
    } catch (fallbackError) {
      if (process.env.NODE_ENV === 'production') {
        console.error('Fallback product load failed:', fallbackError);
      }
      return {
        props: {
          featuredOfficials: [], featuredClarks: [], featuredCasuals: [], featuredLacosteCasuals: [],
          featuredTimberlandCasuals: [], featuredOfficialCasuals: [], featuredLoafers: [], featuredEmpireOfficials: [],
          featuredOfficialBoots: [], featuredLacoste: [], featuredLoafersProducts: [], featuredClarksOfficials: [],
          featuredEmpireOfficialsFiltered: [], featuredOfficialBootsFiltered: [], featuredTimberlandCasualsFiltered: [],
          featuredOfficialCasualsFiltered: [], featuredSports: [], featuredVans: [], featuredSandals: [], heroClarks: [], heroTimberland: [],
        },
        revalidate: 60,
      };
    }
  }
};

export default Home;
