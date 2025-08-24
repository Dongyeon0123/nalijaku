import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    domains: [],
    remotePatterns: [],
  },
  experimental: {
    optimizeCss: true,
  },
  // Vercel 배포를 위한 설정
  output: 'standalone',
  trailingSlash: false,
};

export default nextConfig;
