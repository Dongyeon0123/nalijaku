import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envCheck = {
      NOTION_API_KEY: process.env.NOTION_API_KEY ? '설정됨' : '설정되지 않음',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      // API 키의 일부만 표시 (보안을 위해)
      NOTION_API_KEY_PREFIX: process.env.NOTION_API_KEY ? process.env.NOTION_API_KEY.substring(0, 10) + '...' : '없음'
    };

    return NextResponse.json({
      message: '환경 변수 확인',
      ...envCheck
    });
  } catch (error) {
    return NextResponse.json(
      { error: '환경 변수 확인 실패', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
