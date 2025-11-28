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
}

export default function InstructorsManagementPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    subtitle: '',
    imageUrl: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('region', formData.region);
      submitData.append('subtitle', formData.subtitle);
      submitData.append('education', formData.education);
      submitData.append('certificates', formData.certificates);
      submitData.append('experience', formData.experience);
      submitData.append('awards', formData.awards);
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/instructors`, {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        alert('강사가 등록되었습니다.');
        setShowModal(false);
        setFormData({ name: '', region: '', subtitle: '', imageUrl: '', education: '', certificates: '', experience: '', awards: '' });
        setImageFile(null);
        fetchInstructors();
      } else {
        alert('강사 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('강사 등록 실패:', error);
      alert('강사 등록 중 오류가 발생했습니다.');
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
                      src={instructor.imageUrl} 
                      alt={instructor.name}
                      className={styles.thumbnailImage}
                    />
                  </td>
                  <td>
                    <button className={styles.editButton}>수정</button>
                    <button className={styles.deleteButton}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 강사 등록 모달 */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>강사 등록</h2>
              <button 
                onClick={() => setShowModal(false)}
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
                <label>이미지 *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
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
                  onClick={() => setShowModal(false)}
                  className={styles.cancelButton}
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className={styles.submitButton}
                >
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
