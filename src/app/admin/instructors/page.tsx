'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import api from '@/lib/axios';

interface Instructor {
  id: number;
  name: string;
  region: string;
  category?: string;
  subtitle: string;
  imageUrl: string;
  profileDescription?: string;
  education?: string | Array<{ school: string; major: string; degree: string; graduationYear: number }>;
  certificates?: string | Array<{ name: string; issuer: string; issueDate: string }>;
  experience?: string | Array<{ company: string; position: string; startDate: string; endDate: string; description: string }>;
  awards?: string | Array<{ name: string; issuer: string; awardDate: string; description: string }>;
  userId?: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface Material {
  id: number;
  category: string;
  subCategory?: string;
  image: string;
  title: string;
  subtitle: string;
  instructor: string;
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
}

export default function InstructorsManagementPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [teacherUsers, setTeacherUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [formData, setFormData] = useState({
    userId: 0,
    name: '',
    region: '',
    category: '',
    subtitle: '',
    imageUrl: '',
    profileDescription: '',
    education: [] as Array<{ school: string; major: string; degree: string; graduationYear: number }>,
    certificates: [] as Array<{ name: string; issuer: string; issueDate: string }>,
    experience: [] as Array<{ company: string; position: string; startDate: string; endDate: string; description: string }>,
    awards: [] as Array<{ name: string; issuer: string; awardDate: string; description: string }>
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // 강의 할당 모달 상태
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningInstructor, setAssigningInstructor] = useState<Instructor | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<number[]>([]);
  const [assignmentDetails, setAssignmentDetails] = useState({
    schoolName: '',      // 학교/기관 이름 추가
    studentCount: 0,
    startDate: '',
    endDate: ''
  });

  // 강의 관리 모달 상태
  const [showManageCoursesModal, setShowManageCoursesModal] = useState(false);
  const [managingInstructor, setManagingInstructor] = useState<Instructor | null>(null);
  const [assignedCourses, setAssignedCourses] = useState<CourseGroup[]>([]);  // 타입 변경
  const [loadingAssignedCourses, setLoadingAssignedCourses] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());  // 확장된 그룹 ID 추적
  
  // 공지사항 편집 모달 상태
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [announcementForm, setAnnouncementForm] = useState({
    classLink: '',
    announcement: ''
  });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchTeacherUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await api.get('/api/users');
      const users = response.data.data || response.data || [];
      // TEACHER 역할을 가진 사용자만 필터링
      const teachers = users.filter((user: User) => user.role === 'TEACHER');
      console.log('📋 강사 역할 사용자 목록:', teachers);
      setTeacherUsers(teachers);
    } catch (error) {
      console.error('강사 사용자 목록 로드 실패:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoadingMaterials(true);
      const response = await api.get('/api/resources');
      const result = response.data;
      const materialsData = result.success ? result.data : (Array.isArray(result.data) ? result.data : []);
      console.log('📚 학습자료 목록:', materialsData);
      setMaterials(materialsData);
    } catch (error) {
      console.error('학습자료 목록 로드 실패:', error);
      alert('학습자료 목록을 불러올 수 없습니다.');
    } finally {
      setLoadingMaterials(false);
    }
  };

  const handleAssignClick = (instructor: Instructor) => {
    setAssigningInstructor(instructor);
    setSelectedMaterials([]);
    setAssignmentDetails({
      schoolName: '',
      studentCount: 0,
      startDate: '',
      endDate: ''
    });
    setShowAssignModal(true);
    fetchMaterials();
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setAssigningInstructor(null);
    setSelectedMaterials([]);
    setAssignmentDetails({
      schoolName: '',
      studentCount: 0,
      startDate: '',
      endDate: ''
    });
  };

  const handleMaterialToggle = (materialId: number) => {
    setSelectedMaterials(prev => {
      if (prev.includes(materialId)) {
        return prev.filter(id => id !== materialId);
      } else {
        return [...prev, materialId];
      }
    });
  };

  const handleAssignCourses = async () => {
    if (!assigningInstructor || selectedMaterials.length === 0) {
      alert('할당할 강의를 선택해주세요.');
      return;
    }

    if (!assignmentDetails.schoolName.trim()) {
      alert('학교/기관 이름을 입력해주세요.');
      return;
    }

    if (!assignmentDetails.studentCount || assignmentDetails.studentCount <= 0) {
      alert('수강 인원을 입력해주세요.');
      return;
    }

    if (!assignmentDetails.startDate || !assignmentDetails.endDate) {
      alert('강의 기간을 선택해주세요.');
      return;
    }

    // 날짜 유효성 검사
    const startDate = new Date(assignmentDetails.startDate);
    const endDate = new Date(assignmentDetails.endDate);
    
    if (endDate < startDate) {
      alert('종료일은 시작일보다 이후여야 합니다.');
      return;
    }

    try {
      // 임시: 백엔드 class-groups API 구현 전까지 기존 API 사용
      // TODO: 백엔드 구현 후 /api/instructors/{id}/class-groups로 변경
      await api.post(`/api/instructors/${assigningInstructor.id}/assign-courses`, {
        schoolName: assignmentDetails.schoolName,
        studentCount: assignmentDetails.studentCount,
        startDate: assignmentDetails.startDate,
        endDate: assignmentDetails.endDate,
        materialIds: selectedMaterials
      });

      alert(`${assigningInstructor.name} 강사에게 "${assignmentDetails.schoolName}" 강의 그룹이 할당되었습니다.`);
      handleCloseAssignModal();
    } catch (error: any) {
      console.error('강의 할당 실패:', error);
      const errorMsg = error.response?.data?.message || error.message || '알 수 없는 오류';
      alert(`강의 할당 중 오류가 발생했습니다: ${errorMsg}`);
    }
  };

