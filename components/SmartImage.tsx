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
  quality = 70,
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
    return `data:image/svg+xml;base64,${toBase64(shimmer(shimmerWidth, shimmerHeight))}`;
  }, [placeholder, blurDataURL, shimmerWidth, shimmerHeight]);

  return (
    <NextImage
      {...props}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={fallbackBlur}
      className={cn(
        'duration-500 ease-out will-change-transform',
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


