'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';
import { FaTachometerAlt, FaUsers } from 'react-icons/fa';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin" style={{textDecoration: 'none', color: 'inherit'}}><h2>날리자쿠 Admin</h2></Link>
        </div>
        <nav className={styles.sidebarNav}>
          <ul>
            <li className={pathname === '/admin' ? styles.active : ''}>
              <Link href="/admin"><FaTachometerAlt /> 대시보드</Link>
            </li>
            <li className={pathname === '/admin/users' ? styles.active : ''}>
              <Link href="/admin/users"><FaUsers /> 사용자 관리</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
