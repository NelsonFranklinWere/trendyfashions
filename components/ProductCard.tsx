'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product, formatPrice, getWhatsAppLink } from '@/data/products';
import { cn } from '@/lib/utils';
import ImageModal from './ImageModal';
import useCart from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const feedbackTimeout = useRef<NodeJS.Timeout | null>(null);
  const whatsappLink = getWhatsAppLink(product.name);
  const { addItem } = useCart();

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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={cn(
          'bg-white rounded-lg overflow-hidden shadow-soft hover:shadow-large transition-all duration-300 group',
          className
        )}
      >
        {/* Product Image - Clickable */}
        <div
          className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-light to-gray-100 cursor-pointer"
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
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={90}
            loading="lazy"
          />
          {product.tags?.includes('New Arrivals') && (
            <div className="absolute top-3 right-3 bg-secondary text-white px-3 py-1.5 rounded-full text-xs font-body font-bold z-10 shadow-lg">
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

        {/* Action Buttons */}
        <div className="flex gap-1.5 sm:gap-2">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-whatsapp text-white text-center py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm md:text-base font-body font-semibold hover:bg-[#20BA5A] transition-all hover:shadow-lg flex items-center justify-center gap-2"
            aria-label={`Order ${product.name}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span className="hidden sm:inline">Order</span>
            <span className="sm:hidden">Order</span>
          </a>
          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg border border-text/20 px-2 py-1.5 text-xs font-body font-semibold transition-colors sm:px-3 sm:py-2 sm:text-sm md:text-base',
              isAdded
                ? 'bg-secondary text-white border-secondary'
                : 'bg-white text-primary hover:bg-light',
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {isAdded ? 'Added!' : 'Cart'}
          </button>
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
};

export default ProductCard;

