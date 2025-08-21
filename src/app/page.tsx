'use client';

import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Cooperation from '@/components/Cooperation';
import Customer from '@/components/Customer';
import Why from '@/components/Why';
import Why2 from '@/components/Why2';
import SidebarNav from '@/components/SidebarNav';
import How from '@/components/How';
import Who from '@/components/Who';

export default function Home() {
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, []);

  return (
    <div style={{
      margin: 0,
      padding: 0,
      height: '100vh',
      overflow: 'hidden',
      width: '100vw',
      maxWidth: '100%'
    }}>
      <SidebarNav />
      
      <div className="mainContent">        
        <main style={{
          height: '100vh',
          background: '#ffffff',
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
          scrollBehavior: 'smooth',
          width: '100%',
          maxWidth: '100vw'
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
          <section id="why">
            <Why />
          </section>
          <section id="why2">
            <Why2 />
          </section>
          <section id="who">
            <Who />
          </section>
          <section id="how" style={{ minHeight: '230vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: "url('/How/HOWBackImage.png')", backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', position: 'relative' }}>
            <How />
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
          overflow-x: hidden;
          width: 100%;
          max-width: 100vw;
        }
        
        body {
          overflow-x: hidden;
          width: 100%;
          max-width: 100vw;
        }
        
        .mainContent {
          margin-left: 0;
          height: 100vh;
          position: relative;
          overflow-x: hidden;
          width: 100%;
          max-width: 100vw;
        }


        /* 화살표 바운스 애니메이션 */
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}
