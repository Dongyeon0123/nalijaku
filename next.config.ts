import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    domains: [],
    remotePatterns: [],
  },
  
  // 프로덕션 빌드 시 console.log 제거
  compiler: {
    removeConsole: false,
  },
  
  async rewrites() {
    // 환경 변수에서 API URL 가져오기 (없으면 로컬 백엔드 사용)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    console.log('🔧 API Rewrite 설정:', apiUrl);

    return {
      beforeFiles: [
        // /api/auth/* 는 Next.js API 라우트로 처리하고, 나머지만 백엔드로 전달
        {
          source: '/api/users/:path*',
          destination: `${apiUrl}/api/users/:path*`,
        },
        {
          source: '/api/instructors/:path*',
          destination: `${apiUrl}/api/instructors/:path*`,
        },
        {
          source: '/api/courses/:path*',
          destination: `${apiUrl}/api/courses/:path*`,
        },
        {
          source: '/api/course-groups/:path*',
          destination: `${apiUrl}/api/course-groups/:path*`,
        },
        {
          source: '/api/attendances/:path*',
          destination: `${apiUrl}/api/attendances/:path*`,
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
