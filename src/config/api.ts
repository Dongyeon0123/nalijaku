// API 기본 URL - 환경에 따라 다름
// 개발: 프록시 사용 (CORS 우회)
// 프로덕션: 직접 호출
export const API_BASE_URL = process.env.NODE_ENV === 'development' ? '' : 'https://api.nallijaku.com';

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
    LIST: '/api/resources',
    DETAIL: (id: number) => `/api/resources/${id}`,
    CATEGORIES: '/api/resources/categories',
    INSTRUCTORS: '/api/resources/instructors',
    RECENT: '/api/resources/recent',
    COUNT: '/api/resources/count',
    UPLOAD_IMAGE: '/api/resources/upload-image',
    LESSONS: {
      LIST: (courseId: number) => `/api/resources/${courseId}/lessons`,
      DETAIL: (courseId: number, order: number) => `/api/resources/${courseId}/lessons/${order}`,
    },
  },

  // 강사
  INSTRUCTORS: {
    LIST: '/api/instructors',
    DETAIL: (id: number) => `/api/instructors/${id}`,
    BY_REGION: (region: string) => `/api/instructors/region/${region}`,
  },

  // 교육 문의
  EDUCATION: {
    INQUIRY: '/api/education-inquiries',
    APPLICATION: '/api/education-applications',
  },

  // 파트너 지원
  PARTNER: {
    APPLICATION: '/api/partner-applications',
  },

  // 시스템
  SYSTEM: {
    HEALTH: '/api/health',
    USER_COUNT: '/api/users/count',
    USERS: '/api/users',
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
