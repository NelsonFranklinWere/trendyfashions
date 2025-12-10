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
import { getSneakersImageProducts } from '@/lib/server/sneakersImageProducts';
import { getAirmaxImageProducts } from '@/lib/server/airmaxImageProducts';
import { getCasualImageProducts } from '@/lib/server/casualImageProducts';
import { getAirforceImageProducts } from '@/lib/server/airforceImageProducts';
import { getJordanImageProducts } from '@/lib/server/jordanImageProducts';
import { getLoafersImageProducts } from '@/lib/server/loafersImageProducts';
import { getSportsImageProducts } from '@/lib/server/sportsImageProducts';
import { getNikeImageProducts } from '@/lib/server/nikeImageProducts';
import { getVansImageProducts } from '@/lib/server/vansImageProducts';
import { filterOfficialsProducts } from '@/lib/filters/officials';
import { filterAirmaxProducts } from '@/lib/filters/airmax';
import { filterCasualProducts } from '@/lib/filters/casuals';
import { siteConfig, nairobiKeywords } from '@/lib/seo/config';

interface HomeProps {
  featuredOfficials: Product[];
  featuredSneakers: Product[];
  featuredAirmax: Product[];
  featuredClarks: Product[];
  featuredCasuals: Product[];
  featuredAirforce: Product[];
  featuredJordan: Product[];
  featuredLoafers: Product[];
  featuredSports: Product[];
  featuredNike: Product[];
  featuredVans: Product[];
  heroAirmax97: Product[];
  heroClarks: Product[];
  heroTimberland: Product[];
}


