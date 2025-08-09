'use client';

import React from 'react';
import { IoChevronForward } from 'react-icons/io5';
import styles from '@/styles/HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <video
        autoPlay
        muted
        loop
        playsInline
        className={styles.backgroundVideo}
      >
        <source src="/background.mp4" type="video/mp4" />
        브라우저에서 비디오를 지원하지 않습니다.
      </video>

      <div className={styles.videoOverlay} />
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          드론과 꿈을 하늘로 날리자쿠!
        </h1>
        <p className={styles.heroDescription}>
          국내 최초 학교 & 기관 대상, AI/XR 기반 드론 교육 전문 플랫폼
        </p>
                 <div style={{ display: 'flex', justifyContent: 'center' }}>
             <button className={styles.serviceButton}>
               서비스 소개서 보기
               <IoChevronForward size={20} />
             </button>
         </div>
        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton}>
            교육 도입하기
          </button>
          <button className={styles.secondaryButton}>
            교육 파트너 모집
          </button>
        </div>
      </div>
    </section>
  );
}
