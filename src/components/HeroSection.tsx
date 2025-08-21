'use client';

import React from 'react';
import { IoChevronForward } from 'react-icons/io5';
import styles from '@/styles/HeroSection.module.css';

export default function HeroSection() {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  const renderAnimatedText = (
    text: string,
    className: string,
    baseDelayMs: number,
    stepMs: number
  ) => {
    const characters = Array.from(text);
    return characters.map((ch, idx) => {
      const displayChar = ch === ' ' ? '\u00A0' : ch;
      return (
        <span
          key={`${ch}-${idx}`}
          className={className}
          style={{ animationDelay: `${baseDelayMs + idx * stepMs}ms` }}
        >
          {displayChar}
        </span>
      );
    });
  };

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // 간단하고 확실한 비디오 자동재생
  React.useEffect(() => {
    if (!isMounted) return;

    const video = videoRef.current;
    if (!video) return;

    // 비디오 자동재생 시도
    const tryPlay = async () => {
      try {
        video.muted = true;
        video.volume = 0;
        await video.play();
        console.log('✅ 비디오 자동재생 성공!');
      } catch (error) {
        console.log('자동재생 실패, 사용자 상호작용 대기 중...', error);
      }
    };

    // 비디오가 로드되면 재생 시도
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);

    // 사용자 상호작용 시 재생
    const playOnInteraction = async () => {
      try {
        await video.play();
        console.log('🎯 사용자 상호작용으로 재생 성공!');
        // 성공 후 이벤트 리스너 제거
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
      } catch (error) {
        console.log('재생 실패:', error);
      }
    };

    document.addEventListener('click', playOnInteraction, { once: true });
    document.addEventListener('touchstart', playOnInteraction, { once: true });

    // 즉시 재생 시도
    tryPlay();

    return () => {
      video.removeEventListener('loadeddata', tryPlay);
      video.removeEventListener('canplay', tryPlay);
      document.removeEventListener('click', playOnInteraction);
      document.removeEventListener('touchstart', playOnInteraction);
    };
  }, [isMounted]);

  const titleText = '드론과 꿈을 하늘로 날리자쿠!';
  const subtitleText = '국내 최초 학교 & 기관 대상, AI/XR 기반 드론 교육 전문 플랫폼';
  
  // 모바일에서 줄바꿈을 위한 텍스트 분리
  const subtitlePart1 = '국내 최초 학교 & 기관 대상, AI/XR 기반 ';
  const subtitlePart2 = '드론 교육 전문 플랫폼';

  return (
    <div ref={containerRef} className={styles.heroSection}>
      <video
        ref={videoRef}
        className={styles.backgroundVideo}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        poster="/nallijaku.png"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      
      <div className={styles.videoOverlay} />
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {renderAnimatedText(titleText, styles.char, 0, 35)}
        </h1>
        <p className={styles.heroDescription}>
          {/* 데스크탑에서는 한 줄로, 모바일에서는 두 줄로 표시 */}
          <span className={styles.desktopSubtitle}>
            {renderAnimatedText(subtitleText, styles.subtitleChar, 400, 18)}
          </span>
          <span className={styles.mobileSubtitle}>
            {renderAnimatedText(subtitlePart1, styles.subtitleChar, 400, 18)}
            <br />
            {renderAnimatedText(subtitlePart2, styles.subtitleChar, 400, 18)}
          </span>
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className={`${styles.serviceButton} ${styles.enterFromBottom}`}
            style={{ animationDelay: '650ms' }}
          >
            서비스 소개서 보기
            <IoChevronForward size={20} />
          </button>
        </div>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.primaryButton} ${styles.enterFromBottom}`}
            style={{ animationDelay: '800ms' }}
          >
            교육 도입하기
          </button>
          <button
            className={`${styles.secondaryButton} ${styles.enterFromBottom}`}
            style={{ animationDelay: '950ms' }}
          >
            교육 파트너 모집
          </button>
        </div>
      </div>
    </div>
  );
}
