'use client';

import { memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/data/products';
import { cn } from '@/lib/utils';
import SmartImage from './SmartImage';

interface CircularProductCardProps {
  product: Product;
  className?: string;
  delay?: number;
}

const CircularProductCard = memo(({ product, className, delay = 0 }: CircularProductCardProps) => {
  // Map product category to collection page slug
  const getCategorySlug = (category?: string): string => {
    if (!category) return '/collections';
    
    // Normalize category names to match collection slugs
    const categoryMap: Record<string, string> = {
      'officials': 'officials',
      'official': 'officials',
      'formal': 'officials',
      'casuals': 'casuals',
      'casual': 'casuals',
      'vans': 'vans',
      'van': 'vans',
      'custom': 'custom',
      'customized': 'custom',
      'customize': 'custom',
    };
    
    const normalizedCategory = category.toLowerCase().trim();
    return `/collections/${categoryMap[normalizedCategory] || normalizedCategory}`;
  };
  
  const categoryLink = getCategorySlug(product.category);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={cn('flex flex-col items-center group', className)}
    >
      <Link
        href={categoryLink}
        className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-light to-gray-100 shadow-soft hover:shadow-large transition-all duration-300 group-hover:scale-105"
      >
        <SmartImage
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 128px, (max-width: 1024px) 144px, 160px"
          shimmerWidth={400}
          shimmerHeight={400}
          quality={65}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
      </Link>
      
      {/* Product Name */}
      <h3 className="mt-4 text-xs sm:text-sm md:text-base font-heading font-semibold text-primary text-center line-clamp-2 px-2">
        {product.name}
      </h3>
      
      {/* Explore Link */}
      <Link
        href={categoryLink}
        className="mt-1 text-xs sm:text-sm font-body text-secondary hover:text-primary transition-colors duration-200 underline underline-offset-2"
      >
        Explore
      </Link>
    </motion.div>
  );
});

CircularProductCard.displayName = 'CircularProductCard';

export default CircularProductCard;
