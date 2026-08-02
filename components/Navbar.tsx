'use client';

import FastLink from '@/components/FastLink';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CartBadge from '@/components/CartBadge';
import CartDrawer from '@/components/CartDrawer';
import useCart from '@/hooks/useCart';
import SmartImage from '@/components/SmartImage';
import { mainCategories, type MainCategory } from '@/data/categories-structure';
import AsyncProductSearch from '@/components/AsyncProductSearch';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const renderDesktopDropdown = (category: MainCategory) => {
    if (category.groups?.length) {
      return (
        <div className="absolute top-full left-0 mt-2 w-[22rem] bg-white rounded-lg shadow-2xl border border-light z-50 p-3">
          <div className="grid grid-cols-2 gap-3">
            {category.groups.map((group) => (
              <div key={group.id}>
                <p className="px-2 pb-1 text-xs font-heading font-bold uppercase tracking-wide text-primary">
                  {group.name}
                </p>
                {group.items.map((item) => (
                  <FastLink
                    key={item.id}
                    href={item.href}
                    prefetch
                    className="block px-2 py-1.5 text-sm text-text hover:bg-light hover:text-secondary rounded transition-colors"
                  >
                    {item.name}
                  </FastLink>
                ))}
              </div>
            ))}
          </div>
          <FastLink
            href={category.href}
            className="mt-2 block border-t border-light px-2 pt-2 text-sm font-semibold text-secondary hover:underline"
          >
            View all {category.name}
          </FastLink>
        </div>
      );
    }

    return (
      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-light z-50 py-2">
        {category.subcategories?.map((subcat) => (
          <FastLink
            key={subcat.id}
            href={subcat.href}
            prefetch
            className="block px-4 py-2 text-sm text-text hover:bg-light hover:text-secondary transition-colors"
          >
            {subcat.name}
          </FastLink>
        ))}
      </div>
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-lg backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'
        }`}
        style={{ position: 'fixed' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <FastLink
              href="/"
              className="flex items-center space-x-2 sm:space-x-3 group min-w-0"
              aria-label="Trendy Fashion Zone Home"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-light flex items-center justify-center">
                <SmartImage
                  src="/logo/Logo.jpg"
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
            </FastLink>

            <div className="hidden md:flex items-center space-x-4 lg:space-x-5 relative">
              {mainCategories.map((category) => (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => category.hasSubcategories && setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <FastLink
                    href={category.href}
                    prefetch
                    className="text-xs lg:text-sm text-text font-body font-medium hover:text-secondary transition-colors relative group flex items-center gap-1"
                  >
                    {category.name}
                    {category.hasSubcategories && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
                  </FastLink>

                  <AnimatePresence>
                    {category.hasSubcategories && hoveredCategory === category.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        {renderDesktopDropdown(category)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <AsyncProductSearch compact className="hidden md:block" />

              <CartBadge count={itemsCount} onClick={openCart} />
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <CartBadge count={itemsCount} onClick={openCart} />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-primary hover:bg-light transition-colors"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-light max-h-[80vh] overflow-y-auto"
            >
              <div className="px-4 py-4 space-y-1">
                <div className="pb-3 mb-2 border-b border-light">
                  <AsyncProductSearch compact className="w-full" />
                </div>
                {mainCategories.map((category) => (
                  <div key={category.id} className="border-b border-light/80 pb-2 mb-2">
                    <div className="flex items-center justify-between">
                      <FastLink
                        href={category.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-sm text-text font-body font-semibold hover:text-secondary py-2"
                      >
                        {category.name}
                      </FastLink>
                      {category.hasSubcategories && (
                        <button
                          type="button"
                          className="p-2 text-text"
                          onClick={() =>
                            setMobileExpanded((prev) =>
                              prev === category.id ? null : category.id,
                            )
                          }
                          aria-label={`Expand ${category.name}`}
                        >
                          <svg
                            className={cnExpand(mobileExpanded === category.id)}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {category.hasSubcategories && mobileExpanded === category.id && (
                      <div className="pl-3 space-y-2">
                        {category.groups?.map((group) => (
                          <div key={group.id}>
                            <p className="text-xs font-bold uppercase text-primary/70 py-1">{group.name}</p>
                            {group.items.map((item) => (
                              <FastLink
                                key={item.id}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block text-sm text-text/80 hover:text-secondary py-1"
                              >
                                {item.name}
                              </FastLink>
                            ))}
                          </div>
                        ))}
                        {!category.groups &&
                          category.subcategories?.map((subcat) => (
                            <FastLink
                              key={subcat.id}
                              href={subcat.href}
                              onClick={() => setIsOpen(false)}
                              className="block text-sm text-text/80 hover:text-secondary py-1"
                            >
                              {subcat.name}
                            </FastLink>
                          ))}
                      </div>
                    )}
                  </div>
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

function cnExpand(open: boolean) {
  return `w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`;
}

export default Navbar;
