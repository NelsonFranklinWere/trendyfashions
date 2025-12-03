/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Disable Next.js Image Optimization - Nginx serves images directly (faster)
    unoptimized: true,
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
    // Remote patterns for external images (if needed in future)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.online',
      },
    ],
  },
  compress: true,
}

module.exports = nextConfig

