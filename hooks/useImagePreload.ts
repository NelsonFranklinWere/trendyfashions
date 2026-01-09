import { useEffect } from 'react';
import { preloadImage, preloadImages } from '@/lib/utils/imagePreloader';

/**
 * Hook to preload critical images
 */
export function useImagePreload(imageUrls: string | string[], priority: boolean = false) {
  useEffect(() => {
    if (!priority) return;

    if (typeof imageUrls === 'string') {
      preloadImage(imageUrls);
    } else {
      preloadImages(imageUrls);
    }
  }, [imageUrls, priority]);
}

/**
 * Hook to preload hero images on page load
 */
export function useHeroImagePreload(imageUrls: string[]) {
  useEffect(() => {
    // Preload first 3 hero images immediately
    const criticalImages = imageUrls.slice(0, 3);
    criticalImages.forEach((url) => preloadImage(url));
  }, [imageUrls]);
}
