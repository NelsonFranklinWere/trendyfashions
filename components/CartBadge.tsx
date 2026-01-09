'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '@/context/CartContext';

interface CartBadgeProps {
  count: number;
  onClick: () => void;
  className?: string;
}

const CartBadge = ({ count, onClick, className }: CartBadgeProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasItems = mounted && count > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={hasItems ? `Open cart with ${count} items` : 'Open cart'}
      className={`relative inline-flex items-center justify-center rounded-full border border-primary/10 bg-white px-3 py-2 text-primary shadow-soft transition-all hover:scale-[1.02] hover:border-secondary/40 hover:shadow-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${className ?? ''}`}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <AnimatePresence>
        {hasItems && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-2 -right-1 min-w-[1.5rem] rounded-full bg-secondary px-1.5 py-0.5 text-center text-xs font-heading text-white shadow-lg"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export type CartBadgeItem = CartItem;

export default CartBadge;


