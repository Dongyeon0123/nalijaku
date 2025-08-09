'use client';

import React from 'react';
import { IoHomeOutline, IoBusinessOutline, IoPeopleOutline, IoSchoolOutline, IoCallOutline, IoDocumentTextOutline, IoMenuOutline, IoHelpCircleOutline, IoStarOutline, IoAddCircleOutline } from 'react-icons/io5';
import styles from '@/styles/SidebarNav.module.css';

export default function SidebarNav() {
  const [activeSection, setActiveSection] = React.useState('home');
  const [isExpanded, setIsExpanded] = React.useState(false);

  const navItems = [
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
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    
    const targetElement = document.getElementById(sectionId);
    const mainElement = document.querySelector('main');
    
    if (targetElement && mainElement) {
      // main 요소 내에서의 상대적 위치 계산
      const targetTop = targetElement.offsetTop - mainElement.offsetTop;
      
      // main 요소 내에서 스크롤
      mainElement.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
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
      className={`${styles.sidebarNav} ${isExpanded ? styles.expanded : styles.collapsed}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          {!isExpanded ? (
            <IoMenuOutline className={styles.hamburgerIcon} />
          ) : (
            <>
              <img src="/logo.png" alt="날리자쿠" className={styles.logoImage} />
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
