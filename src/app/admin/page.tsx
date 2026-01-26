'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import api from '@/lib/axios';

interface RecentActivity {
  id: string;
  type: 'education' | 'partner';
  message: string;
  timestamp: string;
  icon: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    educationApplications: 0,
    partnerApplications: 0,
    totalUsers: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const loadStats = async () => {
      try {
        setLoading(true);
        
        const allActivities: RecentActivity[] = [];

        // 교육 도입 신청 통계 - Axios 사용
        try {
          const educationResponse = await api.get('/api/admin/inquiries');
          const educationData = educationResponse.data;
          // 백엔드 응답 구조에 맞게 파싱
          const applications = educationData.data || educationData.inquiries || educationData || [];
          console.log('📊 대시보드 - 교육 신청 데이터:', applications);
          setStats(prev => ({
            ...prev,
            educationApplications: Array.isArray(applications) ? applications.length : 0
          }));

          // 최근 활동 추가 (교육 신청)
          const educationActivities: RecentActivity[] = (Array.isArray(applications) ? applications : [])
            .slice(0, 3)
            .map((app: any, index: number) => ({
              id: `education-${app.id}-${index}-${Math.random().toString(36).substring(2, 11)}`,
              type: 'education' as const,
              message: `새로운 교육 도입 신청이 접수되었습니다. (${app.organizationName || app.schoolName})`,
              timestamp: app.createdAt || app.submittedAt,
              icon: '📝'
            }));
          
          allActivities.push(...educationActivities);
        } catch (error) {
          console.error('교육 신청 통계 로드 실패:', error);
        }

        // 파트너 모집 신청 통계 - Axios 사용
        try {
          const partnerResponse = await api.get('/api/partner-applications');
          const partnerData = partnerResponse.data;
          const applications = partnerData.applications || partnerData.data || [];
          setStats(prev => ({
            ...prev,
            partnerApplications: applications.length
          }));

          // 최근 활동 추가 (파트너 신청)
          const partnerActivities: RecentActivity[] = applications
            .slice(0, 3)
            .map((app: any, index: number) => ({
              id: `partner-${app.id}-${index}-${Math.random().toString(36).substring(2, 11)}`,
              type: 'partner' as const,
              message: `파트너 모집 신청이 접수되었습니다. (${app.applicantName || app.contactPerson})`,
              timestamp: app.createdAt || app.submittedAt,
              icon: '🤝'
            }));
          
          allActivities.push(...partnerActivities);
        } catch (error) {
          console.error('파트너 신청 통계 로드 실패:', error);
        }
        
        // 모든 활동을 한 번에 설정
        setRecentActivities(allActivities);

        // 총 사용자 수 - Axios 사용
        try {
          const usersResponse = await api.get('/api/users/count');
          const usersData = usersResponse.data;
          setStats(prev => ({
            ...prev,
            totalUsers: usersData.count || usersData.data?.count || 0
          }));
        } catch (error) {
          console.error('사용자 수 로드 실패:', error);
        }

      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // 시간 차이 계산 함수
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMs = now.getTime() - past.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) return `${diffInDays}일 전`;
    if (diffInHours > 0) return `${diffInHours}시간 전`;
    if (diffInMinutes > 0) return `${diffInMinutes}분 전`;
    return '방금 전';
  };

  // 최근 활동을 시간순으로 정렬
  const sortedActivities = [...recentActivities].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 5);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>대시보드 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
        <div className={styles.header}>
          <h1>관리자 대시보드</h1>
          <p>날리자쿠 관리자 페이지에 오신 것을 환영합니다.</p>
        </div>
      
      <div className={styles.dashboardGrid}>
        <div 
          className={styles.card}
          onClick={() => router.push('/admin/inquiries')}
          style={{ cursor: 'pointer' }}
        >
          <h3>교육 도입 신청</h3>
          <div className={styles.number}>{stats.educationApplications}</div>
          <p>총 신청 건수</p>
        </div>
        
        <div 
          className={styles.card}
          onClick={() => router.push('/admin/inquiries')}
          style={{ cursor: 'pointer' }}
        >
          <h3>파트너 모집 신청</h3>
          <div className={styles.number}>{stats.partnerApplications}</div>
          <p>총 신청 건수</p>
        </div>
        
        <div className={styles.card}>
          <h3>총 사용자</h3>
          <div className={styles.number}>{stats.totalUsers.toLocaleString()}</div>
          <p>등록된 사용자 수</p>
        </div>
      </div>
      
      <div className={styles.recentActivity}>
        <h3>최근 활동</h3>
        <div className={styles.activityList}>
          {sortedActivities.length === 0 ? (
            <div className={styles.emptyState}>
              <p>최근 활동이 없습니다.</p>
            </div>
          ) : (
            sortedActivities.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <span className={styles.activityIcon}>{activity.icon}</span>
                <div className={styles.activityContent}>
                  <p>{activity.message}</p>
                  <span className={styles.activityTime}>{getTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}