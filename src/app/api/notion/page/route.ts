import { NextRequest, NextResponse } from 'next/server';
import { getNotionPageContent } from '@/services/notionService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    if (!pageId) {
      return NextResponse.json(
        { error: '페이지 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const content = await getNotionPageContent(pageId);

    if (!content) {
      return NextResponse.json(
        { error: '페이지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
