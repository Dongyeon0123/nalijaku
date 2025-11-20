'use client';

import React from 'react';
import Image from 'next/image';
import { IoHomeOutline, IoBusinessOutline, IoPeopleOutline, IoCallOutline, IoMenuOutline, IoBookOutline ,IoHelpOutline, IoHeartOutline, IoNewspaperOutline, IoPersonOutline } from 'react-icons/io5';
import styles from '@/styles/SidebarNav.module.css';
import { checkAdminStatus } from '@/services/authService';

export default function SidebarNav() {
  const [activeSection, setActiveSection] = React.useState('home');
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isDarkBackground, setIsDarkBackground] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const allNavItems = [
    { id: 'home', label: 'Home', icon: IoHomeOutline },
    { id: 'cooperation', label: '협력 업체', icon: IoPeopleOutline },
    { id: 'customer', label: '고객사', icon: IoBusinessOutline },
    { id: 'why', label: 'WHY?', icon: IoHelpOutline },
    { id: 'who', label: 'WHO?', icon: IoPersonOutline },
    { id: 'how', label: 'HOW?', icon: IoBookOutline },
    { id: 'review', label: '교육 후기', icon: IoHeartOutline },
    { id: 'team', label: 'Team 날리자쿠', icon: IoPeopleOutline },
    { id: 'news', label: '날리자쿠 News', icon: IoNewspaperOutline },
    { id: 'contact', label: 'Contact Us', icon: IoCallOutline },
  ];

  const navItems = React.useMemo(() => {
    // 관리자 계정이면 Contact Us 제외
    if (isAdmin) {
      return allNavItems.filter(item => item.id !== 'contact');
    }
    return allNavItems;
  }, [isAdmin]);

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

  // 관리자 상태 확인
  React.useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        const userData = JSON.parse(savedUserInfo);
        if (userData.username) {
          checkAdminStatus(userData.username)
            .then(adminResult => {
              setIsAdmin(adminResult.data.isAdmin);
            })
            .catch(error => {
              console.log('관리자 권한 확인 실패:', error);
              setIsAdmin(false);
            });
        }
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
      }
    }
  }, []);

  // 스크롤 위치에 따른 active 섹션 업데이트
  React.useEffect(() => {
    const handleScroll = () => {
      const mainElement = document.querySelector('main');
      if (!mainElement) return;

      const sections = navItems.map(item => item.id);
      const scrollPosition = mainElement.scrollTop;
      const viewportHeight = mainElement.clientHeight;
      
      // 현재 뷰포트의 중앙점을 기준으로 활성 섹션 결정
      const viewportCenter = scrollPosition + viewportHeight / 2;

      let currentActiveSection = 'home';
      let minDistance = Infinity;
      
      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop - mainElement.offsetTop;
          const sectionCenter = sectionTop + section.offsetHeight / 2;
          
          // 섹션의 중앙과 뷰포트 중앙 사이의 거리 계산
          const distance = Math.abs(viewportCenter - sectionCenter);
          
          // 가장 가까운 섹션을 찾기
          if (distance < minDistance) {
            minDistance = distance;
            currentActiveSection = sectionId;
          }
        }
      }

      // why2 섹션 체크 (navItems에 없지만 페이지에 존재)
      const why2Section = document.getElementById('why2');
      if (why2Section) {
        const why2Top = why2Section.offsetTop - mainElement.offsetTop;
        const why2Bottom = why2Top + why2Section.offsetHeight;
        
        // why2 섹션이 뷰포트에 보이는지 확인
        if (scrollPosition < why2Bottom && scrollPosition + viewportHeight > why2Top) {
          // why2 섹션이 보이면 라이트 테마 유지
          if (isDarkBackground) {
            setIsDarkBackground(false);
          }
        }
      }

      // HOW 섹션 체크 - 밝은 배경이므로 라이트 테마 유지
      const howSection = document.getElementById('how');
      if (howSection) {
        const howTop = howSection.offsetTop - mainElement.offsetTop;
        const howBottom = howTop + howSection.offsetHeight;
        
        // HOW 섹션이 뷰포트에 보이는지 확인
        if (scrollPosition < howBottom && scrollPosition + viewportHeight > howTop) {
          // HOW 섹션이 보이면 라이트 테마 유지
          if (isDarkBackground) {
            setIsDarkBackground(false);
          }
        }
      }

      // Team 섹션 체크 - 밝은 배경이므로 라이트 테마 유지
      const teamSection = document.getElementById('team');
      if (teamSection) {
        const teamTop = teamSection.offsetTop - mainElement.offsetTop;
        const teamBottom = teamTop + teamSection.offsetHeight;
        
        // Team 섹션이 뷰포트에 보이는지 확인
        if (scrollPosition < teamBottom && scrollPosition + viewportHeight > teamTop) {
          // Team 섹션이 보이면 라이트 테마 유지
          if (isDarkBackground) {
            setIsDarkBackground(false);
          }
        }
      }

      // News 섹션 체크 - 밝은 배경이므로 라이트 테마 유지
      const newsSection = document.getElementById('news');
      if (newsSection) {
        const newsTop = newsSection.offsetTop - mainElement.offsetTop;
        const newsBottom = newsTop + newsSection.offsetHeight;
        
        // News 섹션이 뷰포트에 보이는지 확인
        if (scrollPosition < newsBottom && scrollPosition + viewportHeight > newsTop) {
          // News 섹션이 보이면 라이트 테마 유지
          if (isDarkBackground) {
            setIsDarkBackground(false);
          }
        }
      }

      // 이전 섹션과 다를 때만 업데이트 (깜빡임 방지)
      if (activeSection !== currentActiveSection) {
        console.log('Active section changed:', currentActiveSection, 'Scroll position:', scrollPosition);
        setActiveSection(currentActiveSection);
        // home 섹션일 때만 다크 배경, 나머지는 라이트 배경
        setIsDarkBackground(currentActiveSection === 'home');
      }
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

      mainElement.addEventListener('scroll', throttledHandleScroll, { passive: true });
      // 초기 섹션 설정
      handleScroll();
      return () => {
        mainElement.removeEventListener('scroll', throttledHandleScroll);
      };
    }
  }, [navItems, activeSection, isDarkBackground]);

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
