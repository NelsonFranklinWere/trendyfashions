'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CartBadge from '@/components/CartBadge';
import CartDrawer from '@/components/CartDrawer';
import useCart from '@/hooks/useCart';
import SmartImage from '@/components/SmartImage';
import { OFFICIAL_SUBCATEGORY_FILTERS } from '@/lib/filters/officials';
import { CASUAL_BRAND_FILTERS } from '@/lib/filters/casuals';
import { AIRMAX_SUBCATEGORY_FILTERS } from '@/lib/filters/airmax';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredCollection, setHoveredCollection] = useState<string | null>(null);
  const { itemsCount } = useCart();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/contact', label: 'Contact' },
  ];

  const collectionMenus = {
    officials: {
      label: 'Officials',
      href: '/collections/officials',
      subcategories: OFFICIAL_SUBCATEGORY_FILTERS.map(filter => ({
        label: filter,
        href: `/collections/officials?filter=${encodeURIComponent(filter)}`,
      })),
    },
    casuals: {
      label: 'Casuals',
      href: '/collections/casuals',
      subcategories: CASUAL_BRAND_FILTERS.map(filter => ({
        label: filter,
        href: `/collections/casuals?filter=${encodeURIComponent(filter)}`,
      })),
    },
    airmax: {
      label: 'Airmax',
      href: '/collections/airmax',
      subcategories: AIRMAX_SUBCATEGORY_FILTERS.map(filter => ({
        label: filter,
        href: `/collections/airmax?filter=${encodeURIComponent(filter)}`,
      })),
    },
  };

  const handleMouseEnter = (collection: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setHoveredCollection(collection);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setHoveredCollection(null);
    }, 200);
  };

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
            <div className="hidden md:flex items-center space-x-6">
              {/* Collections with Dropdowns */}
              {Object.entries(collectionMenus).map(([key, menu]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(key)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={menu.href}
                    className="text-text font-body font-medium hover:text-secondary transition-colors relative group flex items-center gap-1"
                  >
                    {menu.label}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        hoveredCollection === key ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
                  </Link>
                  
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {hoveredCollection === key && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-light z-50 py-2"
                        onMouseEnter={() => handleMouseEnter(key)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {menu.subcategories.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-text font-body hover:bg-light hover:text-secondary transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
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
                {/* Collections in Mobile */}
                {Object.entries(collectionMenus).map(([key, menu]) => (
                  <div key={key} className="space-y-1">
                    <Link
                      href={menu.href}
                      onClick={() => setIsOpen(false)}
                      className="block text-text font-body font-semibold hover:text-secondary transition-colors py-2"
                    >
                      {menu.label}
                    </Link>
                    <div className="pl-4 space-y-1">
                      {menu.subcategories.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className="block text-sm text-text/70 font-body hover:text-secondary transition-colors py-1"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
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

