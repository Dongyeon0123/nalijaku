'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

interface Instructor {
  id: number;
  name: string;
  region: string;
  subtitle: string;
  imageUrl: string;
  education?: string;
  certificates?: string;
  experience?: string;
  awards?: string;
}

export default function InstructorsManagementPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    subtitle: '',
    imageUrl: '',
    profileDescription: '',
    education: '',
    certificates: '',
    experience: '',
    awards: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.INSTRUCTORS.LIST}`);
      if (response.ok) {
        const result = await response.json();
        const data = Array.isArray(result) ? result : (Array.isArray(result.data) ? result.data : []);
        setInstructors(data);
      }
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
    setEditingInstructor(instructor);
    setFormData({
      name: instructor.name,
      region: instructor.region,
      subtitle: instructor.subtitle,
      imageUrl: instructor.imageUrl,
      profileDescription: (instructor as any).profileDescription || '',
      education: instructor.education || '',
      certificates: instructor.certificates || '',
      experience: instructor.experience || '',
      awards: instructor.awards || ''
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInstructor(null);
    setFormData({
      name: '',
      region: '',
      subtitle: '',
      imageUrl: '',
      profileDescription: '',
      education: '',
      certificates: '',
      experience: '',
      awards: ''
    });
    setImageFile(null);
  };

  const handleDeleteClick = async (instructor: Instructor) => {
    if (!confirm(`${instructor.name} 강사를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      console.log('🗑️ 강사 삭제 요청:', instructor.id);
      
      const response = await fetch(`${API_BASE_URL}/api/instructors/${instructor.id}`, {
        method: 'DELETE'
      });

      console.log('📊 응답 상태:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ 강사 삭제 성공:', result);
        alert('강사가 삭제되었습니다.');
        fetchInstructors();
      } else {
        const errorText = await response.text();
        console.error('❌ 강사 삭제 실패:', response.status);
        console.error('📝 에러 응답:', errorText);
        alert(`강사 삭제에 실패했습니다. (${response.status})`);
      }
    } catch (error) {
      console.error('❌ 강사 삭제 중 오류:', error);
      alert('강사 삭제 중 오류가 발생했습니다.');
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
      submitData.append('name', formData.name);
      submitData.append('region', formData.region);
      submitData.append('subtitle', formData.subtitle);
      submitData.append('profileDescription', formData.profileDescription || '');
      submitData.append('education', formData.education || '');
      submitData.append('certificates', formData.certificates || '');
      submitData.append('experience', formData.experience || '');
      submitData.append('awards', formData.awards || '');
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const isEditing = !!editingInstructor;
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `${API_BASE_URL}/api/instructors/${editingInstructor.id}`
        : `${API_BASE_URL}/api/instructors`;

      console.log(`📤 강사 ${isEditing ? '수정' : '등록'} 요청:`);
      console.log('  - 메서드:', method);
      console.log('  - URL:', url);
      console.log('  - 이름:', formData.name);
      console.log('  - 지역:', formData.region);
      console.log('  - 부제목:', formData.subtitle);
      console.log('  - 소개말:', formData.profileDescription || '(없음)');
      console.log('  - 학력:', formData.education || '(없음)');
      console.log('  - 자격증:', formData.certificates || '(없음)');
      console.log('  - 경력:', formData.experience || '(없음)');
      console.log('  - 수상:', formData.awards || '(없음)');
      if (imageFile) {
        console.log('  - 이미지:', imageFile.name, `(${(imageFile.size / 1024).toFixed(2)}KB)`);
      }

      const response = await fetch(url, {
        method,
        body: submitData
      });

      console.log('📊 응답 상태:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ 강사 ${isEditing ? '수정' : '등록'} 성공:`, result);
        alert(`강사가 ${isEditing ? '수정' : '등록'}되었습니다.`);
        handleCloseModal();
        fetchInstructors();
      } else {
        const errorText = await response.text();
        console.error(`❌ 강사 ${isEditing ? '수정' : '등록'} 실패:`, response.status);
        console.error('📝 에러 응답:', errorText);
        alert(`강사 ${isEditing ? '수정' : '등록'}에 실패했습니다. (${response.status})`);
      }
    } catch (error) {
      console.error('❌ 강사 처리 중 오류:', error);
      alert('강사 처리 중 오류가 발생했습니다.');
    }
  };

  const regions = ['서울', '경기', '충북', '충남', '강원', '전북', '전남', '경북', '경남', '제주', '수원'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>강사 관리</h1>
        <button 
          onClick={() => setShowModal(true)}
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
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                  placeholder="예: 서울대학교 항공우주공학과 졸업"
                  rows={2}
                  style={{ padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <div className={styles.formGroup}>
                <label>자격증</label>
                <textarea
                  name="certificates"
                  value={formData.certificates}
                  onChange={(e) => setFormData(prev => ({ ...prev, certificates: e.target.value }))}
                  placeholder="예: 드론조종사 자격증, 항공촬영 전문가"
                  rows={2}
                  style={{ padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <div className={styles.formGroup}>
                <label>경력</label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="예: 드론 교육 10년, 항공촬영 전문가"
                  rows={2}
                  style={{ padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <div className={styles.formGroup}>
                <label>수상</label>
                <textarea
                  name="awards"
                  value={formData.awards}
                  onChange={(e) => setFormData(prev => ({ ...prev, awards: e.target.value }))}
                  placeholder="예: 2023년 드론 교육 우수상, 2022년 혁신 강사상"
                  rows={2}
                  style={{ padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical' }}
                />
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
