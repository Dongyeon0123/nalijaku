'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import api from '@/lib/axios';

interface Inquiry {
  id: number;
  userId?: number;
  organizationName: string;
  contactPerson: string;
  phone: string;
  email: string;
  studentCount: number;
  budget?: string;
  educationRegion?: string;
  preferredDate: string;
  message?: string;
  status: 'pending' | 'reviewing' | 'completed';
  courses?: Array<{
    id: number;
    title: string;
    category?: string;
    learningMaterials?: Array<{
      id: number;
      title: string;
      price?: number;
    }>;
  }>;
  courseDetails?: Array<{
    courseId: number;
    selectedModules: number[];
    droneOption: 'none' | 'purchase' | 'rental';
    droneQuantity?: number;
  }>;
  createdAt: string;
  updatedAt?: string;
}

interface PartnerApplication {
  id: number;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  experience: string;
  practicalCert: boolean;
  class1Cert: boolean;
  class2Cert: boolean;
  class3Cert: boolean;
  instructorCert: boolean;
  other: boolean;
  otherText?: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  createdAt: string;
}

export default function InquiriesPage() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'partners'>('inquiries');
  
  // 교육 도입 문의 상태
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [filterInquiryStatus, setFilterInquiryStatus] = useState<string>('all');

  // 파트너 모집 상태
  const [partners, setPartners] = useState<PartnerApplication[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<PartnerApplication | null>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [filterPartnerStatus, setFilterPartnerStatus] = useState<string>('all');

  useEffect(() => {
    loadInquiries();
    loadPartnerApplications();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoadingInquiries(true);
      const response = await api.get('/api/admin/inquiries');
      if (response.data.success) {
        // 백엔드에서 대문자로 오는 상태값을 소문자로 변환
        const mappedInquiries = response.data.data.map((inq: any) => ({
          ...inq,
          status: inq.status?.toLowerCase() || 'pending'
        }));
        setInquiries(mappedInquiries);
      }
    } catch (error) {
      console.error('문의 목록 로드 실패:', error);
      setInquiries([]);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const loadPartnerApplications = async () => {
    try {
      setLoadingPartners(true);
      const response = await api.get('/api/partner-applications');
      const partnerData = response.data;
      // 백엔드 응답 구조에 맞게 파싱
      const applications = partnerData.applications || partnerData.data || partnerData || [];
      // 필드명 매핑 (백엔드 응답 -> 프론트엔드 인터페이스)
      const mappedApplications = applications.map((app: any) => ({
        id: app.id,
        contactPerson: app.applicantName || app.contactPerson,
        phone: app.phoneNumber || app.phone,
        email: app.email,
        location: app.location,
        experience: app.experience,
        practicalCert: app.practicalCert,
        class1Cert: app.class1Cert,
        class2Cert: app.class2Cert,
        class3Cert: app.class3Cert,
        instructorCert: app.instructorCert,
        other: app.other || app.otherCert,
        otherText: app.otherText || app.otherCertText,
        status: app.status?.toLowerCase() === 'completed' ? 'approved' 
              : app.status?.toLowerCase() === 'in_progress' ? 'reviewing'
              : app.status?.toLowerCase() || 'pending',
        createdAt: app.createdAt
      }));
      setPartners(mappedApplications);
    } catch (error) {
      console.error('파트너 신청 목록 로드 실패:', error);
      setPartners([]);
    } finally {
      setLoadingPartners(false);
    }
  };

  const handleInquiryStatusChange = async (inquiryId: number, newStatus: string) => {
    try {
      // 백엔드 API는 대문자 상태값 필요
      const upperStatus = newStatus.toUpperCase();
      await api.put(`/api/admin/inquiries/${inquiryId}/status?status=${upperStatus}`);
      setInquiries(inquiries.map(inq => 
        inq.id === inquiryId ? { ...inq, status: newStatus as Inquiry['status'] } : inq
      ));
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus as Inquiry['status'] });
      }
      alert('상태가 변경되었습니다.');
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const handleInquiryDelete = async (inquiryId: number) => {
    if (!confirm('정말 이 문의를 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await api.delete(`/api/admin/inquiries/${inquiryId}`);
      setInquiries(inquiries.filter(inq => inq.id !== inquiryId));
      if (selectedInquiry?.id === inquiryId) {
        setShowInquiryModal(false);
        setSelectedInquiry(null);
      }
      alert('문의가 삭제되었습니다.');
    } catch (error) {
      console.error('문의 삭제 실패:', error);
      alert('문의 삭제에 실패했습니다.');
    }
  };

  const handlePartnerStatusChange = async (partnerId: number, newStatus: string) => {
    try {
      // 프론트엔드 상태 -> 백엔드 상태 매핑
      const backendStatus = newStatus === 'approved' ? 'completed'
                         : newStatus === 'reviewing' ? 'in_progress'
                         : newStatus === 'rejected' ? 'pending'  // 거절은 pending으로 처리 (백엔드에 rejected가 없을 수 있음)
                         : 'pending';
      await api.put(`/api/partner-applications/${partnerId}/status?status=${backendStatus}`);
      setPartners(partners.map(p => 
        p.id === partnerId ? { ...p, status: newStatus as PartnerApplication['status'] } : p
      ));
      if (selectedPartner?.id === partnerId) {
        setSelectedPartner({ ...selectedPartner, status: newStatus as PartnerApplication['status'] });
      }
      alert('상태가 변경되었습니다.');
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const handlePartnerDelete = async (partnerId: number) => {
    if (!confirm('정말 이 파트너 신청을 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await api.delete(`/api/partner-applications/${partnerId}`);
      setPartners(partners.filter(p => p.id !== partnerId));
      if (selectedPartner?.id === partnerId) {
        setShowPartnerModal(false);
        setSelectedPartner(null);
      }
      alert('파트너 신청이 삭제되었습니다.');
    } catch (error) {
      console.error('파트너 신청 삭제 실패:', error);
      alert('파트너 신청 삭제에 실패했습니다.');
    }
  };

  const filteredInquiries = filterInquiryStatus === 'all' 
    ? inquiries 
    : inquiries.filter(inq => inq.status === filterInquiryStatus);

  const filteredPartners = filterPartnerStatus === 'all'
    ? partners
    : partners.filter(p => p.status === filterPartnerStatus);

  const getInquiryStatusBadge = (status: string) => {
    const badgeStyles: { [key: string]: React.CSSProperties } = {
      pending: { backgroundColor: '#FEF3C7', color: '#92400E' },
      reviewing: { backgroundColor: '#DBEAFE', color: '#1E40AF' },
      completed: { backgroundColor: '#D1FAE5', color: '#065F46' }
    };
    const labels: { [key: string]: string } = {
      pending: '대기중',
      reviewing: '검토중',
      completed: '완료'
    };
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '16px',
        fontSize: '0.8rem',
        fontWeight: '600',
        ...badgeStyles[status]
      }}>
        {labels[status]}
      </span>
    );
  };

  const getPartnerStatusBadge = (status: string) => {
    const badgeStyles: { [key: string]: React.CSSProperties } = {
      pending: { backgroundColor: '#FEF3C7', color: '#92400E' },
      reviewing: { backgroundColor: '#DBEAFE', color: '#1E40AF' },
      approved: { backgroundColor: '#D1FAE5', color: '#065F46' },
      rejected: { backgroundColor: '#FEE2E2', color: '#991B1B' }
    };
    const labels: { [key: string]: string } = {
      pending: '대기중',
      reviewing: '검토중',
      approved: '승인',
      rejected: '거절'
    };
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '16px',
        fontSize: '0.8rem',
        fontWeight: '600',
        ...badgeStyles[status]
      }}>
        {labels[status]}
      </span>
    );
  };

  const getCertificates = (partner: PartnerApplication) => {
    const certs = [];
    if (partner.practicalCert) certs.push('실기평가조종');
    if (partner.class1Cert) certs.push('1종');
    if (partner.class2Cert) certs.push('2종');
    if (partner.class3Cert) certs.push('3종');
    if (partner.instructorCert) certs.push('교관');
    if (partner.other && partner.otherText) certs.push(partner.otherText);
    return certs.length > 0 ? certs.join(', ') : '-';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>문의 관리</h1>
        <p>교육 도입 문의 및 파트너 모집을 관리합니다.</p>
      </div>

      {/* 탭 */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'inquiries' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('inquiries')}
        >
          교육 도입 문의
          <span className={styles.tabBadge}>{inquiries.length}</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'partners' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('partners')}
        >
          파트너 모집
          <span className={styles.tabBadge}>{partners.length}</span>
        </button>
      </div>

      {/* 교육 도입 문의 탭 */}
      {activeTab === 'inquiries' && (
        <>
          <div className={styles.toolbar}>
            <div className={styles.filterGroup}>
              <label>상태 필터:</label>
              <select 
                value={filterInquiryStatus} 
                onChange={(e) => setFilterInquiryStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">전체</option>
                <option value="pending">대기중</option>
                <option value="reviewing">검토중</option>
                <option value="completed">완료</option>
              </select>
            </div>
            <div className={styles.stats}>
              <span>전체: {inquiries.length}건</span>
              <span>대기: {inquiries.filter(i => i.status === 'pending').length}건</span>
              <span>검토중: {inquiries.filter(i => i.status === 'reviewing').length}건</span>
              <span>완료: {inquiries.filter(i => i.status === 'completed').length}건</span>
            </div>
          </div>

          {loadingInquiries ? (
            <div className={styles.loading}>로딩 중...</div>
          ) : filteredInquiries.length === 0 ? (
            <div className={styles.empty}>
              <p>📋 문의 내역이 없습니다.</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>기관명</th>
                    <th>담당자</th>
                    <th>연락처</th>
                    <th>예상 인원</th>
                    <th>희망 일정</th>
                    <th>상태</th>
                    <th>신청일</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id}>
                      <td>{inquiry.id}</td>
                      <td>{inquiry.organizationName}</td>
                      <td>{inquiry.contactPerson}</td>
                      <td>{inquiry.phone}</td>
                      <td>{inquiry.studentCount}명</td>
                      <td>{inquiry.preferredDate}</td>
                      <td>{getInquiryStatusBadge(inquiry.status)}</td>
                      <td>{new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className={styles.detailBtn}
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setShowInquiryModal(true);
                            }}
                          >
                            상세보기
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleInquiryDelete(inquiry.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* 파트너 모집 탭 */}
      {activeTab === 'partners' && (
        <>
          <div className={styles.toolbar}>
            <div className={styles.filterGroup}>
              <label>상태 필터:</label>
              <select 
                value={filterPartnerStatus} 
                onChange={(e) => setFilterPartnerStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">전체</option>
                <option value="pending">대기중</option>
                <option value="reviewing">검토중</option>
                <option value="approved">승인</option>
                <option value="rejected">거절</option>
              </select>
            </div>
            <div className={styles.stats}>
              <span>전체: {partners.length}건</span>
              <span>대기: {partners.filter(p => p.status === 'pending').length}건</span>
              <span>검토중: {partners.filter(p => p.status === 'reviewing').length}건</span>
              <span>승인: {partners.filter(p => p.status === 'approved').length}건</span>
            </div>
          </div>

          {loadingPartners ? (
            <div className={styles.loading}>로딩 중...</div>
          ) : filteredPartners.length === 0 ? (
            <div className={styles.empty}>
              <p>👥 파트너 신청 내역이 없습니다.</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>이름</th>
                    <th>연락처</th>
                    <th>이메일</th>
                    <th>활동지역</th>
                    <th>자격증</th>
                    <th>상태</th>
                    <th>신청일</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPartners.map((partner) => (
                    <tr key={partner.id}>
                      <td>{partner.id}</td>
                      <td>{partner.contactPerson}</td>
                      <td>{partner.phone}</td>
                      <td>{partner.email}</td>
                      <td>{partner.location}</td>
                      <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {getCertificates(partner)}
                      </td>
                      <td>{getPartnerStatusBadge(partner.status)}</td>
                      <td>{new Date(partner.createdAt).toLocaleDateString('ko-KR')}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className={styles.detailBtn}
                            onClick={() => {
                              setSelectedPartner(partner);
                              setShowPartnerModal(true);
                            }}
                          >
                            상세보기
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handlePartnerDelete(partner.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* 교육 도입 문의 상세 모달 */}
      {showInquiryModal && selectedInquiry && (
        <div className={styles.modal} onClick={() => setShowInquiryModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>문의 상세</h2>
              <button className={styles.closeBtn} onClick={() => setShowInquiryModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <label>기관명</label>
                  <span>{selectedInquiry.organizationName}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>담당자</label>
                  <span>{selectedInquiry.contactPerson}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>연락처</label>
                  <span>{selectedInquiry.phone}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>이메일</label>
                  <span>{selectedInquiry.email}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>예상 인원</label>
                  <span>{selectedInquiry.studentCount}명</span>
                </div>
                <div className={styles.detailItem}>
                  <label>희망 일정</label>
                  <span>{selectedInquiry.preferredDate}</span>
                </div>
                {selectedInquiry.budget && (
                  <div className={styles.detailItem}>
                    <label>예산</label>
                    <span>{selectedInquiry.budget}</span>
                  </div>
                )}
                {selectedInquiry.educationRegion && (
                  <div className={styles.detailItem}>
                    <label>교육 지역</label>
                    <span>{selectedInquiry.educationRegion}</span>
                  </div>
                )}
              </div>

              {selectedInquiry.courses && selectedInquiry.courses.length > 0 && (
                <div className={styles.coursesSection}>
                  <label>선택한 강좌</label>
                  <div className={styles.coursesList}>
                    {selectedInquiry.courses.map((course) => {
                      // courseDetails에서 해당 코스의 세부 정보 찾기
                      const courseDetail = selectedInquiry.courseDetails?.find(
                        (cd) => cd.courseId === course.id
                      );
                      const selectedModules = courseDetail?.selectedModules || [];
                      const droneOption = courseDetail?.droneOption || 'none';
                      const isDrone = course.category === '드론';

                      return (
                        <div key={course.id} className={styles.courseItem}>
                          <div className={styles.courseHeader}>
                            <span className={styles.courseTag}>{course.title}</span>
                            {course.category && (
                              <span className={styles.categoryBadge}>{course.category}</span>
                            )}
                          </div>
                          
                          {/* 선택된 모듈 표시 */}
                          {selectedModules.length > 0 && course.learningMaterials && (
                            <div className={styles.modulesList}>
                              <div className={styles.modulesLabel}>📚 선택된 모듈:</div>
                              {selectedModules.map((moduleId) => {
                                const module = course.learningMaterials?.find((m) => m.id === moduleId);
                                return module ? (
                                  <div key={moduleId} className={styles.moduleItem}>
                                    • {module.title}
                                    {module.price && (
                                      <span className={styles.modulePrice}>
                                        ({module.price.toLocaleString()}원)
                                      </span>
                                    )}
                                  </div>
                                ) : null;
                              })}
                            </div>
                          )}

                          {/* 드론 교구 옵션 표시 */}
                          {isDrone && droneOption !== 'none' && (
                            <div className={styles.droneOption}>
                              <div className={styles.droneLabel}>🚁 드론 교구:</div>
                              <div className={styles.droneValue}>
                                {droneOption === 'purchase' ? '교구 구매' : '교구 대여'} × {courseDetail?.droneQuantity || 1}개
                                <span style={{ color: '#04AD74', fontWeight: '600', marginLeft: '4px' }}>
                                  ({((droneOption === 'purchase' ? 25000 : 10000) * (courseDetail?.droneQuantity || 1)).toLocaleString()}원)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedInquiry.message && (
                <div className={styles.messageSection}>
                  <label>요청사항</label>
                  <p>{selectedInquiry.message}</p>
                </div>
              )}

              <div className={styles.statusSection}>
                <label>상태 변경</label>
                <div className={styles.statusButtons}>
                  <button
                    className={`${styles.statusBtn} ${selectedInquiry.status === 'pending' ? styles.active : ''}`}
                    onClick={() => handleInquiryStatusChange(selectedInquiry.id, 'pending')}
                  >
                    대기중
                  </button>
                  <button
                    className={`${styles.statusBtn} ${selectedInquiry.status === 'reviewing' ? styles.active : ''}`}
                    onClick={() => handleInquiryStatusChange(selectedInquiry.id, 'reviewing')}
                  >
                    검토중
                  </button>
                  <button
                    className={`${styles.statusBtn} ${selectedInquiry.status === 'completed' ? styles.active : ''}`}
                    onClick={() => handleInquiryStatusChange(selectedInquiry.id, 'completed')}
                  >
                    완료
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.closeModalBtn} onClick={() => setShowInquiryModal(false)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 파트너 신청 상세 모달 */}
      {showPartnerModal && selectedPartner && (
        <div className={styles.modal} onClick={() => setShowPartnerModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>파트너 신청 상세</h2>
              <button className={styles.closeBtn} onClick={() => setShowPartnerModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <label>이름</label>
                  <span>{selectedPartner.contactPerson}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>연락처</label>
                  <span>{selectedPartner.phone}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>이메일</label>
                  <span>{selectedPartner.email}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>활동지역</label>
                  <span>{selectedPartner.location}</span>
                </div>
                <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                  <label>경력 사항</label>
                  <span>{selectedPartner.experience}</span>
                </div>
              </div>

              <div className={styles.coursesSection}>
                <label>보유 자격증</label>
                <div className={styles.coursesList}>
                  {selectedPartner.practicalCert && <span className={styles.courseTag}>실기평가조종 자격증</span>}
                  {selectedPartner.class1Cert && <span className={styles.courseTag}>1종 조종 자격증</span>}
                  {selectedPartner.class2Cert && <span className={styles.courseTag}>2종 조종 자격증</span>}
                  {selectedPartner.class3Cert && <span className={styles.courseTag}>3종 조종 자격증</span>}
                  {selectedPartner.instructorCert && <span className={styles.courseTag}>교관 자격증</span>}
                  {selectedPartner.other && selectedPartner.otherText && (
                    <span className={styles.courseTag}>{selectedPartner.otherText}</span>
                  )}
                </div>
              </div>

              <div className={styles.statusSection}>
                <label>상태 변경</label>
                <div className={styles.statusButtons}>
                  <button
                    className={`${styles.statusBtn} ${selectedPartner.status === 'pending' ? styles.active : ''}`}
                    onClick={() => handlePartnerStatusChange(selectedPartner.id, 'pending')}
                  >
                    대기중
                  </button>
                  <button
                    className={`${styles.statusBtn} ${selectedPartner.status === 'reviewing' ? styles.active : ''}`}
                    onClick={() => handlePartnerStatusChange(selectedPartner.id, 'reviewing')}
                  >
                    검토중
                  </button>
                  <button
                    className={`${styles.statusBtn} ${styles.approveBtn} ${selectedPartner.status === 'approved' ? styles.active : ''}`}
                    onClick={() => handlePartnerStatusChange(selectedPartner.id, 'approved')}
                  >
                    승인
                  </button>
                  <button
                    className={`${styles.statusBtn} ${styles.rejectBtn} ${selectedPartner.status === 'rejected' ? styles.active : ''}`}
                    onClick={() => handlePartnerStatusChange(selectedPartner.id, 'rejected')}
                  >
                    거절
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.closeModalBtn} onClick={() => setShowPartnerModal(false)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
