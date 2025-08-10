'use client';

import React from 'react';
import Image from 'next/image';
import { IoHomeOutline, IoBusinessOutline, IoPeopleOutline, IoCallOutline, IoMenuOutline, IoHelpCircleOutline, IoStarOutline, IoAddCircleOutline } from 'react-icons/io5';
import styles from '@/styles/SidebarNav.module.css';

export default function SidebarNav() {
  const [activeSection, setActiveSection] = React.useState('home');
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isDarkBackground, setIsDarkBackground] = React.useState(true);

  const navItems = React.useMemo(() => [
    { id: 'home', label: 'Home', icon: IoHomeOutline },
    { id: 'cooperation', label: '협력 업체', icon: IoPeopleOutline },
    { id: 'customer', label: '고객사', icon: IoBusinessOutline },
    { id: 'why', label: 'WHY?', icon: IoHelpCircleOutline },
    { id: 'who', label: 'WHO?', icon: IoBusinessOutline },
    { id: 'how', label: 'HOW?', icon: IoHelpCircleOutline },
    { id: 'review', label: '교육 후기', icon: IoStarOutline },
    { id: 'team', label: 'Team 날리자쿠', icon: IoPeopleOutline },
    { id: 'more', label: 'MORE', icon: IoAddCircleOutline },
    { id: 'contact', label: 'Contact Us', icon: IoCallOutline },
  ], []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    
    const targetElement = document.getElementById(sectionId);
    const mainElement = document.querySelector('main');
    
    if (targetElement && mainElement) {
      // CSS scroll-behavior 제거하고 JavaScript로 애니메이션 처리
      const originalScrollBehavior = mainElement.style.scrollBehavior;
      mainElement.style.scrollBehavior = 'auto';
      
      // main 요소 내에서의 상대적 위치 계산
      const targetTop = targetElement.offsetTop - mainElement.offsetTop;
      
      // 부드러운 스크롤 애니메이션 구현
      const startScrollTop = mainElement.scrollTop;
      const distance = targetTop - startScrollTop;
      const duration = 800; // 800ms 애니메이션
      let startTime = 0;
      
      const animate = (currentTime: number) => {
        if (startTime === 0) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // easeInOutCubic 이징 함수
        const ease = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        mainElement.scrollTop = startScrollTop + distance * ease;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // 애니메이션 완료 후 원래 scroll-behavior 복원
          mainElement.style.scrollBehavior = originalScrollBehavior;
        }
      };
      
      requestAnimationFrame(animate);
    }
  };

  // 스크롤 위치에 따른 active 섹션 업데이트
  React.useEffect(() => {
    const handleScroll = () => {
      const mainElement = document.querySelector('main');
      if (!mainElement) return;

      const sections = navItems.map(item => item.id);
      const scrollPosition = mainElement.scrollTop;
      const viewportHeight = mainElement.clientHeight;
      
      // 현재 뷰포트의 중앙점을 기준으로 활성 섹션 결정
      const centerPosition = scrollPosition + viewportHeight / 2;

      let currentActiveSection = 'home';
      
      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop - mainElement.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;
          
          // 섹션의 중앙이 뷰포트 중앙에 가장 가까운 섹션을 찾기
          if (centerPosition >= sectionTop && centerPosition < sectionBottom) {
            currentActiveSection = sectionId;
            break;
          }
        }
      }

      setActiveSection(currentActiveSection);
      
      // home 섹션일 때는 다크 배경, 나머지는 라이트 배경
      setIsDarkBackground(currentActiveSection === 'home');
    };

    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      // 초기 섹션 설정
      handleScroll();
      return () => mainElement.removeEventListener('scroll', handleScroll);
    }
  }, [navItems]);

  return (
    <nav 
      className={`${styles.sidebarNav} ${isExpanded ? styles.expanded : styles.collapsed} ${isDarkBackground ? styles.darkTheme : styles.lightTheme}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          {!isExpanded ? (
            <IoMenuOutline className={styles.hamburgerIcon} />
          ) : (
            <>
              <Image src="/logo.png" alt="날리자쿠" width={120} height={40} className={styles.logoImage} />
              <span className={styles.logoText}>날리자쿠</span>
            </>
          )}
        </div>
        
        <ul className={styles.navList}>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id} className={styles.navItem}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`${styles.navButton} ${
                    activeSection === item.id ? styles.active : ''
                  }`}
                  title={!isExpanded ? item.label : undefined}
                >
                  <IconComponent className={styles.navIcon} />
                  {isExpanded && <span className={styles.navLabel}>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
