'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Product, formatPrice } from '@/data/products';
import useCart from '@/hooks/useCart';
import SmartImage from './SmartImage';

interface RandomProductsCarouselProps {
  products: Product[];
}

const RandomProductsCarousel = ({ products }: RandomProductsCarouselProps) => {
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [isAdded, setIsAdded] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    if (products.length === 0) return;

    // Shuffle and select random products (at least 15 for smooth scrolling)
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.max(15, Math.min(products.length, 20)));
    
    // Duplicate products for seamless infinite loop
    setDisplayProducts([...selected, ...selected]);
  }, [products]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    setIsAdded(product.id);
    setTimeout(() => setIsAdded(null), 2000);
  };

  if (displayProducts.length === 0) return null;

  // Calculate card width including gap (192px mobile, 224px tablet, 256px desktop + 16px gap)
  const cardWidth = 256 + 24; // w-64 (256px) + gap-6 (24px)
  const totalWidth = cardWidth * displayProducts.length;
  const halfWidth = totalWidth / 2;

  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-white to-light/20 py-12 md:py-16">
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2">
          Explore More Styles
        </h2>
        <p className="text-text font-body">
          Discover products from across our collection
        </p>
      </div>
      
      <div className="relative" ref={containerRef}>
        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />
        
        <motion.div
          className="flex gap-4 md:gap-6"
          animate={{
            x: [0, -halfWidth],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 60,
              ease: 'linear',
            },
          }}
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          {displayProducts.map((product, index) => (
            <motion.div
              key={`${product.id}-${index}`}
              className="flex-shrink-0 w-48 md:w-56 lg:w-64 group cursor-pointer"
              onClick={() => handleAddToCart(product)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleAddToCart(product);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Add ${product.name} to cart`}
              whileHover={{ y: -4 }}
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-soft hover:shadow-large transition-all duration-300 h-full flex flex-col relative">
                {/* Added indicator */}
                {isAdded === product.id && (
                  <div className="absolute inset-0 bg-secondary/90 z-20 flex items-center justify-center rounded-lg">
                    <div className="text-white font-heading font-bold text-lg flex items-center gap-2">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      Added to Cart!
                    </div>
                  </div>
                )}

                {/* Product Image */}
                <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-light to-gray-100">
                  <SmartImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 256px"
                    shimmerWidth={400}
                    shimmerHeight={400}
                  />
                </div>

                {/* Product Info */}
                <div className="p-3 md:p-4 flex-1 flex flex-col">
                  <h3 className="text-sm md:text-base font-heading font-semibold text-primary mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="mt-auto pt-2">
                    <span className="text-base md:text-lg font-heading font-bold text-secondary">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RandomProductsCarousel;
