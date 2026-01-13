'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import api from '@/lib/axios';

interface Lesson {
  id: number;
  order: number;
  materials: string;
  description: string;
  pdfUrl?: string;
  type?: string; // 이론, 실습, 게임
}

interface Course {
  id: number;
  category: string;
  subCategory?: string; // 서브카테고리 추가
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
  const [lessonFormData, setLessonFormData] = useState({ order: 1, materials: '', description: '', type: '이론' });
  const [lessonPdfFile, setLessonPdfFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', parentCategory: '' });
  const [subCategories, setSubCategories] = useState<{ [key: string]: string[] }>({
    '창업': ['배송', '물류', '마케팅'],
    '드론': ['기초', '조종', '촬영', '항공법'],
    'AI': ['머신러닝', '딥러닝', '데이터분석'],
    '환경': ['재활용', '에너지', '생태계']
  });
  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
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
      console.log('🔄 강좌 목록 새로고침 중...');

      // 영어 → 한글 매핑
      const categoryToKorean: { [key: string]: string } = {
        'ALL': '전체',
        'STARTUP': '창업',
        'DRONE': '드론',
        'AI': 'AI',
        'ENVIRONMENT': '환경'
      };

      // Axios 사용 (인증 토큰 자동 포함)
      const response = await api.get('/api/resources');

      console.log('✅ 강좌 목록 로드 성공:', response.data);

      const result = response.data;
      if (result.success && result.data) {
        // 카테고리를 한글로 변환
        const coursesWithKoreanCategory = result.data.map((course: Course) => ({
          ...course,
          category: categoryToKorean[course.category] || course.category
        }));
        
        setCourses(coursesWithKoreanCategory);

        // 각 강좌의 차시 정보 로깅
        coursesWithKoreanCategory.forEach((course: Course) => {
          if (course.lessons && course.lessons.length > 0) {
            console.log(`📚 강좌 "${course.title}" 차시 목록:`, course.lessons);
            course.lessons.forEach((lesson: Lesson) => {
              console.log(`  - ${lesson.order}차시:`, {
                materials: lesson.materials,
                description: lesson.description,
                pdfUrl: lesson.pdfUrl || '없음',
              });
            });
          }
        });
      }

      // 카테고리는 별도 API에서 가져오기
      try {
        const categoriesResponse = await api.get('/api/resources/categories');
        console.log('✅ 카테고리 로드 성공:', categoriesResponse.data);
        
        if (Array.isArray(categoriesResponse.data)) {
          // "전체" 제외하고 나머지만 사용
          const filteredCategories = categoriesResponse.data.filter((cat: string) => cat !== '전체');
          setCategories(filteredCategories);
        } else if (categoriesResponse.data.data && Array.isArray(categoriesResponse.data.data)) {
          // "전체" 제외하고 나머지만 사용
          const filteredCategories = categoriesResponse.data.data.filter((cat: string) => cat !== '전체');
          setCategories(filteredCategories);
        } else {
          // 카테고리 API 실패 시 기본값 ("전체" 제외)
          setCategories(['창업', '드론', 'AI', '환경']);
        }
      } catch (categoryError) {
        console.error('❌ 카테고리 로드 실패:', categoryError);
        // 카테고리 API 실패 시 기본값 ("전체" 제외)
        setCategories(['창업', '드론', 'AI', '환경']);
      }
    } catch (error: any) {
      console.error('❌ 강좌 로드 실패:', error);
      if (error.response?.status === 401) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/';
      }
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

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging) {
      setModalPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  }, [isDragging, dragOffset]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

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
      subCategory: '',
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
      subCategory: course.subCategory || '',
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
        // Axios 사용 (인증 토큰 자동 포함)
        await api.delete(`/api/resources/${id}`);
        setCourses(courses.filter(c => c.id !== id));
        alert('강좌가 삭제되었습니다.');
      } catch (error) {
        console.error('강좌 삭제 실패:', error);
        alert('강좌 삭제에 실패했습니다.');
      }
    }
  };

  // 차시 추가 모달 열기
  const handleAddLesson = () => {
    setEditingLesson(null);
    setLessonFormData({ order: 1, materials: '', description: '', type: '이론' });
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

      // PDF 파일 크기 체크 (100MB 제한)
      if (lessonPdfFile && lessonPdfFile.size > 100 * 1024 * 1024) {
        const sizeMB = (lessonPdfFile.size / (1024 * 1024)).toFixed(2);
        alert(`PDF 파일 크기가 100MB를 초과합니다. (현재: ${sizeMB}MB)`);
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('order', lessonFormData.order.toString());
      formData.append('materials', lessonFormData.materials);
      formData.append('description', lessonFormData.description);
      formData.append('type', lessonFormData.type || '이론');

      console.log('📋 FormData 구성:');
      console.log('  - order:', lessonFormData.order);
      console.log('  - materials:', lessonFormData.materials);
      console.log('  - type:', lessonFormData.type);
      console.log('  - description:', lessonFormData.description);

      if (lessonPdfFile) {
        formData.append('pdfFile', lessonPdfFile);
        console.log('📄 PDF 파일 정보:');
        console.log('  - 파일명:', lessonPdfFile.name);
        console.log('  - 파일 크기:', (lessonPdfFile.size / (1024 * 1024)).toFixed(2), 'MB');
        console.log('  - 파일 타입:', lessonPdfFile.type);
      } else {
        console.log('⚠️ PDF 파일 없음');
      }

      const method = editingLesson ? 'PUT' : 'POST';
      const url = editingLesson
        ? `/api/resources/${courseId}/lessons/${editingLesson.order}`
        : `/api/resources/${courseId}/lessons`;
      const fullUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.nallijaku.com'}${url}`;

      console.log('📤 차시 저장 요청:');
      console.log('  - 메서드:', method);
      console.log('  - URL:', fullUrl);
      console.log('  - 강좌 ID:', courseId);
      console.log('  - 편집 모드:', editingLesson ? '수정' : '신규');

      // XMLHttpRequest를 사용하여 진행률 추적
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
          console.log(`📊 업로드 진행률: ${Math.round(percentComplete)}%`);
        }
      });

      xhr.addEventListener('load', async () => {
        console.log('업로드 완료');
        console.log('응답 상태:', xhr.status, xhr.statusText);
        console.log('응답 본문:', xhr.responseText);
        console.log('응답 헤더:', {
          'Content-Type': xhr.getResponseHeader('Content-Type'),
        });

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const responseData = JSON.parse(xhr.responseText);
            console.log('파싱된 응답 데이터:', responseData);
            console.log('저장된 PDF URL:', responseData.pdfUrl || responseData.data?.pdfUrl || '없음');

            alert(editingLesson ? '차시가 수정되었습니다.' : '차시가 추가되었습니다.');
            setShowLessonModal(false);
            setLessonFormData({ order: 1, materials: '', description: '', type: '이론' });
            setLessonPdfFile(null);
            setUploadProgress(0);
            loadCourses();
          } catch (parseError) {
            console.error('응답 파싱 실패:', parseError);
            alert('차시가 저장되었으나 응답 처리 중 오류가 발생했습니다.');
            loadCourses();
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            console.error('백엔드 에러:', errorData);
            alert(`차시 저장에 실패했습니다: ${errorData.message || '알 수 없는 오류'}`);
          } catch {
            console.error('응답 파싱 실패:', xhr.statusText);
            alert(`차시 저장에 실패했습니다: ${xhr.statusText}`);
          }
        }
        setIsUploading(false);
      });

      xhr.addEventListener('error', () => {
        console.error('❌ 업로드 실패:', xhr.statusText);
        alert('차시 저장 중 오류가 발생했습니다.');
        setIsUploading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener('abort', () => {
        console.error('❌ 업로드 취소됨');
        alert('업로드가 취소되었습니다.');
        setIsUploading(false);
        setUploadProgress(0);
      });

      // 타임아웃 설정 (5분)
      xhr.timeout = 5 * 60 * 1000;
      xhr.addEventListener('timeout', () => {
        console.error('❌ 업로드 타임아웃');
        alert('업로드 시간이 초과되었습니다. 파일 크기를 확인해주세요.');
        setIsUploading(false);
        setUploadProgress(0);
      });

      xhr.open(method, fullUrl);
      xhr.setRequestHeader('Accept', 'application/json');
      
      // 인증 토큰 추가
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      }
      
      xhr.withCredentials = true;
      xhr.send(formData);
    } catch (error) {
      console.error('❌ 차시 저장 실패:', error);
      const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류';
      alert('차시 저장 중 오류가 발생했습니다: ' + errorMsg);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // 차시 삭제
  const handleDeleteLesson = async (courseId: number, order: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        // Axios 사용 (인증 토큰 자동 포함)
        await api.delete(`/api/resources/${courseId}/lessons/${order}`);
        alert('차시가 삭제되었습니다.');
        loadCourses();
      } catch (error: any) {
        console.error('차시 삭제 실패:', error);
        const errorMsg = error.response?.data?.message || error.message || '알 수 없는 오류';
        alert(`차시 삭제 중 오류가 발생했습니다: ${errorMsg}`);
      }
    }
  };

  const handleSaveCourse = async () => {
    try {
      setUploading(true);

      // 카테고리 한글 → 영어 매핑
      const categoryMap: { [key: string]: string } = {
        '전체': 'ALL',
        '창업': 'STARTUP',
        '드론': 'DRONE',
        'AI': 'AI',
        '환경': 'ENVIRONMENT'
      };

      const englishCategory = categoryMap[formData.category] || formData.category;

      if (editingCourse) {
        // 수정 - JSON 형식으로 전송 (기존 방식 유지)
        let imageUrl = formData.image;

        if (imageFile) {
          // 새 이미지 파일이 있으면 업로드
          const uploadFormData = new FormData();
          uploadFormData.append('file', imageFile);

          const uploadResponse = await api.post('/api/resources/upload-image', uploadFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          const uploadResult = uploadResponse.data;
          imageUrl = uploadResult.filePath || uploadResult.data?.filePath || uploadResult.url || uploadResult.data?.url;
        } else if (!imageUrl) {
          imageUrl = editingCourse.image;
        }

        const requestData = {
          category: englishCategory,
          subCategory: formData.subCategory || '',
          title: formData.title,
          subtitle: formData.subtitle,
          description: formData.description,
          instructor: formData.instructor,
          price: Number(formData.price) || 0,
          duration: formData.duration,
          level: formData.level,
          alt: formData.alt,
          image: imageUrl,
        };

        console.log('📤 수정 요청 데이터:', requestData);
        const response = await api.put(`/api/resources/${editingCourse.id}`, requestData);
        console.log('API 응답:', response.data);
        alert('강좌가 수정되었습니다.');
      } else {
        // 추가 - multipart/form-data 형식으로 전송
        if (!imageFile && !formData.image) {
          alert('이미지를 선택하거나 URL을 입력해주세요.');
          setUploading(false);
          return;
        }

        const multipartFormData = new FormData();
        multipartFormData.append('category', formData.category); // 한글 카테고리 그대로 전송
        if (formData.subCategory) {
          multipartFormData.append('subCategory', formData.subCategory);
        }
        multipartFormData.append('title', formData.title);
        multipartFormData.append('subtitle', formData.subtitle);
        multipartFormData.append('description', formData.description || '');
        multipartFormData.append('instructor', formData.instructor);
        multipartFormData.append('price', String(Number(formData.price) || 0));
        multipartFormData.append('duration', formData.duration || '');
        multipartFormData.append('level', formData.level || '');
        multipartFormData.append('alt', formData.alt || '');
        
        if (imageFile) {
          multipartFormData.append('file', imageFile);
        } else if (formData.image) {
          multipartFormData.append('imageUrl', formData.image);
        }

        console.log('📤 추가 요청 (multipart/form-data)');
        const response = await api.post('/api/resources', multipartFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('API 응답:', response.data);
        alert('강좌가 추가되었습니다.');
      }

      loadCourses();
      setShowModal(false);
      setImageFile(null);
      setImagePreview('');
    } catch (error: any) {
      console.error('강좌 저장 실패:', error);
      console.error('에러 응답:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || '알 수 없는 오류';
      
      if (error.response?.data) {
        console.error('상세 에러:', JSON.stringify(error.response.data, null, 2));
      }
      
      alert(`강좌 저장에 실패했습니다: ${errorMsg}`);
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={styles.categoryButton} 
            onClick={() => setShowCategoryModal(true)}
            style={{ 
              backgroundColor: '#6366F1', 
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaPlus /> 카테고리 관리
          </button>
          <button className={styles.addButton} onClick={handleAddCourse}>
            <FaPlus /> 강좌 추가
          </button>
        </div>
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
                <th>서브카테고리</th>
                <th>강좌명</th>
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
                      <td>{course.subCategory || '-'}</td>
                      <td>{course.title}</td>
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
                                {course.lessons.map((lesson, idx) => {
                                  const typeColors: { [key: string]: { bg: string; text: string } } = {
                                    '이론': { bg: '#E1BEE7', text: '#6A1B9A' },
                                    '실습': { bg: '#C8E6C9', text: '#2E7D32' },
                                    '게임': { bg: '#FFF9C4', text: '#F57F17' }
                                  };
                                  const typeColor = typeColors[lesson.type || '이론'] || typeColors['이론'];
                                  
                                  return (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e0e0e0', position: 'relative' }}>
                                      <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                          <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#383838' }}>{lesson.order}차시</p>
                                          <span style={{ 
                                            padding: '2px 8px', 
                                            backgroundColor: typeColor.bg, 
                                            color: typeColor.text, 
                                            borderRadius: '4px', 
                                            fontSize: '11px', 
                                            fontWeight: '600' 
                                          }}>
                                            {lesson.type || '이론'}
                                          </span>
                                        </div>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#565D6D' }}>준비물: {lesson.materials}</p>
                                        {lesson.description && <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{lesson.description}</p>}
                                      </div>
                                      <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                          onClick={() => {
                                            setEditingLesson(lesson);
                                            setLessonFormData({ order: lesson.order, materials: lesson.materials, description: lesson.description, type: lesson.type || '이론' });
                                            setLessonPdfFile(null);
                                            setShowLessonModal(true);
                                          }}
                                          style={{ padding: '6px 12px', backgroundColor: '#E3F2FD', color: '#1976D2', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>수정</button>
                                        <button
                                          onClick={() => handleDeleteLesson(course.id, lesson.order)}
                                          style={{ padding: '6px 12px', backgroundColor: '#FFEBEE', color: '#D32F2F', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>삭제</button>
                                      </div>
                                    </div>
                                  );
                                })}
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
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, subCategory: '' })}
                >
                  <option value="">선택하세요</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              {formData.category && subCategories[formData.category] && subCategories[formData.category].length > 0 && (
                <div className={styles.formGroup}>
                  <label>서브카테고리</label>
                  <select
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  >
                    <option value="">선택하세요 (선택사항)</option>
                    {subCategories[formData.category].map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
                      src={imagePreview.startsWith('data:') ? imagePreview : (imagePreview.startsWith('http') ? imagePreview : `https://api.nallijaku.com${imagePreview}`)}
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
                <label>차시 타입</label>
                <select
                  value={lessonFormData.type}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, type: e.target.value })}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="이론">이론</option>
                  <option value="실습">실습</option>
                  <option value="게임">게임</option>
                </select>
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
                {editingLesson && editingLesson.pdfUrl && (
                  <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#E8F5E9', borderRadius: '6px', border: '1px solid #4CAF50' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#2E7D32' }}>
                      📄 현재 PDF 파일
                    </p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#555' }}>
                      {editingLesson.pdfUrl.split('/').pop()}
                    </p>
                    <a
                      href={`https://api.nallijaku.com${editingLesson.pdfUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        borderRadius: '4px',
                        fontSize: '12px',
                        textDecoration: 'none',
                        fontWeight: '600',
                      }}
                    >
                      다운로드
                    </a>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setLessonPdfFile(e.target.files?.[0] || null)}
                  disabled={isUploading}
                />
                <p style={{ fontSize: '12px', color: '#999', margin: '8px 0 0 0' }}>
                  {editingLesson && editingLesson.pdfUrl ? '새 파일을 선택하면 기존 파일이 대체됩니다.' : ''}
                </p>
                {lessonPdfFile && (
                  <p style={{ fontSize: '12px', color: '#1976D2', margin: '8px 0 0 0', fontWeight: '600' }}>
                    ✓ 새 파일 선택됨: {lessonPdfFile.name} ({(lessonPdfFile.size / (1024 * 1024)).toFixed(2)}MB)
                  </p>
                )}
              </div>
              {isUploading && (
                <div className={styles.formGroup}>
                  <label>업로드 진행률</label>
                  <div style={{ width: '100%', height: '24px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        backgroundColor: '#04AD74',
                        transition: 'width 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {uploadProgress > 10 && `${uploadProgress}%`}
                    </div>
                  </div>
                </div>
              )}
              <div className={styles.formActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowLessonModal(false)}
                  type="button"
                  disabled={isUploading}
                >
                  취소
                </button>
                <button
                  className={styles.saveBtn}
                  onClick={() => {
                    const expandedId = expandedCourseId;
                    if (expandedId) {
                      handleSaveLesson(expandedId);
                    }
                  }}
                  disabled={isUploading}
                >
                  {isUploading ? `업로드 중... ${uploadProgress}%` : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 카테고리 관리 모달 */}
      {showCategoryModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: '800px' }}>
            <div className={styles.modalHeader}>
              <h3>카테고리 관리</h3>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setShowCategoryModal(false)}
                type="button"
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              {/* 카테고리 추가 폼 */}
              <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>새 카테고리 추가</h4>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#555' }}>
                      카테고리 타입
                    </label>
                    <select
                      value={categoryFormData.parentCategory}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, parentCategory: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
                    >
                      <option value="">메인 카테고리</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}의 서브카테고리
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#555' }}>
                      카테고리명
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.name}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                      placeholder="카테고리 이름 입력"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!categoryFormData.name) {
                        alert('카테고리명을 입력해주세요.');
                        return;
                      }
                      
                      if (categoryFormData.parentCategory) {
                        // 서브카테고리 추가
                        const newSubCategories = { ...subCategories };
                        if (!newSubCategories[categoryFormData.parentCategory]) {
                          newSubCategories[categoryFormData.parentCategory] = [];
                        }
                        newSubCategories[categoryFormData.parentCategory].push(categoryFormData.name);
                        setSubCategories(newSubCategories);
                        alert(`"${categoryFormData.parentCategory}"의 서브카테고리 "${categoryFormData.name}"이(가) 추가되었습니다.`);
                      } else {
                        // 메인 카테고리 추가
                        setCategories([...categories, categoryFormData.name]);
                        alert(`메인 카테고리 "${categoryFormData.name}"이(가) 추가되었습니다.`);
                      }
                      
                      setCategoryFormData({ name: '', parentCategory: '' });
                    }}
                    style={{
                      padding: '9px 15px',
                      backgroundColor: '#6366F1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      marginLeft: '10px',
                    }}
                  >
                    추가
                  </button>
                </div>
              </div>

              {/* 현재 카테고리 목록 */}
              <div>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>현재 카테고리</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {categories.map((category) => (
                    <div key={category} style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#333' }}>{category}</h5>
                        <button
                          onClick={() => {
                            if (confirm(`"${category}" 카테고리를 삭제하시겠습니까?`)) {
                              setCategories(categories.filter(c => c !== category));
                              // 서브카테고리도 삭제
                              const newSubCategories = { ...subCategories };
                              delete newSubCategories[category];
                              setSubCategories(newSubCategories);
                              alert('카테고리가 삭제되었습니다.');
                            }
                          }}
                          style={{
                            padding: '4px 12px',
                            backgroundColor: '#FFEBEE',
                            color: '#D32F2F',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          삭제
                        </button>
                      </div>
                      
                      {/* 서브카테고리 목록 */}
                      {subCategories[category] && subCategories[category].length > 0 && (
                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
                          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: '600' }}>서브카테고리:</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {subCategories[category].map((sub, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '4px 10px',
                                  backgroundColor: '#E3F2FD',
                                  color: '#1976D2',
                                  borderRadius: '16px',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}
                              >
                                <span>{sub}</span>
                                <button
                                  onClick={() => {
                                    if (confirm(`"${sub}" 서브카테고리를 삭제하시겠습니까?`)) {
                                      const newSubCategories = { ...subCategories };
                                      newSubCategories[category] = newSubCategories[category].filter(s => s !== sub);
                                      setSubCategories(newSubCategories);
                                      alert('서브카테고리가 삭제되었습니다.');
                                    }
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#1976D2',
                                    cursor: 'pointer',
                                    padding: '0',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#FFF9C4', borderRadius: '6px', border: '1px solid #FBC02D' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#F57F17' }}>
                  <span style={{fontSize: '18px'}}>💡</span> <strong>참고:</strong> 카테고리 타입에서 부카테고리를 넣고싶은 카테고리를 선택 후, 이름을 입력하고 추가하면 됨.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
