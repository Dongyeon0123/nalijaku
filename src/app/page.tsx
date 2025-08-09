'use client';

import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, []);

  return (
    <div style={{
      fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
      margin: 0,
      padding: 0,
      minHeight: '100vh',
    }}>
      <Header />
      
      <main style={{
        minHeight: 'calc(100vh - 80px)',
        background: '#fafafa'
      }}>
        <HeroSection />
        
        <section style={{
          padding: '80px 24px',
          textAlign: 'center',
          color: '#666',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{ fontSize: '36px', margin: '0 0 24px 0', color: '#1a1a1a' }}>
            다음 섹션들이 여기에 추가됩니다
          </h2>
          <p style={{ fontSize: '18px', margin: 0 }}>
            스크롤형 페이지의 추가 컨텐츠 영역입니다.
          </p>
        </section>
      </main>
    </div>
  );
}
