import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, logout } from '@/utils/auth';

// API URL 결정 함수
const getApiUrl = () => {
  // 브라우저 환경에서만 실행
  if (typeof window !== 'undefined') {
    // PWA로 실행 중인지 확인
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone === true;
    
    console.log('🌐 PWA 모드:', isPWA);
    console.log('🌐 현재 origin:', window.location.origin);
    
    // PWA 모드에서는 현재 도메인 사용 (Next.js rewrites 활용)
    if (isPWA) {
      return window.location.origin;
    }
  }
  
  // 일반 브라우저나 서버 사이드에서는 환경 변수 사용
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.nallijaku.com';
};

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초 타임아웃
});

// 요청 인터셉터: 모든 요청에 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    // 동적으로 baseURL 업데이트 (PWA 모드 변경 대응)
    config.baseURL = getApiUrl();
    
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('📤 API 요청:', config.method?.toUpperCase(), config.baseURL + config.url);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 시 토큰 자동 갱신
api.interceptors.response.use(
  (response) => {
    console.log('📥 API 응답:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error('❌ API 에러:', error.config?.url, error.response?.status, error.message);
    
    const originalRequest = error.config;

    // 로그인 요청은 인터셉터 무시
    if (originalRequest.url?.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // 401 에러이고, 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          // Refresh Token이 없으면 로그아웃
          console.log('❌ Refresh Token이 없습니다. 로그아웃 처리');
          logout();
          if (typeof window !== 'undefined') {
            // 출근부 페이지에서는 출근부 로그인으로
            if (window.location.pathname.startsWith('/teacher')) {
              window.location.href = '/teacher/login';
            } else if (window.location.pathname.startsWith('/attendance')) {
              window.location.href = '/attendance/login';
            } else {
              window.location.href = '/';
            }
          }
          return Promise.reject(error);
        }

        console.log('🔄 Access Token 갱신 시도...');

        // Refresh Token으로 새 Access Token 발급
        const response = await axios.post(
          `${getApiUrl()}/api/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data.data;

        // 새 토큰 저장
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
        }

        console.log('✅ Access Token 갱신 성공');

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료된 경우 로그아웃
        console.error('❌ Refresh Token 갱신 실패:', refreshError);
        logout();
        if (typeof window !== 'undefined') {
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          // 출근부 페이지에서는 출근부 로그인으로
          if (window.location.pathname.startsWith('/teacher')) {
            window.location.href = '/teacher/login';
          } else if (window.location.pathname.startsWith('/attendance')) {
            window.location.href = '/attendance/login';
          } else {
            window.location.href = '/';
          }
        }
        return Promise.reject(refreshError);
      }
    }

    // 403 에러 처리
    if (error.response?.status === 403) {
      console.error('❌ 403 Forbidden: 접근 권한이 없습니다');
      if (typeof window !== 'undefined') {
        alert('접근 권한이 없습니다.');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
