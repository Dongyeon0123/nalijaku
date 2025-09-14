import { ApiResponse, SignupData, LoginData } from '@/types/auth';
import { API_BASE_URL, API_ENDPOINTS, getDefaultHeaders } from '@/config/api';

// 서버 상태 확인 함수
export const checkServerHealth = async (): Promise<{status: string; message?: string}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    console.log('🏥 서버 응답 상태:', response.status, response.statusText);
    
    // 응답이 JSON인지 텍스트인지 확인
    const contentType = response.headers.get('content-type');
    console.log('📄 Content-Type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      console.log('🏥 서버 상태 (JSON):', result);
      return result;
    } else {
      const result = await response.text();
      console.log('🏥 서버 상태 (텍스트):', result);
      return { status: 'OK', message: result };
    }
  } catch (error) {
    console.log('❌ 서버 상태 확인 실패:', error);
    throw error;
  }
};

// 사용자 수 확인 함수
export const getUserCount = async (): Promise<{count: string | number}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/count`);
    console.log('👥 사용자 수 응답 상태:', response.status, response.statusText);
    
    // 응답이 JSON인지 텍스트인지 확인
    const contentType = response.headers.get('content-type');
    console.log('📄 Content-Type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      console.log('👥 사용자 수 (JSON):', result);
      return result;
    } else {
      const result = await response.text();
      console.log('👥 사용자 수 (텍스트):', result);
      return { count: result };
    }
  } catch (error) {
    console.log('❌ 사용자 수 확인 실패:', error);
    throw error;
  }
};

// 관리자 권한 확인 함수
export const checkAdminStatus = async (username: string): Promise<{success: boolean; data: {isAdmin: boolean; username: string}}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-admin/${username}`);
    console.log('🔐 관리자 권한 확인 응답 상태:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error('관리자 권한 확인에 실패했습니다.');
    }
    
    const result = await response.json();
    console.log('🔐 관리자 권한 확인 결과:', result);
    return result;
  } catch (error) {
    console.log('❌ 관리자 권한 확인 실패:', error);
    throw error;
  }
};

// API 호출 함수들
export const signup = async (data: SignupData): Promise<ApiResponse> => {
  try {
    const apiUrl = `${API_BASE_URL}${API_ENDPOINTS.AUTH.SIGNUP}`;
    
    // 서버로 보낼 데이터 준비
    const signupPayload = {
      username: data.username.trim(),
      password: data.password,
      confirmPassword: data.confirmPassword,
      email: data.email.trim(),
      organization: data.organization?.trim() || '',
      role: data.role || 'GENERAL',
      phone: data.phone?.trim() || '',
      droneExperience: Boolean(data.droneExperience),
      termsAgreed: Boolean(data.termsAgreed)
    };
    
    console.log('🚀 회원가입 API 호출 시작');
    console.log('📍 API URL:', apiUrl);
    console.log('📤 원본 데이터:', data);
    console.log('📤 서버 전송 데이터:', signupPayload);
    console.log('📤 JSON 문자열:', JSON.stringify(signupPayload));
    console.log('📤 요청 헤더:', getDefaultHeaders());
    
    // 데이터 유효성 검사
    if (!signupPayload.username || !signupPayload.password || !signupPayload.email) {
      throw new Error('필수 필드가 누락되었습니다: username, password, email');
    }
    
    if (signupPayload.username.length < 3) {
      throw new Error('사용자명은 3자 이상이어야 합니다');
    }
    
    if (signupPayload.password.length < 6) {
      throw new Error('비밀번호는 6자 이상이어야 합니다');
    }
    
    if (!signupPayload.email.includes('@')) {
      throw new Error('올바른 이메일 형식이 아닙니다');
    }
    
    // 개발 환경에서 API 서버가 없을 때를 위한 모킹
    if (process.env.NODE_ENV === 'development') {
      // 실제 API 호출 시도
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify(signupPayload)
        });

        console.log('📡 응답 상태:', response.status, response.statusText);
        console.log('📋 응답 헤더:', Object.fromEntries(response.headers.entries()));
        const result = await response.json();
        console.log('📥 응답 데이터:', result);
        
        if (!response.ok) {
          throw new Error(result.message || '회원가입에 실패했습니다.');
        }

        return result;
      } catch (fetchError) {
        // API 서버 연결 실패 시 에러 반환
        console.log('❌ API 서버 연결 실패:', fetchError);
        throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
      }
    } else {
      // 프로덕션 환경에서는 실제 API 호출
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(signupPayload)
      });

      console.log('📡 응답 상태:', response.status, response.statusText);
      const result = await response.json();
      console.log('📥 응답 데이터:', result);
      
      if (!response.ok) {
        throw new Error(result.message || '회원가입에 실패했습니다.');
      }

      return result;
    }
  } catch (error) {
    console.log('💥 회원가입 에러:', error);
    throw error;
  }
};

