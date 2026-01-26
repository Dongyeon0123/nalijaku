'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import styles from './page.module.css';
import api from '@/lib/axios';
import { FiEdit2, FiSave, FiX, FiAward, FiBook, FiClock, FiTrendingUp } from 'react-icons/fi';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  organization: string;
  role: string;
  phone: string;
  droneExperience: boolean;
  createdAt: string;
}

interface EnrolledCourse {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  completedAt?: string;
  thumbnail?: string;
}

interface CourseGroup {
  id: number;
  schoolName: string;
  studentCount: number;
  startDate: string;
  endDate: string;
  status: string;
  courseCount: number;
  courses: Array<{
    id: number;
    title: string;
    subtitle?: string;
    thumbnail?: string;
    category?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  classLink?: string;
  announcement?: string;
}

interface Inquiry {
  id: number;
  organizationName: string;
  contactPerson: string;
  phone: string;
  email: string;
  studentCount: number;
  preferredDate: string;
  message: string;
  status: 'pending' | 'reviewing' | 'completed';
  courses: Array<{
    id: number;
    title: string;
    category: string;
  }>;
  createdAt: string;
}

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [instructorCourses, setInstructorCourses] = useState<CourseGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'courses' | 'inquiries' | 'settings' | 'certificates'>('profile');
  const [selectedCourse, setSelectedCourse] = useState<CourseGroup | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  
  // 수정 모드 상태
  const [editMode, setEditMode] = useState({
    organization: false,
    phone: false,
    droneExperience: false
  });

  // 수정 중인 값
  const [editValues, setEditValues] = useState({
    organization: '',
    phone: '',
    droneExperience: false
  });
  
