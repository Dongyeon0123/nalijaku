'use client';

import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Cooperation from '@/components/Cooperation';

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
        <Cooperation />
      </main>
    </div>
  );
}
