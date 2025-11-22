'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Category } from '@/data/products';
import { cn } from '@/lib/utils';
import ImageModal from './ImageModal';

interface CategoryCardProps {
  category: Category;
  className?: string;
  delay?: number;
}

const CategoryCard = ({ category, className, delay = 0 }: CategoryCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Check if category is airmax, sneakers, or jordan
  const isSpecialCategory = ['airmax', 'sneakers', 'jordan'].includes(
    category.slug?.toLowerCase() || category.id?.toLowerCase() || ''
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className={cn('group', className)}
      >
        <div className="block bg-white rounded-lg overflow-hidden shadow-soft hover:shadow-large transition-all duration-300">
          {/* Category Image - Clickable */}
          <div
            className={cn(
              "relative w-full overflow-hidden bg-gradient-to-br from-light to-gray-100 cursor-pointer",
              isSpecialCategory 
                ? "aspect-[4/3] p-4" 
                : "aspect-square"
            )}
            onClick={() => setIsModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsModalOpen(true);
              }
            }}
            aria-label={`View larger image of ${category.name}`}
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              className={cn(
                "group-hover:scale-110 transition-transform duration-700 ease-out",
                isSpecialCategory ? "object-contain" : "object-cover"
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              quality={90}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Click indicator overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-xl transform group-hover:scale-110">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Info */}
          <Link
            href={`/collections/${category.slug}`}
            className="block p-4 sm:p-5 md:p-6"
          >
            <h3 className="text-base sm:text-lg md:text-xl font-heading font-bold text-primary mb-1 sm:mb-2 group-hover:text-secondary transition-colors">
              {category.name}
            </h3>
            <p className="text-xs sm:text-sm text-text font-body mb-3 sm:mb-4 line-clamp-2">
              {category.description}
            </p>
            <span className="inline-flex items-center text-xs sm:text-sm md:text-base text-secondary font-body font-medium group-hover:translate-x-2 transition-transform">
              Explore
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </motion.div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        imageSrc={category.image}
        imageAlt={category.name}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CategoryCard;

