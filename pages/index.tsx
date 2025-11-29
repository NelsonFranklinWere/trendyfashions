import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
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
import { filterAirmaxProducts } from '@/lib/filters/airmax';

interface HomeProps {
  featuredOfficials: Product[];
  featuredSneakers: Product[];
  featuredAirmax: Product[];
  featuredClarks: Product[];
  featuredCasuals: Product[];
  featuredAirforce: Product[];
  featuredJordan: Product[];
  heroAirmax97: Product[];
  heroClarks: Product[];
}


const Home = ({
  featuredOfficials,
  featuredSneakers,
  featuredAirmax,
  featuredClarks,
  featuredCasuals,
  featuredAirforce,
  featuredJordan,
  heroAirmax97,
  heroClarks,
}: HomeProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get 3 clarks images and 2 airmax 97 images
  const clarksImages = heroClarks.slice(0, 3).map(p => p.image).filter(Boolean);
  const airmax97Images = heroAirmax97.slice(0, 2).map(p => p.image).filter(Boolean);
  const carouselImages = [...clarksImages, ...airmax97Images];

  useEffect(() => {
    if (carouselImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

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

      {/* Hero Section with Background Carousel */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white py-12 md:py-20 overflow-hidden">
        {/* Background Carousel */}
        {carouselImages.length > 0 && (
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={carouselImages[currentImageIndex]}
                  alt="Featured Product"
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                  quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90" />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 z-[1]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold mb-4 md:mb-6">
              Nairobi&apos;s Premier Shoe Destination
              <br />
              <span className="text-secondary">Trendy Fashion Zone</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white font-body max-w-3xl mx-auto mb-6 md:mb-8 font-medium">
              From Moi Avenue to your doorstep — Authentic sneakers, stylish kicks, and premium footwear. 
              <span className="block mt-2 text-base md:text-lg">📍 Located in Nairobi CBD | 🚚 Free delivery in Nairobi</span>
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
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredOfficials.slice(0, 8).map((product) => (
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
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredSneakers.slice(0, 8).map((product) => (
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
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredAirmax.slice(0, 5).map((product) => (
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
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredClarks.slice(0, 8).map((product) => (
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
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredCasuals.slice(0, 5).map((product) => (
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
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredAirforce.slice(0, 8).map((product) => (
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
            <div className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
                {featuredJordan.slice(0, 8).map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
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

          <div className="grid grid-cols-4 gap-4 md:gap-6 lg:gap-8">
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
    
    // Filter Airmax 97 products
    const airmax97 = filterAirmaxProducts(airmax, 'Airmax 97');

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
        heroAirmax97: airmax97,
        heroClarks: clarks,
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
        heroAirmax97: [],
        heroClarks: [],
      },
    };
  }
};

export default Home;
