import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    domains: [],
    remotePatterns: [],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'https://api.nallijaku.com/api/:path*',
        },
        {
          source: '/auth/:path*',
          destination: 'https://api.nallijaku.com/auth/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
