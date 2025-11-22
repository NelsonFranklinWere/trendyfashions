'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CartBadge from '@/components/CartBadge';
import CartDrawer from '@/components/CartDrawer';
import useCart from '@/hooks/useCart';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/collections', label: 'Collections' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-medium backdrop-blur-sm'
            : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 group"
              aria-label="Trendy Fashion Zone Home"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-light flex items-center justify-center">
                <NextImage
                  src="/images/logos/Logo.jpg"
                  alt="Trendy Fashion Zone Logo"
                  width={64}
                  height={64}
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 48px, 64px"
                  priority
                  unoptimized
                />
              </div>
              <span className="text-xl md:text-2xl font-heading font-bold text-primary group-hover:text-secondary transition-colors hidden sm:block">
                Trendy Fashion Zone
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text font-body font-medium hover:text-secondary transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
              <CartBadge count={itemsCount} onClick={openCart} />
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-3 md:hidden">
              <CartBadge count={itemsCount} onClick={openCart} />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-primary hover:bg-light transition-colors"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-light"
            >
              <div className="px-4 py-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-text font-body font-medium hover:text-secondary transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Navbar;

