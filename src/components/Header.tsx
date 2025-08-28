'use client';

import React from 'react';
import Image from 'next/image';
import styles from '@/styles/Header.module.css';

interface HeaderProps {
  forceLightMode?: boolean;
}

export default function Header({ forceLightMode = false }: HeaderProps) {
  const [progress, setProgress] = React.useState(0);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const headerRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      const mainElement = document.querySelector('main');
      if (!mainElement) return;

      const scrollTop = mainElement.scrollTop;
      
      // 스크롤 진행도 계산
      const { scrollHeight, clientHeight } = mainElement;
      const maxScrollable = scrollHeight - clientHeight;
      const percent = maxScrollable > 0 ? (scrollTop / maxScrollable) * 100 : 0;
      setProgress(percent);
      
      // 현재 섹션 확인하여 헤더 스타일 결정
      const homeSection = document.getElementById('home');
      if (homeSection) {
        const homeSectionBottom = homeSection.offsetTop + homeSection.offsetHeight - mainElement.offsetTop;
        const isInHomeSection = scrollTop < homeSectionBottom - 100; // 100px 여유
        setIsScrolled(!isInHomeSection);
      } else {
        // fallback: 50px 이상 스크롤하면 흰색 배경 활성화
        setIsScrolled(scrollTop > 50);
      }
    };

    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true });
      // 초기 상태 설정
      handleScroll();
      return () => {
        mainElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  React.useEffect(() => {
    const updateHeaderHeight = () => {
      const height = headerRef.current?.offsetHeight ?? 80;
      document.documentElement.style.setProperty('--header-height', `${height}px`);
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  const handleScrollToHome = () => {
    const homeSection = document.getElementById('home');
    const mainElement = document.querySelector('main');
    
    if (homeSection && mainElement) {
      // main 요소 내에서 home 섹션으로 스크롤
      const targetTop = homeSection.offsetTop - mainElement.offsetTop;
      mainElement.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    } else {
      // fallback으로 맨 위로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header ref={headerRef} className={`${styles.header} ${forceLightMode ? styles.scrolled : (isScrolled ? styles.scrolled : styles.transparent)}`}>
      <div className={styles.container}>
        <div className={styles.logoSection} onClick={handleScrollToHome}>
          <Image 
            src="/logo.png" 
            alt="날리자쿠 로고" 
            width={72} 
            height={40}
            className={styles.logoImage}
          />
          <span className={styles.logoText}>
            날리자쿠
          </span>
        </div>

        <nav className={styles.navigation}>
          <a href="#" className={styles.navLink}>
            학습 자료
          </a>
          <a href="#" className={styles.navLink}>
            날리자쿠 소개
          </a>
          <a href="#" className={styles.navLink}>
            강의하기
          </a>
        </nav>

        <div className={styles.buttonSection}>
          <button className={styles.curriculumButton}>
            전체 커리큘럼
          </button>
          <button className={styles.loginButton}>
            로그인
          </button>
        </div>
      </div>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}
