'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CartBadge from '@/components/CartBadge';
import CartDrawer from '@/components/CartDrawer';
import useCart from '@/hooks/useCart';
import SmartImage from '@/components/SmartImage';
import { mainCategories } from '@/data/categories-structure';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemsCount } = useCart();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-lg backdrop-blur-sm'
            : 'bg-white/95 backdrop-blur-sm'
        }`}
        style={{ position: 'fixed' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 sm:space-x-3 group min-w-0"
              aria-label="Trendy Fashion Zone Home"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-light flex items-center justify-center">
                <SmartImage
                  src="/images/logos/Logo.jpg"
                  alt="Trendy Fashion Zone Logo"
                  width={64}
                  height={64}
                  className="object-contain rounded-lg"
                  sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 64px"
                  priority
                  shimmerWidth={100}
                  shimmerHeight={100}
                />
              </div>
              <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-heading font-bold text-primary group-hover:text-secondary transition-colors whitespace-nowrap truncate">
                Trendy Fashion Zone
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 relative">
              {mainCategories.map((category) => (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => category.hasSubcategories && setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    href={category.href}
                    className="text-text font-body font-medium hover:text-secondary transition-colors relative group flex items-center gap-1"
                  >
                    {category.name}
                    {category.hasSubcategories && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
                  </Link>
                  
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {category.hasSubcategories && hoveredCategory === category.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-light z-50 py-2"
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <div className="max-h-96 overflow-y-auto">
                          {category.subcategories?.map((subcat) => (
                            <Link
                              key={subcat.id}
                              href={subcat.href}
                              className="block px-4 py-2 text-sm text-text hover:bg-light hover:text-secondary transition-colors"
                            >
                              {subcat.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              <Link
                href="/contact"
                className="text-text font-body font-medium hover:text-secondary transition-colors relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
              </Link>
              
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
              <div className="px-4 py-4 space-y-2">
                {mainCategories.map((category) => (
                  <div key={category.id}>
                    <Link
                      href={category.href}
                      onClick={() => setIsOpen(false)}
                      className="block text-text font-body font-medium hover:text-secondary transition-colors py-2"
                    >
                      {category.name}
                    </Link>
                    {category.hasSubcategories && category.subcategories && (
                      <div className="pl-4 space-y-1 border-l-2 border-light">
                        {category.subcategories.slice(0, 6).map((subcat) => (
                          <Link
                            key={subcat.id}
                            href={subcat.href}
                            onClick={() => setIsOpen(false)}
                            className="block text-sm text-text/70 hover:text-secondary transition-colors py-1"
                          >
                            {subcat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block text-text font-body font-medium hover:text-secondary transition-colors py-2"
                >
                  Contact
                </Link>
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

