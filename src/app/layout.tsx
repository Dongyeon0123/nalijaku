import React from 'react';
import CollaborationSidebar from '@/components/CollaborationSidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '날리자KU | 드론 교육과 창업을 위한 플랫폼',
  description:
    '날리자KU는 국내 최초로 학교와 기관을 연결하는 드론 교육, 체험, 창업을 아우르는 통합 플랫폼입니다.',
    keywords: [
      // 브랜드
      '날리자KU',
      'NALIDAKU',
      '날리자케이유',
    
      // 드론 교육/체험
      '드론 교육',
      '드론 교육 프로그램',
      '드론 교육 과정',
      '드론 강의',
      '드론 학원',
      '드론 교육 센터',
      '드론 체험',
      '드론 체험 프로그램',
      '드론 체험학습',
      '드론 비행 체험',
      '드론 조종 체험',
    
      // 방과후/자유학기제
      '방과후 드론',
      '방과후 드론수업',
      '초등학생 드론 교육',
      '자유학기제 드론 수업',
      '중학교 자유학기제 프로그램',
    
      // 드론 코딩/AI
      '드론 코딩',
      '코딩 드론 교육',
      '블록코딩 드론',
      'AI 드론',
      '인공지능 드론',
      '자율비행 드론',
    
      // 교구/키트
      '드론 만들기',
      '드론 조립',
      '드론 키트',
      '교육용 드론',
      '코딩 교육용 드론',
      'STEAM 교육 드론',
      '과학 교구',
      '과학 실험 키트',
    
      // 자격증/전문 과정
      '드론 자격증',
      '드론 자격증 학원',
      '드론 자격증 시험',
      '드론 전문가 과정',
      '드론 파일럿',
      '드론 조종사',
    
      // 산업/창업
      '드론 창업',
      '드론 창업 프로그램',
      '드론 창업 지원',
      '드론 일자리',
      '드론 촬영',
      '드론 항공촬영',
      '드론 측량',
      '농업 드론',
      '드론 방제',
    
      // 드론 스포츠
      '드론 축구',
      '드론 레이싱',
      'FPV 드론',
    
      // 일반
      '무인기',
      'UAV',
      '드론 종류',
      '드론 추천',
      '드론 가격',
    
      // 미래 모빌리티
      'UAM',
      'AAM',
      '도심항공교통',
      '스마트 모빌리티',
      '자율주행',
      '에어택시',
      'PAV',
      '4차 산업혁명',
    
      // 지역 키워드 (충주대학교 중심)
      '충주',
      '충주시',
      '충주대학교 드론',
      '충주시 충주대학교 드론 교육',
      '충주시 충주대학교 드론 체험',
      '충주시 충주대학교 드론 창업',
    ],
  openGraph: {
    title: '날리자KU | 드론 교육과 창업을 위한 플랫폼',
    description:
      '국내 최초 학교&기관과 연결하는 드론 교육과 체험, 창업까지 한 번에! 날리자KU에서 다양한 프로그램과 최신 소식을 확인하세요.',
    type: 'website',
    siteName: '날리자KU',
    images: [
      {
        url: '/nallijaku.png',
        width: 1200,
        height: 630,
        alt: '날리자KU 로고 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '날리자KU | 드론 교육과 창업을 위한 플랫폼',
    description:
      '국내 최초 학교&기관과 연결하는 드론 교육과 체험, 창업까지 한 번에! 날리자KU에서 다양한 프로그램과 최신 소식을 확인하세요.',
    images: ['/nallijaku.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <meta name="naver-site-verification" content="5d07fbec5c7214a2aa549c9e290eea204ceab2e6" />
        <meta name="google-site-verification" content="N6nZQYHXxDVkRfgMM85UNZHbMYCnCKz9sqKtDMl6sCc" />
        <link rel="alternate" type="application/rss+xml" title="날리자쿠 외부소식 RSS" href="/rss.xml" />
      </head>
      <body>
        {children}
        <CollaborationSidebar />
      </body>
    </html>
  );
}