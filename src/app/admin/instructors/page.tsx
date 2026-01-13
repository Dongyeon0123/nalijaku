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
}

export default function InstructorsManagementPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    fetchInstructors();
  }, []);

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
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInstructor(null);
    setFormData({
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
