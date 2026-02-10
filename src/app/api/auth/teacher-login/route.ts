import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 백엔드 API 호출
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // 성공 응답
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('로그인 에러:', error);
    return NextResponse.json(
      { success: false, message: '서버 연결에 실패했습니다.' },
      { status: 500 }
    );
  }
}