  // 강의 관리 모달 열기
  const handleManageCoursesClick = async (instructor: Instructor) => {
    setManagingInstructor(instructor);
    setShowManageCoursesModal(true);
    await fetchAssignedCourses(instructor.id);
  };

  // 할당된 강의 목록 조회
  const fetchAssignedCourses = async (instructorId: number) => {
    try {
      setLoadingAssignedCourses(true);
      const response = await api.get(`/api/instructors/${instructorId}/courses`);
      const result = response.data;
      const coursesData = result.success ? result.data : (Array.isArray(result.data) ? result.data : []);
      console.log('📚 할당된 강의 목록:', coursesData);
      setAssignedCourses(coursesData);
    } catch (error) {
      console.error('할당된 강의 목록 로드 실패:', error);
      setAssignedCourses([]);
    } finally {
      setLoadingAssignedCourses(false);
    }
  };

  // 강의 그룹 삭제
  const handleDeleteCourseGroup = async (groupId: number) => {
    if (!confirm('이 강의 그룹을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await api.delete(`/api/instructors/${managingInstructor?.id}/class-groups/${groupId}`);
      alert('강의 그룹이 삭제되었습니다.');
      // 목록 새로고침
      if (managingInstructor) {
        await fetchAssignedCourses(managingInstructor.id);
      }
    } catch (error: any) {
      console.error('강의 그룹 삭제 실패:', error);
      const errorMsg = error.response?.data?.message || error.message || '알 수 없는 오류';
      alert(`강의 그룹 삭제 중 오류가 발생했습니다: ${errorMsg}`);
    }
  };

  // 강의 관리 모달 닫기
  const handleCloseManageCoursesModal = () => {
    setShowManageCoursesModal(false);
    setManagingInstructor(null);
    setAssignedCourses([]);
    setExpandedGroups(new Set());  // 확장 상태 초기화
  };

  // 그룹 확장/축소 토글
  const toggleGroupExpansion = (groupId: number) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // 공지사항 편집 모달 열기
  const handleEditAnnouncement = (course: any) => {
    setEditingCourse(course);
    setAnnouncementForm({
      classLink: course.classLink || '',
      announcement: course.announcement || ''
    });
    setShowAnnouncementModal(true);
  };

  // 공지사항 저장
  const handleSaveAnnouncement = async () => {
    if (!managingInstructor || !editingCourse) return;

    try {
      await api.put(`/api/instructors/${managingInstructor.id}/courses/${editingCourse.id}/announcement`, {
        classLink: announcementForm.classLink,
        announcement: announcementForm.announcement
      });

      // 목록 업데이트
      setAssignedCourses(prev => prev.map(c => 
        c.id === editingCourse.id ? { 
          ...c, 
          classLink: announcementForm.classLink,
          announcement: announcementForm.announcement
        } : c
      ));
      
      setShowAnnouncementModal(false);
      setEditingCourse(null);
      setAnnouncementForm({ classLink: '', announcement: '' });
      alert('공지사항이 저장되었습니다.');
    } catch (error: any) {
      console.error('공지사항 저장 실패:', error);
      const errorMsg = error.response?.data?.message || error.message || '알 수 없는 오류';
      alert(`공지사항 저장 중 오류가 발생했습니다: ${errorMsg}`);
    }
  };

  // 공지사항 편집 모달 닫기
  const handleCloseAnnouncementModal = () => {
    setShowAnnouncementModal(false);
    setEditingCourse(null);
    setAnnouncementForm({ classLink: '', announcement: '' });
  };

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      // Axios 사용 (인증 토큰 자동 포함)
      const response = await api.get('/api/instructors');
      const result = response.data;
      const data = Array.isArray(result) ? result : (Array.isArray(result.data) ? result.data : []);
      console.log('📥 로드된 강사 목록:', data);
      data.forEach((instructor: Instructor, idx: number) => {
        console.log(`강사 ${idx + 1}:`, {
          name: instructor.name,
          profileDescription: instructor.profileDescription,
          education: instructor.education,
          certificates: instructor.certificates,
          experience: instructor.experience,
          awards: instructor.awards
        });
      });
      setInstructors(data);
    } catch (error) {
      console.error('강사 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEditClick = (instructor: Instructor) => {
    console.log('수정할 강사 데이터:', instructor);

    setEditingInstructor(instructor);
    const profileDesc = (instructor as Instructor & { profileDescription?: string }).profileDescription || '';
    console.log('로드된 소개말:', profileDesc);

    setFormData({
      userId: instructor.userId || 0,
      name: instructor.name,
      region: instructor.region,
      category: instructor.category || '',
      subtitle: instructor.subtitle,
      imageUrl: instructor.imageUrl,
      profileDescription: profileDesc,
      education: (Array.isArray(instructor.education) ? instructor.education : []) as Array<{ school: string; major: string; degree: string; graduationYear: number }>,
      certificates: (Array.isArray(instructor.certificates) ? instructor.certificates : []) as Array<{ name: string; issuer: string; issueDate: string }>,
      experience: (Array.isArray(instructor.experience) ? instructor.experience : []) as Array<{ company: string; position: string; startDate: string; endDate: string; description: string }>,
      awards: (Array.isArray(instructor.awards) ? instructor.awards : []) as Array<{ name: string; issuer: string; awardDate: string; description: string }>
    });
    setImageFile(null);
    fetchTeacherUsers();
    setShowModal(true);
  };

  const handleOpenModal = () => {
    setShowModal(true);
    fetchTeacherUsers();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInstructor(null);
    setFormData({
      userId: 0,
      name: '',
      region: '',
      category: '',
      subtitle: '',
      imageUrl: '',
      profileDescription: '',
      education: [],
      certificates: [],
      experience: [],
      awards: []
    });
    setImageFile(null);
  };

  const handleDeleteClick = async (instructor: Instructor) => {
    if (!confirm(`${instructor.name} 강사를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      console.log('강사 삭제 요청:', instructor.id);

      // Axios 사용 (인증 토큰 자동 포함)
      await api.delete(`/api/instructors/${instructor.id}`);

      console.log('강사 삭제 성공');
      alert('강사가 삭제되었습니다.');
      fetchInstructors();
    } catch (error: any) {
      console.error('강사 삭제 중 오류:', error);
      const errorMsg = error.response?.data?.message || error.message || '알 수 없는 오류';
      alert(`강사 삭제 중 오류가 발생했습니다: ${errorMsg}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 신규 등록 시 필수 필드 검증
      if (!editingInstructor && (!formData.name || !formData.region || !formData.subtitle || !imageFile)) {
        alert('필수 필드를 모두 입력해주세요.');
        return;
      }

      const submitData = new FormData();
      if (formData.userId) {
        submitData.append('userId', formData.userId.toString());
      }
      submitData.append('name', formData.name);
      submitData.append('region', formData.region);
      submitData.append('subtitle', formData.subtitle);
      submitData.append('profileDescription', formData.profileDescription || '');
      // 배열을 JSON 문자열로 변환
      submitData.append('education', JSON.stringify(formData.education || []));
      submitData.append('certificates', JSON.stringify(formData.certificates || []));
      submitData.append('experience', JSON.stringify(formData.experience || []));
      submitData.append('awards', JSON.stringify(formData.awards || []));

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      // FormData 내용 로깅
      console.log('FormData 내용:');
      for (const [key, value] of submitData.entries()) {
        console.log(`  ${key}:`, value);
      }

      const isEditing = !!editingInstructor;
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `/api/instructors/${editingInstructor.id}`
        : `/api/instructors`;

      console.log(`강사 ${isEditing ? '수정' : '등록'} 요청:`);
      console.log('  - 메서드:', method);
      console.log('  - URL:', url);
      console.log('  - 이름:', formData.name);
      console.log('  - 지역:', formData.region);
      console.log('  - 부제목:', formData.subtitle);
      console.log('  - 소개말:', formData.profileDescription || '(없음)');
      console.log('  - 학력:', JSON.stringify(formData.education));
      console.log('  - 자격증:', JSON.stringify(formData.certificates));
      console.log('  - 경력:', JSON.stringify(formData.experience));
      console.log('  - 수상:', JSON.stringify(formData.awards));
      if (imageFile) {
        console.log('  - 이미지:', imageFile.name, `(${(imageFile.size / 1024).toFixed(2)}KB)`);
      }

      console.log('요청 전송 중...');

      // Axios 사용 (인증 토큰 자동 포함)
      const response = isEditing 
        ? await api.put(url, submitData, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await api.post(url, submitData, { headers: { 'Content-Type': 'multipart/form-data' } });

      console.log('응답 상태:', response.status);
      console.log('응답 수신 완료');

      const result = response.data;
      console.log(`강사 ${isEditing ? '수정' : '등록'} 성공:`, result);
      console.log('전체 응답:', JSON.stringify(result, null, 2));
      console.log('data 내용:', JSON.stringify(result.data, null, 2));
      console.log('profileDescription:', result.data?.profileDescription);
        console.log('education:', result.data?.education);
        console.log('certificates:', result.data?.certificates);
        console.log('💼 experience:', result.data?.experience);
        console.log('awards:', result.data?.awards);
        alert(`강사가 ${isEditing ? '수정' : '등록'}되었습니다.`);
        handleCloseModal();
        fetchInstructors();
      } catch (error: any) {
        console.error('강사 처리 중 오류:', error);
        const errorMsg = error.response?.data?.message || error.message || '알 수 없는 오류';
        alert(`강사 처리 중 오류가 발생했습니다: ${errorMsg}`);
      }
    };

  const regions = ['서울', '경기', '충북', '충남', '강원', '전북', '전남', '경북', '경남', '제주', '수원'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>강사 관리</h1>
        <button
          onClick={handleOpenModal}
          className={styles.addButton}
        >
          + 강사 등록
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>로딩 중...</div>
      ) : (
        <div className={styles.instructorsList}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>이름</th>
                <th>지역</th>
                <th>카테고리</th>
                <th>부제목</th>
                <th>이미지</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => (
                <tr key={instructor.id}>
                  <td>{instructor.name}</td>
                  <td>{instructor.region}</td>
                  <td>{instructor.category || '-'}</td>
                  <td>{instructor.subtitle}</td>
                  <td>
                    <img
                      src={instructor.imageUrl.startsWith('http')
                        ? instructor.imageUrl
                        : `https://api.nallijaku.com${instructor.imageUrl}`}
                      alt={instructor.name}
                      className={styles.thumbnailImage}
                      onError={(e) => {
                        console.error('이미지 로드 실패:', instructor.imageUrl);
                        (e.target as HTMLImageElement).src = '/placeholder.png';
                      }}
                    />
                  </td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditClick(instructor)}
                    >
                      수정
                    </button>
                    <button
                      className={styles.manageButton}
                      onClick={() => handleManageCoursesClick(instructor)}
                    >
                      강의 관리
                    </button>
                    <button
                      className={styles.assignButton}
                      onClick={() => handleAssignClick(instructor)}
                    >
                      강의 할당
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(instructor)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 강의 할당 모달 */}
      {showAssignModal && assigningInstructor && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '800px' }}>
            <div className={styles.modalHeader}>
              <h2>강의 할당 - {assigningInstructor.name}</h2>
              <button
                onClick={handleCloseAssignModal}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
                학교/기관 정보를 입력하고, 할당할 학습자료를 선택하세요.
              </p>

              {/* 학교/기관 정보 및 강의 기간 입력 */}
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px', 
                marginBottom: '20px',
                border: '1px solid #e0e0e0'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>
                  📋 강의 그룹 정보
                </h3>
                
                {/* 학교/기관 이름 */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#555' }}>
                    학교/기관 이름 *
                  </label>
                  <input
                    type="text"
                    value={assignmentDetails.schoolName}
                    onChange={(e) => setAssignmentDetails(prev => ({ 
                      ...prev, 
                      schoolName: e.target.value 
                    }))}
                    placeholder="예: 서울초등학교, 부산중학교"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div style={{ flex: '0 0 120px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#555' }}>
                      수강 인원 *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={assignmentDetails.studentCount || ''}
                      onChange={(e) => setAssignmentDetails(prev => ({ 
                        ...prev, 
                        studentCount: parseInt(e.target.value) || 0 
                      }))}
                      placeholder="인원 수"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end' }}>
                    <div style={{ flex: '0 0 150px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#555' }}>
                        시작일 *
                      </label>
                      <input
                        type="date"
                        value={assignmentDetails.startDate}
                        onChange={(e) => setAssignmentDetails(prev => ({ 
                          ...prev, 
                          startDate: e.target.value 
                        }))}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    
                    <div style={{ flex: '0 0 150px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#555' }}>
                        종료일 *
                      </label>
                      <input
                        type="date"
                        value={assignmentDetails.endDate}
                        onChange={(e) => setAssignmentDetails(prev => ({ 
                          ...prev, 
                          endDate: e.target.value 
                        }))}
                        min={assignmentDetails.startDate}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    {assignmentDetails.startDate && assignmentDetails.endDate && (
                      <div style={{ 
                        padding: '10px 16px',
                        backgroundColor: '#E3F2FD',
                        borderRadius: '6px',
                        fontSize: '13px', 
                        color: '#1976D2',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        📅 {Math.ceil((new Date(assignmentDetails.endDate).getTime() - new Date(assignmentDetails.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)}일
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {loadingMaterials ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  학습자료 목록을 불러오는 중...
                </div>
              ) : materials.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  할당 가능한 학습자료가 없습니다.
                </div>
              ) : (
                <>
                  <div style={{ 
                    maxHeight: '400px', 
                    overflowY: 'auto', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    {materials.map(material => {
                      const categoryColors: { [key: string]: { bg: string; text: string } } = {
                        '창업': { bg: '#E3F2FD', text: '#1976D2' },
                        '드론': { bg: '#F3E5F5', text: '#7B1FA2' },
                        'AI': { bg: '#FFF3E0', text: '#E65100' },
                        '환경': { bg: '#E8F5E9', text: '#2E7D32' }
                      };
                      const categoryColor = categoryColors[material.category] || { bg: '#F5F5F5', text: '#666' };

                      return (
                        <div
                          key={material.id}
                          onClick={() => handleMaterialToggle(material.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '16px',
                            borderBottom: '1px solid #f0f0f0',
                            cursor: 'pointer',
                            backgroundColor: selectedMaterials.includes(material.id) ? '#f0f7ff' : 'white',
                            transition: 'background-color 0.2s'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedMaterials.includes(material.id)}
                            onChange={() => {}}
                            style={{
                              width: '20px',
                              height: '20px',
                              marginRight: '16px',
                              cursor: 'pointer'
                            }}
                          />
                          <img
                            src={material.image.startsWith('http') ? material.image : `https://api.nallijaku.com${material.image}`}
                            alt={material.title}
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              marginRight: '16px'
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.png';
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              display: 'inline-block',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              marginBottom: '8px',
                              backgroundColor: categoryColor.bg,
                              color: categoryColor.text
                            }}>
                              {material.category}
                              {material.subCategory && ` - ${material.subCategory}`}
                            </div>
                            <h4 style={{ margin: '4px 0', fontSize: '16px', fontWeight: '600' }}>
                              {material.title}
                            </h4>
                            <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                              {material.subtitle}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '4px' }}>
                        선택된 강의: {selectedMaterials.length}개
                      </span>
                      {assignmentDetails.studentCount > 0 && (
                        <span style={{ fontSize: '12px', color: '#666' }}>
                          수강 인원: {assignmentDetails.studentCount}명
                        </span>
                      )}
                    </div>
                    {selectedMaterials.length > 0 && (
                      <button
                        onClick={() => setSelectedMaterials([])}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          color: '#666',
                          backgroundColor: 'white',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        선택 해제
                      </button>
                    )}
                  </div>
                </>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={handleCloseAssignModal}
                  className={styles.cancelButton}
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleAssignCourses}
                  className={styles.submitButton}
                  disabled={
                    selectedMaterials.length === 0 || 
                    !assignmentDetails.schoolName.trim() ||
                    !assignmentDetails.studentCount || 
                    !assignmentDetails.startDate || 
                    !assignmentDetails.endDate
                  }
                >
                  할당하기 ({selectedMaterials.length}개 강의)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 공지사항 등록/수정 모달 */}
      {showAnnouncementModal && editingCourse && (
        <div className={styles.modalOverlay} style={{ zIndex: 1100 }}>
          <div className={styles.modal} style={{ maxWidth: '700px' }}>
            <div className={styles.modalHeader}>
              <h2>공지사항 {editingCourse.classLink || editingCourse.announcement ? '수정' : '등록'}</h2>
              <button
                onClick={handleCloseAnnouncementModal}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ 
                padding: '12px 16px', 
                backgroundColor: '#f0f9ff', 
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #bae6fd'
              }}>
                <p style={{ fontSize: '14px', color: '#0369a1', margin: 0, fontWeight: '600' }}>
                  📚 {editingCourse.title}
                </p>
              </div>

              <div className={styles.formGroup} style={{ marginBottom: '20px' }}>
                <label>🔗 외부 강의 링크</label>
                <input
                  type="url"
                  value={announcementForm.classLink}
                  onChange={(e) => setAnnouncementForm(prev => ({ ...prev, classLink: e.target.value }))}
                  placeholder="https://zoom.us/j/123456789 또는 https://meet.google.com/abc-defg-hij"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '6px', lineHeight: '1.5' }}>
                  수강생들이 접속할 수 있는 외부 강의 링크 (예: Zoom, Google Meet, YouTube 등)
                </p>
              </div>

              <div className={styles.formGroup}>
                <label>📢 공지사항 내용</label>
                <textarea
                  value={announcementForm.announcement}
                  onChange={(e) => setAnnouncementForm(prev => ({ ...prev, announcement: e.target.value }))}
                  placeholder="강의와 관련된 공지사항을 입력하세요.&#10;예: 강의 일정, 준비물, 과제 안내 등"
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    lineHeight: '1.6'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '6px', lineHeight: '1.5' }}>
                  강의 일정, 준비물, 과제 등 수강생에게 전달할 내용을 입력하세요.
                </p>
              </div>

              {(editingCourse.classLink || editingCourse.announcement) && (
                <div style={{ 
                  padding: '16px', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '8px',
                  marginTop: '20px',
                  border: '1px solid #e5e7eb'
                }}>
                  <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 12px 0', fontWeight: '600' }}>
                    📌 현재 등록된 정보
                  </p>
                  {editingCourse.classLink && (
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>링크: </span>
                      <a 
                        href={editingCourse.classLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          fontSize: '12px', 
                          color: '#0284c7',
                          wordBreak: 'break-all',
                          textDecoration: 'underline'
                        }}
                      >
                        {editingCourse.classLink}
                      </a>
                    </div>
                  )}
                  {editingCourse.announcement && (
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>공지: </span>
                      <span style={{ fontSize: '12px', color: '#374151', whiteSpace: 'pre-wrap' }}>
                        {editingCourse.announcement}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.formActions} style={{ marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={handleCloseAnnouncementModal}
                  className={styles.cancelButton}
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSaveAnnouncement}
                  className={styles.submitButton}
                  disabled={!announcementForm.classLink.trim() && !announcementForm.announcement.trim()}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 강의 관리 모달 */}
      {showManageCoursesModal && managingInstructor && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '900px' }}>
            <div className={styles.modalHeader}>
              <h2>강의 관리 - {managingInstructor.name}</h2>
              <button
                onClick={handleCloseManageCoursesModal}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              {loadingAssignedCourses ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  강의 목록을 불러오는 중...
                </div>
              ) : assignedCourses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  할당된 강의가 없습니다.
                </div>
              ) : (
                <div style={{ 
                  maxHeight: '500px', 
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {assignedCourses.map(group => {
                    const isExpanded = expandedGroups.has(group.id);
                    
                    return (
                      <div 
                        key={group.id}
                        style={{
                          border: '2px solid #e0e0e0',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          backgroundColor: 'white',
                          transition: 'all 0.2s'
                        }}
                      >
                        {/* 그룹 카드 헤더 */}
                        <div style={{
                          padding: '20px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              <h3 style={{ 
                                margin: '0 0 12px 0', 
                                fontSize: '20px', 
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}>
                                🏫 {group.schoolName}
                              </h3>
                              <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                gap: '12px',
                                fontSize: '14px',
                                opacity: 0.95
                              }}>
                                <div>
                                  <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>수강 인원</div>
                                  <div style={{ fontSize: '18px', fontWeight: '600' }}>👥 {group.studentCount}명</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>강의 수</div>
                                  <div style={{ fontSize: '18px', fontWeight: '600' }}>📚 {group.courseCount}개</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>수강 기간</div>
                                  <div style={{ fontSize: '13px', fontWeight: '600' }}>
                                    📅 {new Date(group.startDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} ~ {new Date(group.endDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>상태</div>
                                  <div>
                                    <span style={{
                                      padding: '4px 12px',
                                      borderRadius: '12px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      backgroundColor: group.status === 'active' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)',
                                      border: '1px solid rgba(255, 255, 255, 0.3)'
                                    }}>
                                      {group.status === 'active' ? '✓ 진행중' : '완료'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 그룹 카드 액션 버튼 */}
                        <div style={{
                          padding: '16px 20px',
                          backgroundColor: '#f8f9fa',
                          borderTop: '1px solid #e0e0e0',
                          display: 'flex',
                          gap: '8px',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <button
                            onClick={() => toggleGroupExpansion(group.id)}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: isExpanded ? '#e3f2fd' : 'white',
                              color: isExpanded ? '#1976d2' : '#666',
                              border: '1px solid #e0e0e0',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            {isExpanded ? '▲ 접기' : '▼ 상세보기'}
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteCourseGroup(group.id)}
                            style={{ fontSize: '13px', padding: '8px 16px' }}
                          >
                            🗑️ 그룹 삭제
                          </button>
                        </div>

                        {/* 확장된 강의 목록 */}
                        {isExpanded && (
                          <div style={{
                            padding: '20px',
                            backgroundColor: 'white',
                            borderTop: '1px solid #e0e0e0'
                          }}>
                            <h4 style={{ 
                              margin: '0 0 16px 0', 
                              fontSize: '15px', 
                              fontWeight: '600',
                              color: '#333'
                            }}>
                              📖 포함된 강의 목록
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {group.courses && group.courses.length > 0 ? (
                                group.courses.map((course, idx) => (
                                  <div 
                                    key={idx}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '16px',
                                      padding: '16px',
                                      backgroundColor: '#f9fafb',
                                      borderRadius: '8px',
                                      border: '1px solid #e5e7eb'
                                    }}
                                  >
                                    {course.thumbnail && (
                                      <img
                                        src={course.thumbnail.startsWith('http') 
                                          ? course.thumbnail 
                                          : `https://api.nallijaku.com${course.thumbnail}`
                                        }
                                        alt={course.title}
                                        style={{
                                          width: '60px',
                                          height: '60px',
                                          objectFit: 'cover',
                                          borderRadius: '8px',
                                          flexShrink: 0
                                        }}
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                      />
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ 
                                        fontWeight: '600', 
                                        marginBottom: '4px',
                                        fontSize: '14px',
                                        color: '#1f2937'
                                      }}>
                                        {idx + 1}. {course.title}
                                      </div>
                                      {course.subtitle && (
                                        <div style={{ 
                                          fontSize: '12px', 
                                          color: '#6b7280',
                                          marginBottom: '4px'
                                        }}>
                                          {course.subtitle}
                                        </div>
                                      )}
                                      {course.category && (
                                        <span style={{
                                          display: 'inline-block',
                                          padding: '2px 8px',
                                          borderRadius: '4px',
                                          fontSize: '11px',
                                          fontWeight: '600',
                                          backgroundColor: '#e0e7ff',
                                          color: '#4338ca'
                                        }}>
                                          {course.category}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div style={{ 
                                  textAlign: 'center', 
                                  padding: '20px', 
                                  color: '#999',
                                  fontSize: '13px'
                                }}>
                                  강의 정보가 없습니다.
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className={styles.formActions} style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={handleCloseManageCoursesModal}
                  className={styles.cancelButton}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 강사 등록/수정 모달 */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingInstructor ? '강사 수정' : '강사 등록'}</h2>
              <button
                onClick={handleCloseModal}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {!editingInstructor && (
                <div className={styles.formGroup}>
                  <label>강사 계정 선택 *</label>
                  {loadingUsers ? (
                    <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                      사용자 목록 로딩 중...
                    </div>
                  ) : (
                    <select
                      name="userId"
                      value={formData.userId}
                      onChange={(e) => {
                        const selectedUserId = parseInt(e.target.value);
                        const selectedUser = teacherUsers.find(u => u.id === selectedUserId);
                        setFormData(prev => ({
                          ...prev,
                          userId: selectedUserId,
                          name: selectedUser?.username || prev.name
                        }));
                      }}
                      required
                      style={{ padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px' }}
                    >
                      <option value="">강사 역할을 가진 사용자를 선택하세요</option>
                      {teacherUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.username} ({user.email})
                        </option>
                      ))}
                    </select>
                  )}
                  {teacherUsers.length === 0 && !loadingUsers && (
                    <p style={{ fontSize: '12px', color: '#f44336', margin: '8px 0 0 0' }}>
                      ⚠️ 강사 역할을 가진 사용자가 없습니다. 먼저 사용자 관리에서 강사 역할을 부여해주세요.
                    </p>
                  )}
                </div>
              )}

              <div className={styles.formGroup}>
                <label>이름 *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="강사 이름을 입력하세요"
                />
                {!editingInstructor && formData.userId > 0 && (
                  <p style={{ fontSize: '12px', color: '#1976D2', margin: '4px 0 0 0' }}>
                    💡 선택한 사용자: {teacherUsers.find(u => u.id === formData.userId)?.username || ''} (이름은 수정 가능합니다)
                  </p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>지역 *</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">지역을 선택하세요</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>카테고리 *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">카테고리를 선택하세요</option>
                  <option value="창업">창업</option>
                  <option value="드론">드론</option>
                  <option value="AI">AI</option>
                  <option value="환경">환경</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>부제목 *</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  required
                  placeholder="강사 소개 부제목을 입력하세요"
                />
              </div>

              <div className={styles.formGroup}>
                <label>소개말</label>
                <textarea
                  name="profileDescription"
                  value={formData.profileDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, profileDescription: e.target.value }))}
                  placeholder="강사 소개 내용을 입력하세요"
                  rows={3}
                  style={{ padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <div className={styles.formGroup}>
                <label>이미지 *</label>
                {editingInstructor && editingInstructor.imageUrl && (
                  <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#E3F2FD', borderRadius: '6px', border: '1px solid #1976D2' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#1565C0' }}>
                      📷 현재 이미지
                    </p>
                    <img
                      src={editingInstructor.imageUrl.startsWith('http')
                        ? editingInstructor.imageUrl
                        : `https://api.nallijaku.com${editingInstructor.imageUrl}`}
                      alt={editingInstructor.name}
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: '1px solid #1976D2',
                        marginBottom: '8px'
                      }}
                      onError={(e) => {
                        console.error('이미지 로드 실패:', editingInstructor.imageUrl);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <p style={{ margin: '0', fontSize: '12px', color: '#1565C0' }}>
                      새 이미지를 선택하면 기존 이미지가 대체됩니다.
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingInstructor}
                />
                {imageFile && (
                  <p style={{ fontSize: '12px', color: '#1976D2', margin: '8px 0 0 0', fontWeight: '600' }}>
                    ✓ 새 이미지 선택됨: {imageFile.name}
                  </p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>학력</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Array.isArray(formData.education) && formData.education.map((edu, idx) => (
                    <div key={idx} style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => {
                            const newEducation = [...formData.education];
                            newEducation[idx].school = e.target.value;
                            setFormData(prev => ({ ...prev, education: newEducation }));
                          }}
                          placeholder="학교명"
                          style={{ padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
                        />
                        <input
                          type="text"
                          value={edu.major}
                          onChange={(e) => {
                            const newEducation = [...formData.education];
                            newEducation[idx].major = e.target.value;
                            setFormData(prev => ({ ...prev, education: newEducation }));
                          }}
                          placeholder="전공"
                          style={{ padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEducation = [...formData.education];
                            newEducation[idx].degree = e.target.value;
                            setFormData(prev => ({ ...prev, education: newEducation }));
                          }}
                          placeholder="학위"
                          style={{ padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
                        />
                        <input
                          type="number"
                          value={edu.graduationYear}
                          onChange={(e) => {
                            const newEducation = [...formData.education];
                            newEducation[idx].graduationYear = parseInt(e.target.value) || 0;
                            setFormData(prev => ({ ...prev, education: newEducation }));
                          }}
                          placeholder="졸업년도"
                          style={{ padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newEducation = formData.education.filter((_, i) => i !== idx);
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                        style={{ width: '100%', padding: '6px', backgroundColor: '#FFEBEE', color: '#D32F2F', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, education: [...prev.education, { school: '', major: '', degree: '', graduationYear: new Date().getFullYear() }] }))}
                    style={{ padding: '8px 12px', backgroundColor: '#E3F2FD', color: '#1976D2', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-start' }}
                  >
                    + 추가
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>자격증</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Array.isArray(formData.certificates) && formData.certificates.map((cert, idx) => (
                    <div key={idx} style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => {
                            const newCerts = [...formData.certificates];
                            newCerts[idx].name = e.target.value;
                            setFormData(prev => ({ ...prev, certificates: newCerts }));
                          }}
                          placeholder="자격증명"
                          style={{ padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
                        />
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const newCerts = [...formData.certificates];
                            newCerts[idx].issuer = e.target.value;
                            setFormData(prev => ({ ...prev, certificates: newCerts }));
                          }}
                          placeholder="발급기관"
                          style={{ padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
                        />
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <input
                          type="date"
                          value={cert.issueDate}
                          onChange={(e) => {
                            const newCerts = [...formData.certificates];
                            newCerts[idx].issueDate = e.target.value;
                            setFormData(prev => ({ ...prev, certificates: newCerts }));
                          }}
                          style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newCerts = formData.certificates.filter((_, i) => i !== idx);
                          setFormData(prev => ({ ...prev, certificates: newCerts }));
                        }}
                        style={{ width: '100%', padding: '6px', backgroundColor: '#FFEBEE', color: '#D32F2F', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, certificates: [...prev.certificates, { name: '', issuer: '', issueDate: '' }] }))}
                    style={{ padding: '8px 12px', backgroundColor: '#E3F2FD', color: '#1976D2', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-start' }}
                  >
                    + 추가
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>경력</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Array.isArray(formData.experience) && formData.experience.map((exp, idx) => (
                    <div key={idx} style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const newExp = [...formData.experience];
                            newExp[idx].company = e.target.value;
                            setFormData(prev => ({ ...prev, experience: newExp }));
                          }}
                          placeholder="회사명"
                          style={{ padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
                        />
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => {
                            const newExp = [...formData.experience];
                            newExp[idx].position = e.target.value;
                            setFormData(prev => ({ ...prev, experience: newExp }));
                          }}
                          placeholder="직책"
                          style={{ padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => {
                            const newExp = [...formData.experience];
                            newExp[idx].startDate = e.target.value;
                            setFormData(prev => ({ ...prev, experience: newExp }));
                          }}
                          placeholder="시작일"
                          style={{ padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
                        />
                        <input
                          type="date"
                          value={exp.endDate}
                          onChange={(e) => {
                            const newExp = [...formData.experience];
                            newExp[idx].endDate = e.target.value;
                            setFormData(prev => ({ ...prev, experience: newExp }));
                          }}
                          placeholder="종료일"
                          style={{ padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
                        />
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <textarea
                          value={exp.description}
                          onChange={(e) => {
                            const newExp = [...formData.experience];
                            newExp[idx].description = e.target.value;
                            setFormData(prev => ({ ...prev, experience: newExp }));
                          }}
                          placeholder="경력 설명"
                          rows={2}
                          style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newExp = formData.experience.filter((_, i) => i !== idx);
                          setFormData(prev => ({ ...prev, experience: newExp }));
                        }}
                        style={{ width: '100%', padding: '6px', backgroundColor: '#FFEBEE', color: '#D32F2F', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, experience: [...prev.experience, { company: '', position: '', startDate: '', endDate: '', description: '' }] }))}
                    style={{ padding: '8px 12px', backgroundColor: '#E3F2FD', color: '#1976D2', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-start' }}
                  >
                    + 추가
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>수상</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Array.isArray(formData.awards) && formData.awards.map((award, idx) => (
                    <div key={idx} style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          value={award.name}
                          onChange={(e) => {
                            const newAwards = [...formData.awards];
                            newAwards[idx].name = e.target.value;
                            setFormData(prev => ({ ...prev, awards: newAwards }));
                          }}
                          placeholder="수상명"
                          style={{ padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
                        />
                        <input
                          type="text"
                          value={award.issuer}
                          onChange={(e) => {
                            const newAwards = [...formData.awards];
                            newAwards[idx].issuer = e.target.value;
                            setFormData(prev => ({ ...prev, awards: newAwards }));
                          }}
                          placeholder="수여기관"
                          style={{ padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
                        />
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <input
                          type="date"
                          value={award.awardDate}
                          onChange={(e) => {
                            const newAwards = [...formData.awards];
                            newAwards[idx].awardDate = e.target.value;
                            setFormData(prev => ({ ...prev, awards: newAwards }));
                          }}
                          style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
                        />
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <textarea
                          value={award.description}
                          onChange={(e) => {
                            const newAwards = [...formData.awards];
                            newAwards[idx].description = e.target.value;
                            setFormData(prev => ({ ...prev, awards: newAwards }));
                          }}
                          placeholder="수상 설명"
                          rows={2}
                          style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newAwards = formData.awards.filter((_, i) => i !== idx);
                          setFormData(prev => ({ ...prev, awards: newAwards }));
                        }}
                        style={{ width: '100%', padding: '6px', backgroundColor: '#FFEBEE', color: '#D32F2F', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, awards: [...prev.awards, { name: '', issuer: '', awardDate: '', description: '' }] }))}
                    style={{ padding: '8px 12px', backgroundColor: '#E3F2FD', color: '#1976D2', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-start' }}
                  >
                    + 추가
                  </button>
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={styles.cancelButton}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  {editingInstructor ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
