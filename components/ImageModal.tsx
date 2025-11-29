'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SmartImage from './SmartImage';

interface ImageModalProps {
  isOpen: boolean;
  imageSrc: string;
  imageAlt: string;
  onClose: () => void;
}

const ImageModal = ({ isOpen, imageSrc, imageAlt, onClose }: ImageModalProps) => {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={onClose}
            aria-hidden="true"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-white hover:text-secondary transition-colors p-2 rounded-full hover:bg-white/10"
              aria-label="Close image"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-7xl h-[90vh] flex items-center justify-center px-4 py-16"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full max-h-full">
                <SmartImage
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  priority
                  quality={100}
                  placeholder="blur"
                  shimmerWidth={1200}
                  shimmerHeight={800}
                />
              </div>
            </motion.div>

            {/* Click hint text */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm font-body">
              Click anywhere or press ESC to close
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;

