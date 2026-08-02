'use client';

import { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/data/products';

interface LazyProductGridProps {
  products: Product[];
  className?: string;
  /** How many cards to paint initially (above the fold) */
  initialCount?: number;
  /** Batch size when scrolling near the bottom */
  batchSize?: number;
  variant?: 'default' | 'sale';
}

/**
 * Renders product cards in batches so the browser isn't asked to fetch
 * every image on a large collection at once.
 */
const LazyProductGrid = ({
  products,
  className,
  initialCount = 12,
  batchSize = 16,
  variant = 'default',
}: LazyProductGridProps) => {
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(initialCount, products.length),
  );
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(Math.min(initialCount, products.length));
  }, [products, initialCount]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || visibleCount >= products.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisibleCount((prev) => Math.min(prev + batchSize, products.length));
        }
      },
      { rootMargin: '400px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visibleCount, products.length, batchSize]);

  const visible = products.slice(0, visibleCount);

  return (
    <>
      <div className={className}>
        {visible.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 4}
            variant={variant}
            className="animate-fade-in"
          />
        ))}
      </div>
      {visibleCount < products.length && (
        <div ref={sentinelRef} className="h-8 w-full" aria-hidden />
      )}
    </>
  );
};

export default LazyProductGrid;
