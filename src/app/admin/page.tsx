'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function AdminPage() {
  const [stats, setStats] = useState({
    educationApplications: 0,
    partnerApplications: 0,
    totalUsers: 1234,
    activeSessions: 89
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        // 교육 도입 신청 통계
        const educationResponse = await fetch('/api/education-applications');
        if (educationResponse.ok) {
          const educationData = await educationResponse.json();
          setStats(prev => ({
            ...prev,
            educationApplications: educationData.applications?.length || 0
          }));
        }

        // 파트너 모집 신청 통계
        const partnerResponse = await fetch('/api/partner-applications');
        if (partnerResponse.ok) {
          const partnerData = await partnerResponse.json();
          setStats(prev => ({
            ...prev,
            partnerApplications: partnerData.applications?.length || 0
          }));
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>관리자 대시보드</h1>
        <p>날리자쿠 관리자 페이지에 오신 것을 환영합니다.</p>
      </div>
      
      <div className={styles.dashboardGrid}>
        <div className={styles.card}>
          <h3>교육 도입 신청</h3>
          <div className={styles.number}>{stats.educationApplications}</div>
          <p>총 신청 건수</p>
        </div>
        
        <div className={styles.card}>
          <h3>파트너 모집 신청</h3>
          <div className={styles.number}>{stats.partnerApplications}</div>
          <p>총 신청 건수</p>
        </div>
        
        <div className={styles.card}>
          <h3>총 사용자</h3>
          <div className={styles.number}>{stats.totalUsers.toLocaleString()}</div>
          <p>등록된 사용자 수</p>
        </div>
        
        <div className={styles.card}>
          <h3>활성 세션</h3>
          <div className={styles.number}>{stats.activeSessions}</div>
          <p>현재 온라인 사용자</p>
        </div>
      </div>
      
      <div className={styles.recentActivity}>
        <h3>최근 활동</h3>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <span className={styles.activityIcon}>📝</span>
            <div className={styles.activityContent}>
              <p>새로운 교육 도입 신청이 접수되었습니다. (대구고등학교)</p>
              <span className={styles.activityTime}>1일 전</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.activityIcon}>🤝</span>
            <div className={styles.activityContent}>
              <p>파트너 모집 신청이 접수되었습니다. (한강사)</p>
              <span className={styles.activityTime}>2일 전</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.activityIcon}>📝</span>
            <div className={styles.activityContent}>
              <p>교육 도입 신청이 완료되었습니다. (인천초등학교)</p>
              <span className={styles.activityTime}>3일 전</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.activityIcon}>🤝</span>
            <div className={styles.activityContent}>
              <p>파트너 모집 신청이 진행중입니다. (김강사)</p>
              <span className={styles.activityTime}>4일 전</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}