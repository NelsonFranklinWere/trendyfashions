/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['franklabels.online', 'trendyfashionzone.online'],
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.online',
      },
    ],
  },
}

module.exports = nextConfig

