/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  poweredByHeader: false,
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
        hostname: 'trendyfashionzone.co.ke',
        pathname: '/uploads/**',
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
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/categories/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
      {
        source: '/collections/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
      {
        source: '/collections',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.trendyfashionzone.co.ke',
          },
        ],
        destination: 'https://trendyfashionzone.co.ke/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Meta Commerce Manager prefers a URL that ends in .csv
      {
        source: '/api/feeds/meta-sale.csv',
        destination: '/api/feeds/meta-sale',
      },
      {
        source: '/api/feeds/meta.csv',
        destination: '/api/feeds/meta?format=csv',
      },
    ];
  },
}

module.exports = nextConfig
