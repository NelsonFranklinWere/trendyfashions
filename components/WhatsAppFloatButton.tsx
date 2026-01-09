import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const WhatsAppFloatButton = () => {
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Hide popup after 5 seconds on initial load if not hovered
    if (!isHovered) {
      timeoutRef.current = setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovered, mounted]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowPopup(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Hide popup after a short delay when mouse leaves
    timeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 300);
  };

  const buttonContent = (
    <div
      className="fixed bottom-6 right-6 z-[9999] pointer-events-auto"
      style={{ 
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        willChange: 'transform',
        transform: 'translateZ(0)', // Force GPU acceleration
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        isolation: 'isolate' // Create new stacking context
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute bottom-20 right-0 mb-2"
          >
            <div className="bg-white rounded-lg shadow-2xl px-4 py-3 max-w-[200px] border border-gray-100">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 pt-1">
                  <div className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1a1a2e] mb-1">
                    Trendy fashions
                  </p>
                  <p className="text-xs text-[#2c3e50]">
                    Chat with us
                  </p>
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close popup"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Arrow pointing down */}
              <div className="absolute bottom-0 right-6 transform translate-y-full">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        href="https://wa.me/254712417489?text=Hello%20Trendy%20Fashion%20Zone%2C%20let%27s%20chat%20shoes."
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-[#20BA5A] hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#20BA5A]"
        aria-label="Chat with Trendy Fashion Zone on WhatsApp"
        onMouseEnter={handleMouseEnter}
      >
        <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </Link>
    </div>
  );

  if (!mounted || typeof window === 'undefined') {
    return null;
  }

  // Use portal to render directly to body, bypassing any parent container issues
  return createPortal(buttonContent, document.body);
};

export default WhatsAppFloatButton;

