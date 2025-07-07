import React from 'react';

export const metadata = {
  title: '날리자 KU',
  description: '현재 날리자 KU 사이트를 준비 중입니다. 곧 찾아뵐게요!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}