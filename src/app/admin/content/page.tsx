'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

interface EducationApplication {
  id: string;
  schoolName: string;
  contactPerson: string;
  email: string;
  phone: string;
  studentCount: number;
  grade: string;
  preferredDate: string;
  budget: string;
  additionalInfo: string;
  status: 'completed' | 'in_progress' | 'pending';
  submittedAt: string;
}

interface PartnerApplication {
  id: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  certificates: string[];
  status: 'completed' | 'in_progress' | 'pending';
  submittedAt: string;
}

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<'education' | 'partner'>('education');
  const [selectedApplication, setSelectedApplication] = useState<EducationApplication | PartnerApplication | null>(null);
  const [loading, setLoading] = useState(true);

  // 실제 데이터
  const [educationApplications, setEducationApplications] = useState<EducationApplication[]>([]);
  const [partnerApplications, setPartnerApplications] = useState<PartnerApplication[]>([]);

  // 데이터 로드
  React.useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        
        // 교육 도입 신청 데이터 로드
        const educationResponse = await fetch('/api/education-applications');
        if (educationResponse.ok) {
          const educationData = await educationResponse.json();
          setEducationApplications(educationData.applications || []);
        }

        // 파트너 모집 신청 데이터 로드
        const partnerResponse = await fetch('/api/partner-applications');
        if (partnerResponse.ok) {
          const partnerData = await partnerResponse.json();
          setPartnerApplications(partnerData.applications || []);
        }
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const handleStatusChange = async (id: string, status: 'completed' | 'in_progress' | 'pending') => {
    try {
      // 실제로는 API 호출로 상태 변경
      const endpoint = activeTab === 'education' ? '/api/education-applications' : '/api/partner-applications';
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // 로컬 상태 업데이트
        if (activeTab === 'education') {
          setEducationApplications(prev => 
            prev.map(app => app.id === id ? { ...app, status } : app)
          );
        } else {
          setPartnerApplications(prev => 
            prev.map(app => app.id === id ? { ...app, status } : app)
          );
        }
        console.log(`Application ${id} status changed to ${status}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { text: '확인 전', class: styles.pending },
      in_progress: { text: '진행중', class: styles.inProgress },
      completed: { text: '완료', class: styles.completed }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return <span className={`${styles.statusBadge} ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  return (
    <div className={styles.container}>
        <div className={styles.header}>
          <h1>콘텐츠 관리</h1>
        <p>교육 도입 신청 및 파트너 모집 신청을 관리합니다.</p>
        </div>
        
      <div className={styles.tabContainer}>
          <button
          className={`${styles.tab} ${activeTab === 'education' ? styles.active : ''}`}
            onClick={() => setActiveTab('education')}
        >
          교육 도입 신청 ({educationApplications.length})
          </button>
          <button
          className={`${styles.tab} ${activeTab === 'partner' ? styles.active : ''}`}
            onClick={() => setActiveTab('partner')}
        >
          파트너 모집 신청 ({partnerApplications.length})
          </button>
        </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>데이터를 불러오는 중...</p>
          </div>
        ) : (
          <>
        {activeTab === 'education' && (
              <div className={styles.tableContainer}>
                {educationApplications.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>교육 도입 신청이 없습니다.</p>
                  </div>
                ) : (
                  <table className={styles.table}>
                <thead>
                      <tr>
                        <th>학교명</th>
                        <th>담당자</th>
                        <th>연락처</th>
                        <th>학생 수</th>
                        <th>예산</th>
                        <th>상태</th>
                        <th>신청일</th>
                        <th>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {educationApplications.map((app) => (
                        <tr key={app.id}>
                          <td>{app.schoolName}</td>
                          <td>{app.contactPerson}</td>
                          <td>{app.phone}</td>
                          <td>{app.studentCount}명</td>
                          <td>{app.budget}</td>
                          <td>{getStatusBadge(app.status)}</td>
                          <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              className={styles.viewButton}
                              onClick={() => setSelectedApplication(app)}
                            >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                )}
          </div>
        )}

        {activeTab === 'partner' && (
              <div className={styles.tableContainer}>
                {partnerApplications.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>파트너 모집 신청이 없습니다.</p>
                  </div>
                ) : (
                  <table className={styles.table}>
                <thead>
                      <tr>
                        <th>이름</th>
                        <th>연락처</th>
                        <th>활동지역</th>
                        <th>경력</th>
                        <th>자격증</th>
                        <th>상태</th>
                        <th>신청일</th>
                        <th>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {partnerApplications.map((app) => (
                        <tr key={app.id}>
                          <td>{app.contactPerson}</td>
                          <td>{app.phone}</td>
                          <td>{app.location}</td>
                          <td>{app.experience}</td>
                          <td>{app.certificates.join(', ')}</td>
                          <td>{getStatusBadge(app.status)}</td>
                          <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              className={styles.viewButton}
                              onClick={() => setSelectedApplication(app)}
                            >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* 상세보기 모달 */}
      {selectedApplication && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>신청 상세 정보</h2>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedApplication(null)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              {activeTab === 'education' && selectedApplication && 'schoolName' in selectedApplication && (
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <label>학교명:</label>
                    <span>{selectedApplication.schoolName}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>담당자:</label>
                    <span>{selectedApplication.contactPerson}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>이메일:</label>
                    <span>{selectedApplication.email}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>연락처:</label>
                    <span>{selectedApplication.phone}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>예상 참여 학생 수:</label>
                    <span>{selectedApplication.studentCount}명</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>대상 학년:</label>
                    <span>{selectedApplication.grade}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>희망 교육 일정:</label>
                    <span>{selectedApplication.preferredDate}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>예상 예산:</label>
                    <span>{selectedApplication.budget}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>추가 요청사항:</label>
                    <span>{selectedApplication.additionalInfo}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>신청일:</label>
                    <span>{selectedApplication.submittedAt}</span>
                  </div>
                </div>
              )}

              {activeTab === 'partner' && selectedApplication && 'location' in selectedApplication && (
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <label>이름:</label>
                    <span>{selectedApplication.contactPerson}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>이메일:</label>
                    <span>{selectedApplication.email}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>연락처:</label>
                    <span>{selectedApplication.phone}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>활동지역:</label>
                    <span>{selectedApplication.location}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>경력 사항:</label>
                    <span>{selectedApplication.experience}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>보유 자격증:</label>
                    <span>{selectedApplication.certificates.join(', ')}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>신청일:</label>
                    <span>{selectedApplication.submittedAt}</span>
            </div>
          </div>
        )}
      </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.completeButton}
                onClick={() => {
                  handleStatusChange(selectedApplication.id, 'completed');
                  setSelectedApplication(null);
                }}
              >
                완료
              </button>
              <button
                className={styles.progressButton}
                onClick={() => {
                  handleStatusChange(selectedApplication.id, 'in_progress');
                  setSelectedApplication(null);
                }}
              >
                진행중
              </button>
              <button
                className={styles.pendingButton}
                onClick={() => {
                  handleStatusChange(selectedApplication.id, 'pending');
                  setSelectedApplication(null);
                }}
              >
                확인 전
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}