'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './layout.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const userStr = localStorage.getItem('user') || localStorage.getItem('userInfo');
      
      if (!userStr) {
        alert('로그인이 필요합니다.');
        router.push('/');
        return;
      }

      try {
        const user = JSON.parse(userStr);
        const userRole = user.role?.toUpperCase();
        
        if (userRole !== 'ADMIN') {
          alert('관리자 권한이 필요합니다.');
          router.push('/');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('인증 정보 확인 실패:', error);
        alert('인증 정보가 올바르지 않습니다. 다시 로그인해주세요.');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // body 스타일 설정
  useEffect(() => {
    if (isAuthorized) {
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      // overflow: hidden 제거 - 스크롤 가능하게
    }
    
    return () => {
      // cleanup
    };
  }, [isAuthorized]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>권한 확인 중...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const menuItems = [
    { path: '/admin', label: '대시보드', icon: '📊' },
    { path: '/admin/courses', label: '강의 관리', icon: '🎓' },
    { path: '/admin/instructors', label: '강사 관리', icon: '👨‍🏫' },
    { path: '/admin/inquiries', label: '문의 관리', icon: '📋' },
    { path: '/admin/users', label: '사용자 관리', icon: '👥' },
    { path: '/admin/statistics', label: '통계', icon: '📈' },
    { path: '/admin/settings', label: '설정', icon: '⚙️' },
  ];

  return (
    <div className={styles.adminLayout} style={{ margin: 0, padding: 0 }}>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>날리자쿠 관리자</h1>
          <div className={styles.headerRight}>
            <button 
              className={styles.homeButton}
              onClick={() => router.push('/')}
            >
              홈으로
            </button>
          </div>
        </div>
      </header>

      <div className={styles.mainContainer}>
        {/* 사이드바 */}
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
