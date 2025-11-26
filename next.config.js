/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24,
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.online',
      },
    ],
  },
}

module.exports = nextConfig

