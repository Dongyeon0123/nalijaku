'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

export default function StatisticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'users' | 'revenue'>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // 통계 카드 데이터
  const [statCards, setStatCards] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  // 실제 데이터 로드
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        
        // 교육 도입 신청 데이터
        const educationResponse = await fetch('/api/education-applications');
        const educationData = educationResponse.ok ? await educationResponse.json() : { applications: [] };
        
        // 파트너 모집 신청 데이터
        const partnerResponse = await fetch('/api/partner-applications');
        const partnerData = partnerResponse.ok ? await partnerResponse.json() : { applications: [] };
        
        const educationApps = educationData.applications || [];
        const partnerApps = partnerData.applications || [];
        
        // 완료된 신청 계산
        const completedEducation = educationApps.filter((app: any) => app.status === 'completed').length;
        const completedPartner = partnerApps.filter((app: any) => app.status === 'completed').length;
        const totalCompleted = completedEducation + completedPartner;
        
        // 통계 카드 업데이트
        setStatCards([
          {
            title: '총 신청 건수',
            value: educationApps.length + partnerApps.length,
            change: 12.5,
            changeType: 'increase',
            icon: '📝'
          },
          {
            title: '교육 도입 신청',
            value: educationApps.length,
            change: 8.2,
            changeType: 'increase',
            icon: '🎓'
          },
          {
            title: '파트너 모집 신청',
            value: partnerApps.length,
            change: -3.1,
            changeType: 'decrease',
            icon: '🤝'
          },
          {
            title: '완료된 신청',
            value: totalCompleted,
            change: 15.3,
            changeType: 'increase',
            icon: '✅'
          },
          {
            title: '총 사용자',
            value: 1234,
            change: 22.1,
            changeType: 'increase',
            icon: '👥'
          },
          {
            title: '활성 사용자',
            value: 456,
            change: 5.7,
            changeType: 'increase',
            icon: '🟢'
          }
        ]);
      } catch (error) {
        console.error('Error loading statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  // 월별 신청 통계
  const monthlyApplications = [
    { month: '1월', education: 12, partner: 8, total: 20 },
    { month: '2월', education: 15, partner: 10, total: 25 },
    { month: '3월', education: 18, partner: 12, total: 30 },
    { month: '4월', education: 22, partner: 15, total: 37 },
    { month: '5월', education: 25, partner: 18, total: 43 },
    { month: '6월', education: 28, partner: 20, total: 48 }
  ];

  // 지역별 신청 통계
  const regionalStats = [
    { region: '서울', applications: 45, percentage: 28.8 },
    { region: '경기', applications: 32, percentage: 20.5 },
    { region: '부산', applications: 18, percentage: 11.5 },
    { region: '대구', applications: 15, percentage: 9.6 },
    { region: '인천', applications: 12, percentage: 7.7 },
    { region: '기타', applications: 34, percentage: 21.9 }
  ];

  // 최근 활동
  const recentActivities = [
    { type: 'education', school: '서울초등학교', status: 'completed', time: '2시간 전' },
    { type: 'partner', name: '김강사', status: 'pending', time: '4시간 전' },
    { type: 'education', school: '부산중학교', status: 'completed', time: '6시간 전' },
    { type: 'partner', name: '이교관', status: 'in_progress', time: '8시간 전' },
    { type: 'education', school: '대구고등학교', status: 'pending', time: '10시간 전' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '🔄';
      case 'pending': return '⏳';
      default: return '📋';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '완료';
      case 'in_progress': return '진행중';
      case 'pending': return '확인 전';
      default: return '알 수 없음';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return styles.completed;
      case 'in_progress': return styles.inProgress;
      case 'pending': return styles.pending;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>통계 및 분석</h1>
        <p>시스템 사용 현황과 신청 통계를 확인할 수 있습니다.</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            개요
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'applications' ? styles.active : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            신청 통계
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => setActiveTab('users')}
          >
            사용자 통계
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'revenue' ? styles.active : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            수익 분석
          </button>
        </div>

        <div className={styles.dateRangeContainer}>
          <label htmlFor="dateRange">기간:</label>
          <select
            id="dateRange"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className={styles.dateRangeSelect}
          >
            <option value="7d">최근 7일</option>
            <option value="30d">최근 30일</option>
            <option value="90d">최근 90일</option>
            <option value="1y">최근 1년</option>
          </select>
        </div>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>통계 데이터를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <>
                <div className={styles.statsGrid}>
                  {statCards.map((card, index) => (
                    <div key={index} className={styles.statCard}>
                      <div className={styles.statIcon}>{card.icon}</div>
                      <div className={styles.statContent}>
                        <h3>{card.title}</h3>
                        <div className={styles.statValue}>{card.value.toLocaleString()}</div>
                        <div className={`${styles.statChange} ${styles[card.changeType]}`}>
                          {card.changeType === 'increase' ? '↗' : '↘'} {Math.abs(card.change)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.chartsGrid}>
                  <div className={styles.chartCard}>
                    <h3>월별 신청 현황</h3>
                    <div className={styles.chart}>
                      <div className={styles.chartBars}>
                        {monthlyApplications.map((data, index) => (
                          <div key={index} className={styles.barContainer}>
                            <div className={styles.barGroup}>
                              <div 
                                className={styles.bar} 
                                style={{ 
                                  height: `${(data.education / 30) * 100}%`,
                                  backgroundColor: '#04AD74'
                                }}
                                title={`교육 도입: ${data.education}건`}
                              />
                              <div 
                                className={styles.bar} 
                                style={{ 
                                  height: `${(data.partner / 30) * 100}%`,
                                  backgroundColor: '#3b82f6'
                                }}
                                title={`파트너 모집: ${data.partner}건`}
                              />
                            </div>
                            <div className={styles.barLabel}>{data.month}</div>
                          </div>
                        ))}
                      </div>
                      <div className={styles.chartLegend}>
                        <div className={styles.legendItem}>
                          <div className={styles.legendColor} style={{ backgroundColor: '#04AD74' }}></div>
                          <span>교육 도입</span>
                        </div>
                        <div className={styles.legendItem}>
                          <div className={styles.legendColor} style={{ backgroundColor: '#3b82f6' }}></div>
                          <span>파트너 모집</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.chartCard}>
                    <h3>지역별 신청 분포</h3>
                    <div className={styles.pieChart}>
                      <div className={styles.pieChartContainer}>
                        {regionalStats.map((region, index) => (
                          <div key={index} className={styles.pieSlice}>
                            <div 
                              className={styles.pieSliceInner}
                              style={{ 
                                transform: `rotate(${index * 60}deg)`,
                                background: `conic-gradient(from ${index * 60}deg, #04AD74 ${region.percentage * 3.6}deg, transparent 0deg)`
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className={styles.pieLegend}>
                        {regionalStats.map((region, index) => (
                          <div key={index} className={styles.pieLegendItem}>
                            <div className={styles.pieLegendColor}></div>
                            <span>{region.region}: {region.applications}건 ({region.percentage}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.recentActivity}>
                  <h3>최근 활동</h3>
                  <div className={styles.activityList}>
                    {recentActivities.map((activity, index) => (
                      <div key={index} className={styles.activityItem}>
                        <div className={styles.activityIcon}>
                          {activity.type === 'education' ? '🎓' : '🤝'}
                        </div>
                        <div className={styles.activityContent}>
                          <div className={styles.activityTitle}>
                            {activity.type === 'education' 
                              ? `${activity.school} 교육 도입 신청`
                              : `${activity.name} 파트너 모집 신청`
                            }
                          </div>
                          <div className={styles.activityMeta}>
                            <span className={`${styles.activityStatus} ${getStatusClass(activity.status)}`}>
                              {getStatusIcon(activity.status)} {getStatusText(activity.status)}
                            </span>
                            <span className={styles.activityTime}>{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!loading && activeTab === 'applications' && (
              <div className={styles.detailedStats}>
                <h2>신청 상세 통계</h2>
                <div className={styles.statsTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>구분</th>
                        <th>총 신청</th>
                        <th>완료</th>
                        <th>진행중</th>
                        <th>확인 전</th>
                        <th>완료율</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>교육 도입</td>
                        <td>5</td>
                        <td>1</td>
                        <td>1</td>
                        <td>3</td>
                        <td>20.0%</td>
                      </tr>
                      <tr>
                        <td>파트너 모집</td>
                        <td>6</td>
                        <td>1</td>
                        <td>1</td>
                        <td>4</td>
                        <td>16.7%</td>
                      </tr>
                      <tr className={styles.totalRow}>
                        <td>전체</td>
                        <td>11</td>
                        <td>2</td>
                        <td>2</td>
                        <td>7</td>
                        <td>18.2%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!loading && activeTab === 'users' && (
              <div className={styles.detailedStats}>
                <h2>사용자 통계</h2>
                <div className={styles.userStatsGrid}>
                  <div className={styles.userStatCard}>
                    <h3>가입 현황</h3>
                    <div className={styles.userStatValue}>1,234명</div>
                    <div className={styles.userStatChange}>+22.1% (이번 달)</div>
                  </div>
                  <div className={styles.userStatCard}>
                    <h3>활성 사용자</h3>
                    <div className={styles.userStatValue}>456명</div>
                    <div className={styles.userStatChange}>+5.7% (이번 주)</div>
                  </div>
                  <div className={styles.userStatCard}>
                    <h3>평균 세션 시간</h3>
                    <div className={styles.userStatValue}>12분 34초</div>
                    <div className={styles.userStatChange}>+8.3% (이번 주)</div>
                  </div>
                </div>
              </div>
            )}

            {!loading && activeTab === 'revenue' && (
              <div className={styles.detailedStats}>
                <h2>수익 분석</h2>
                <div className={styles.revenueGrid}>
                  <div className={styles.revenueCard}>
                    <h3>이번 달 수익</h3>
                    <div className={styles.revenueValue}>₩12,450,000</div>
                    <div className={styles.revenueChange}>+15.3% (전월 대비)</div>
                  </div>
                  <div className={styles.revenueCard}>
                    <h3>총 누적 수익</h3>
                    <div className={styles.revenueValue}>₩89,230,000</div>
                    <div className={styles.revenueChange}>+28.7% (전년 대비)</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}