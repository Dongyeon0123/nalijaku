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

interface InstructorCourse {
  id: number;
  materialId: number;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  description: string;
  categoryName?: string;
  instructorName?: string;
  studentCount: number;
  avgProgress: number;
  status: 'active' | 'completed';
  startDate: string;
  endDate: string;
  assignedAt: string;
  createdAt?: string;
  externalLink?: string;
}

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [instructorCourses, setInstructorCourses] = useState<InstructorCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'courses' | 'settings' | 'certificates'>('profile');
  const [selectedCourse, setSelectedCourse] = useState<InstructorCourse | null>(null);
  
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

      // 강사인 경우 담당 강의 목록 조회
      if (profileResponse.data.data.role === 'TEACHER') {
        try {
          const instructorCoursesResponse = await api.get(`/api/instructors/${userId}/courses`);
          if (instructorCoursesResponse.data.success) {
            setInstructorCourses(instructorCoursesResponse.data.data);
          }
        } catch (error) {
          console.log('강사 강의 목록 API 미구현');
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

  const handleCourseClick = (course: InstructorCourse) => {
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
                      <p className={styles.courseStatLabel}>담당 강의</p>
                      <p className={styles.courseStatValue}>{instructorCourses.length}개</p>
                    </div>
                  </div>
                  <div className={styles.courseStatCard}>
                    <div className={styles.courseStatIcon}>👥</div>
                    <div className={styles.courseStatInfo}>
                      <p className={styles.courseStatLabel}>총 수강생</p>
                      <p className={styles.courseStatValue}>
                        {instructorCourses.reduce((acc, c) => acc + (c.studentCount || 0), 0)}명
                      </p>
                    </div>
                  </div>
                  <div className={styles.courseStatCard}>
                    <div className={styles.courseStatIcon}>📊</div>
                    <div className={styles.courseStatInfo}>
                      <p className={styles.courseStatLabel}>평균 진행률</p>
                      <p className={styles.courseStatValue}>
                        {instructorCourses.length > 0
                          ? Math.round(
                              instructorCourses.reduce((acc, c) => acc + (c.avgProgress || 0), 0) /
                                instructorCourses.length
                            )
                          : 0}%
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
                    {instructorCourses.map(course => (
                      <div key={course.id} className={styles.instructorCourseCard}>
                        <div className={styles.instructorCourseThumbnail}>
                          {course.thumbnail ? (
                            <img 
                              src={course.thumbnail.startsWith('http') 
                                ? course.thumbnail 
                                : `https://api.nallijaku.com${course.thumbnail}`
                              } 
                              alt={course.title}
                              onError={(e) => {
                                console.error('이미지 로드 실패:', course.thumbnail);
                                (e.target as HTMLImageElement).style.display = 'none';
                                const placeholder = (e.target as HTMLImageElement).nextElementSibling;
                                if (placeholder) {
                                  (placeholder as HTMLElement).style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div 
                            className={styles.placeholderThumbnail}
                            style={{ display: course.thumbnail ? 'none' : 'flex' }}
                          >
                            {course.title.charAt(0)}
                          </div>
                          <div className={`${styles.statusBadge} ${styles[course.status]}`}>
                            {course.status === 'active' ? '진행중' : '완료'}
                          </div>
                        </div>
                        <div className={styles.instructorCourseInfo}>
                          <h3>{course.title}</h3>
                          <p className={styles.courseDescription}>{course.description}</p>
                          
                          {/* 강의 기간 */}
                          {course.startDate && course.endDate && (
                            <div className={styles.courseDates}>
                              <span>📅 {new Date(course.startDate).toLocaleDateString('ko-KR')} ~ {new Date(course.endDate).toLocaleDateString('ko-KR')}</span>
                              <span className={styles.courseDuration}>
                                ({Math.ceil((new Date(course.endDate).getTime() - new Date(course.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)}일)
                              </span>
                            </div>
                          )}
                          
                          <div className={styles.courseMetrics}>
                            <div className={styles.metric}>
                              <span className={styles.metricLabel}>수강생</span>
                              <span className={styles.metricValue}>{course.studentCount || 0}명</span>
                            </div>
                            <div className={styles.metric}>
                              <span className={styles.metricLabel}>평균 진행률</span>
                              <span className={styles.metricValue}>{Math.round(course.avgProgress || 0)}%</span>
                            </div>
                          </div>
                          <button
                            className={styles.manageCourseButton}
                            onClick={() => handleCourseClick(course)}
                          >
                            강의 관리
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
                  <h2>{selectedCourse.title}</h2>
                </div>

                <div className={styles.courseDetailCard}>
                  <div className={styles.courseDetailHeader}>
                    <div className={styles.courseDetailThumbnail}>
                      {selectedCourse.thumbnail ? (
                        <img 
                          src={selectedCourse.thumbnail.startsWith('http') 
                            ? selectedCourse.thumbnail 
                            : `https://api.nallijaku.com${selectedCourse.thumbnail}`
                          } 
                          alt={selectedCourse.title}
                        />
                      ) : (
                        <div className={styles.placeholderThumbnail}>
                          {selectedCourse.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className={styles.courseDetailInfo}>
                      <h3>{selectedCourse.title}</h3>
                      <p>{selectedCourse.description}</p>
                      {selectedCourse.startDate && selectedCourse.endDate && (
                        <p className={styles.courseDetailDates}>
                          📅 {new Date(selectedCourse.startDate).toLocaleDateString('ko-KR')} ~ {new Date(selectedCourse.endDate).toLocaleDateString('ko-KR')}
                          <span> ({Math.ceil((new Date(selectedCourse.endDate).getTime() - new Date(selectedCourse.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)}일)</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={styles.courseDetailStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>수강생</span>
                      <span className={styles.statValue}>{selectedCourse.studentCount || 0}명</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>평균 진행률</span>
                      <span className={styles.statValue}>{Math.round(selectedCourse.avgProgress || 0)}%</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>상태</span>
                      <span className={styles.statValue}>{selectedCourse.status === 'active' ? '진행중' : '완료'}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.studentsSection}>
                  <h3>📢 공지사항</h3>
                  {selectedCourse.externalLink ? (
                    <div className={styles.announcementCard}>
                      <div className={styles.announcementHeader}>
                        <span className={styles.announcementIcon}>🔗</span>
                        <h4>외부 강의 링크</h4>
                      </div>
                      <div className={styles.announcementContent}>
                        <p>아래 링크를 통해 강의에 접속하실 수 있습니다.</p>
                        <a 
                          href={selectedCourse.externalLink} 
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
                      <p>📝 등록된 공지사항이 없습니다.</p>
                      <p className={styles.emptyAnnouncementSub}>관리자가 외부 강의 링크를 등록하면 여기에 표시됩니다.</p>
                    </div>
                  )}
                </div>
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
