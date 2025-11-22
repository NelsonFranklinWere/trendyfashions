import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/data/products';

const Collections = () => {
  return (
    <>
      <NextSeo
        title="Explore Our Exclusive Shoe Collections | Trendy Fashion Zone"
        description="Discover styles that define comfort, confidence, and class. Browse our complete collection of sneakers, officials, casuals, Airforce, Airmax, and Jordans."
        canonical="https://trendyfashionzone.online/collections"
        openGraph={{
          url: 'https://trendyfashionzone.online/collections',
          title: 'Explore Our Exclusive Shoe Collections | Trendy Fashion Zone',
          description:
            'Discover styles that define comfort, confidence, and class. Browse our complete collection.',
        }}
      />

      <div className="bg-gradient-to-b from-light/30 to-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary mb-4">
              Explore Our Exclusive Shoe Collections
            </h1>
            <p className="text-lg md:text-xl text-text font-body max-w-3xl mx-auto font-medium">
              Discover styles that define comfort, confidence, and class.
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collections;