const Home = ({
  featuredOfficials,
  featuredSneakers,
  featuredAirmax,
  featuredClarks,
  featuredCasuals,
  featuredAirforce,
  featuredJordan,
  featuredLoafers,
  featuredSports,
  featuredNike,
  featuredVans,
  heroAirmax97,
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
                  url: `${siteConfig.url}/collections/mens-casuals`,
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
                href="/collections/officials"
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

      {/* Featured Sneakers Section */}
      {featuredSneakers.length > 0 && (
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
              Hot Sellers: Authentic Sneakers
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
              Original Nike, Jordan, Airmax, and New Balance. Authentic quality that thousands of Nairobi sneaker lovers trust.
            </p>
              </motion.div>
              <Link
                href="/collections/sneakers"
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
                {featuredSneakers.slice(0, 8).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Airmax Section */}
      {featuredAirmax.length > 0 && (
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
                  Nike Air Max Collection
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Iconic running and lifestyle shoes
                </p>
              </motion.div>
              <Link
                href="/collections/airmax"
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
                {featuredAirmax.slice(0, 5).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
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
                href="/collections/officials?filter=Clarks"
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
                href="/collections/casuals"
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

      {/* Featured Airforce Section */}
      {featuredAirforce.length > 0 && (
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
                  Nike Air Force 1 — The Icon
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  The icon that never goes out of style. Original Air Force 1s in classic and custom designs.
                </p>
              </motion.div>
              <Link
                href="/collections/airforce"
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
                {featuredAirforce.slice(0, 8).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Jordan Section */}
      {featuredJordan.length > 0 && (
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
                  🏀 Air Jordan — The Legendary Sneakers
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  The legend that started it all. Original Air Jordans where style meets heritage.
                </p>
              </motion.div>
              <Link
                href="/collections/jordan"
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
                {featuredJordan.slice(0, 8).filter(p => p && p.id && p.name && p.image && p.price).map((product) => (
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

      {/* Featured Nike Section */}
      {featuredNike.length > 0 && (
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
                  Men&apos;s Nike Collection — Ultimate Style
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                  Original SB, Shox, Ultra, and Air Force. Authentic quality that Nairobi&apos;s style-conscious choose.
                </p>
              </motion.div>
              <Link
                href="/collections/mens-nike"
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
                {featuredNike.slice(0, 10).filter(p => {
                  if (!p || !p.id || !p.name || !p.image || !p.price) return false;
                  // Ensure only Nike products (exclude sports and casuals)
                  const imageLower = (p.image || '').toLowerCase();
                  const nameLower = (p.name || '').toLowerCase();
                  const categoryLower = (p.category || '').toLowerCase();
                  // Exclude sports and casuals
                  if (categoryLower === 'sports' || categoryLower === 'casuals' || categoryLower === 'casual') {
                    return false;
                  }
                  if (imageLower.includes('/images/sports/') || imageLower.includes('/images/casual/')) {
                    return false;
                  }
                  // Include Nike products
                  return nameLower.includes('nike') || imageLower.includes('nike') || 
                         imageLower.includes('/images/nike/') ||
                         categoryLower === 'airforce' || categoryLower === 'airmax' ||
                         imageLower.includes('/images/airforce/') || imageLower.includes('/images/airmax/');
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 md:gap-8 mb-12">
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

          {/* Featured Products - Circular Cards */}
          <div className="mt-12">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-heading font-bold text-primary mb-6 text-center"
            >
              Featured Products
            </motion.h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 md:gap-8">
              {[
                ...featuredOfficials.slice(0, 2),
                ...featuredSneakers.slice(0, 2),
                ...featuredAirmax.slice(0, 1),
                ...featuredCasuals.slice(0, 1),
                ...featuredAirforce.slice(0, 1),
                ...featuredJordan.slice(0, 1),
              ]
                .filter(p => p && p.id && p.name && p.image && p.price)
                .reduce((acc, product) => {
                  const nameLower = (product.name || '').toLowerCase();
                  const isNewBalance1000 = nameLower.includes('new balance 1000') || 
                                         nameLower.includes('newbalance 1000') ||
                                         nameLower === 'new balance 1000';
                  
                  // Check if we already have a New Balance 1000 in the accumulator
                  const hasNewBalance1000 = acc.some(p => {
                    const pNameLower = (p.name || '').toLowerCase();
                    return pNameLower.includes('new balance 1000') || 
                           pNameLower.includes('newbalance 1000') ||
                           pNameLower === 'new balance 1000';
                  });
                  
                  // Skip if this is a duplicate New Balance 1000
                  if (isNewBalance1000 && hasNewBalance1000) {
                    return acc;
                  }
                  
                  return [...acc, product];
                }, [] as Product[])
                .slice(0, 8)
                .map((product, index) => (
                  <CircularProductCard
                    key={product.id}
                    product={product}
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
    
    // Helper to filter out invalid products and verify images exist
    const filterValidProducts = (products: Product[]): Product[] => {
      return products.filter(p => {
        // Filter out null/undefined products
        if (!p || p === null || p === undefined) return false;
        
        // Filter out products with null/undefined required fields
        if (!p.id || p.id === null || p.id === undefined) return false;
        if (!p.name || p.name === null || p.name === undefined || p.name === 'null' || p.name.trim() === '') return false;
        if (!p.image || p.image === null || p.image === undefined || p.image === 'null' || p.image.trim() === '') return false;
        if (p.price === null || p.price === undefined || isNaN(p.price) || p.price <= 0) return false;
        
        // Verify image exists (for local images only, skip Supabase/external URLs)
        if (p.image.startsWith('/images/')) {
          try {
            const imagePath = path.join(process.cwd(), 'public', p.image);
            if (!fs.existsSync(imagePath)) {
              return false;
            }
          } catch (err) {
            // If path check fails, exclude the product
            return false;
          }
        } else if (p.image.startsWith('http://') || p.image.startsWith('https://')) {
          // Allow external URLs (Supabase, etc.) - assume they're valid
          return true;
        }
        
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
    const allOfficials = await mergeWithDbPriority('mens-officials', filterValidProducts(getOfficialImageProducts()));
    const officials = filterValidProducts(allOfficials.filter(p => {
      if (!p || !p.image) return false;
      const categoryLower = (p.category || '').toLowerCase();
      const imageLower = (p.image || '').toLowerCase();
      // Only include mens-officials or officials category products
      return categoryLower === 'mens-officials' || categoryLower === 'officials' ||
             imageLower.includes('/images/officials/') || imageLower.includes('/images/Officials/');
    }));
    
    const allSneakers = await mergeWithDbPriority('sneakers', getSneakersImageProducts());
    const sneakers = filterValidProducts(allSneakers.filter(p => {
      if (!p || !p.image) return false;
      const categoryLower = (p.category || '').toLowerCase();
      const imageLower = (p.image || '').toLowerCase();
      // Only include sneakers category products
      return categoryLower === 'sneakers' ||
             imageLower.includes('/images/sneakers/') || imageLower.includes('/images/Sneakers/') ||
             (imageLower.includes('supabase.co') && imageLower.includes('/sneakers/'));
    }));
    
    const allAirmax = await mergeWithDbPriority('airmax', getAirmaxImageProducts());
    const airmax = filterValidProducts(allAirmax.filter(p => {
      if (!p || !p.image) return false;
      const categoryLower = (p.category || '').toLowerCase();
      const imageLower = (p.image || '').toLowerCase();
      // Only include airmax category products
      return categoryLower === 'airmax' ||
             imageLower.includes('/images/airmax/') || imageLower.includes('/images/Airmax/') ||
             (imageLower.includes('supabase.co') && imageLower.includes('/airmax/'));
    }));
    
    const allCasuals = await mergeWithDbPriority('casual', getCasualImageProducts());
    const casuals = filterValidProducts(allCasuals.filter(p => {
      if (!p || !p.image) return false;
      const categoryLower = (p.category || '').toLowerCase();
      const imageLower = (p.image || '').toLowerCase();
      // Only include casual category products
      return categoryLower === 'casual' || categoryLower === 'casuals' ||
             imageLower.includes('/images/casual/') || imageLower.includes('/images/Casual/') ||
             (imageLower.includes('supabase.co') && imageLower.includes('/casual/'));
    }));
    
    const allAirforce = await mergeWithDbPriority('airforce', getAirforceImageProducts());
    const airforce = filterValidProducts(allAirforce.filter(p => {
      if (!p || !p.image) return false;
      const categoryLower = (p.category || '').toLowerCase();
      const imageLower = (p.image || '').toLowerCase();
      // Only include airforce category products
      return categoryLower === 'airforce' ||
             imageLower.includes('/images/airforce/') || imageLower.includes('/images/Airforce/') ||
             (imageLower.includes('supabase.co') && imageLower.includes('/airforce/'));
    }));
    
    const allJordan = await mergeWithDbPriority('jordan', getJordanImageProducts());
    const jordan = filterValidProducts(allJordan.filter(p => {
      if (!p || !p.image) return false;
      const categoryLower = (p.category || '').toLowerCase();
      const imageLower = (p.image || '').toLowerCase();
      // Only include jordan category products
      return categoryLower === 'jordan' ||
             imageLower.includes('/images/jordan/') || imageLower.includes('/images/Jordan/') ||
             (imageLower.includes('supabase.co') && imageLower.includes('/jordan/'));
    }));
    // Loafers - STRICT: only from loafers category/folder
    const allLoafers = await mergeWithDbPriority('loafers', getLoafersImageProducts());
    const loafers = filterValidProducts(allLoafers.filter(p => {
      if (!p || !p.image) return false;
      const categoryLower = (p.category || '').toLowerCase();
      const imageLower = (p.image || '').toLowerCase();
      // Only include loafers category products - STRICT
      return categoryLower === 'loafers' ||
             imageLower.includes('/images/loafers/') || imageLower.includes('/images/Loafers/') ||
             (imageLower.includes('supabase.co') && imageLower.includes('/loafers/'));
    }));
    
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
    
    // Nike products - STRICT: only from nike category
    const allNike = await mergeWithDbPriority('nike', getNikeImageProducts());
    const nike = filterValidProducts(allNike.filter(p => {
      if (!p || !p.image) return false;
      const categoryLower = (p.category || '').toLowerCase();
      const imageLower = (p.image || '').toLowerCase();
      const nameLower = (p.name || '').toLowerCase();
      // STRICT: Only include nike category products
      // Must be from nike category OR nike folder OR have nike in name/image
      const isNikeCategory = categoryLower === 'nike' || 
                            imageLower.includes('/images/nike/') || imageLower.includes('/images/Nike/') ||
                            (imageLower.includes('supabase.co') && imageLower.includes('/nike/'));
      // Also allow airforce/airmax if they're Nike products (legacy support)
      const isNikeRelated = (categoryLower === 'airforce' || categoryLower === 'airmax') &&
                           (nameLower.includes('nike') || imageLower.includes('nike'));
      // Exclude sports and casuals
      if (categoryLower === 'sports' || categoryLower === 'casuals' || categoryLower === 'casual') {
        return false;
      }
      if (imageLower.includes('/images/sports/') || imageLower.includes('/images/casual/')) {
        return false;
      }
      return isNikeCategory || isNikeRelated;
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
    
    // Filter Airmax 97 products
    const airmax97 = filterValidProducts(filterAirmaxProducts(airmax, 'Airmax 97'));
    
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
        featuredSneakers: shuffle(sneakers).slice(0, 8),
        featuredAirmax: shuffle(airmax).slice(0, 8),
        featuredClarks: shuffle(clarks).slice(0, 8),
        featuredCasuals: shuffle(casuals).slice(0, 8),
        featuredAirforce: shuffle(airforce).slice(0, 8),
        featuredJordan: shuffle(jordan).slice(0, 8),
        featuredLoafers: shuffle(loafers).slice(0, 10),
        featuredSports: shuffle(sports).slice(0, 10),
        featuredNike: shuffle(nike).slice(0, 10),
        featuredVans: shuffle(vans).slice(0, 10),
        heroAirmax97: airmax97,
        heroClarks: clarks,
        heroTimberland: timberland,
      },
      // Enable ISR: regenerate page every 30 seconds to show new uploads automatically
      revalidate: 30,
    };
  } catch (error) {
    console.error('Error loading products:', error);
    return {
      props: {
        featuredOfficials: [],
        featuredSneakers: [],
        featuredAirmax: [],
        featuredClarks: [],
        featuredCasuals: [],
        featuredAirforce: [],
        featuredJordan: [],
        featuredLoafers: [],
        featuredSports: [],
        featuredNike: [],
        featuredVans: [],
        heroAirmax97: [],
        heroClarks: [],
        heroTimberland: [],
      },
    };
  }
};

export default Home;
