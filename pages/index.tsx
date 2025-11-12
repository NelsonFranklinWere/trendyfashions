import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/data/products';

const Home = () => {
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/collections"
                className="bg-secondary text-white px-8 py-4 rounded-full font-body font-bold hover:bg-[#d35400] transition-all hover:shadow-2xl text-lg transform hover:scale-105"
              >
                Explore Collections
              </Link>
              <a
                href="https://wa.me/254743869564?text=Hello, I'm interested in your products."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-whatsapp text-white px-8 py-4 rounded-full font-body font-bold hover:bg-[#20BA5A] transition-all hover:shadow-2xl text-lg flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-4">
              Featured Collections
            </h2>
            <p className="text-lg text-text font-body max-w-2xl mx-auto font-medium">
              Discover styles that define comfort, confidence, and class. 
              <span className="block mt-2 text-base">🔥 Hot picks from Nairobi&apos;s fashion scene</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
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
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6">
                5 Years of Trusted Style
              </h2>
              <p className="text-lg text-text font-body mb-6 leading-relaxed font-medium">
                Founded in 2020, Trendy Fashion Zone has served Nairobi&apos;s
                fashion lovers for over five years. From luxury sneakers to
                classic office shoes, our brand stands for comfort,
                authenticity, and confidence.
              </p>
              <p className="text-lg text-text font-body mb-8 leading-relaxed font-medium">
                We believe great style begins from the ground up. 
                <span className="block mt-2 text-base">📍 Based in Nairobi CBD, serving all of Kenya</span>
              </p>
              <Link
                href="/about"
                className="inline-block bg-secondary text-white px-8 py-3 rounded-full font-body font-semibold hover:bg-secondary/90 transition-all hover:shadow-medium"
              >
                Learn More About Us
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl p-8 md:p-12"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-heading font-bold text-primary mb-2">
                    Our Mission
                  </h3>
                  <p className="text-text font-body font-medium">
                    To redefine Kenya&apos;s footwear experience through
                    quality, creativity, and convenience.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold text-primary mb-2">
                    Our Vision
                  </h3>
                  <p className="text-text font-body font-medium">
                    To become the most trusted shoe brand in East Africa.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

