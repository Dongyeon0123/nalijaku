import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 입력 검증
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '아이디와 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // username/password 길이 제한 (DoS 방지)
    if (username.length > 50 || password.length > 100) {
      return NextResponse.json(
        { success: false, message: '입력값이 너무 깁니다.' },
        { status: 400 }
      );
    }

    console.log('🔐 로그인 시도:', { username }); // 비밀번호는 로그에 남기지 않음
    console.log('🌐 API URL:', process.env.NEXT_PUBLIC_API_URL);

    // 백엔드 API 호출
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    // 응답에서 민감한 정보 제거 (필요시)
    if (data.data?.password) {
      delete data.data.password;
    }

    if (!response.ok) {
      // 에러 메시지를 일반화하여 정보 노출 방지
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || '로그인에 실패했습니다.' 
        }, 
        { status: response.status }
      );
    }

    // 성공 응답
    const res = NextResponse.json(data, { status: 200 });
    
    // HttpOnly 쿠키로 토큰 저장 (선택사항 - 백엔드에서 토큰을 반환하는 경우)
    if (data.data?.token) {
      res.cookies.set('auth-token', data.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS에서만
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: '/',
      });
    }
    
    return res;
  } catch (error) {
    console.error('❌ 로그인 에러:', error);
    // 에러 상세 정보를 클라이언트에 노출하지 않음
    return NextResponse.json(
      { success: false, message: '서버 연결에 실패했습니다.' },
      { status: 500 }
    );
  }
}
