import Image from 'next/image';
import { useState } from 'react';
import { ImageRecord } from '@/types/supabase';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized Image Component with:
 * - Automatic format optimization (WebP/AVIF)
 * - Responsive sizing
 * - Lazy loading (except priority images)
 * - Blur placeholder support
 * - Error handling
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate blur placeholder if not provided
  const blurPlaceholder =
    blurDataURL ||
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Fallback for broken images
  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? undefined : { width, height }}
      >
        <span className="text-gray-400 text-sm">Image not available</span>
      </div>
    );
  }

  const imageProps: {
    src: string;
    alt: string;
    className: string;
    quality?: number;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    sizes?: string;
    placeholder?: 'blur';
    blurDataURL?: string;
    onLoad: () => void;
    onError: () => void;
    style: {
      objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
      objectPosition?: string;
    };
  } = {
    src,
    alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    quality,
    priority,
    loading: priority ? undefined : 'lazy',
    sizes,
    placeholder: placeholder === 'blur' ? 'blur' : undefined,
    blurDataURL: placeholder === 'blur' ? blurPlaceholder : undefined,
    onLoad: handleLoad,
    onError: handleError,
    style: {
      objectFit,
      objectPosition,
    },
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  return <Image {...imageProps} width={width} height={height} />;
}

/**
 * Product Image Component - optimized for product cards
 */
export function ProductImage({
  image,
  alt,
  priority = false,
  className = '',
}: {
  image: ImageRecord | string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const src = typeof image === 'string' ? image : image.url;

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={className}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      quality={85}
      placeholder="blur"
      objectFit="cover"
    />
  );
}

/**
 * Hero Image Component - optimized for hero sections
 */
export function HeroImage({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority
      className={className}
      sizes="100vw"
      quality={90}
      placeholder="blur"
      objectFit="cover"
    />
  );
}

/**
 * Thumbnail Image Component - optimized for thumbnails
 */
export function ThumbnailImage({
  src,
  alt,
  width = 150,
  height = 150,
  className = '',
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes="150px"
      quality={75}
      placeholder="blur"
      objectFit="cover"
    />
  );
}
