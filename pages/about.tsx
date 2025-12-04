import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import Link from 'next/link';

const About = () => {
  return (
    <>
      <NextSeo
        title="About Us - Best Sellers & Quality Original Shoes | Trendy Fashion Zone"
        description="Founded in 2020, Trendy Fashion Zone has served Nairobi's fashion lovers for over five years. Best sellers and quality original shoes - trusted by thousands. Learn about our mission, vision, and commitment to authentic brands."
        canonical="https://trendyfashionzone.co.ke/about"
        openGraph={{
          url: 'https://trendyfashionzone.co.ke/about',
          title: 'About Us - Best Sellers & Quality Original Shoes | Trendy Fashion Zone',
          description: 'Founded in 2020, Trendy Fashion Zone has served Nairobi\'s fashion lovers for over five years. Best sellers and quality original shoes.',
          type: 'website',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: 'about Trendy Fashion Zone, best sellers shoe store Nairobi, quality original shoes Kenya, trusted shoe retailer Nairobi, Moi Avenue shoe shop',
          },
        ]}
      />

      <div className="bg-gradient-to-b from-light/30 to-white py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-4">
              Our Story — Best Sellers & Quality Original Shoes Since 2020
            </h1>
          </motion.div>

          {/* Story Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-white rounded-lg shadow-soft p-8 md:p-12 mb-8">
              <div className="inline-block bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-body font-semibold mb-6">
                Established 2020 • Nairobi, Kenya
              </div>
              <p className="text-lg text-text font-body leading-relaxed mb-6 font-medium">
                Founded in 2020, Trendy Fashion Zone has been Nairobi&apos;s trusted destination for premium footwear 
                for over five years. What started as a small shop on Moi Avenue has grown into one of the city&apos;s 
                most respected shoe retailers, serving thousands of fashion-forward Kenyans.
              </p>
              <p className="text-lg text-text font-body leading-relaxed mb-6 font-medium">
                From luxury sneakers to classic office shoes, our brand stands for comfort, authenticity, and confidence. 
                We&apos;ve built our reputation on three pillars: <strong>quality products, genuine service, and customer satisfaction</strong>.
              </p>
              <p className="text-lg text-text font-body leading-relaxed mb-6 font-medium">
                Located in the heart of Nairobi CBD, we&apos;ve witnessed the city&apos;s fashion evolution firsthand. 
                Our team understands what Nairobi needs—authentic styles, fair prices, and reliable service. 
                We believe great style begins from the ground up, and we&apos;re here to help you step out in confidence.
              </p>
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-heading font-bold text-primary mb-3">Our Nairobi Story</h3>
                <p className="text-text font-body font-medium leading-relaxed">
                  Starting in 2020, we opened our doors on Moi Avenue with a simple mission: bring authentic, 
                  quality footwear to Nairobi at accessible prices. Over the years, we&apos;ve expanded our collection, 
                  improved our service, and built lasting relationships with customers across Kenya. Today, 
                  we&apos;re proud to be part of Nairobi&apos;s vibrant fashion community.
                </p>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-6 md:p-8"
              >
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">
                  Our Mission
                </h2>
                <p className="text-text font-body leading-relaxed font-medium">
                  To redefine Kenya&apos;s footwear experience through quality,
                  creativity, and convenience.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-6 md:p-8"
              >
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">
                  Our Vision
                </h2>
                <p className="text-text font-body leading-relaxed font-medium">
                  To become the most trusted shoe brand in East Africa.
                </p>
              </motion.div>
            </div>

            {/* Brand Values */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-soft p-8 md:p-12 mb-8"
            >
              <h2 className="text-2xl font-heading font-bold text-primary mb-6">
                Why Choose Trendy Fashion Zone?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl mb-3">✨</div>
                  <h3 className="text-lg font-heading font-semibold text-primary mb-2">
                    Quality First
                  </h3>
                  <p className="text-text font-body text-sm font-medium">
                    We source only the finest footwear for our customers.
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="text-lg font-heading font-semibold text-primary mb-2">
                    Fast Delivery
                  </h3>
                  <p className="text-text font-body text-sm font-medium">
                    Quick and reliable delivery across Kenya.
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-3">💬</div>
                  <h3 className="text-lg font-heading font-semibold text-primary mb-2">
                    24/7 Support
                  </h3>
                  <p className="text-text font-body text-sm font-medium">
                    Always here to help via WhatsApp.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Link
                href="/collections"
                className="inline-block bg-secondary text-white px-8 py-4 rounded-full font-body font-semibold hover:bg-secondary/90 transition-all hover:shadow-medium text-lg"
              >
                Explore Collections
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default About;

