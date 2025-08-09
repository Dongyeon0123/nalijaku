'use client';

import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Cooperation from '@/components/Cooperation';
import Customer from '@/components/Customer';
import SidebarNav from '@/components/SidebarNav';

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
      height: '100vh',
      overflow: 'hidden',
    }}>
      <SidebarNav />
      
      <div className="mainContent">        
        <main style={{
          height: '100vh',
          background: '#fafafa',
          overflowY: 'auto',
          position: 'relative',
          scrollBehavior: 'smooth'
        }}>
          <section id="home" style={{ height: '100vh', minHeight: '100vh', position: 'relative' }}>
            <HeroSection />
            <Header />
          </section>
          <section id="cooperation">
            <Cooperation />
          </section>
          <section id="customer">
            <Customer />
          </section>
          <section id="why" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>WHY 날리자쿠?</h2>
              <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                왜 날리자쿠를 선택해야 할까요? 전문적인 교육과 혁신적인 솔루션을 제공합니다.
              </p>
            </div>
          </section>
          <section id="who" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>WHO는 누구인가?</h2>
              <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                날리자쿠와 함께하는 사람들과 대상을 소개합니다.
              </p>
            </div>
          </section>
          <section id="how" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>HOW 어떻게?</h2>
              <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                날리자쿠만의 특별한 교육 방법론을 소개합니다.
              </p>
            </div>
          </section>
          <section id="review" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>교육 후기</h2>
              <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                날리자쿠 교육을 받은 분들의 생생한 후기를 확인하세요.
              </p>
            </div>
          </section>
          <section id="team" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>Team 날리자쿠</h2>
              <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                날리자쿠 팀원들을 소개합니다.
              </p>
            </div>
          </section>
          <section id="more" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>MORE</h2>
              <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                더 많은 정보와 서비스를 확인하세요.
              </p>
            </div>
          </section>
          <section id="contact" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>Contact Us</h2>
              <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                언제든지 연락주세요. 함께 성장하겠습니다.
              </p>
            </div>
          </section>
        </main>
      </div>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        
        .mainContent {
          margin-left: 0;
          height: 100vh;
          position: relative;
        }
      `}</style>
    </div>
  );
}