export const login = async (data: LoginData): Promise<ApiResponse> => {
  try {
    const apiUrl = `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`;
    console.log('🔐 로그인 API 호출 시작');
    console.log('📍 API URL:', apiUrl);
    console.log('📤 요청 데이터:', data);
    
    // 개발 환경에서 API 서버가 없을 때를 위한 모킹
    if (process.env.NODE_ENV === 'development') {
      // 실제 API 호출 시도
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: getDefaultHeaders(),
          body: JSON.stringify(data)
        });

        console.log('📡 응답 상태:', response.status, response.statusText);
        
        // 응답이 JSON인지 확인
        const contentType = response.headers.get('content-type');
        let result;
        
        if (contentType && contentType.includes('application/json')) {
          result = await response.json();
          console.log('📥 응답 데이터 (JSON):', result);
        } else {
          const textResult = await response.text();
          console.log('📥 응답 데이터 (텍스트):', textResult);
          result = { message: textResult };
        }
        
        if (!response.ok) {
          // HTTP 상태 코드에 따라 다른 에러 메시지 제공
          if (response.status === 401) {
            throw new Error('아이디 또는 비밀번호가 잘못되었습니다.');
          } else if (response.status === 404) {
            throw new Error('아이디 또는 비밀번호가 잘못되었습니다.');
          } else {
            // 서버에서 보낸 메시지가 있으면 사용, 없으면 기본 메시지
            const errorMessage = result.message || result.error || '로그인에 실패했습니다.';
            throw new Error(errorMessage);
          }
        }

        return result;
      } catch (fetchError) {
        // API 서버 연결 실패 시 에러 반환
        console.log('❌ API 서버 연결 실패:', fetchError);
        
        // fetchError가 Error 객체인지 확인하고 타입에 따라 다른 메시지 제공
        if (fetchError instanceof Error) {
          // 이미 우리가 던진 에러인 경우 (서버 응답 처리 중 발생한 에러) 그대로 전달
          if (fetchError.message.includes('아이디 또는 비밀번호가 잘못되었습니다') || 
              fetchError.message.includes('로그인에 실패했습니다') ||
              fetchError.message.includes('비밀번호가 일치하지 않습니다')) {
            throw fetchError;
          }
          
          // 네트워크 에러인 경우
          if (fetchError.message.includes('fetch') || fetchError.message.includes('network') || fetchError.message.includes('Failed to fetch')) {
            throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
          }
          // JSON 파싱 에러인 경우 (서버가 응답했지만 JSON이 아닌 경우)
          if (fetchError.message.includes('JSON') || fetchError.message.includes('parse')) {
            throw new Error('서버 응답을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.');
          }
        }
        
        throw new Error('아이디 또는 비밀번호가 잘못되었습니다.');
      }
    } else {
      // 프로덕션 환경에서는 실제 API 호출
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify(data)
      });

      console.log('📡 응답 상태:', response.status, response.statusText);
      
      // 응답이 JSON인지 확인
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
        console.log('📥 응답 데이터 (JSON):', result);
      } else {
        const textResult = await response.text();
        console.log('📥 응답 데이터 (텍스트):', textResult);
        result = { message: textResult };
      }
      
      if (!response.ok) {
        // HTTP 상태 코드에 따라 다른 에러 메시지 제공
        if (response.status === 401) {
          throw new Error('아이디 또는 비밀번호가 잘못되었습니다.');
        } else if (response.status === 404) {
          throw new Error('아이디 또는 비밀번호가 잘못되었습니다.');
        } else {
          // 서버에서 보낸 메시지가 있으면 사용, 없으면 기본 메시지
          const errorMessage = result.message || result.error || '로그인에 실패했습니다.';
          throw new Error(errorMessage);
        }
      }

      return result;
    }
  } catch (error) {
    console.log('💥 로그인 에러:', error);
    throw error;
  }
};
