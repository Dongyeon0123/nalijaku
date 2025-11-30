'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

interface Lesson {
  id: number;
  order: number;
  materials: string;
  description: string;
  pdfUrl?: string;
}

interface Course {
  id: number;
  category: string;
  image: string;
  alt: string;
  instructor: string;
  title: string;
  subtitle: string;
  description?: string;
  price?: number;
  duration?: string;
  level?: string;
  lessons?: Lesson[];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonFormData, setLessonFormData] = useState({ order: 1, materials: '', description: '' });
  const [lessonPdfFile, setLessonPdfFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    image: '',
    alt: '',
    instructor: '',
    title: '',
    subtitle: '',
    description: '',
    price: 0,
    duration: '',
    level: '',
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      // 백엔드에서 강좌 목록 가져오기
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RESOURCES.LIST}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setCourses(result.data);
          // 카테고리 추출
          const categorySet = new Set<string>(result.data.map((c: Course) => c.category));
          setCategories(Array.from(categorySet).sort());
        }
      }
    } catch (error) {
      console.error('강좌 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.modalHeader')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - modalPosition.x,
        y: e.clientY - modalPosition.y,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setModalPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };



  const handleAddCourse = () => {
    setEditingCourse(null);
    setImageFile(null);
    setImagePreview('');
    setFormData({
      category: '',
      image: '',
      alt: '',
      instructor: '',
      title: '',
      subtitle: '',
      description: '',
      price: 0,
      duration: '',
      level: '',
    });
    setShowModal(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setImageFile(null);
    setImagePreview(course.image);
    setFormData({
      category: course.category,
      image: course.image,
      alt: course.alt,
      instructor: course.instructor,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description || '',
      price: course.price || 0,
      duration: course.duration || '',
      level: course.level || '',
    });
    setShowModal(true);
  };

  const handleDeleteCourse = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        // 백엔드에서 강좌 삭제
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RESOURCES.DETAIL(id)}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setCourses(courses.filter(c => c.id !== id));
          alert('강좌가 삭제되었습니다.');
        } else {
          alert('강좌 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('강좌 삭제 실패:', error);
        alert('강좌 삭제에 실패했습니다.');
      }
    }
  };

  // 차시 추가 모달 열기
  const handleAddLesson = () => {
    setEditingLesson(null);
    setLessonFormData({ order: 1, materials: '', description: '' });
    setLessonPdfFile(null);
    setShowLessonModal(true);
  };

  // 차시 저장
  const handleSaveLesson = async (courseId: number) => {
    try {
      if (!lessonFormData.materials || !lessonFormData.description) {
        alert('준비물과 설명을 입력해주세요.');
        return;
      }

      const formData = new FormData();
      formData.append('order', lessonFormData.order.toString());
      formData.append('materials', lessonFormData.materials);
      formData.append('description', lessonFormData.description);
      if (lessonPdfFile) {
        formData.append('pdfFile', lessonPdfFile);
      }

      const method = editingLesson ? 'PUT' : 'POST';
      const endpoint = editingLesson
        ? API_ENDPOINTS.RESOURCES.LESSONS.DETAIL(courseId, editingLesson.order)
        : API_ENDPOINTS.RESOURCES.LESSONS.LIST(courseId);
      const url = `${API_BASE_URL}${endpoint}`;

      console.log('📤 차시 저장 요청:', { method, url, courseId, lessonFormData });

      const response = await fetch(url, {
        method,
        body: formData,
      });

      console.log('📥 차시 저장 응답:', response.status);

      if (response.ok) {
        alert(editingLesson ? '차시가 수정되었습니다.' : '차시가 추가되었습니다.');
        setShowLessonModal(false);
        setLessonFormData({ order: 1, materials: '', description: '' });
        setLessonPdfFile(null);
        loadCourses();
      } else {
        try {
          const errorData = await response.json();
          alert(`차시 저장에 실패했습니다: ${errorData.message || '알 수 없는 오류'}`);
        } catch {
          alert(`차시 저장에 실패했습니다: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('차시 저장 실패:', error);
      alert('차시 저장 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
    }
  };

  // 차시 삭제
  const handleDeleteLesson = async (courseId: number, order: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        const endpoint = API_ENDPOINTS.RESOURCES.LESSONS.DETAIL(courseId, order);
        const url = `${API_BASE_URL}${endpoint}`;

        const response = await fetch(url, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('차시가 삭제되었습니다.');
          loadCourses();
        } else {
          const errorData = await response.json();
          alert(`차시 삭제에 실패했습니다: ${errorData.message || '알 수 없는 오류'}`);
        }
      } catch (error) {
        console.error('차시 삭제 실패:', error);
        alert('차시 삭제 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
      }
    }
  };

  const handleSaveCourse = async () => {
    try {
      setUploading(true);

      // 이미지 처리
      let imageUrl = formData.image;

      if (imageFile) {
        // 새 이미지 파일이 있으면 업로드
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);

        const uploadResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RESOURCES.UPLOAD_IMAGE}`, {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.filePath || uploadResult.data?.filePath || uploadResult.url || uploadResult.data?.url;
        } else {
          alert('이미지 업로드에 실패했습니다.');
          setUploading(false);
          return;
        }
      } else if (!imageUrl && editingCourse) {
        // 수정할 때 이미지가 없으면 기존 이미지 유지
        imageUrl = editingCourse.image;
      } else if (!imageUrl && !editingCourse) {
        // 새로 추가할 때 이미지가 없으면 오류
        alert('이미지를 선택하거나 URL을 입력해주세요.');
        setUploading(false);
        return;
      }

      // JSON 형식으로 요청 데이터 생성
      const requestData = {
        category: formData.category,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        instructor: formData.instructor,
        price: formData.price,
        duration: formData.duration,
        level: formData.level,
        alt: formData.alt,
        image: imageUrl,
      };

      console.log('📤 요청 데이터:', requestData);

      if (editingCourse) {
        // 수정
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RESOURCES.DETAIL(editingCourse.id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });

        const responseData = await response.json();
        console.log('API 응답:', responseData);

        if (response.ok) {
          alert('강좌가 수정되었습니다.');
          loadCourses();
          setShowModal(false);
          setImageFile(null);
          setImagePreview('');
        } else {
          alert(`강좌 수정에 실패했습니다: ${responseData.message || responseData.error || '알 수 없는 오류'}`);
        }
      } else {
        // 추가
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RESOURCES.LIST}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });

        const responseData = await response.json();
        console.log('API 응답:', responseData);

        if (response.ok) {
          alert('강좌가 추가되었습니다.');
          loadCourses();
          setShowModal(false);
          setImageFile(null);
          setImagePreview('');
        } else {
          alert(`강좌 추가에 실패했습니다: ${responseData.message || responseData.error || '알 수 없는 오류'}`);
        }
      }
    } catch (error) {
      console.error('강좌 저장 실패:', error);
      alert('강좌 저장에 실패했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
    } finally {
      setUploading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>강좌관리</h1>
        <p>학습자료 강좌를 관리합니다.</p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="강좌명 또는 강사명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button className={styles.addButton} onClick={handleAddCourse}>
          <FaPlus /> 강좌 추가
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>로딩 중...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>카테고리</th>
                <th>강좌명</th>
                <th>강사</th>
                <th>설명</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <React.Fragment key={course.id}>
                    <tr>
                      <td>{course.id}</td>
                      <td>{course.category}</td>
                      <td>{course.title}</td>
                      <td>{course.instructor}</td>
                      <td>{course.subtitle}</td>
                      <td className={styles.actions}>
                        <button
                          className={styles.expandBtn}
                          onClick={() => setExpandedCourseId(expandedCourseId === course.id ? null : course.id)}
                          title="차시 보기"
                        >
                          {expandedCourseId === course.id ? '▼' : '▶'} 차시
                        </button>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEditCourse(course)}
                          title="수정"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteCourse(course.id)}
                          title="삭제"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                    {expandedCourseId === course.id && (
                      <tr style={{ backgroundColor: '#f9f9f9' }}>
                        <td colSpan={6} style={{ padding: '20px' }}>
                          <div style={{ marginBottom: '16px' }}>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#383838' }}>차시 관리</h4>
                            {course.lessons && course.lessons.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {course.lessons.map((lesson, idx) => (
                                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                                    <div>
                                      <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#383838' }}>{lesson.order}차시</p>
                                      <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#565D6D' }}>준비물: {lesson.materials}</p>
                                      {lesson.description && <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{lesson.description}</p>}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button
                                        onClick={() => {
                                          setEditingLesson(lesson);
                                          setLessonFormData({ order: lesson.order, materials: lesson.materials, description: lesson.description });
                                          setLessonPdfFile(null);
                                          setShowLessonModal(true);
                                        }}
                                        style={{ padding: '6px 12px', backgroundColor: '#E3F2FD', color: '#1976D2', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>수정</button>
                                      <button
                                        onClick={() => handleDeleteLesson(course.id, lesson.order)}
                                        style={{ padding: '6px 12px', backgroundColor: '#FFEBEE', color: '#D32F2F', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>삭제</button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>등록된 차시가 없습니다.</p>
                            )}
                            <button
                              onClick={() => handleAddLesson()}
                              style={{ marginTop: '12px', padding: '8px 16px', backgroundColor: '#04AD74', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>+ 차시 추가</button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={styles.noData}>
                    강좌가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className={styles.modal}>
          <div
            ref={modalRef}
            className={styles.modalContent}
            onMouseDown={handleModalMouseDown}
            style={{
              transform: `translate(${modalPosition.x}px, ${modalPosition.y}px)`,
              cursor: isDragging ? 'grabbing' : 'auto',
            }}
          >
            <div className={styles.modalHeader}>
              <h2>{editingCourse ? '강좌 수정' : '강좌 추가'}</h2>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setShowModal(false)}
                type="button"
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>카테고리</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>강좌명</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="강좌명을 입력하세요"
                />
              </div>
              <div className={styles.formGroup}>
                <label>강사</label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  placeholder="강사명을 입력하세요"
                />
              </div>
              <div className={styles.formGroup}>
                <label>부제목</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="부제목을 입력하세요"
                />
              </div>
              <div className={styles.formGroup}>
                <label>설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="설명을 입력하세요"
                  rows={3}
                />
              </div>
              <div className={styles.formGroup}>
                <label>이미지</label>
                <div style={{ marginBottom: '10px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ marginBottom: '10px' }}
                  />
                </div>
                {imagePreview && (
                  <div style={{ marginBottom: '10px' }}>
                    <img
                      src={imagePreview.startsWith('data:') ? imagePreview : `${API_BASE_URL}${imagePreview}`}
                      alt="미리보기"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                      }}
                      onError={() => {
                        console.error('이미지 로드 실패:', imagePreview);
                      }}
                    />
                  </div>
                )}
                <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
                  또는 이미지 URL을 직접 입력하세요
                </p>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="이미지 URL을 입력하세요"
                />
              </div>
              <div className={styles.formGroup}>
                <label>이미지 설명</label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  placeholder="이미지 설명을 입력하세요"
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>난이도</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  >
                    <option value="">선택</option>
                    <option value="초급">초급</option>
                    <option value="중급">중급</option>
                    <option value="고급">고급</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>시간</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="예: 2시간"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>가격</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className={styles.modalButtons}>
                <button className={styles.cancelBtn} onClick={() => setShowModal(false)} disabled={uploading}>
                  취소
                </button>
                <button className={styles.saveBtn} onClick={handleSaveCourse} disabled={uploading}>
                  {uploading ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 차시 관리 모달 */}
      {showLessonModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingLesson ? '차시 수정' : '차시 추가'}</h3>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setShowLessonModal(false)}
                type="button"
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>차시 번호</label>
                <input
                  type="number"
                  min="1"
                  value={lessonFormData.order}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, order: parseInt(e.target.value) })}
                  placeholder="차시 번호를 입력하세요"
                />
              </div>
              <div className={styles.formGroup}>
                <label>준비물</label>
                <input
                  type="text"
                  value={lessonFormData.materials}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, materials: e.target.value })}
                  placeholder="준비물을 입력하세요"
                />
              </div>
              <div className={styles.formGroup}>
                <label>설명</label>
                <textarea
                  value={lessonFormData.description}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, description: e.target.value })}
                  placeholder="차시 설명을 입력하세요"
                  rows={4}
                />
              </div>
              <div className={styles.formGroup}>
                <label>PDF 파일</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setLessonPdfFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className={styles.formActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowLessonModal(false)}
                  type="button"
                >
                  취소
                </button>
                <button className={styles.saveBtn} onClick={() => {
                  const expandedId = expandedCourseId;
                  if (expandedId) {
                    handleSaveLesson(expandedId);
                  }
                }}>
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
