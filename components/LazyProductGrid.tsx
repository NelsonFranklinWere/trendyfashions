'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/data/products';

interface LazyProductGridProps {
  products: Product[];
  className?: string;
}

// Virtual scrolling for large product lists
const LazyProductGrid = ({ products, className }: LazyProductGridProps) => {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ITEMS_PER_LOAD = 20;
  const BUFFER = 10;

  useEffect(() => {
    // Load initial products
    setVisibleProducts(products.slice(0, ITEMS_PER_LOAD + BUFFER));
    setStartIndex(ITEMS_PER_LOAD + BUFFER);
  }, [products]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Intersection Observer for infinite scroll
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && startIndex < products.length) {
            const nextIndex = Math.min(
              startIndex + ITEMS_PER_LOAD,
              products.length
            );
            setVisibleProducts(products.slice(0, nextIndex + BUFFER));
            setStartIndex(nextIndex);
          }
        });
      },
      { rootMargin: '200px' }
    );

    // Observe the last product card
    const lastCard = containerRef.current.lastElementChild;
    if (lastCard) {
      observerRef.current.observe(lastCard);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [startIndex, products]);

  return (
    <div ref={containerRef} className={className}>
      {visibleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default LazyProductGrid;
