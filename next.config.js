/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Enable Next.js Image Optimization with Supabase
    unoptimized: false,
    // Prefer AVIF over WebP for better compression
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 7 days
    minimumCacheTTL: 60 * 60 * 24 * 7,
    // Device sizes for responsive images
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536, 1920, 2048],
    // Image sizes for different use cases
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Security settings
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
