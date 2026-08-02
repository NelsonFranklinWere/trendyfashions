'use client';

import { useState, useEffect, useRef, memo } from 'react';
import FastLink from '@/components/FastLink';
import { Product, formatPrice, getWhatsAppLink } from '@/data/products';
import { cn } from '@/lib/utils';
import useCart from '@/hooks/useCart';
import SmartImage from './SmartImage';
import { productToLineItem } from '@/lib/analytics/items';
import { trackAddToCart } from '@/lib/analytics/google';
import { trackMetaAddToCart, trackMetaMessaging, trackMetaViewContent } from '@/lib/analytics/meta';
import { getProductBrand, isNewArrivalProduct } from '@/lib/products/flags';

export type ProductCardVariant = 'default' | 'sale';

interface ProductCardProps {
  product: Product;
  className?: string;
  /** Above-the-fold images load eagerly for faster LCP */
  priority?: boolean;
  /** sale = image, name, price, WhatsApp order (Meta ads); default = cart + open PDP */
  variant?: ProductCardVariant;
}

const ProductCard = memo(
  ({ product, className, priority = false, variant = 'default' }: ProductCardProps) => {
    const [isAdded, setIsAdded] = useState(false);
    const feedbackTimeout = useRef<NodeJS.Timeout | null>(null);
    const whatsappLink = getWhatsAppLink(product.name, product.price);
    const { addItem } = useCart();
    const brand = getProductBrand(product);
    const isSale = variant === 'sale';
    const productHref = `/products/${encodeURIComponent(product.id)}`;

    useEffect(() => {
      return () => {
        if (feedbackTimeout.current) {
          clearTimeout(feedbackTimeout.current);
        }
      };
    }, []);

    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.fullImageUrl || product.image,
        category: product.category,
      });

      setIsAdded(true);
      if (feedbackTimeout.current) {
        clearTimeout(feedbackTimeout.current);
      }
      feedbackTimeout.current = setTimeout(() => setIsAdded(false), 1600);

      const line = productToLineItem(product);
      trackAddToCart([line]);
      trackMetaAddToCart([line]);
    };

    const handleWhatsApp = () => {
      const line = productToLineItem(product);
      trackMetaViewContent(line);
      trackMetaMessaging('whatsapp_sale_order');
    };

    return (
      <div
        className={cn(
          'bg-white rounded-lg overflow-hidden shadow-soft hover:shadow-large transition-shadow duration-200 group product-card-container',
          className,
        )}
      >
        <FastLink
          href={productHref}
          className="block relative w-full overflow-hidden bg-gradient-to-br from-light to-gray-100 aspect-square p-2 sm:p-3"
          aria-label={`View ${product.name}`}
          onClick={() => trackMetaViewContent(productToLineItem(product))}
        >
          <SmartImage
            src={product.fullImageUrl || product.image}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            sizes="(max-width: 640px) 48vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 240px"
            shimmerWidth={720}
            shimmerHeight={720}
            quality={priority ? 78 : 74}
            fallbackSrc={product.image}
          />
          {isNewArrivalProduct(product) && (
            <div className="absolute top-3 left-3 bg-secondary text-white px-3 py-1.5 rounded-full text-xs font-body font-bold z-10 shadow-lg">
              New
            </div>
          )}
          {isSale && (
            <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-body font-bold z-10 shadow-lg">
              Sale
            </div>
          )}
        </FastLink>

        <div className="p-3 sm:p-4">
          {brand && brand !== 'Trendy Fashion Zone' && (
            <p className="text-[11px] sm:text-xs uppercase tracking-wide text-secondary font-body font-semibold mb-1">
              {brand}
            </p>
          )}
          <FastLink href={productHref} className="block">
            <h3 className="text-sm sm:text-base md:text-lg font-heading font-semibold text-primary mb-1 sm:mb-2 line-clamp-2 hover:text-secondary transition-colors">
              {product.name}
            </h3>
          </FastLink>
          <div className="flex items-center justify-between mb-3">
            <span className="text-base sm:text-lg md:text-xl font-heading font-bold text-secondary">
              {formatPrice(product.price)}
            </span>
            {product.gender && (
              <span className="text-xs text-text font-body bg-light px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                {product.gender}
              </span>
            )}
          </div>

          {isSale ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsApp}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2.5 text-sm font-body font-semibold text-white hover:bg-[#1ebe57] transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order on WhatsApp
            </a>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-body font-semibold transition-colors',
                isAdded
                  ? 'bg-secondary text-white'
                  : 'bg-[#f9c74f] text-primary hover:bg-[#f5b041]',
              )}
              aria-label={
                isAdded ? `Added ${product.name} to cart` : `Add ${product.name} to cart`
              }
              aria-pressed={isAdded}
            >
              {isAdded ? (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Added
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.1} viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to cart
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  },
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;
