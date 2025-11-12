'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CartItem } from '@/context/CartContext';
import { formatPrice } from '@/data/products';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

const CartItemRow = ({ item, onIncrement, onDecrement, onRemove }: CartItemRowProps) => {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-4 rounded-xl border border-light bg-white/90 p-4 shadow-soft"
    >
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-light">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-heading font-semibold text-primary md:text-base">{item.name}</p>
            <p className="text-xs font-body text-text/70 md:text-sm">{formatPrice(item.price)}</p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-text/50 transition-colors hover:text-secondary focus:outline-none focus-visible:text-secondary"
            aria-label={`Remove ${item.name} from cart`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="inline-flex items-center rounded-full border border-primary/15 bg-white shadow-soft">
            <button
              type="button"
              onClick={() => onDecrement(item.id)}
              className="grid h-8 w-8 place-content-center text-primary transition-colors hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <span className="text-lg">−</span>
            </button>
            <span className="w-8 text-center text-sm font-heading text-primary" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onIncrement(item.id)}
              className="grid h-8 w-8 place-content-center text-primary transition-colors hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              aria-label={`Increase quantity of ${item.name}`}
            >
              <span className="text-lg">+</span>
            </button>
          </div>

          <p className="text-sm font-heading text-secondary md:text-base">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </motion.li>
  );
};

export default CartItemRow;


