/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Exclude scripts from TypeScript checking during build
eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  // Exclude scripts directory from build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  images: {
    // Enable Next.js Image Optimization for fast loading
    unoptimized: false,
    // Prefer AVIF over WebP for better compression (smaller file sizes)
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 1 year for maximum speed
    minimumCacheTTL: 60 * 60 * 24 * 365,
    // Enable aggressive caching for CDN images
    dangerouslyAllowSVG: false,
    // Device sizes for responsive images (optimized for fast loading)
    deviceSizes: [320, 420, 640, 768, 1024, 1280],
    // Image sizes for different use cases
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable image optimization with quality settings
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Remote patterns for Supabase Storage and legacy CDNs
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: '**.cdn.digitaloceanspaces.com',
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
