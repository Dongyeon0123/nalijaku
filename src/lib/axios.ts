import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, logout } from '@/utils/auth';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.nallijaku.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초 타임아웃
});

// 요청 인터셉터: 모든 요청에 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 시 토큰 자동 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

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
            window.location.href = '/';
          }
          return Promise.reject(error);
        }

        console.log('🔄 Access Token 갱신 시도...');

        // Refresh Token으로 새 Access Token 발급
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://api.nallijaku.com'}/api/auth/refresh`,
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
          window.location.href = '/';
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
