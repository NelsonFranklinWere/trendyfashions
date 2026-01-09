'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import useCart from '@/hooks/useCart';
import CartItemRow from '@/components/CartItemRow';
import { createWhatsAppCheckoutLink, getCartAnalyticsPayload } from '@/lib/cart-utils';
import { formatPrice } from '@/data/products';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, subtotal, itemsCount, incrementItem, decrementItem, removeItem, clearCart } = useCart();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (focusable.length === 0) {
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };

    if (isOpen) {
      lastFocusedElement.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      window.setTimeout(() => {
        closeButtonRef.current?.focus({ preventScroll: true });
      }, 100);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      lastFocusedElement.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const whatsappLink = createWhatsAppCheckoutLink(items, subtotal);

  const handleCheckoutClick = () => {
    if (typeof window !== 'undefined') {
      const payload = getCartAnalyticsPayload(items, subtotal);
      window.dispatchEvent(new CustomEvent('tfz.cart.checkout', { detail: payload }));
      if (typeof window?.dataLayer !== 'undefined' && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: 'cart_checkout', payload });
      }
    }
  };

  const handleContinueShopping = () => {
    onClose();
    if (typeof window !== 'undefined') {
      const payload = getCartAnalyticsPayload(items, subtotal);
      window.dispatchEvent(new CustomEvent('tfz.cart.continue', { detail: payload }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-primary/10 bg-white px-6 py-8 shadow-large"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-heading font-bold text-primary">Your Cart</h2>
                <p className="text-sm font-body text-text/70">{itemsCount} item{itemsCount === 1 ? '' : 's'}</p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="rounded-full border border-primary/10 p-2 text-primary transition-colors hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                aria-label="Close cart"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {items.length ? (
                <motion.ul layout className="space-y-4" aria-live="polite">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onIncrement={incrementItem}
                      onDecrement={decrementItem}
                      onRemove={removeItem}
                    />
                  ))}
                </motion.ul>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-dashed border-primary/20 bg-white/70 p-8 text-center"
                >
                  <p className="text-base font-heading text-primary">Your cart is empty</p>
                  <p className="mt-2 text-sm font-body text-text/70">
                    Add styles you love and send them to us via WhatsApp to place your order.
                  </p>
                </motion.div>
              )}

              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 rounded-2xl border border-primary/10 bg-light/60 p-6 shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-body text-text/70">Subtotal</span>
                    <span className="text-xl font-heading font-semibold text-primary">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/checkout"
                      onClick={handleCheckoutClick}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 text-center font-heading text-white shadow-medium transition-all hover:bg-secondary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                    >
                      Pay with M-Pesa
                    </Link>

                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-center font-heading text-white shadow-medium transition-all hover:bg-[#20BA5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2"
                      onClick={handleCheckoutClick}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.051 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                      </svg>
                      Order via WhatsApp
                    </a>

                    <button
                      type="button"
                      onClick={handleContinueShopping}
                      className="w-full rounded-full border border-primary/20 bg-white px-6 py-3 text-sm font-heading text-primary shadow-soft transition-all hover:border-secondary/50 hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                    >
                      Continue Shopping
                    </button>

                    <button
                      type="button"
                      onClick={clearCart}
                      className="w-full rounded-full border border-red-200 bg-white px-6 py-3 text-xs font-body font-medium text-red-500 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                    >
                      Clear cart
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

