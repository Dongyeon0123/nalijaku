'use client';

import React from 'react';
import { IoChevronForward } from 'react-icons/io5';
import styles from '@/styles/HeroSection.module.css';

export default function HeroSection() {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const containerRef = React.useRef<HTMLElement | null>(null);
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

  // 동적 비디오 생성 및 강제 재생
  React.useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    const createAndPlayVideo = () => {
      // 기존 비디오 제거
      const existingVideo = videoRef.current;
      if (existingVideo) {
        existingVideo.remove();
      }

      // 새 비디오 요소 동적 생성
      const video = document.createElement('video');
      video.className = styles.backgroundVideo;
      video.muted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.poster = '/nallijaku.png';
      video.src = '/background.mp4';
      
      // 모든 볼륨 관련 설정
      video.volume = 0;
      video.defaultMuted = true;
      (video as HTMLVideoElement & { 'webkit-playsinline'?: boolean })['webkit-playsinline'] = true;

      videoRef.current = video;

      // 이벤트 리스너 추가
      const playVideo = async () => {
        try {
          video.currentTime = 0;
          await video.play();
          console.log('✅ 비디오 재생 성공!');
        } catch (error) {
          console.log('🔄 재생 시도 중...', error);
        }
      };

      video.addEventListener('canplay', playVideo);
      video.addEventListener('loadeddata', playVideo);
      video.addEventListener('loadedmetadata', playVideo);

      // DOM에 추가
      containerRef.current?.appendChild(video);

      // 즉시 로드 및 재생 시도
      video.load();
      playVideo();

      return video;
    };

    const video = createAndPlayVideo();

    // 강력한 사용자 상호작용 감지
    const forcePlay = async () => {
      if (!video) return;
      try {
        video.muted = true;
        video.volume = 0;
        await video.play();
        console.log('🎯 상호작용으로 재생 성공!');
      } catch (error) {
        console.log('재생 실패:', error);
      }
    };

    // 모든 종류의 사용자 이벤트 감지
    const handleUserEvent = () => {
      forcePlay();
      // 한 번 성공하면 이벤트 제거
      removeAllListeners();
    };

    const events = [
      'click', 'mousedown', 'mouseup', 'mousemove',
      'touchstart', 'touchend', 'touchmove',
      'keydown', 'keyup', 'scroll', 'wheel',
      'focus', 'blur', 'resize'
    ];

    const removeAllListeners = () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserEvent);
        window.removeEventListener(event, handleUserEvent);
      });
    };

    // 모든 이벤트에 리스너 추가
    events.forEach(event => {
      document.addEventListener(event, handleUserEvent, { passive: true, once: true });
      window.addEventListener(event, handleUserEvent, { passive: true, once: true });
    });

    // visibility change
    const visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        forcePlay();
      }
    };
    document.addEventListener('visibilitychange', visibilityHandler);

    // 정기적 재시도 (더 공격적으로)
    let attempts = 0;
    const maxAttempts = 20;
    const retryInterval = setInterval(() => {
      if (video && video.paused && attempts < maxAttempts) {
        attempts++;
        forcePlay();
        console.log(`🔄 자동 재시도 ${attempts}/${maxAttempts}`);
      } else if (attempts >= maxAttempts || !video.paused) {
        clearInterval(retryInterval);
      }
    }, 500); // 0.5초마다

    return () => {
      clearInterval(retryInterval);
      removeAllListeners();
      document.removeEventListener('visibilitychange', visibilityHandler);
      if (video && video.parentNode) {
        video.remove();
      }
    };
  }, [isMounted]);

  const titleText = '드론과 꿈을 하늘로 날리자쿠!';
  const subtitleText = '국내 최초 학교 & 기관 대상, AI/XR 기반 드론 교육 전문 플랫폼';

  return (
    <section ref={containerRef} className={styles.heroSection}>
      {/* 비디오는 동적으로 생성되므로 여기서는 빈 공간 */}
      
      <div className={styles.videoOverlay} />
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {renderAnimatedText(titleText, styles.char, 0, 35)}
        </h1>
        <p className={styles.heroDescription}>
          {renderAnimatedText(subtitleText, styles.subtitleChar, 400, 18)}
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
    </section>
  );
}
