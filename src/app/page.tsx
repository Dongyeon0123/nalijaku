import React from 'react';

const slideStyle = `
@keyframes slide {
  0% { transform: translateX(0); }
  50% { transform: translateX(18px); }
  100% { transform: translateX(0); }
}
.slideText {
  display: inline-block;
  animation: slide 2s ease-in-out infinite;
}
`;

const baseColor = '#52CC7A';

export default function Landing() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: baseColor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
      zIndex: 9999,
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      minWidth: '100vw',
    }}>
      <style>{slideStyle}</style>
      <div style={{
        background: 'rgba(255,255,255,0.12)',
        borderRadius: 32,
        boxShadow: '0 8px 32px 0 rgba(82,204,122,0.25)',
        padding: '56px 36px 48px 36px',
        maxWidth: 420,
        width: '90%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <svg width="60" height="60" viewBox="0 0 60 60" style={{ marginBottom: 28 }}>
          <circle cx="30" cy="30" r="30" fill="#fff" opacity="0.22"/>
          <path d="M20 33L28 41L42 25" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 style={{
          color: '#fff',
          fontSize: 28,
          fontWeight: 800,
          margin: 0,
          marginBottom: 18,
          letterSpacing: '-1px',
          lineHeight: 1.25
        }}>
          <span className="slideText">
            현재 날리자 KU 사이트를<br/>준비 중입니다.<br />
            <span style={{ fontWeight: 500, fontSize: 22, opacity: 0.85 }}>
              곧 찾아뵐게요!
            </span>
          </span>
        </h1>
        <div style={{
          marginTop: 30,
          color: '#fff',
          fontSize: 15,
          opacity: 0.65,
          fontWeight: 400,
          letterSpacing: '-0.5px'
        }}>
          문의: <a href="proteolee2@gmail.com" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8,}}>proteolee2@gmail.com</a>
        </div>
      </div>
    </div>
  );
}
