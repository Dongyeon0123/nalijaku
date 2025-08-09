'use client';

import React from 'react';
import Image from 'next/image';
import styles from '@/styles/Header.module.css';

export default function Header() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const maxScrollable = scrollHeight - clientHeight;
      const percent = maxScrollable > 0 ? (scrollTop / maxScrollable) * 100 : 0;
      setProgress(percent);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Image 
            src="/logo.png" 
            alt="날리자쿠 로고" 
            width={90} 
            height={50}
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
