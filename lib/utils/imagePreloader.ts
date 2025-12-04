/**
 * Image Preloader - Preload critical images for faster perceived performance
 */

export function preloadImage(src: string, as: 'image' = 'image'): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

export function preloadImages(srcs: string[]): void {
  srcs.forEach((src) => preloadImage(src));
}

/**
 * Preload hero/critical images
 */
export function preloadHeroImages(imageUrls: string[]): void {
  if (typeof window === 'undefined') return;
  
  imageUrls.forEach((url) => {
    preloadImage(url);
  });
}

/**
 * Lazy load images with Intersection Observer
 */
export function setupLazyLoading(selector: string = 'img[data-lazy]'): () => void {
  if (typeof window === 'undefined') return () => {};

  const images = document.querySelectorAll<HTMLImageElement>(selector);
  
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all images immediately
    images.forEach((img) => {
      if (img.dataset.lazy) {
        img.src = img.dataset.lazy;
        img.removeAttribute('data-lazy');
      }
    });
    return () => {};
  }

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.lazy) {
          img.src = img.dataset.lazy;
          img.removeAttribute('data-lazy');
          imageObserver.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px', // Start loading 50px before image enters viewport
  });

  images.forEach((img) => imageObserver.observe(img));

  return () => {
    images.forEach((img) => imageObserver.unobserve(img));
    imageObserver.disconnect();
  };
}
