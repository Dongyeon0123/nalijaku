import { NextRequest, NextResponse } from 'next/server';
import { getNotionPageContent } from '@/services/notionService';

export async function GET(request: NextRequest) {
  try {
    console.log('Notion API 엔드포인트 호출됨');
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);
    
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    console.log('Search params:', searchParams.toString());
    console.log('Page ID:', pageId);

    if (!pageId) {
      console.log('페이지 ID가 없음');
      return NextResponse.json(
        { error: '페이지 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    console.log('Notion API 요청 - pageId:', pageId);
    const content = await getNotionPageContent(pageId);
    console.log('Notion API 응답 데이터:', content);

    if (!content) {
      console.log('Notion API 응답이 null입니다.');
      return NextResponse.json(
        { error: '페이지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('API 오류:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
