import React from 'react';
import CollaborationSidebar from '@/components/CollaborationSidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '날리자KU | 드론 교육과 창업을 위한 플랫폼',
  description:
    '날리자KU는 국내 최초로 학교와 기관을 연결하는 드론 교육, 체험, 창업을 아우르는 통합 플랫폼입니다.',
  keywords: [
    '날리자KU',
    '드론 교육',
    '드론 체험',
    '드론 창업',
    '무인기',
    '충주',
    '교육 프로그램',
    '충주',
    '충주시',
    '충주시 충주대학교',
    '충주시 충주대학교 드론',
    '충주시 충주대학교 드론 교육',
    '충주시 충주대학교 드론 체험',
    '충주시 충주대학교 드론 창업',
    '드론 교육 프로그램',
    '드론 체험 프로그램',
    '드론 창업 프로그램',
    '드론 교육 프로그램 추천',
    '드론 체험 프로그램 추천',
    '드론 창업 프로그램 추천',
    '드론 교육 프로그램 추천',
    '드론 종류',
    '드론 자격증',
    '드론 충주',
    '드론 충주시',
    '드론 충주시 충주대학교',
    '드론 충주시 충주대학교 드론',
    '드론 충주시 충주대학교 드론 교육',
    '드론 충주시 충주대학교 드론 체험',
    '드론 충주시 충주대학교 드론 창업',
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
      </head>
      <body>
        {children}
        <CollaborationSidebar />
      </body>
    </html>
  );
}