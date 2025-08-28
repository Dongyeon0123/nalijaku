'use client';

import React from 'react';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import styles from '@/styles/CollaborationSidebar.module.css';

export default function CollaborationSidebar() {
  const [isDarkBackground, setIsDarkBackground] = React.useState(true);

  React.useEffect(() => {
    const handleScroll = () => {
      const mainElement = document.querySelector('main');
      if (!mainElement) return;

      const sections = ['home', 'cooperation', 'customer', 'why', 'who', 'how', 'review', 'team', 'more', 'contact'];
      const scrollPosition = mainElement.scrollTop;
      const viewportHeight = mainElement.clientHeight;
      
      // 현재 뷰포트의 중앙점을 기준으로 활성 섹션 결정
      const centerPosition = scrollPosition + viewportHeight / 2;

      let currentActiveSection = 'home';
      let minDistance = Infinity;
      
      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop - mainElement.offsetTop;
          const sectionCenter = sectionTop + section.offsetHeight / 2;
          
          // 섹션의 중앙과 뷰포트 중앙 사이의 거리 계산
          const distance = Math.abs(centerPosition - sectionCenter);
          
          // 가장 가까운 섹션을 찾기
          if (distance < minDistance) {
            minDistance = distance;
            currentActiveSection = sectionId;
          }
        }
      }

      // home 섹션일 때는 다크 배경, 나머지는 라이트 배경
      setIsDarkBackground(currentActiveSection === 'home');
    };

    const mainElement = document.querySelector('main');
    if (mainElement) {
      // 스크롤 이벤트에 throttle 적용하여 성능 개선
      let ticking = false;
      const throttledHandleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };

      mainElement.addEventListener('scroll', throttledHandleScroll);
      // 초기 섹션 설정
      handleScroll();
      return () => mainElement.removeEventListener('scroll', throttledHandleScroll);
    }
  }, []);

  return (
    <div className={styles.sidebar}>
      <a href="http://pf.kakao.com/_Wxmdxen" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <div className={`${styles.button} ${isDarkBackground ? styles.darkTheme : styles.lightTheme}`}>
          <div className={styles.iconContainer}>
            <HiChatBubbleLeftRight className={styles.icon} />
          </div>
          <div className={styles.divider}></div>
          <div className={styles.text}>고객 센터</div>
        </div>
      </a>
    </div>
  );
}
