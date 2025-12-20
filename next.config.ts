import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    domains: [],
    remotePatterns: [],
  },
  async rewrites() {
    // 환경 변수에서 API URL 가져오기 (없으면 로컬 백엔드 사용)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    console.log('🔧 API Rewrite 설정:', apiUrl);

    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/api/:path*`,
        },
        {
          source: '/auth/:path*',
          destination: `${apiUrl}/auth/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
