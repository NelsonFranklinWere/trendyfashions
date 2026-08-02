'use client';

import { useEffect, useMemo, useState } from 'react';
import NextImage, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import {
  isPreoptimizedUpload,
  toLocalImageSrc,
} from '@/lib/images/uploadUrls';

type SmartImageProps = ImageProps & {
  /** Retry with this URL if the primary src fails (e.g. full image when thumb 404s) */
  fallbackSrc?: string;
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

function normalizeSrc(src: ImageProps['src']): ImageProps['src'] {
  if (typeof src !== 'string') return src;
  const local = toLocalImageSrc(src);
  return local || src;
}

const SmartImage = ({
  className,
  quality = 75,
  placeholder = 'blur',
  shimmerWidth = 700,
  shimmerHeight = 475,
  blurDataURL,
  fallbackSrc,
  onLoadingComplete,
  onLoad,
  src,
  decoding = 'async',
  ...props
}: SmartImageProps) => {
  const normalizedSrc = useMemo(() => normalizeSrc(src), [src]);
  const normalizedFallback =
    typeof fallbackSrc === 'string' ? toLocalImageSrc(fallbackSrc) || fallbackSrc : undefined;

  const [activeSrc, setActiveSrc] = useState(normalizedSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setActiveSrc(normalizedSrc);
    setIsLoaded(false);
    setHasError(false);
  }, [normalizedSrc]);

  const fallbackBlur = useMemo(() => {
    if (placeholder !== 'blur') return undefined;
    if (blurDataURL) return blurDataURL;
    const width = typeof shimmerWidth === 'number' ? shimmerWidth : Number(shimmerWidth) || 700;
    const height = typeof shimmerHeight === 'number' ? shimmerHeight : Number(shimmerHeight) || 475;
    return `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;
  }, [placeholder, blurDataURL, shimmerWidth, shimmerHeight]);

  const optimizedSizes = props.sizes || '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px';

  const srcStr = typeof activeSrc === 'string' ? activeSrc : '';
  const isRemoteHttp =
    srcStr.startsWith('http://') || srcStr.startsWith('https://');
  // Local /uploads WebP is already encoded for the network — skip CPU re-encode on the VPS.
  // Remote CDNs: also skip the optimizer.
  const skipOptimizer =
    (typeof activeSrc === 'string' && isPreoptimizedUpload(activeSrc)) ||
    (isRemoteHttp &&
      (srcStr.includes('digitaloceanspaces.com') ||
        srcStr.includes('cdn.digitaloceanspaces.com') ||
        srcStr.includes('supabase.co')));

  const qualityNum = typeof quality === 'number' ? quality : Number(quality) || 75;
  // Quality only applied when Next optimizes; keep as-is for pre-encoded WebPs.
  const optimizedQuality = qualityNum;
  const shouldPriority = props.priority || false;
  const effectivePlaceholder =
    isRemoteHttp && !srcStr.includes('trendyfashionzone.co.ke') ? 'empty' : placeholder;

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          className,
        )}
        style={{ width: props.width, height: props.height }}
      >
        <span className="text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <NextImage
      {...props}
      src={activeSrc}
      quality={optimizedQuality}
      placeholder={effectivePlaceholder}
      blurDataURL={effectivePlaceholder === 'blur' ? fallbackBlur : undefined}
      loading={props.loading || (shouldPriority ? 'eager' : 'lazy')}
      decoding={decoding}
      sizes={optimizedSizes}
      priority={shouldPriority}
      fetchPriority={shouldPriority ? 'high' : 'auto'}
      unoptimized={skipOptimizer || isRemoteHttp}
      className={cn(
        shouldPriority ? 'opacity-100' : 'duration-150 ease-out',
        !shouldPriority && (isLoaded ? 'opacity-100' : 'opacity-0'),
        className,
      )}
      onLoad={(event) => {
        setIsLoaded(true);
        onLoad?.(event);
        onLoadingComplete?.(event.currentTarget);
      }}
      onError={() => {
        if (
          normalizedFallback &&
          typeof normalizedFallback === 'string' &&
          normalizedFallback !== activeSrc
        ) {
          setActiveSrc(normalizedFallback);
          setIsLoaded(false);
          return;
        }
        setHasError(true);
      }}
    />
  );
};

export default SmartImage;
