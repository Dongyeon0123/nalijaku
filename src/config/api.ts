// API 기본 URL - 환경변수로 관리
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.nallijaku.com/';

// API 설정 로그 출력
console.log('🔧 API 설정 정보:');
console.log('📍 API_BASE_URL:', API_BASE_URL);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔑 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

// API 엔드포인트
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },

  // 학습자료
  RESOURCES: {
    LIST: '/resources',
    DETAIL: (id: number) => `/resources/${id}`,
    CATEGORIES: '/resources/categories',
    INSTRUCTORS: '/resources/instructors',
    RECENT: '/resources/recent',
    COUNT: '/resources/count',
    UPLOAD_IMAGE: '/resources/upload-image',
  },

  // 강사
  INSTRUCTORS: {
    LIST: '/instructors',
    DETAIL: (id: number) => `/instructors/${id}`,
    BY_REGION: (region: string) => `/instructors/region/${region}`,
  },

  // 교육 문의
  EDUCATION: {
    INQUIRY: '/education-inquiries',
    APPLICATION: '/education-applications',
  },

  // 파트너 지원
  PARTNER: {
    APPLICATION: '/partner-applications',
  },

  // 시스템
  SYSTEM: {
    HEALTH: '/health',
    USER_COUNT: '/users/count',
    USERS: '/users',
  },
} as const;

// API 요청 헤더
export const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
});

// API 요청 헤더 (인증 토큰 포함)
export const getAuthHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});
