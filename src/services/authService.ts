import { ApiResponse, SignupData, LoginData } from '@/types/auth';
import { API_ENDPOINTS } from '@/config/api';
import api from '@/lib/axios';
import { setTokens, setUser, clearTokens, clearUser } from '@/utils/auth';

// 서버 상태 확인 함수
export const checkServerHealth = async (): Promise<{status: string; message?: string}> => {
  try {
    const response = await api.get('/health');
    console.log('🏥 서버 상태:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ 서버 상태 확인 실패:', error);
    throw error;
  }
};

// 사용자 수 확인 함수
export const getUserCount = async (): Promise<{count: string | number}> => {
  try {
    const response = await api.get('/users/count');
    console.log('👥 사용자 수:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ 사용자 수 확인 실패:', error);
    throw error;
  }
};

// 현재 사용자 정보 조회 (토큰 기반)
export const getCurrentUser = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    console.log('👤 현재 사용자 정보:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ 사용자 정보 조회 실패:', error);
    throw error;
  }
};

// 관리자 권한 확인 함수 (토큰 기반으로 변경)
export const checkAdminStatus = async (): Promise<{success: boolean; data: {isAdmin: boolean; role: string}}> => {
  try {
    const userInfo = await getCurrentUser();
    
    if (!userInfo.success || !userInfo.data) {
      return { success: false, data: { isAdmin: false, role: 'GENERAL' } };
    }

    const role = userInfo.data.role?.toUpperCase() || 'GENERAL';
    const isAdmin = role === 'ADMIN';

    console.log('🔐 관리자 권한 확인 결과:', { isAdmin, role });
    return { success: true, data: { isAdmin, role } };
  } catch (error) {
    console.log('❌ 관리자 권한 확인 실패:', error);
    return { success: false, data: { isAdmin: false, role: 'GENERAL' } };
  }
};

// API 호출 함수들
export const signup = async (data: SignupData): Promise<ApiResponse> => {
  try {
    console.log('🚀 회원가입 API 호출 시작');
    console.log('📤 서버 전송 데이터:', data);

    const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, data);

    console.log('✅ 회원가입 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.log('💥 회원가입 에러:', error);
    const errorMessage = error.response?.data?.message || error.message || '회원가입 중 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

export const login = async (data: LoginData): Promise<ApiResponse> => {
  try {
    console.log('🔐 로그인 API 호출 시작');
    console.log('📤 요청 데이터:', { username: data.username });

    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      username: data.username,
      password: data.password
    });

    console.log('✅ 로그인 성공:', response.data);

    // 토큰 저장
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken, user } = response.data.data;
      
      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken);
        console.log('✅ 토큰 저장 완료');
      }

      // 사용자 정보 저장
      if (user) {
        setUser(user);
        console.log('✅ 사용자 정보 저장 완료:', user);
      }
    }

    return response.data;
  } catch (error: any) {
    console.log('💥 로그인 에러:', error);
    const errorMessage = error.response?.data?.message || error.message || '로그인 중 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

// 로그아웃 함수
export const logoutUser = async (): Promise<void> => {
  try {
    // 서버에 로그아웃 요청 (선택사항)
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    console.log('로그아웃 API 호출 실패:', error);
  } finally {
    // 로컬 스토리지 정리
    clearTokens();
    clearUser();
    console.log('✅ 로그아웃 완료');
  }
};
