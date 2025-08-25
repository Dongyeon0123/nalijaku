'use client';

import React from 'react';
import { IoChevronForward } from 'react-icons/io5';
import styles from '@/styles/HeroSection.module.css';

export default function HeroSection() {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);

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

  // 강화된 비디오 자동재생 로직
  React.useEffect(() => {
    if (!isMounted) return;

    const video = videoRef.current;
    if (!video) return;

    // 비디오 설정 최적화
    video.muted = true;
    video.volume = 0;
    video.playsInline = true;
    video.preload = 'auto';

    // 비디오 자동재생 시도 (여러 방법)
    const tryPlay = async () => {
      try {
        // 방법 1: 기본 play() 시도
        await video.play();
        setIsVideoPlaying(true);
        console.log('✅ 비디오 자동재생 성공!');
        return true;
      } catch (error) {
        console.log('기본 재생 실패, 대체 방법 시도...', error);
        
        try {
          // 방법 2: Promise.resolve()로 감싸서 시도
          await Promise.resolve(video.play());
          setIsVideoPlaying(true);
          console.log('✅ Promise.resolve로 재생 성공!');
          return true;
        } catch (error2) {
          console.log('Promise.resolve 재생도 실패:', error2);
          
          try {
            // 방법 3: setTimeout으로 지연 재생 시도
            setTimeout(async () => {
              try {
                await video.play();
                setIsVideoPlaying(true);
                console.log('✅ 지연 재생 성공!');
              } catch (error3) {
                console.log('지연 재생도 실패:', error3);
              }
            }, 100);
            return false;
          } catch (error3) {
            console.log('지연 재생 시도 실패:', error3);
            return false;
          }
        }
      }
    };

    // 비디오 이벤트 리스너들
    const handleLoadedData = () => {
      console.log('📹 비디오 데이터 로드됨');
      tryPlay();
    };

    const handleCanPlay = () => {
      console.log('🎬 비디오 재생 가능');
      tryPlay();
    };

    const handleCanPlayThrough = () => {
      console.log('🎭 비디오 완전 재생 가능');
      tryPlay();
    };

    const handleLoadedMetadata = () => {
      console.log('📋 비디오 메타데이터 로드됨');
      tryPlay();
    };

    // 사용자 상호작용 시 재생
    const playOnInteraction = async (event: Event) => {
      event.preventDefault();
      try {
        await video.play();
        setIsVideoPlaying(true);
        console.log('🎯 사용자 상호작용으로 재생 성공!');
        
        // 성공 후 이벤트 리스너 제거
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('keydown', playOnInteraction);
        document.removeEventListener('scroll', playOnInteraction);
      } catch (error) {
        console.log('사용자 상호작용 재생 실패:', error);
      }
    };

    // 비디오 이벤트 리스너 추가
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // 사용자 상호작용 이벤트 리스너 추가
    document.addEventListener('click', playOnInteraction, { once: true });
    document.addEventListener('touchstart', playOnInteraction, { once: true });
    document.addEventListener('keydown', playOnInteraction, { once: true });
    document.addEventListener('scroll', playOnInteraction, { once: true });

    // 비디오 재생 상태 모니터링
    const handlePlay = () => {
      setIsVideoPlaying(true);
      console.log('▶️ 비디오 재생 시작');
    };

    const handlePause = () => {
      setIsVideoPlaying(false);
      console.log('⏸️ 비디오 일시정지');
    };

    const handleEnded = () => {
      console.log('🔚 비디오 재생 완료');
    };

    const handleError = (error: Event) => {
      console.error('❌ 비디오 오류:', error);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    // 초기 재생 시도
    setTimeout(() => {
      tryPlay();
    }, 100);

    return () => {
      // 이벤트 리스너 정리
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      
      document.removeEventListener('click', playOnInteraction);
      document.removeEventListener('touchstart', playOnInteraction);
      document.removeEventListener('keydown', playOnInteraction);
      document.removeEventListener('scroll', playOnInteraction);
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
        style={{ 
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        }}
      >
        <source src="/background.mp4" type="video/mp4" />
        <source src="/background.webm" type="video/webm" />
        {/* 브라우저가 비디오를 지원하지 않을 때 대체 이미지 */}
        <img src="/nallijaku.png" alt="날리자쿠 배경" />
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
      
      {/* 비디오 재생 상태 표시 (개발용) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: isVideoPlaying ? 'rgba(0, 255, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          {isVideoPlaying ? '▶️ 재생 중' : '⏸️ 일시정지'}
        </div>
      )}
    </div>
  );
}
