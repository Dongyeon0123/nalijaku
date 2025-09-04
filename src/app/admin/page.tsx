'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { FaUsers, FaFileAlt, FaCog } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <div>
      <header className={styles.mainHeader}>
        <h1>대시보드</h1>
      </header>
      <div className={styles.dashboardGrid}>
        <Link href="/admin/users" className={styles.cardLink}>
          <div className={styles.card}>
            <FaUsers size={40} className={styles.cardIcon} />
            <h3>사용자 관리</h3>
            <p>사용자 계정 및 권한을 관리합니다.</p>
          </div>
        </Link>
        <div className={styles.card}>
          <FaFileAlt size={40} className={styles.cardIcon} />
          <h3>콘텐츠 관리</h3>
          <p>웹사이트의 콘텐츠를 수정합니다.</p>
        </div>
        <div className={styles.card}>
          <FaCog size={40} className={styles.cardIcon} />
          <h3>설정</h3>
          <p>시스템 설정을 변경합니다.</p>
        </div>
        <div className={styles.card}>
          <h3>통계</h3>
          <p>방문자 및 주요 지표를 확인합니다.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
