'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/data/products';

interface ScrollableProductRowProps {
  /** Section title (e.g. "Clarks Officials") */
  title: string;
  /** Short description under the title */
  description?: string;
  /** "View all" link href (e.g. "/collections/mens-officials") */
  viewAllHref: string;
  /** "View all" link label (e.g. "View all" or "View all officials") */
  viewAllLabel?: string;
  /** Products to show in the row (with image + price; invalid ones are filtered out) */
  products: Product[];
  /** Max number of products to show in the row (default 8) */
  maxItems?: number;
  /** Optional section background (e.g. "bg-white" or "bg-light/30") */
  className?: string;
}

/**
 * Horizontal scrollable row of product cards, one per category section.
 * Used on the home page so images display as scrollable per category.
 */
export default function ScrollableProductRow({
  title,
  description,
  viewAllHref,
  viewAllLabel = 'View all',
  products,
  maxItems = 8,
  className = 'bg-white',
}: ScrollableProductRowProps) {
  const valid = (products || [])
    .slice(0, maxItems)
    .filter((p) => p && p.id && p.name && p.image && p.price != null);

  if (valid.length === 0) return null;

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 pr-4"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary mb-1 sm:mb-2 leading-tight">
              {title}
            </h2>
            {description && (
              <p className="text-xs sm:text-sm md:text-base text-text font-body leading-relaxed">
                {description}
              </p>
            )}
          </motion.div>
          <Link
            href={viewAllHref}
            className="text-secondary font-body font-semibold hover:underline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
          >
            {viewAllLabel}
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div
          className="overflow-x-auto pb-4 product-scroll -mx-4 px-4 sm:mx-0 sm:px-0"
          role="region"
          aria-label={`${title} products`}
        >
          <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max">
            {valid.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
