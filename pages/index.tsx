import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import { useState } from 'react';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
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
import { siteConfig, nairobiKeywords } from '@/lib/seo/config';
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
  heroClarks: Product[];
  heroTimberland: Product[];
}


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
  heroClarks,
  heroTimberland,
}: HomeProps) => {

  return (
    <>
      <NextSeo
        title="Best Sellers | Quality Original Shoes Nairobi | Trendy Fashion Zone"
        description="Shop best sellers and quality original shoes in Nairobi. Authentic Nike Airforce, Jordan shoes, Airmax, Clarks officials, Vans, sneakers, casuals, loafers, and sports shoes. Located on Moi Avenue. 5+ years trusted. Free delivery available. Best prices in Nairobi."
        canonical={siteConfig.url}
        openGraph={{
          url: siteConfig.url,
          title: 'Best Sellers | Quality Original Shoes Nairobi | Trendy Fashion Zone',
          description: 'Shop best sellers and quality original shoes in Nairobi. Authentic Nike Airforce, Jordan shoes, Airmax, Clarks officials, Vans, sneakers, casuals, loafers, and sports shoes. Located on Moi Avenue.',
          images: [
            {
              url: `${siteConfig.url}/images/featured-banner.jpg`,
              width: 1200,
              height: 630,
              alt: 'Best Sellers - Quality Original Shoes Nairobi - Trendy Fashion Zone',
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
              ...nairobiKeywords.brands.slice(0, 8),
              ...nairobiKeywords.categories.slice(0, 6),
              ...nairobiKeywords.quality.slice(0, 4),
              ...nairobiKeywords.location.slice(0, 4),
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
            logo: `${siteConfig.url}/images/logos/Logo.jpg`,
            image: `${siteConfig.url}/images/logos/Logo.jpg`,
            description: 'Nairobi\'s premier destination for best sellers and quality original shoes. Authentic Nike Airforce, Jordan shoes, Airmax, Clarks officials, Vans, sneakers, casuals, loafers, and sports shoes. Located on Moi Avenue.',
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/95 text-white py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 z-[1]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold mb-4 md:mb-6">
              Your Perfect Pair Awaits — Original Quality That Matches Your Style
              <br />
              <span className="text-secondary">Trendy Fashion Zone</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white font-body max-w-3xl mx-auto mb-6 md:mb-8 font-medium">
              Discover authentic Nike, Jordan, Airmax, Clarks, and Vans. Join thousands of Nairobi shoppers who found exactly what they were looking for — original quality that lasts. 
              <span className="block mt-2 text-base md:text-lg">📍 Moi Avenue, Nairobi CBD | 🚚 Free delivery | 💬 WhatsApp us now!</span>
            </p>
            
            <div className="flex flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="/collections"
                className="bg-secondary text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-body font-bold hover:bg-[#d35400] transition-all hover:shadow-2xl text-sm sm:text-lg transform hover:scale-105 whitespace-nowrap"
              >
                Explore Collections
              </Link>
              <a
                href="https://wa.me/254743869564?text=Hello, I'm interested in your products."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-whatsapp text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-body font-bold hover:bg-[#20BA5A] transition-all hover:shadow-2xl text-sm sm:text-lg flex items-center justify-center gap-2 transform hover:scale-105 whitespace-nowrap"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="hidden sm:inline">Chat on WhatsApp</span>
                <span className="sm:hidden">WhatsApp</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Officials Section */}
      {featuredOfficials.length > 0 && (
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
              Elevate Your Office Style
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
              Premium professional shoes that command respect. Quality trusted by thousands of Nairobi professionals.
            </p>
              </motion.div>
              <Link
                href="/collections/mens-officials"
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
                {featuredOfficials.slice(0, 8).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Clarks Officials Section */}
      {featuredClarks.length > 0 && (
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
                  Clarks Officials — Most Trusted Professional Shoes
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Join 6,500+ professionals who chose Clarks. Timeless style and original quality for your professional journey.
                </p>
              </motion.div>
              <Link
                href="/collections/mens-officials?filter=Clarks"
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
                {featuredClarks.slice(0, 8).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
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

      {/* Featured Vans Section */}
      {featuredVans.length > 0 && (
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
                  Vans Collection — Express Your Style
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Original Vans in classic & custom designs. Styles that stand out and reflect your unique personality.
                </p>
              </motion.div>
              <Link
                href="/collections/vans"
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
                {featuredVans.slice(0, 10).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

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
            productMap.set(p.image, p);
          }
        });
        
        // Add filesystem products only if image doesn't exist in database
        fsProducts.forEach(p => {
          if (p && p.image && !productMap.has(p.image)) {
            productMap.set(p.image, p);
          }
        });
        
        return Array.from(productMap.values());
      } catch {
        return fsProducts;
      }
    };
    
    // Get products from each category (database first, fallback to filesystem)
    // STRICT FILTERING: Only include products that match the exact category
    // Get officials products - prioritize database products
    const dbOfficials = await getDbProducts('officials');
    const officials = filterValidProducts(dbOfficials);
    
    // Get casuals products - prioritize database products
    const dbCasuals = await getDbProducts('casual');
    const casuals = filterValidProducts(dbCasuals);
    
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
             imageLower.includes('/images/sports/') || imageLower.includes('/images/Sports/') ||
             (imageLower.includes('supabase.co') && imageLower.includes('/sports/'));
    }));
    
    // Vans - STRICT: only from vans category
    const allVans = await mergeWithDbPriority('vans', getVansImageProducts());
    const vans = filterValidProducts(allVans.filter(p => {
      if (!p || !p.image) return false;
      const categoryLower = (p.category || '').toLowerCase();
      const imageLower = (p.image || '').toLowerCase();
      // Only include vans category products - STRICT
      return categoryLower === 'vans' ||
             imageLower.includes('/images/vans/') || imageLower.includes('/images/Vans/') ||
             (imageLower.includes('supabase.co') && imageLower.includes('/vans/'));
    }));

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
        heroClarks: clarks,
        heroTimberland: timberland,
      },
      // Enable ISR: regenerate page at most once per 60 seconds
      // This ensures database updates show up on home page
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error loading products:', error);
    return {
      props: {
        featuredOfficials: [],
        featuredClarks: [],
        featuredCasuals: [],
        featuredLacosteCasuals: [],
        featuredTimberlandCasuals: [],
        featuredOfficialCasuals: [],
        featuredLoafers: [],
        featuredEmpireOfficials: [],
        featuredOfficialBoots: [],
        featuredLacoste: [],
        featuredLoafersProducts: [],
        featuredClarksOfficials: [],
        featuredEmpireOfficialsFiltered: [],
        featuredOfficialBootsFiltered: [],
        featuredTimberlandCasualsFiltered: [],
        featuredOfficialCasualsFiltered: [],
        featuredSports: [],
        featuredVans: [],
        heroClarks: [],
        heroTimberland: [],
      },
      // Enable ISR: regenerate page at most once per 60 seconds
      revalidate: 60,
    };
  }
};

export default Home;
