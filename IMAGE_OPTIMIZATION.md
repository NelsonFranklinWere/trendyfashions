# Image Optimization Guide

This project implements first-level image optimization for faster loading on both upload and display (web and mobile).

## Features

### 1. Upload Optimization
- **Automatic compression** during upload
- **Format conversion** to WebP (better compression than JPEG/PNG)
- **Resize** to optimal dimensions (max 1920px)
- **Thumbnail generation** for faster previews
- **Quality optimization** (85% quality, balanced for web)

### 2. Display Optimization
- **Next.js Image Optimization** enabled
- **Automatic format selection** (AVIF > WebP > JPEG/PNG)
- **Responsive sizing** based on viewport
- **Lazy loading** for non-critical images
- **Blur placeholder** for better perceived performance
- **Preloading** for critical/hero images

### 3. Performance Features
- **Intersection Observer** for lazy loading
- **Image preloading** for above-the-fold content
- **Caching** (7-day cache TTL)
- **Progressive loading** with blur placeholders

## Usage

### Upload Images (Admin)

1. Navigate to `/admin/images`
2. Select category and subcategory
3. Choose image file
4. Image is automatically optimized before upload
5. View optimization stats (compression ratio, file size reduction)

### Use Optimized Images in Components

#### Basic Usage
```tsx
import OptimizedImage from '@/components/OptimizedImage';

<OptimizedImage
  src="/images/product.jpg"
  alt="Product name"
  width={400}
  height={400}
  priority={false} // true for above-the-fold images
/>
```

#### Product Image
```tsx
import { ProductImage } from '@/components/OptimizedImage';

<ProductImage
  image={product.image}
  alt={product.name}
  priority={false}
/>
```

#### Hero Image
```tsx
import { HeroImage } from '@/components/OptimizedImage';

<HeroImage
  src="/images/hero.jpg"
  alt="Hero banner"
/>
```

#### Preload Critical Images
```tsx
import { useHeroImagePreload } from '@/hooks/useImagePreload';

function HomePage() {
  const heroImages = ['/images/hero1.jpg', '/images/hero2.jpg'];
  useHeroImagePreload(heroImages);
  
  return <div>...</div>;
}
```

## Optimization Settings

### Upload Settings
- **Max Width**: 1920px
- **Max Height**: 1920px
- **Quality**: 85%
- **Format**: WebP
- **Thumbnail Size**: 300px

### Display Settings
- **Device Sizes**: 640, 750, 828, 1080, 1200, 1920, 2048, 3840px
- **Image Sizes**: 16, 32, 48, 64, 96, 128, 256, 384px
- **Cache TTL**: 7 days
- **Formats**: AVIF, WebP (fallback to original)

## Performance Metrics

### Expected Improvements
- **File Size Reduction**: 60-80% smaller files
- **Load Time**: 50-70% faster initial load
- **Mobile Performance**: Optimized for mobile networks
- **Bandwidth Savings**: Significant reduction in data usage

### Optimization Stats
After upload, you'll see:
- Original file size
- Optimized file size
- Compression ratio
- Format used

## Technical Details

### Image Processing Pipeline

1. **Upload**: Image received via API
2. **Analysis**: Check if optimization needed (>500KB)
3. **Resize**: Resize to max dimensions maintaining aspect ratio
4. **Convert**: Convert to WebP format
5. **Compress**: Apply quality settings
6. **Thumbnail**: Generate 300px thumbnail
7. **Upload**: Store optimized image + thumbnail in Supabase
8. **Metadata**: Save dimensions, size, format to database

### Browser Support

- **AVIF**: Chrome 85+, Edge 85+, Opera 71+
- **WebP**: Chrome 23+, Edge 18+, Firefox 65+, Safari 14+
- **Fallback**: Original format for older browsers

## Best Practices

1. **Use priority for above-the-fold images**
   ```tsx
   <OptimizedImage priority src="..." alt="..." />
   ```

2. **Preload hero images**
   ```tsx
   useHeroImagePreload(['/hero1.jpg', '/hero2.jpg']);
   ```

3. **Use appropriate sizes**
   ```tsx
   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
   ```

4. **Lazy load below-the-fold images**
   ```tsx
   <OptimizedImage loading="lazy" src="..." alt="..." />
   ```

## Configuration

### Next.js Config (`next.config.js`)
```javascript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  remotePatterns: [
    { protocol: 'https', hostname: '**.supabase.co' },
  ],
}
```

### Optimization Utility (`lib/utils/imageOptimization.ts`)
- Adjustable quality, dimensions, format
- Mobile-specific optimization
- Thumbnail generation
- Compression ratio calculation

## Monitoring

Check optimization effectiveness:
1. Browser DevTools → Network tab
2. Check image file sizes
3. Compare original vs optimized
4. Monitor load times

## Troubleshooting

### Images not optimizing
- Check file size (optimization only for files >500KB)
- Verify Sharp is installed correctly
- Check server logs for errors

### Slow uploads
- Large images take time to process
- Consider client-side pre-compression
- Use CDN for faster delivery

### Format not supported
- Browser automatically falls back to supported format
- Check browser compatibility
- Verify Next.js Image Optimization is enabled
