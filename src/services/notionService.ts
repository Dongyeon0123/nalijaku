// 노션 API 서비스
import { Client } from '@notionhq/client';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Notion 클라이언트 초기화
const notion = new Client({
  auth: NOTION_API_KEY,
});

export interface NotionPage {
  id: string;
  title: string;
  content: any[];
  last_edited_time: string;
}

export interface NotionBlock {
  id: string;
  type: string;
  [key: string]: any;
}

// 노션 페이지 내용 가져오기
export async function getNotionPageContent(pageId: string): Promise<NotionPage | null> {
  try {
    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY가 설정되지 않았습니다.');
    }

    // 페이지 정보 가져오기
    const page = await notion.pages.retrieve({ page_id: pageId });

    // 페이지 블록들 가져오기
    const blocksData = await notion.blocks.children.list({
      block_id: pageId,
    });

    return {
      id: page.id,
      title: extractTitle(page),
      content: blocksData.results,
      last_edited_time: (page as any).last_edited_time || new Date().toISOString(),
    };
  } catch (error) {
    console.error('노션 API 오류:', error);
    return null;
  }
}

// 페이지 제목 추출
function extractTitle(page: any): string {
  const properties = page.properties;
  
  // 제목 속성 찾기
  for (const key in properties) {
    const prop = properties[key];
    if (prop.type === 'title' && prop.title && prop.title.length > 0) {
      return prop.title[0].plain_text;
    }
  }
  
  return '제목 없음';
}

// 블록을 HTML로 변환
export function convertBlockToHTML(block: NotionBlock): string {
  const { type } = block;
  
  switch (type) {
    case 'paragraph':
      return `<p>${extractText(block.paragraph?.rich_text || [])}</p>`;
    
    case 'heading_1':
      return `<h1>${extractText(block.heading_1?.rich_text || [])}</h1>`;
    
    case 'heading_2':
      return `<h2>${extractText(block.heading_2?.rich_text || [])}</h2>`;
    
    case 'heading_3':
      return `<h3>${extractText(block.heading_3?.rich_text || [])}</h3>`;
    
    case 'bulleted_list_item':
      return `<li>${extractText(block.bulleted_list_item?.rich_text || [])}</li>`;
    
    case 'numbered_list_item':
      return `<li>${extractText(block.numbered_list_item?.rich_text || [])}</li>`;
    
    case 'code':
      return `<pre><code>${extractText(block.code?.rich_text || [])}</code></pre>`;
    
    case 'quote':
      return `<blockquote>${extractText(block.quote?.rich_text || [])}</blockquote>`;
    
    case 'divider':
      return `<hr />`;
    
    case 'image':
      const imageUrl = block.image?.file?.url || block.image?.external?.url;
      return imageUrl ? `<img src="${imageUrl}" alt="이미지" style="max-width: 100%;" />` : '';
    
    default:
      return `<div>${extractText(block[type]?.rich_text || [])}</div>`;
  }
}

// 리치 텍스트에서 텍스트 추출
function extractText(richText: any[]): string {
  return richText.map(text => text.plain_text).join('');
}

// 모든 블록을 HTML로 변환
export function convertBlocksToHTML(blocks: NotionBlock[]): string {
  let html = '';
  let inList = false;
  
  for (const block of blocks) {
    const blockHtml = convertBlockToHTML(block);
    
    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      if (!inList) {
        html += block.type === 'bulleted_list_item' ? '<ul>' : '<ol>';
        inList = true;
      }
      html += blockHtml;
    } else {
      if (inList) {
        html += block.type === 'bulleted_list_item' ? '</ul>' : '</ol>';
        inList = false;
      }
      html += blockHtml;
    }
  }
  
  if (inList) {
    html += '</ul>';
  }
  
  return html;
}
