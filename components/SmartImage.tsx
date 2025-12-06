'use client';

import { useMemo, useState } from 'react';
import NextImage, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

type SmartImageProps = ImageProps & {
  /**
   * Optional width/height values for the shimmer placeholder.
   * Useful when the rendered image is dramatically smaller or larger
   * than the default shimmer dimensions.
   */
  shimmerWidth?: number;
  shimmerHeight?: number;
};

const shimmer = (width: number, height: number) => `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#f4f4f4" offset="20%" />
        <stop stop-color="#e5e5e5" offset="50%" />
        <stop stop-color="#f4f4f4" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="#f4f4f4" />
    <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1.2s" repeatCount="indefinite" />
  </svg>
`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

const SmartImage = ({
  className,
  quality = 75, // Reduced from 80 for faster loading
  placeholder = 'blur',
  shimmerWidth = 700,
  shimmerHeight = 475,
  blurDataURL,
  onLoadingComplete,
  onLoad,
  ...props
}: SmartImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const fallbackBlur = useMemo(() => {
    if (placeholder !== 'blur') return undefined;
    if (blurDataURL) return blurDataURL;
    const width = typeof shimmerWidth === 'number' ? shimmerWidth : Number(shimmerWidth) || 700;
    const height = typeof shimmerHeight === 'number' ? shimmerHeight : Number(shimmerHeight) || 475;
    return `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;
  }, [placeholder, blurDataURL, shimmerWidth, shimmerHeight]);

  // Optimize sizes for responsive loading
  const optimizedSizes = props.sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  // Determine if this is a Supabase Storage URL
  const isSupabaseUrl = typeof props.src === 'string' && 
    (props.src.includes('supabase.co') || props.src.includes('supabase.in'));

  // Use lower quality for Supabase URLs to leverage their CDN optimization
  const qualityNum = typeof quality === 'number' ? quality : Number(quality) || 75;
  const optimizedQuality = isSupabaseUrl ? Math.min(qualityNum, 75) : qualityNum;

  return (
    <NextImage
      {...props}
      quality={optimizedQuality}
      placeholder={placeholder}
      blurDataURL={fallbackBlur}
      loading={props.loading || (props.priority ? 'eager' : 'lazy')}
      sizes={optimizedSizes}
      // Enable automatic format optimization (WebP/AVIF)
      className={cn(
        'duration-300 ease-out will-change-transform',
        isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-[1.02]',
        className,
      )}
      onLoad={(event) => {
        setIsLoaded(true);
        onLoad?.(event);
        onLoadingComplete?.(event.currentTarget);
      }}
    />
  );
};

export default SmartImage;


