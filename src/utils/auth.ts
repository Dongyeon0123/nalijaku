/**
 * 인증 관련 유틸리티 함수
 */

// 토큰 저장
export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
};

// Access Token 가져오기
export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

// Refresh Token 가져오기
export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

// 토큰 삭제
export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

// 사용자 정보 저장
export const setUser = (user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// 사용자 정보 가져오기
export const getUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

// 사용자 정보 삭제
export const clearUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('userInfo'); // 하위 호환성
  }
};

// 로그인 여부 확인
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// 관리자 여부 확인
export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === 'ADMIN';
};

// 전체 로그아웃 (모든 데이터 삭제)
export const logout = () => {
  clearTokens();
  clearUser();
};
