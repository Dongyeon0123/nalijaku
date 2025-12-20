'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

interface EducationApplication {
  id: number;
  organizationName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  studentCount: number | string;
  grade: string;
  preferredDate: string;
  budget: string;
  additionalInfo: string;
  status: 'completed' | 'in_progress' | 'pending' | 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  submittedAt: string;
  createdAt?: string;
  selectedCourses?: string | Array<{  // 문자열 또는 배열
    id: number;
    title: string;
    instructor: string;
    category: string;
  }>;
}

interface PartnerApplication {
  id: string | number;
  applicantName: string;
  contactPerson?: string;
  email: string;
  phoneNumber: string;
  phone?: string;
  location: string;
  experience: string;
  certificates?: string[];
  practicalCert?: boolean;
  class1Cert?: boolean;
  class2Cert?: boolean;
  class3Cert?: boolean;
  instructorCert?: boolean;
  otherCert?: boolean;
  other?: boolean;
  otherCertText?: string;
  otherText?: string;
  status: 'completed' | 'in_progress' | 'pending' | 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  createdAt: string;
  submittedAt?: string;
  updatedAt?: string;
}

export default function ContentManagementPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as 'education' | 'partner' | null;
  const [activeTab, setActiveTab] = useState<'education' | 'partner'>(tabParam || 'education');
  const [selectedApplication, setSelectedApplication] = useState<EducationApplication | PartnerApplication | null>(null);
  const [loading, setLoading] = useState(true);

  // 실제 데이터
  const [educationApplications, setEducationApplications] = useState<EducationApplication[]>([]);
  const [partnerApplications, setPartnerApplications] = useState<PartnerApplication[]>([]);

  // 데이터 로드 함수
  const loadApplications = async () => {
    try {
      setLoading(true);

      // 교육 도입 신청 데이터 로드
      const educationResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EDUCATION.INQUIRY}`);
      if (educationResponse.ok) {
        const educationData = await educationResponse.json();
        console.log('📚 교육 도입 신청 원본 데이터:', educationData);
        
        // 백엔드 응답 구조 확인
        const applications = educationData.data || educationData.inquiries || educationData || [];
        console.log('📚 파싱된 교육 신청 데이터:', applications);
        
        setEducationApplications(applications);
      } else {
        console.error('교육 도입 신청 로드 실패:', educationResponse.status);
      }

      // 파트너 모집 신청 데이터 로드
      const partnerResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PARTNER.APPLICATION}`);
      if (partnerResponse.ok) {
        const partnerData = await partnerResponse.json();
        console.log('🤝 파트너 모집 원본 데이터:', partnerData);
        
        // 백엔드 응답 구조 확인
        const applications = partnerData.applications || partnerData.data || partnerData || [];
        console.log('🤝 파싱된 파트너 데이터:', applications);
        
        setPartnerApplications(applications);
      } else {
        console.error('파트너 모집 신청 로드 실패:', partnerResponse.status);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // 데이터 로드
  React.useEffect(() => {
    loadApplications();
  }, []);

  const handleStatusChange = async (id: number | string, status: 'completed' | 'in_progress' | 'pending') => {
    try {
      let endpoint: string;
      let method: string;

      if (activeTab === 'education') {
        // 교육 도입 신청: PUT 사용, query parameter로 status 전달
        endpoint = `${API_BASE_URL}${API_ENDPOINTS.EDUCATION.INQUIRY}/${id}/status?status=${status}`;
        method = 'PUT';
      } else {
        // 파트너 신청: PUT 사용, query parameter로 status 전달
        endpoint = `${API_BASE_URL}${API_ENDPOINTS.PARTNER.APPLICATION}/${id}/status?status=${status}`;
        method = 'PUT';
      }

      console.log('🔄 상태 변경 요청:', { id, status, endpoint, method });

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log(`✅ Application ${id} status changed to ${status}`);
        alert('상태가 변경되었습니다.');
        
        // 데이터 다시 로드
        await loadApplications();
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to update status:', errorText);
        alert('상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const getStatusBadge = (status: string) => {
    // 대소문자 모두 처리
    const normalizedStatus = status.toLowerCase();
    const statusMap: { [key: string]: { text: string; class: string } } = {
      pending: { text: '확인 전', class: styles.pending },
      in_progress: { text: '진행중', class: styles.inProgress },
      completed: { text: '완료', class: styles.completed }
    };
    const statusInfo = statusMap[normalizedStatus] || { text: '확인 전', class: styles.pending };
    return <span className={`${styles.statusBadge} ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const getBudgetText = (budget: string) => {
    const budgetMap: { [key: string]: string } = {
      'under-500': '50만원 미만',
      '500-1000': '50만원 ~ 100만원',
      '1000-2000': '100만원 ~ 200만원',
      '2000-3000': '200만원 ~ 300만원',
      '3000-5000': '300만원 ~ 500만원',
      'over-5000': '500만원 이상',
      'discuss': '상담 후 결정',
      'negotiable': '협의 가능'
    };
    return budgetMap[budget] || budget;
  };

  // selectedCourses 파싱 함수
  const parseSelectedCourses = (selectedCourses?: string | Array<any>) => {
    if (!selectedCourses) return [];
    
    // 이미 배열이면 그대로 반환
    if (Array.isArray(selectedCourses)) return selectedCourses;
    
    // 문자열이면 JSON 파싱
    try {
      return JSON.parse(selectedCourses);
    } catch (error) {
      console.error('selectedCourses 파싱 실패:', error);
      return [];
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>콘텐츠 관리</h1>
        <p>교육 도입 신청, 교육 문의 및 파트너 모집 신청을 관리합니다.</p>
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
                        <th>기관명</th>
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
                          <td>{app.organizationName}</td>
                          <td>{app.contactPerson}</td>
                          <td>{app.phoneNumber}</td>
                          <td>{app.studentCount}명</td>
                          <td>{getBudgetText(app.budget)}</td>
                          <td>{getStatusBadge(app.status)}</td>
                          <td>{new Date(app.createdAt || app.submittedAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              className={styles.viewButton}
                              onClick={() => {
                                console.log('📋 선택된 교육 신청 데이터:', app);
                                console.log('📚 선택된 강의:', app.selectedCourses);
                                setSelectedApplication(app);
                              }}
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
                          <td>{app.applicantName}</td>
                          <td>{app.phoneNumber}</td>
                          <td>{app.location}</td>
                          <td>{app.experience}</td>
                          <td>
                            {[
                              app.practicalCert && '실기평가',
                              app.class1Cert && '1종',
                              app.class2Cert && '2종',
                              app.class3Cert && '3종',
                              app.instructorCert && '교관',
                              (app.otherCert || app.other) && (app.otherCertText || app.otherText)
                            ].filter(Boolean).join(', ') || '-'}
                          </td>
                          <td>{getStatusBadge(app.status)}</td>
                          <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              className={styles.viewButton}
                              onClick={() => {
                                console.log('📋 선택된 파트너 신청 데이터:', app);
                                setSelectedApplication(app);
                              }}
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
              {activeTab === 'education' && selectedApplication && 'organizationName' in selectedApplication && (
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <label>기관명:</label>
                    <span>{(selectedApplication as EducationApplication).organizationName}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>담당자:</label>
                    <span>{(selectedApplication as EducationApplication).contactPerson}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>이메일:</label>
                    <span>{(selectedApplication as EducationApplication).email}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>연락처:</label>
                    <span>{(selectedApplication as EducationApplication).phoneNumber}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>예상 참여 학생 수:</label>
                    <span>{(selectedApplication as EducationApplication).studentCount}명</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>희망 교육 일정:</label>
                    <span>{(selectedApplication as EducationApplication).preferredDate || '-'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>예상 예산:</label>
                    <span>{(selectedApplication as EducationApplication).budget ? getBudgetText((selectedApplication as EducationApplication).budget) : '-'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>추가 요청사항:</label>
                    <span>{(selectedApplication as EducationApplication).additionalInfo || '-'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>신청일:</label>
                    <span>
                      {(selectedApplication as EducationApplication).createdAt 
                        ? new Date((selectedApplication as EducationApplication).createdAt!).toLocaleDateString('ko-KR')
                        : (selectedApplication as EducationApplication).submittedAt 
                          ? new Date((selectedApplication as EducationApplication).submittedAt).toLocaleDateString('ko-KR')
                          : '-'}
                    </span>
                  </div>
                  {(() => {
                    const courses = parseSelectedCourses((selectedApplication as EducationApplication).selectedCourses);
                    return courses.length > 0 && (
                      <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                        <label>선택된 강의:</label>
                        <div style={{ marginTop: '8px' }}>
                          {courses.map((course: any, idx: number) => (
                            <div key={idx} style={{
                              padding: '8px',
                              backgroundColor: '#f5f5f5',
                              borderRadius: '4px',
                              marginBottom: '6px',
                              fontSize: '14px'
                            }}>
                              <div style={{ fontWeight: '600', color: '#383838' }}>{course.title}</div>
                              <div style={{ fontSize: '12px', color: '#04AD74' }}>강사: {course.instructor}</div>
                              <div style={{ fontSize: '12px', color: '#999' }}>카테고리: {course.category}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {activeTab === 'partner' && selectedApplication && 'location' in selectedApplication && (
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <label>이름:</label>
                    <span>{(selectedApplication as PartnerApplication).applicantName}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>이메일:</label>
                    <span>{selectedApplication.email}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>연락처:</label>
                    <span>{(selectedApplication as PartnerApplication).phoneNumber}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>활동지역:</label>
                    <span>{selectedApplication.location}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>경력 사항:</label>
                    <span>{selectedApplication.experience}</span>
                  </div>
                  <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                    <label>보유 자격증:</label>
                    <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(() => {
                        const partner = selectedApplication as PartnerApplication;
                        const hasCerts = partner.practicalCert || partner.class1Cert || partner.class2Cert || 
                                        partner.class3Cert || partner.instructorCert || partner.otherCert || partner.other;
                        
                        if (!hasCerts) {
                          return <span style={{ color: '#999' }}>자격증 정보 없음</span>;
                        }
                        
                        return (
                          <>
                            {partner.practicalCert && (
                              <div style={{ padding: '6px 14px', backgroundColor: '#04AD74', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>실기평가조종</div>
                            )}
                            {partner.class1Cert && (
                              <div style={{ padding: '6px 14px', backgroundColor: '#04AD74', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>1종 조종</div>
                            )}
                            {partner.class2Cert && (
                              <div style={{ padding: '6px 14px', backgroundColor: '#04AD74', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>2종 조종</div>
                            )}
                            {partner.class3Cert && (
                              <div style={{ padding: '6px 14px', backgroundColor: '#04AD74', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>3종 조종</div>
                            )}
                            {partner.instructorCert && (
                              <div style={{ padding: '6px 14px', backgroundColor: '#04AD74', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>교관</div>
                            )}
                            {(partner.otherCert || partner.other) && (partner.otherCertText || partner.otherText) && (
                              <div style={{ padding: '6px 14px', backgroundColor: '#999', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>
                                {partner.otherCertText || partner.otherText}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <label>신청일:</label>
                    <span>{new Date((selectedApplication as PartnerApplication).createdAt).toLocaleDateString('ko-KR')}</span>
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