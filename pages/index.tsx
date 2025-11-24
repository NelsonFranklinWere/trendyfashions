import Link from 'next/link';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import { categories, Product } from '@/data/products';
import { getOfficialImageProducts } from '@/lib/server/officialImageProducts';
import { getSneakersImageProducts } from '@/lib/server/sneakersImageProducts';
import { getAirmaxImageProducts } from '@/lib/server/airmaxImageProducts';
import { getCasualImageProducts } from '@/lib/server/casualImageProducts';
import { getAirforceImageProducts } from '@/lib/server/airforceImageProducts';
import { getJordanImageProducts } from '@/lib/server/jordanImageProducts';
import { filterOfficialsProducts } from '@/lib/filters/officials';

interface HomeProps {
  featuredOfficials: Product[];
  featuredSneakers: Product[];
  featuredAirmax: Product[];
  featuredClarks: Product[];
  featuredCasuals: Product[];
  featuredAirforce: Product[];
  featuredJordan: Product[];
}

const Home = ({
  featuredOfficials,
  featuredSneakers,
  featuredAirmax,
  featuredClarks,
  featuredCasuals,
  featuredAirforce,
  featuredJordan,
}: HomeProps) => {
  return (
    <>
      <NextSeo
        title="Trendy Fashion Zone | Nairobi's #1 Shoe Store"
        description="Shop sneakers, officials, casuals, Airforce, Airmax, and Jordans in Nairobi. 5 years of trusted fashion at Trendy Fashion Zone."
        canonical="https://trendyfashionzone.online"
        openGraph={{
          url: 'https://trendyfashionzone.online',
          title: 'Trendy Fashion Zone | Nairobi\'s #1 Shoe Store',
          description: 'Shop sneakers, officials, casuals, Airforce, Airmax, and Jordans in Nairobi. 5 years of trusted fashion at Trendy Fashion Zone.',
          images: [
            {
              url: 'https://trendyfashionzone.online/images/featured-banner.jpg',
              width: 1200,
              height: 630,
              alt: 'Trendy Fashion Zone',
            },
          ],
          siteName: 'Trendy Fashion Zone',
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: '@TrendyFashionZone',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content:
              'shoes Nairobi, sneakers Kenya, Airforce, Airmax, Trendy Fashion Zone, Moi Avenue shoe shop',
          },
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6">
              Nairobi&apos;s Premier Shoe Destination
              <br />
              <span className="text-secondary">Trendy Fashion Zone</span>
            </h1>
            <p className="text-xl md:text-2xl text-white font-body max-w-3xl mx-auto mb-8 font-medium">
              From Moi Avenue to your doorstep — Authentic sneakers, stylish kicks, and premium footwear. 
              <span className="block mt-2 text-lg">📍 Located in Nairobi CBD | 🚚 Free delivery in Nairobi</span>
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
            <div className="flex items-center justify-between mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-primary mb-2">
                  Professional Office Shoes
                </h2>
                <p className="text-text font-body">
                  Premium formal footwear for the modern professional
                </p>
              </motion.div>
              <Link
                href="/collections/officials"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-2"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll">
              <div className="flex gap-4 md:gap-6 min-w-max">
                {featuredOfficials.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-48 sm:w-56 md:w-64">
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
            <div className="flex items-center justify-between mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-primary mb-2">
                  Popular Sneakers
                </h2>
                <p className="text-text font-body">
                  Classic and modern sneakers for every style
                </p>
              </motion.div>
              <Link
                href="/collections/sneakers"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-2"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll">
              <div className="flex gap-4 md:gap-6 min-w-max">
                {featuredSneakers.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-48 sm:w-56 md:w-64">
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
            <div className="flex items-center justify-between mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-primary mb-2">
                  Nike Air Max Collection
                </h2>
                <p className="text-text font-body">
                  Iconic running and lifestyle shoes
                </p>
              </motion.div>
              <Link
                href="/collections/airmax"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-2"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll">
              <div className="flex gap-4 md:gap-6 min-w-max">
                {featuredAirmax.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-48 sm:w-56 md:w-64">
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
            <div className="flex items-center justify-between mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-primary mb-2">
                  Clarks Official
                </h2>
                <p className="text-text font-body">
                  Premium professional footwear
                </p>
              </motion.div>
              <Link
                href="/collections/officials?filter=Clarks"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-2"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll">
              <div className="flex gap-4 md:gap-6 min-w-max">
                {featuredClarks.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-48 sm:w-56 md:w-64">
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
            <div className="flex items-center justify-between mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-primary mb-2">
                  Stylish Casual Shoes
                </h2>
                <p className="text-text font-body">
                  Everyday comfort meets style
                </p>
              </motion.div>
              <Link
                href="/collections/casuals"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-2"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll">
              <div className="flex gap-4 md:gap-6 min-w-max">
                {featuredCasuals.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-48 sm:w-56 md:w-64">
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
            <div className="flex items-center justify-between mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-primary mb-2">
                  Nike Air Force 1
                </h2>
                <p className="text-text font-body">
                  Classic and customized designs
                </p>
              </motion.div>
              <Link
                href="/collections/airforce"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-2"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll">
              <div className="flex gap-4 md:gap-6 min-w-max">
                {featuredAirforce.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-48 sm:w-56 md:w-64">
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
            <div className="flex items-center justify-between mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-primary mb-2">
                  Air Jordan Collection
                </h2>
                <p className="text-text font-body">
                  Iconic basketball sneakers
                </p>
              </motion.div>
              <Link
                href="/collections/jordan"
                className="text-secondary font-body font-semibold hover:underline flex items-center gap-2"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="overflow-x-auto pb-4 product-scroll">
              <div className="flex gap-4 md:gap-6 min-w-max">
                {featuredJordan.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-48 sm:w-56 md:w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Collections Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-4">
              Premium Collections That Define Your Style
            </h2>
            <p className="text-lg text-text font-body max-w-2xl mx-auto font-medium">
              Every collection is handpicked for quality, authenticity, and style. From office elegance to street-ready sneakers—find your perfect match and stand out from the crowd.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {categories
              .filter((cat) => cat.featured)
              .slice(0, 8)
              .map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  delay={index * 0.1}
                />
              ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '5+', label: 'Years Experience', icon: '🏆' },
              { number: '10K+', label: 'Happy Customers', icon: '👥' },
              { number: '500+', label: 'Shoe Styles', icon: '👟' },
              { number: '24/7', label: 'Customer Support', icon: '💬' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-text font-body font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-body font-semibold mb-4">
                Since 2020 • Nairobi Based
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-6">
                5+ Years of Trusted Style in Nairobi
              </h2>
              <p className="text-lg text-text font-body mb-6 leading-relaxed font-medium">
                Founded in 2020, Trendy Fashion Zone has been Nairobi&apos;s go-to destination for premium footwear. 
                From the bustling streets of Moi Avenue to your doorstep, we&apos;ve served thousands of fashion-forward 
                Kenyans with authentic sneakers, stylish casuals, and professional office shoes.
              </p>
              <p className="text-lg text-text font-body mb-6 leading-relaxed font-medium">
                Our journey started with a simple belief: <strong>great style begins from the ground up</strong>. 
                Today, we&apos;re proud to be one of Nairobi&apos;s most trusted shoe retailers, known for quality, 
                authenticity, and exceptional customer service.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-text font-body">
                  <span className="text-secondary">📍</span>
                  <span className="font-medium">Nairobi CBD, Moi Avenue</span>
                </div>
                <div className="flex items-center gap-2 text-text font-body">
                  <span className="text-secondary">🚚</span>
                  <span className="font-medium">Free Delivery in Nairobi</span>
                </div>
                <div className="flex items-center gap-2 text-text font-body">
                  <span className="text-secondary">💳</span>
                  <span className="font-medium">M-Pesa & Cash Accepted</span>
                </div>
              </div>
              <div className="flex flex-row gap-3 sm:gap-4">
                <Link
                  href="/about"
                  className="inline-block bg-secondary text-white px-6 py-3 sm:px-8 rounded-full font-body font-semibold hover:bg-secondary/90 transition-all hover:shadow-medium text-center text-sm sm:text-base whitespace-nowrap flex-1 sm:flex-none"
                >
                  Our Story
                </Link>
                <a
                  href="https://wa.me/254743869564?text=Hello, I'd like to visit your store."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border-2 border-secondary text-secondary px-6 py-3 sm:px-8 rounded-full font-body font-semibold hover:bg-secondary hover:text-white transition-all text-center text-sm sm:text-base whitespace-nowrap flex-1 sm:flex-none"
                >
                  Visit Our Store
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-secondary/10 via-accent/5 to-primary/5 rounded-2xl p-8 md:p-12 shadow-soft"
            >
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-primary">
                      Our Mission
                    </h3>
                  </div>
                  <p className="text-text font-body font-medium leading-relaxed">
                    To redefine Kenya&apos;s footwear experience through quality, creativity, and convenience. 
                    We bring the world&apos;s best shoe brands to Nairobi&apos;s doorstep.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🌟</span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-primary">
                      Our Vision
                    </h3>
                  </div>
                  <p className="text-text font-body font-medium leading-relaxed">
                    To become East Africa&apos;s most trusted and innovative footwear destination, 
                    setting the standard for quality and customer experience.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💎</span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-primary">
                      Our Values
                    </h3>
                  </div>
                  <p className="text-text font-body font-medium leading-relaxed">
                    Authenticity, Quality, Customer First. Every shoe we sell is genuine, 
                    every customer is valued, and every interaction matters.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-light/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-4">
              Why Nairobi Chooses Trendy Fashion Zone
            </h2>
            <p className="text-lg text-text font-body max-w-2xl mx-auto font-medium">
              Experience the difference that 5+ years of expertise makes
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {[
              {
                icon: '✅',
                title: '100% Authentic',
                description: 'Every shoe is genuine and verified. No fakes, no compromises. Your style deserves the real deal.',
              },
              {
                icon: '🚀',
                title: 'Fast Delivery',
                description: 'Free delivery across Nairobi within 24 hours. Same-day delivery available for urgent orders.',
              },
              {
                icon: '💰',
                title: 'Best Prices',
                description: 'Competitive pricing without sacrificing quality. We believe great style should be accessible.',
              },
              {
                icon: '💬',
                title: '24/7 Support',
                description: 'WhatsApp us anytime. Our team is always ready to help you find the perfect pair.',
              },
              {
                icon: '🏪',
                title: 'Physical Store',
                description: 'Visit us at Moi Avenue, Nairobi CBD. Try before you buy with our friendly in-store experience.',
              },
              {
                icon: '🔄',
                title: 'Easy Returns',
                description: 'Not satisfied? We offer hassle-free returns and exchanges. Your happiness is our priority.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-soft hover:shadow-medium transition-all border border-primary/5"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="text-base sm:text-lg md:text-xl font-heading font-bold text-primary mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-text font-body font-medium leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Visit Us in Nairobi
            </h2>
            <p className="text-xl md:text-2xl font-body mb-8 max-w-3xl mx-auto font-medium">
              Located in the heart of Nairobi CBD, we&apos;re easily accessible and ready to serve you. 
              Walk-ins welcome, or order online for delivery.
            </p>
            <div className="flex flex-row gap-3 sm:gap-4 justify-center items-stretch">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-left flex-1 sm:flex-none sm:min-w-[280px]">
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="text-2xl sm:text-3xl">📍</span>
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg mb-2">Our Location</h3>
                    <p className="font-body font-medium text-sm sm:text-base">
                      Moi Avenue, Nairobi CBD<br />
                      Near City Market
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-left flex-1 sm:flex-none sm:min-w-[280px]">
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="text-2xl sm:text-3xl">📞</span>
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg mb-2">Get in Touch</h3>
                    <p className="font-body font-medium text-sm sm:text-base">
                      WhatsApp: +254 743 869 564<br />
                      WhatsApp: +254 792 264 228<br />
                      Available 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="https://wa.me/254743869564?text=Hello, I'd like to visit your store in Nairobi."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-body font-bold hover:bg-[#d35400] transition-all hover:shadow-2xl text-sm sm:text-lg flex items-center justify-center gap-2 whitespace-nowrap flex-1 sm:flex-none"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Get Directions
              </a>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-body font-bold hover:bg-white hover:text-primary transition-all text-sm sm:text-lg whitespace-nowrap flex-1 sm:flex-none text-center"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    // Get products from each category
    const officials = getOfficialImageProducts();
    const sneakers = getSneakersImageProducts();
    const airmax = getAirmaxImageProducts();
    const casuals = getCasualImageProducts();
    const airforce = getAirforceImageProducts();
    const jordan = getJordanImageProducts();

    // Filter Clarks products from officials
    const clarks = filterOfficialsProducts(officials, 'Clarks');

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
        featuredOfficials: shuffle(officials).slice(0, 5),
        featuredSneakers: shuffle(sneakers).slice(0, 5),
        featuredAirmax: shuffle(airmax).slice(0, 5),
        featuredClarks: shuffle(clarks).slice(0, 10),
        featuredCasuals: shuffle(casuals).slice(0, 5),
        featuredAirforce: shuffle(airforce).slice(0, 5),
        featuredJordan: shuffle(jordan).slice(0, 5),
      },
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
      },
    };
  }
};

export default Home;

