/**
 * Image Caching Utilities for Fast Loading
 * Implements aggressive caching strategies for DigitalOcean Spaces CDN
 */

/**
 * Generate cache-friendly image URL with optimization parameters
 * For DigitalOcean Spaces CDN, we can add query parameters for optimization
 */
export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
  }
): string {
  // If it's a DigitalOcean Spaces CDN URL, we can optimize it
  if (url.includes('digitaloceanspaces.com') || url.includes('cdn.digitaloceanspaces.com')) {
    const params = new URLSearchParams();
    
    if (options?.width) {
      params.set('w', options.width.toString());
    }
    
    if (options?.quality) {
      params.set('q', options.quality.toString());
    }
    
    if (options?.format && options.format !== 'auto') {
      params.set('f', options.format);
    }
    
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  }
  
  // For local images, use Next.js Image optimization
  return url;
}

/**
 * Preload critical images for instant display
 */
export function preloadImage(src: string): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Preload multiple images
 */
export function preloadImages(srcs: string[]): void {
  srcs.forEach(src => preloadImage(src));
}

/**
 * Get responsive image sizes for optimal loading
 */
export function getResponsiveSizes(breakpoints?: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}): string {
  const mobile = breakpoints?.mobile || 640;
  const tablet = breakpoints?.tablet || 1024;
  const desktop = breakpoints?.desktop || 1280;
  
  return `(max-width: ${mobile}px) 100vw, (max-width: ${tablet}px) 50vw, (max-width: ${desktop}px) 33vw, ${desktop}px`;
}