  // 비밀번호 변경
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 통계 데이터
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalStudyTime: 0,
    certificates: 0
  });

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) {
        alert('로그인이 필요합니다.');
        router.push('/');
        return;
      }
      
      try {
        const userData = JSON.parse(savedUser);
        loadUserProfile(userData.id);
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  const loadUserProfile = async (userId: number) => {
    try {
      setLoading(true);
      
      // 사용자 프로필 조회
      const profileResponse = await api.get(`/api/users/${userId}`);
      if (profileResponse.data.success) {
        const userData = profileResponse.data.data;
        setUser(userData);
        setEditValues({
          organization: userData.organization || '',
          phone: userData.phone || '',
          droneExperience: userData.droneExperience || false
        });
      }

      // 수강 중인 강의 목록 조회 (API 구현 필요)
      try {
        const coursesResponse = await api.get(`/api/users/${userId}/courses`);
        if (coursesResponse.data.success) {
          const courses = coursesResponse.data.data;
          setEnrolledCourses(courses);
          
          // 통계 계산
          setStats({
            totalCourses: courses.length,
            completedCourses: courses.filter((c: EnrolledCourse) => c.completedAt).length,
            totalStudyTime: courses.reduce((acc: number, c: EnrolledCourse) => acc + (c.progress * 2), 0), // 임시 계산
            certificates: courses.filter((c: EnrolledCourse) => c.completedAt).length
          });
        }
      } catch (error) {
        console.log('수강 강의 목록 API 미구현');
        setEnrolledCourses([]);
      }

      // 내 문의 내역 조회
      try {
        const inquiriesResponse = await api.get(`/api/inquiries/my`);
        if (inquiriesResponse.data.success) {
          setInquiries(inquiriesResponse.data.data);
        }
      } catch (error) {
        console.log('문의 내역 API 미구현 또는 오류');
        setInquiries([]);
      }

      // 강사인 경우 담당 강의 목록 조회
      if (profileResponse.data.data.role === 'TEACHER') {
        try {
          console.log('🔍 강사 강의 목록 조회 시작, userId:', userId);
          
          // userId로 강의 목록 조회 (백엔드에서 userId → instructorId 변환)
          const instructorCoursesResponse = await api.get(`/api/instructors/by-user/${userId}/courses`);
          
          console.log('✅ 강사 강의 목록 응답:', instructorCoursesResponse.data);
          
          if (instructorCoursesResponse.data.success) {
            setInstructorCourses(instructorCoursesResponse.data.data);
          }
        } catch (error: any) {
          console.error('❌ 강사 강의 목록 로드 실패:', error);
          console.error('에러 상태:', error.response?.status);
          console.error('에러 메시지:', error.response?.data);
          setInstructorCourses([]);
        }
      }
    } catch (error: any) {
      console.error('프로필 로드 실패:', error);
      alert('프로필을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field: 'organization' | 'phone' | 'droneExperience') => {
    setEditMode(prev => ({ ...prev, [field]: true }));
  };

  const handleCancel = (field: 'organization' | 'phone' | 'droneExperience') => {
    if (user) {
      setEditValues(prev => ({
        ...prev,
        [field]: user[field]
      }));
    }
    setEditMode(prev => ({ ...prev, [field]: false }));
  };

  const handleSave = async (field: 'organization' | 'phone' | 'droneExperience') => {
    if (!user) return;

    try {
      await api.put(`/api/users/${user.id}`, {
        [field]: editValues[field]
      });

      setUser(prev => prev ? { ...prev, [field]: editValues[field] } : null);
      setEditMode(prev => ({ ...prev, [field]: false }));
      alert('정보가 수정되었습니다.');
    } catch (error: any) {
      alert(error.response?.data?.message || '정보 수정에 실패했습니다.');
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    try {
      await api.put(`/api/users/${user?.id}/password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      alert('비밀번호가 변경되었습니다.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('정말로 회원 탈퇴하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    const confirmText = prompt('탈퇴하시려면 "탈퇴"를 입력해주세요.');
    if (confirmText !== '탈퇴') {
      return;
    }

    try {
      await api.delete(`/api/users/${user?.id}`);
      alert('회원 탈퇴가 완료되었습니다.');
      localStorage.clear();
      router.push('/');
    } catch (error: any) {
      alert(error.response?.data?.message || '회원 탈퇴에 실패했습니다.');
    }
  };

  const handleCourseClick = (course: CourseGroup) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'GENERAL': return '일반 사용자';
      case 'TEACHER': return '강사';
      case 'ADMIN': return '관리자';
      default: return role;
    }
  };

  return (
    <>
      <Header forceLightMode={true} />
      <div className={styles.container}>
        <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          내 정보
        </button>
        {user.role === 'TEACHER' && (
          <button
            className={`${styles.tab} ${activeTab === 'courses' ? styles.active : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            내 강의
          </button>
        )}
        <button
          className={`${styles.tab} ${activeTab === 'inquiries' ? styles.active : ''}`}
          onClick={() => setActiveTab('inquiries')}
        >
          내 문의 내역
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          설정
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'certificates' ? styles.active : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          수료증
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'profile' && (
          <div className={styles.profileSection}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className={styles.profileInfo}>
                  <h2>{user.username}</h2>
                  <span className={styles.roleBadge}>{getRoleText(user.role)}</span>
                </div>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>이메일</label>
                  <span>{user.email}</span>
                </div>

                {/* 소속 - 수정 가능 */}
                <div className={styles.infoItem}>
                  <label>소속</label>
                  {editMode.organization ? (
                    <div className={styles.editField}>
                      <input
                        type="text"
                        value={editValues.organization}
                        onChange={(e) => setEditValues(prev => ({ ...prev, organization: e.target.value }))}
                        placeholder="소속을 입력하세요"
                      />
                      <button className={styles.saveBtn} onClick={() => handleSave('organization')}>
                        <FiSave />
                      </button>
                      <button className={styles.cancelBtn} onClick={() => handleCancel('organization')}>
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <div className={styles.editableField}>
                      <span>{user.organization || '-'}</span>
                      <button className={styles.editBtn} onClick={() => handleEdit('organization')}>
                        <FiEdit2 />
                      </button>
                    </div>
                  )}
                </div>

                {/* 전화번호 - 수정 가능 */}
                <div className={styles.infoItem}>
                  <label>전화번호</label>
                  {editMode.phone ? (
                    <div className={styles.editField}>
                      <input
                        type="tel"
                        value={editValues.phone}
                        onChange={(e) => setEditValues(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="전화번호를 입력하세요"
                      />
                      <button className={styles.saveBtn} onClick={() => handleSave('phone')}>
                        <FiSave />
                      </button>
                      <button className={styles.cancelBtn} onClick={() => handleCancel('phone')}>
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <div className={styles.editableField}>
                      <span>{user.phone || '-'}</span>
                      <button className={styles.editBtn} onClick={() => handleEdit('phone')}>
                        <FiEdit2 />
                      </button>
                    </div>
                  )}
                </div>

                {/* 드론 경험 - 수정 가능 */}
                <div className={styles.infoItem}>
                  <label>드론 경험</label>
                  {editMode.droneExperience ? (
                    <div className={styles.editField}>
                      <select
                        value={editValues.droneExperience ? 'true' : 'false'}
                        onChange={(e) => setEditValues(prev => ({ ...prev, droneExperience: e.target.value === 'true' }))}
                      >
                        <option value="true">있음</option>
                        <option value="false">없음</option>
                      </select>
                      <button className={styles.saveBtn} onClick={() => handleSave('droneExperience')}>
                        <FiSave />
                      </button>
                      <button className={styles.cancelBtn} onClick={() => handleCancel('droneExperience')}>
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <div className={styles.editableField}>
                      <span>{user.droneExperience ? '있음' : '없음'}</span>
                      <button className={styles.editBtn} onClick={() => handleEdit('droneExperience')}>
                        <FiEdit2 />
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <label>가입일</label>
                  <span>{new Date(user.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && user.role === 'TEACHER' && (
          <div className={styles.instructorCoursesSection}>
            {!selectedCourse ? (
              <>
                <div className={styles.courseStatsGrid}>
                  <div className={styles.courseStatCard}>
                    <div className={styles.courseStatIcon}>📚</div>
                    <div className={styles.courseStatInfo}>
                      <p className={styles.courseStatLabel}>담당 그룹</p>
                      <p className={styles.courseStatValue}>{instructorCourses.length}개</p>
                    </div>
                  </div>
                  <div className={styles.courseStatCard}>
                    <div className={styles.courseStatIcon}>🎓</div>
                    <div className={styles.courseStatInfo}>
                      <p className={styles.courseStatLabel}>총 강의</p>
                      <p className={styles.courseStatValue}>
                        {instructorCourses.reduce((acc, g) => acc + (g.courseCount || 0), 0)}개
                      </p>
                    </div>
                  </div>
                  <div className={styles.courseStatCard}>
                    <div className={styles.courseStatIcon}>👥</div>
                    <div className={styles.courseStatInfo}>
                      <p className={styles.courseStatLabel}>총 수강생</p>
                      <p className={styles.courseStatValue}>
                        {instructorCourses.reduce((acc, g) => acc + (g.studentCount || 0), 0)}명
                      </p>
                    </div>
                  </div>
                </div>

                {instructorCourses.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📖</div>
                    <h3>아직 담당 강의가 없습니다</h3>
                    <p>관리자가 강의를 할당하면 여기에 표시됩니다.</p>
                  </div>
                ) : (
                  <div className={styles.instructorCourseGrid}>
                    {instructorCourses.map(group => (
                      <div key={group.id} className={styles.instructorCourseCard} style={{
                        border: 'none',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)'
                      }}>
                        <div className={styles.instructorCourseThumbnail} style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '48px',
                          fontWeight: 'bold',
                          border: 'none',
                          position: 'relative'
                        }}>
                          🏫
                          <div className={`${styles.statusBadge} ${styles[group.status]}`} style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(10px)'
                          }}>
                            {group.status === 'active' ? '✓ 진행중' : '완료'}
                          </div>
                        </div>
                        <div className={styles.instructorCourseInfo}>
                          <h3 style={{ color: '#059669', fontSize: '1.25rem', fontWeight: '700' }}>{group.schoolName}</h3>
                          
                          {/* 강의 기간 */}
                          {group.startDate && group.endDate && (
                            <div className={styles.courseDates} style={{ 
                              backgroundColor: '#f0fdf4',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #bbf7d0'
                            }}>
                              <span style={{ color: '#166534', fontWeight: '500' }}>📅 {new Date(group.startDate).toLocaleDateString('ko-KR')} ~ {new Date(group.endDate).toLocaleDateString('ko-KR')}</span>
                              <span className={styles.courseDuration} style={{ color: '#16a34a' }}>
                                ({Math.ceil((new Date(group.endDate).getTime() - new Date(group.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)}일)
                              </span>
                            </div>
                          )}
                          
                          <div className={styles.courseMetrics}>
                            <div className={styles.metric} style={{
                              backgroundColor: '#f0fdf4',
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid #bbf7d0'
                            }}>
                              <span className={styles.metricLabel} style={{ color: '#166534' }}>수강생</span>
                              <span className={styles.metricValue} style={{ color: '#059669', fontSize: '1.5rem' }}>{group.studentCount || 0}명</span>
                            </div>
                            <div className={styles.metric} style={{
                              backgroundColor: '#f0fdf4',
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid #bbf7d0'
                            }}>
                              <span className={styles.metricLabel} style={{ color: '#166534' }}>강의 수</span>
                              <span className={styles.metricValue} style={{ color: '#059669', fontSize: '1.5rem' }}>{group.courseCount || 0}개</span>
                            </div>
                          </div>
                          <button
                            className={styles.manageCourseButton}
                            onClick={() => handleCourseClick(group)}
                            style={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              borderColor: '#059669',
                              color: 'white',
                              fontWeight: '600',
                              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                            }}
                          >
                            상세보기
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.courseManagementView}>
                <div className={styles.courseManagementHeader}>
                  <button className={styles.backButton} onClick={handleBackToCourses}>
                    ← 뒤로가기
                  </button>
                  <h2>🏫 {selectedCourse.schoolName}</h2>
                </div>

                <div className={styles.courseDetailCard}>
                  <div className={styles.courseDetailHeader}>
                    <div className={styles.courseDetailThumbnail} style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '64px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                      🏫
                    </div>
                    <div className={styles.courseDetailInfo}>
                      <h3 style={{ color: '#059669' }}>{selectedCourse.schoolName}</h3>
                      {selectedCourse.startDate && selectedCourse.endDate && (
                        <p className={styles.courseDetailDates} style={{
                          backgroundColor: '#f0fdf4',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #bbf7d0',
                          color: '#166534'
                        }}>
                          📅 {new Date(selectedCourse.startDate).toLocaleDateString('ko-KR')} ~ {new Date(selectedCourse.endDate).toLocaleDateString('ko-KR')}
                          <span style={{ color: '#16a34a' }}> ({Math.ceil((new Date(selectedCourse.endDate).getTime() - new Date(selectedCourse.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)}일)</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={styles.courseDetailStats}>
                    <div className={styles.statItem} style={{
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px'
                    }}>
                      <span className={styles.statLabel} style={{ color: '#166534' }}>수강생</span>
                      <span className={styles.statValue} style={{ color: '#059669' }}>{selectedCourse.studentCount || 0}명</span>
                    </div>
                    <div className={styles.statItem} style={{
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px'
                    }}>
                      <span className={styles.statLabel} style={{ color: '#166534' }}>강의 수</span>
                      <span className={styles.statValue} style={{ color: '#059669' }}>{selectedCourse.courseCount || 0}개</span>
                    </div>
                    <div className={styles.statItem} style={{
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px'
                    }}>
                      <span className={styles.statLabel} style={{ color: '#166534' }}>상태</span>
                      <span className={styles.statValue} style={{ color: '#059669' }}>{selectedCourse.status === 'active' ? '진행중' : '완료'}</span>
                    </div>
                  </div>
                </div>

                {/* 포함된 강의 목록 */}
                <div className={styles.studentsSection}>
                  <h3>📚 포함된 강의 목록</h3>
                  {selectedCourse.courses && selectedCourse.courses.length > 0 ? (
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {selectedCourse.courses.map((course, idx) => (
                        <div 
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '20px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            border: '2px solid #e5e7eb',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }}
                        >
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail.startsWith('http') 
                                ? course.thumbnail 
                                : `https://api.nallijaku.com${course.thumbnail}`
                              }
                              alt={course.title}
                              style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                flexShrink: 0
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '100px',
                              height: '100px',
                              borderRadius: '12px',
                              background: 'white',
                              border: '1px solid #22c55e',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#16a34a',
                              fontSize: '32px',
                              fontWeight: 'bold',
                              flexShrink: 0
                            }}>
                              {course.title.charAt(0)}
                            </div>
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontSize: '20px', 
                              fontWeight: '700',
                              marginBottom: '8px',
                              color: '#1f2937'
                            }}>
                              {idx + 1}. {course.title}
                            </div>
                            {course.subtitle && (
                              <div style={{ 
                                fontSize: '14px', 
                                color: '#6b7280',
                                marginBottom: '8px'
                              }}>
                                {course.subtitle}
                              </div>
                            )}
                            {course.category && (
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                backgroundColor: '#e0e7ff',
                                color: '#4338ca'
                              }}>
                                {course.category}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyAnnouncement}>
                      <p>📚 포함된 강의가 없습니다.</p>
                    </div>
                  )}
                </div>

                <div className={styles.studentsSection}>
                  <h3>🔗 교육 사이트 링크</h3>
                  {selectedCourse.classLink ? (
                    <div className={styles.announcementCard}>
                      <div className={styles.announcementHeader}>
                        <span className={styles.announcementIcon}>🎓</span>
                        <h4>강의 접속 링크</h4>
                      </div>
                      <div className={styles.announcementContent}>
                        <p>아래 링크를 통해 강의에 접속하실 수 있습니다.</p>
                        <a 
                          href={selectedCourse.classLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.externalLinkButton}
                        >
                          강의 바로가기 →
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.emptyAnnouncement}>
                      <p>🔗 등록된 강의 링크가 없습니다.</p>
                      <p className={styles.emptyAnnouncementSub}>관리자가 링크를 등록하면 표시됩니다.</p>
                    </div>
                  )}
                </div>

                <div className={styles.studentsSection}>
                  <h3>📢 공지사항</h3>
                  {selectedCourse.announcement ? (
                    <div className={styles.announcementCard} style={{ 
                      background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                      border: '2px solid #fed7aa'
                    }}>
                      <div className={styles.announcementHeader}>
                        <span className={styles.announcementIcon}>📋</span>
                        <h4>강의 공지사항</h4>
                      </div>
                      <div className={styles.announcementContent}>
                        <p style={{ 
                          whiteSpace: 'pre-wrap', 
                          lineHeight: '1.8',
                          color: '#9a3412',
                          fontSize: '1rem'
                        }}>
                          {selectedCourse.announcement}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.emptyAnnouncement}>
                      <p>📝 등록된 공지사항이 없습니다.</p>
                      <p className={styles.emptyAnnouncementSub}>관리자가 공지를 등록하면 표시됩니다.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className={styles.inquiriesSection}>
            <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
              📋 내 문의 내역
            </h2>
            
            {inquiries.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📝</div>
                <h3>아직 문의 내역이 없습니다</h3>
                <p>학습자료를 선택하고 교육 도입 문의를 신청해보세요!</p>
                <button
                  className={styles.primaryButton}
                  onClick={() => router.push('/resources')}
                >
                  학습 자료 둘러보기
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      padding: '24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                          {inquiry.organizationName}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')} 신청
                        </p>
                      </div>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: inquiry.status === 'pending' ? '#FEF3C7' :
                                        inquiry.status === 'reviewing' ? '#DBEAFE' : '#D1FAE5',
                        color: inquiry.status === 'pending' ? '#92400E' :
                               inquiry.status === 'reviewing' ? '#1E40AF' : '#065F46'
                      }}>
                        {inquiry.status === 'pending' ? '대기중' :
                         inquiry.status === 'reviewing' ? '검토중' : '완료'}
                      </span>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: '12px',
                      marginBottom: '16px',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>담당자</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{inquiry.contactPerson}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>연락처</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{inquiry.phone}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>예상 인원</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{inquiry.studentCount}명</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>희망 일정</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{inquiry.preferredDate}</span>
                      </div>
                    </div>
                    
                    {inquiry.courses && inquiry.courses.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>
                          선택한 강좌 ({inquiry.courses.length}개)
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {inquiry.courses.map((course) => (
                            <span
                              key={course.id}
                              style={{
                                padding: '4px 12px',
                                backgroundColor: '#E0F2FE',
                                color: '#0369A1',
                                borderRadius: '16px',
                                fontSize: '0.8rem',
                                fontWeight: '500'
                              }}
                            >
                              {course.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {inquiry.message && (
                      <div style={{ 
                        padding: '12px', 
                        backgroundColor: '#f3f4f6', 
                        borderRadius: '8px',
                        marginBottom: '16px'
                      }}>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '4px' }}>요청사항</span>
                        <p style={{ fontSize: '0.9rem', color: '#374151', margin: 0, whiteSpace: 'pre-wrap' }}>
                          {inquiry.message}
                        </p>
                      </div>
                    )}
                    
                    {inquiry.status === 'completed' && (
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#04AD74',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                          onClick={() => alert('견적서 다운로드 기능 준비 중')}
                        >
                          📄 견적서 다운로드
                        </button>
                        <button
                          style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                          onClick={() => alert('강의계획서 다운로드 기능 준비 중')}
                        >
                          📋 강의계획서 다운로드
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={styles.settingsSection}>
            <div className={styles.settingsCard}>
              <h3>🔒 비밀번호 변경</h3>
              <div className={styles.formGroup}>
                <label>현재 비밀번호</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="현재 비밀번호를 입력하세요"
                />
              </div>
              <div className={styles.formGroup}>
                <label>새 비밀번호</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="새 비밀번호를 입력하세요 (6자 이상)"
                />
              </div>
              <div className={styles.formGroup}>
                <label>새 비밀번호 확인</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
              </div>
              <button className={styles.primaryButton} onClick={handlePasswordChange}>
                비밀번호 변경
              </button>
            </div>

            <div className={styles.settingsCard}>
              <h3>⚠️ 회원 탈퇴</h3>
              <p className={styles.warningText}>
                회원 탈퇴 시 모든 학습 데이터와 수료증이 삭제되며 복구할 수 없습니다.
              </p>
              <button className={styles.dangerButton} onClick={handleDeleteAccount}>
                회원 탈퇴
              </button>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className={styles.certificatesSection}>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏆</div>
              <h3>아직 수료증이 없습니다</h3>
              <p>강의를 완료하면 수료증을 받을 수 있습니다!</p>
              <button
                className={styles.primaryButton}
                onClick={() => router.push('/resources')}
              >
                학습 자료 둘러보기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
