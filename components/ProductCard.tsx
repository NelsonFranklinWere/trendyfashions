'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product, formatPrice, getWhatsAppLink } from '@/data/products';
import { cn } from '@/lib/utils';
import ImageModal from './ImageModal';
import useCart from '@/hooks/useCart';
import SmartImage from './SmartImage';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = memo(({ product, className }: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const feedbackTimeout = useRef<NodeJS.Timeout | null>(null);
  const whatsappLink = getWhatsAppLink(product.name);
  const { addItem } = useCart();
  
  // Check if product is in airmax, sneakers, or jordan category
  const isSpecialCategory = ['airmax', 'sneakers', 'jordan'].includes(
    product.category?.toLowerCase() || ''
  ) || 
  product.image?.includes('/airmax/') || 
  product.image?.includes('/sneakers/') || 
  product.image?.includes('/jordan/');

  useEffect(() => {
    return () => {
      if (feedbackTimeout.current) {
        clearTimeout(feedbackTimeout.current);
      }
    };
  }, []);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    setIsAdded(true);
    if (feedbackTimeout.current) {
      clearTimeout(feedbackTimeout.current);
    }
    feedbackTimeout.current = setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cn(
          'bg-white rounded-lg overflow-hidden shadow-soft hover:shadow-large transition-shadow duration-200 group product-card-container',
          className
        )}
        style={{ 
          willChange: 'opacity',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
      >
        {/* Product Image - Clickable */}
        <div
          className={cn(
            "relative w-full overflow-hidden bg-gradient-to-br from-light to-gray-100 cursor-pointer",
            isSpecialCategory 
              ? "aspect-[4/3] p-4" 
              : "aspect-square p-2 sm:p-3"
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
          aria-label={`View larger image of ${product.name}`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className={cn(
              'absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-soft transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary',
              isAdded
                ? 'bg-secondary text-white'
                : 'bg-[#f9c74f] text-primary hover:bg-[#f5b041]'
            )}
            aria-label={
              isAdded
                ? `Added ${product.name} to cart`
                : `Add ${product.name} to cart`
            }
            aria-pressed={isAdded}
          >
            {isAdded ? (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.1}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            )}
          </button>
          <SmartImage
            src={product.image}
            alt={product.name}
            fill
            loading="lazy"
            className={cn(
              "group-hover:scale-105 transition-transform duration-300 ease-out",
              isSpecialCategory ? "object-contain" : "object-cover"
            )}
            sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
            shimmerWidth={isSpecialCategory ? 800 : 600}
            shimmerHeight={isSpecialCategory ? 600 : 600}
            quality={75}
          />
          {product.tags?.includes('New Arrivals') && (
            <div className="absolute top-3 left-3 bg-secondary text-white px-3 py-1.5 rounded-full text-xs font-body font-bold z-10 shadow-lg">
              New
            </div>
          )}
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

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-base md:text-lg font-heading font-semibold text-primary mb-1 sm:mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm text-text font-body mb-2 sm:mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <span className="text-base sm:text-lg md:text-xl font-heading font-bold text-secondary">
            {formatPrice(product.price)}
          </span>
          {product.gender && (
            <span className="text-xs text-text font-body bg-light px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
              {product.gender}
            </span>
          )}
        </div>
      </div>
    </motion.div>

    {/* Image Modal */}
    <ImageModal
      isOpen={isModalOpen}
      imageSrc={product.image}
      imageAlt={product.name}
      onClose={() => setIsModalOpen(false)}
    />
    </>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
