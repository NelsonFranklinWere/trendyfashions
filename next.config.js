/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Enable Next.js Image Optimization with Supabase
    unoptimized: false,
    // Prefer AVIF over WebP for better compression (smaller file sizes)
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 90 days for faster loading
    minimumCacheTTL: 60 * 60 * 24 * 90,
    // Device sizes for responsive images (ultra-reduced for instant loading)
    deviceSizes: [320, 420, 640, 768], // Minimal sizes for fastest loading
    // Image sizes for different use cases (ultra-small sizes for fastest processing)
    imageSizes: [16, 32, 48, 64, 96, 128], // Minimal max size
    // Enable image optimization with quality settings
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Remote patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
      {
        protocol: 'https',
        hostname: 'zdeupdkbsueczuoercmm.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.online',
      },
    ],
  },
  compress: true,
}

module.exports = nextConfig
