'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaGripVertical } from 'react-icons/fa';
import api from '@/lib/axios';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Lesson {
  id: number;
  order: number;
  title: string; // 차시 제목으로 변경
  description: string;
  pdfUrl?: string;
  type?: string; // 이론, 실습, 게임
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
  courseId?: number; // 속한 코스 ID
}

// 드래그 가능한 행 컴포넌트
function SortableRow({ course, onEdit, onDelete, onExpand, isExpanded, coursesList }: {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
  onExpand: (id: number) => void;
  isExpanded: boolean;
  coursesList: any[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: course.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? '#f0f0f0' : 'transparent',
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'grab' }} {...attributes} {...listeners}>
          <FaGripVertical style={{ color: '#999' }} />
          {course.id}
        </div>
      </td>
      <td>
        {course.courseId ? (
          (() => {
            const courseName = coursesList.find(c => c.id === course.courseId)?.title;
            return courseName ? (
              <span style={{ 
                padding: '4px 8px', 
                backgroundColor: '#E3F2FD', 
                color: '#1976D2', 
                borderRadius: '4px', 
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {courseName}
              </span>
            ) : (
              <span style={{ 
                padding: '4px 8px', 
                backgroundColor: '#FFF3E0', 
                color: '#E65100', 
                borderRadius: '4px', 
                fontSize: '12px',
                fontWeight: '600'
              }}>
                코스 #{course.courseId}
              </span>
            );
          })()
        ) : (
          <span style={{ color: '#999', fontSize: '12px' }}>독립 강좌</span>
        )}
      </td>
      <td>{course.category}</td>
      <td>{course.title}</td>
      <td>{course.subtitle}</td>
      <td className={styles.actions}>
        <button
          className={styles.expandBtn}
          onClick={() => onExpand(course.id)}
          title="차시 보기"
        >
          {isExpanded ? '▼' : '▶'} 차시
        </button>
        <button
          className={styles.editBtn}
          onClick={() => onEdit(course)}
          title="수정"
        >
          <FaEdit />
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(course.id)}
          title="삭제"
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
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
  const [categoryMap, setCategoryMap] = useState<{ [name: string]: number }>({}); // 이름 -> ID 매핑
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonFormData, setLessonFormData] = useState({ order: 1, title: '', description: '', type: '이론' });
  const [lessonPdfFile, setLessonPdfFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', parentCategory: '' });
  const [showCourseManagementModal, setShowCourseManagementModal] = useState(false);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    description: '',
    category: '',
    thumbnail: null as File | null,
    difficulty: '',
    duration: ''
  });
  const [coursesList, setCoursesList] = useState<any[]>([]);

  // 코스 관리 모달이 열릴 때 코스 목록 로드
  useEffect(() => {
    if (showCourseManagementModal) {
      loadCoursesForManagement();
    }
  }, [showCourseManagementModal]);
  const [formData, setFormData] = useState({
    category: '',
    image: '',
    alt: '',
    title: '',
    subtitle: '',
    description: '',
    price: 0,
    duration: '',
    level: '',
    courseId: 0, // 속한 코스 ID (0은 독립 강좌)
  });

  // 드래그 앤 드롭 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 백엔드에 순서 저장
  const saveOrderToBackend = async (orderedCourses: Course[]) => {
    try {
      const orders = orderedCourses.map((course, index) => ({
        id: course.id,
        order: index + 1  // 백엔드 API 스펙에 맞춤
      }));

      await api.patch('/api/resources/reorder', { orders });
      console.log('✅ 순서가 저장되었습니다');
    } catch (error: any) {
      console.error('❌ 순서 저장 실패:', error);
      alert('순서 저장에 실패했습니다. 백엔드 API를 확인해주세요.');
    }
  };

  // 드래그 종료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCourses((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // 백엔드에 순서 변경 저장
        saveOrderToBackend(newOrder);
        
        return newOrder;
      });
    }
  };

  useEffect(() => {
    loadCourses();
    loadCoursesForManagement(); // 코스 목록 미리 로드
  }, []);

  const handleCreateCourse = async () => {
    try {
      // 필수 필드 검증
      if (!courseFormData.title || !courseFormData.category || !courseFormData.thumbnail) {
        alert('제목, 카테고리, 썸네일 이미지는 필수 항목입니다.');
        return;
      }

      const formData = new FormData();
      formData.append('title', courseFormData.title);
      formData.append('description', courseFormData.description);
      formData.append('category', courseFormData.category);
      formData.append('thumbnail', courseFormData.thumbnail);
      if (courseFormData.difficulty) {
        formData.append('difficulty', courseFormData.difficulty);
      }
      if (courseFormData.duration) {
        formData.append('duration', courseFormData.duration);
      }

      console.log('코스 생성 요청:', {
        title: courseFormData.title,
        category: courseFormData.category,
        description: courseFormData.description,
        difficulty: courseFormData.difficulty,
        duration: courseFormData.duration
      });

      const response = await api.post('/api/admin/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('코스 생성 성공:', response.data);
      alert('코스가 생성되었습니다!');

      // 폼 초기화
      setCourseFormData({
        title: '',
        description: '',
        category: '',
        thumbnail: null,
        difficulty: '',
        duration: ''
      });

      // 코스 목록 새로고침
      loadCoursesForManagement();
    } catch (error: any) {
      console.error('코스 생성 실패:', error);
      const errorMsg = error.response?.data?.message || error.message || '코스 생성에 실패했습니다.';
      alert(`코스 생성 실패\n\n${errorMsg}`);
    }
  };

  const loadCoursesForManagement = async () => {
    try {
      const response = await api.get('/api/courses');
      const result = response.data;
      const coursesArray = result.success ? (result.data.courses || result.data) : result;
      setCoursesList(coursesArray);
    } catch (error) {
      console.error('코스 목록 로드 실패:', error);
    }
  };

  const loadCourses = async () => {
    try {
      setLoading(true);

      // Axios 사용 (인증 토큰 자동 포함)
      const response = await api.get('/api/resources');

      const result = response.data;
      if (result.success && result.data) {
        // 백엔드가 이제 한글 카테고리를 반환하므로 변환 불필요
        console.log('📚 강좌 목록 로드 완료:', result.data.length, '개');
        console.log('📚 첫 번째 강좌 courseId:', result.data[0]?.courseId);
        setCourses(result.data);
      }

      // 카테고리는 별도 API에서 가져오기
      try {
        // 새로운 계층형 카테고리 API 사용
        const categoriesResponse = await api.get('/api/categories');
        
        if (categoriesResponse.data.success && categoriesResponse.data.data?.categories) {
          const categoryData = categoriesResponse.data.data.categories;
          
          // 메인 카테고리 추출 ("전체" 제외)
          const mainCategories = categoryData
            .filter((cat: any) => cat.name !== '전체')
            .map((cat: any) => cat.name);
          setCategories(mainCategories);
          
          // 카테고리 이름 -> ID 매핑 생성
          const nameToIdMap: { [name: string]: number } = {};
          categoryData.forEach((cat: any) => {
            nameToIdMap[cat.name] = cat.id;
          });
          setCategoryMap(nameToIdMap);
        } else if (Array.isArray(categoriesResponse.data)) {
          // 이전 형식 호환
          const filteredCategories = categoriesResponse.data.filter((cat: string) => cat !== '전체');
          setCategories(filteredCategories);
        } else if (categoriesResponse.data.data && Array.isArray(categoriesResponse.data.data)) {
          const filteredCategories = categoriesResponse.data.data.filter((cat: string) => cat !== '전체');
          setCategories(filteredCategories);
        } else {
          // 카테고리 API 실패 시 빈 배열
          setCategories([]);
        }
      } catch (categoryError) {
        console.error('카테고리 로드 실패:', categoryError);
        // 카테고리 API 실패 시 빈 배열
        setCategories([]);
      }
    } catch (error: any) {
      console.error('강좌 로드 실패:', error);
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



  const handleAddCourse = async () => {
    setEditingCourse(null);
    setImageFile(null);
    setImagePreview('');
    setFormData({
      category: '',
      image: '',
      alt: '',
      title: '',
      subtitle: '',
      description: '',
      price: 0,
      duration: '',
      level: '',
      courseId: 0,
    });
    
    // 코스 목록 로드
    await loadCoursesForManagement();
    setShowModal(true);
  };

  const handleEditCourse = async (course: Course) => {
    setEditingCourse(course);
    setImageFile(null);
    setImagePreview(course.image);
    setFormData({
      category: course.category,
      image: course.image,
      alt: course.alt,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description || '',
      price: course.price || 0,
      duration: course.duration || '',
      level: course.level || '',
      courseId: course.courseId || 0,
    });
    
    // 코스 목록 로드
    await loadCoursesForManagement();
    setShowModal(true);
  };

  const handleDeleteCourse = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        // Axios 사용 (인증 토큰 자동 포함)
        await api.delete(`/api/resources/${id}`);
        
        // 목록에서 즉시 제거
        setCourses(courses.filter(c => c.id !== id));
        
        alert('강좌가 삭제되었습니다.');
        
        // 목록 새로고침 (서버에서 최신 데이터 가져오기)
        await loadCourses();
      } catch (error: any) {
        console.error('강좌 삭제 실패:', error);
        
        if (error.response?.status === 404) {
          // 404 에러: 백엔드 API가 구현되지 않았거나 이미 삭제된 경우
          console.warn('백엔드 DELETE API가 구현되지 않았거나 강좌를 찾을 수 없습니다.');
          alert('⚠️ 백엔드 삭제 API가 아직 구현되지 않았습니다.\n프론트엔드에서만 목록에서 제거합니다.');
          // 목록에서 제거
          setCourses(courses.filter(c => c.id !== id));
        } else if (error.response?.status === 403) {
          alert('강좌를 삭제할 권한이 없습니다.');
        } else if (error.response?.status === 401) {
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/';
        } else if (error.response?.status === 409 || error.message?.includes('foreign key constraint')) {
          // 외래 키 제약 조건 에러
          alert('⚠️ 이 강좌는 강사와 연결되어 있어 삭제할 수 없습니다.\n\n백엔드 개발자에게 다음을 요청하세요:\n1. instructor_courses 테이블에서 관련 레코드를 먼저 삭제\n2. 또는 CASCADE 삭제 설정');
        } else {
          const errorMsg = error.response?.data?.message || error.message || '강좌 삭제에 실패했습니다.';
          
          // 외래 키 제약 조건 에러 메시지 감지
          if (errorMsg.includes('foreign key constraint') || errorMsg.includes('Cannot delete or update a parent row')) {
            alert('⚠️ 이 강좌는 다른 데이터(강사 등)와 연결되어 있어 삭제할 수 없습니다.\n\n해결 방법:\n1. 연결된 강사를 먼저 제거하거나\n2. 백엔드에서 CASCADE 삭제를 설정해야 합니다.');
          } else {
            alert(`강좌 삭제에 실패했습니다: ${errorMsg}`);
          }
        }
      }
    }
  };

  // 차시 추가 모달 열기
  const handleAddLesson = () => {
    setEditingLesson(null);
    setLessonFormData({ order: 1, title: '', description: '', type: '이론' });
    setLessonPdfFile(null);
    setShowLessonModal(true);
  };

  // 차시 저장
  const handleSaveLesson = async (courseId: number) => {
    try {
      if (!lessonFormData.title || !lessonFormData.description) {
        alert('차시 제목과 설명을 입력해주세요.');
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
      formData.append('title', lessonFormData.title);
      formData.append('materials', lessonFormData.title); // 백엔드 호환성을 위해 추가
      formData.append('description', lessonFormData.description);
      formData.append('type', lessonFormData.type || '이론');

      console.log('FormData 구성:');
      console.log('  - order:', lessonFormData.order);
      console.log('  - title:', lessonFormData.title);
      console.log('  - type:', lessonFormData.type);
      console.log('  - description:', lessonFormData.description);

      if (lessonPdfFile) {
        formData.append('pdfFile', lessonPdfFile);
        console.log('PDF 파일 정보:');
        console.log('  - 파일명:', lessonPdfFile.name);
        console.log('  - 파일 크기:', (lessonPdfFile.size / (1024 * 1024)).toFixed(2), 'MB');
        console.log('  - 파일 타입:', lessonPdfFile.type);
      } else {
        console.log('PDF 파일 없음');
      }

      const method = editingLesson ? 'PUT' : 'POST';
      const url = editingLesson
        ? `/api/resources/${courseId}/lessons/${editingLesson.order}`
        : `/api/resources/${courseId}/lessons`;
      const fullUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.nallijaku.com'}${url}`;

      console.log('차시 저장 요청:');
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
          console.log(`업로드 진행률: ${Math.round(percentComplete)}%`);
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
            setLessonFormData({ order: 1, title: '', description: '', type: '이론' });
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
        console.error('업로드 실패:', xhr.statusText);
        alert('차시 저장 중 오류가 발생했습니다.');
        setIsUploading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener('abort', () => {
        console.error('업로드 취소됨');
        alert('업로드가 취소되었습니다.');
        setIsUploading(false);
        setUploadProgress(0);
      });

      // 타임아웃 설정 (5분)
      xhr.timeout = 5 * 60 * 1000;
      xhr.addEventListener('timeout', () => {
        console.error('업로드 타임아웃');
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
      console.error('차시 저장 실패:', error);
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

      if (editingCourse) {
        // 수정 - JSON 형식으로 전송
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
          category: formData.category, // 한글 카테고리 이름 그대로 전송
          title: formData.title,
          subtitle: formData.subtitle,
          description: formData.description,
          instructor: '날리자쿠', // 기본값
          price: Number(formData.price) || 0,
          duration: formData.duration,
          level: formData.level,
          alt: formData.alt,
          image: imageUrl,
          courseId: formData.courseId === 0 ? null : (formData.courseId || null), // 코스 ID (0이면 null로 전송)
        };

        console.log('강좌 수정 요청 데이터:', requestData);
        console.log('  - 카테고리:', requestData.category);
        console.log('  - 코스 ID:', formData.courseId, '→', requestData.courseId || '독립 강좌');
        const response = await api.put(`/api/resources/${editingCourse.id}`, requestData);
        console.log('강좌 수정 API 응답:', response.data);
        console.log('  - 응답 데이터의 courseId:', response.data?.data?.courseId);
        
        // 백엔드 응답에 courseId가 없으면 로컬 상태를 직접 업데이트 (낙관적 업데이트)
        if (!response.data?.data?.courseId && formData.courseId) {
          console.log('⚠️ 백엔드 응답에 courseId가 없습니다. 로컬 상태를 직접 업데이트합니다.');
          setCourses(courses.map(c => 
            c.id === editingCourse.id 
              ? { ...c, courseId: formData.courseId }
              : c
          ));
        }
        
        alert('강좌가 수정되었습니다.');
        
        // 목록 새로고침 전 로그
        console.log('🔄 강좌 목록 새로고침 시작...');
      } else {
        // 추가 - multipart/form-data 형식으로 전송
        if (!imageFile && !formData.image) {
          alert('이미지를 선택하거나 URL을 입력해주세요.');
          setUploading(false);
          return;
        }

        // 카테고리 ID 찾기
        const categoryId = categoryMap[formData.category];
        if (!categoryId) {
          alert('카테고리를 선택해주세요.');
          setUploading(false);
          return;
        }

        const multipartFormData = new FormData();
        multipartFormData.append('categoryId', String(categoryId)); // 카테고리 ID 전송
        multipartFormData.append('title', formData.title);
        multipartFormData.append('subtitle', formData.subtitle);
        multipartFormData.append('description', formData.description || '');
        multipartFormData.append('instructor', '날리자쿠'); // 기본값
        multipartFormData.append('price', String(Number(formData.price) || 0));
        multipartFormData.append('duration', formData.duration || '1시간');
        multipartFormData.append('level', formData.level || '초급');
        multipartFormData.append('alt', formData.alt || '');
        
        // 코스 ID 추가 (0이 아닌 경우에만)
        if (formData.courseId && formData.courseId > 0) {
          multipartFormData.append('courseId', String(formData.courseId));
        }
        
        if (imageFile) {
          multipartFormData.append('file', imageFile);
        } else if (formData.image) {
          multipartFormData.append('imageUrl', formData.image);
        }

        console.log('강좌 추가 요청 (multipart/form-data)');
        console.log('  - 카테고리 ID:', categoryId);
        console.log('  - 카테고리 이름:', formData.category);
        console.log('  - 코스 ID (formData):', formData.courseId);
        console.log('  - 코스 ID (전송):', formData.courseId && formData.courseId > 0 ? formData.courseId : '독립 강좌');
        const response = await api.post('/api/resources', multipartFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('강좌 추가 API 응답:', response.data);
        alert('강좌가 추가되었습니다.');
      }

      // 목록 새로고침
      await loadCourses();
      setShowModal(false);
      setImageFile(null);
      setImagePreview('');
    } catch (error: any) {
      console.error('강좌 저장 실패:', error);
      console.error('  - 에러 응답:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || '알 수 없는 오류';
      
      if (error.response?.data) {
        console.error('  - 상세 에러:', JSON.stringify(error.response.data, null, 2));
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
          <button 
            className={styles.addButton}
            onClick={() => setShowCourseManagementModal(true)}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
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
            <FaPlus /> 코스 관리
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>소속 코스</th>
                  <th>카테고리</th>
                  <th>제목</th>
                  <th>부제목</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                <SortableContext
                  items={filteredCourses.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <React.Fragment key={course.id}>
                        <SortableRow
                          course={course}
                          onEdit={handleEditCourse}
                          onDelete={handleDeleteCourse}
                          onExpand={(id) => setExpandedCourseId(expandedCourseId === id ? null : id)}
                          isExpanded={expandedCourseId === course.id}
                          coursesList={coursesList}
                        />
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
                                        '게임': { bg: '#FFF9C4', text: '#F57F17' },
                                        '토론': { bg: '#B3E5FC', text: '#01579B' },
                                        '수료증': { bg: '#FFCDD2', text: '#C62828' }
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
                                            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#565D6D' }}>제목: {lesson.title}</p>
                                            {lesson.description && <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{lesson.description}</p>}
                                          </div>
                                          <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                              onClick={() => {
                                                setEditingLesson(lesson);
                                                setLessonFormData({ order: lesson.order, title: lesson.title, description: lesson.description, type: lesson.type || '이론' });
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
                      <td colSpan={7} className={styles.noData}>
                        강좌가 없습니다.
                      </td>
                    </tr>
                  )}
                </SortableContext>
              </tbody>
            </table>
          </DndContext>
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
                <label>소속 코스</label>
                <select
                  value={formData.courseId}
                  onChange={(e) => {
                    const selectedCourseId = Number(e.target.value);
                    setFormData({ ...formData, courseId: selectedCourseId });
                    
                    // 코스를 선택하면 해당 코스의 카테고리를 자동으로 설정
                    if (selectedCourseId > 0) {
                      const selectedCourse = coursesList.find(c => c.id === selectedCourseId);
                      if (selectedCourse) {
                        setFormData({ ...formData, courseId: selectedCourseId, category: selectedCourse.category });
                      }
                    }
                  }}
                >
                  <option value={0}>독립 강좌 (코스에 속하지 않음)</option>
                  {coursesList.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.category})
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
                  코스를 선택하면 해당 코스에 포함됩니다
                </p>
              </div>
              <div className={styles.formGroup}>
                <label>카테고리</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={formData.courseId > 0}
                >
                  <option value="">선택하세요</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {formData.courseId > 0 && (
                  <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 0 0' }}>
                    코스를 선택하면 카테고리가 자동으로 설정됩니다
                  </p>
                )}
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
                  <option value="토론">토론</option>
                  <option value="수료증">수료증</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>차시 제목</label>
                <input
                  type="text"
                  value={lessonFormData.title}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
                  placeholder="차시 제목을 입력하세요"
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

      {/* 코스 관리 모달 */}
      {showCourseManagementModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: '900px', maxHeight: '90vh' }}>
            <div className={styles.modalHeader}>
              <h3>코스 관리</h3>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setShowCourseManagementModal(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody} style={{ maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
              <p style={{ marginBottom: '20px', color: '#666' }}>
                여러 학습자료를 하나의 코스로 묶어서 관리할 수 있습니다.
              </p>
              
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>코스 생성</h4>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    썸네일 이미지 <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCourseFormData({ ...courseFormData, thumbnail: file });
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                    권장 크기: 1200x630px (16:9 비율)
                  </p>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    코스 제목 <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: 드론 기초 완성 과정"
                    value={courseFormData.title}
                    onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    카테고리 <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    value={courseFormData.category}
                    onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">선택하세요</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    코스 설명
                  </label>
                  <textarea
                    placeholder="코스에 대한 설명을 입력하세요"
                    rows={3}
                    value={courseFormData.description}
                    onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                      난이도
                    </label>
                    <select
                      value={courseFormData.difficulty}
                      onChange={(e) => setCourseFormData({ ...courseFormData, difficulty: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">선택하세요</option>
                      <option value="초급">초급</option>
                      <option value="중급">중급</option>
                      <option value="고급">고급</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                      총 차시
                    </label>
                    <input
                      type="text"
                      placeholder="예: 8차시"
                      value={courseFormData.duration}
                      onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleCreateCourse}
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  코스 생성
                </button>
              </div>
              
              <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: '30px' }}>
                <h4 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>생성된 코스 목록</h4>
                {coursesList.length === 0 ? (
                  <div style={{ color: '#999', textAlign: 'center', padding: '40px' }}>
                    아직 생성된 코스가 없습니다.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '15px' }}>
                    {coursesList.map((course) => (
                      <div
                        key={course.id}
                        style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '15px',
                          display: 'flex',
                          gap: '15px',
                          alignItems: 'center'
                        }}
                      >
                        <img
                          src={course.thumbnail?.startsWith('http') ? course.thumbnail : `https://api.nallijaku.com${course.thumbnail}`}
                          alt={course.title}
                          style={{
                            width: '120px',
                            height: '68px',
                            objectFit: 'cover',
                            borderRadius: '6px'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <h5 style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: '600' }}>
                            {course.title}
                          </h5>
                          <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#666' }}>
                            {course.description}
                          </p>
                          <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#999' }}>
                            <span>📁 {course.category}</span>
                            {course.difficulty && <span>📊 {course.difficulty}</span>}
                            {course.duration && <span>⏱️ {course.duration}</span>}
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            if (confirm('이 코스를 삭제하시겠습니까?')) {
                              try {
                                await api.delete(`/api/admin/courses/${course.id}`);
                                alert('코스가 삭제되었습니다.');
                                loadCoursesForManagement();
                              } catch (error) {
                                alert('코스 삭제에 실패했습니다.');
                              }
                            }
                          }}
                          style={{
                            background: '#ff4444',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                    onClick={async () => {
                      if (!categoryFormData.name) {
                        alert('카테고리명을 입력해주세요.');
                        return;
                      }
                      
                      try {
                        // 메인 카테고리 추가 API 호출
                        await api.post('/api/admin/categories', {
                          name: categoryFormData.name
                        });
                        
                        setCategories([...categories, categoryFormData.name]);
                        alert(`메인 카테고리 "${categoryFormData.name}"이(가) 추가되었습니다.`);
                        
                        setCategoryFormData({ name: '', parentCategory: '' });
                        loadCourses(); // 카테고리 다시 로드하여 ID 매핑 업데이트
                      } catch (error: any) {
                        console.error('카테고리 추가 실패:', error);
                        alert(error.response?.data?.message || '카테고리 추가에 실패했습니다.');
                      }
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#333' }}>{category}</h5>
                        <button
                          onClick={async () => {
                            if (confirm(`"${category}" 카테고리를 삭제하시겠습니까?`)) {
                              try {
                                const categoryId = categoryMap[category];
                                if (!categoryId) {
                                  alert('카테고리 ID를 찾을 수 없습니다.');
                                  return;
                                }
                                
                                // 메인 카테고리 삭제 API 호출 (ID 사용)
                                await api.delete(`/api/admin/categories/${categoryId}`);
                                
                                alert('카테고리가 삭제되었습니다.');
                                // 카테고리 목록 다시 로드
                                await loadCourses();
                              } catch (error: any) {
                                console.error('카테고리 삭제 실패:', error);
                                
                                if (error.response?.status === 400) {
                                  const errorData = error.response?.data?.data;
                                  const resourceCount = errorData?.resourceCount || '여러';
                                  alert(`카테고리를 삭제할 수 없습니다.\n해당 카테고리에 ${resourceCount}개의 강좌가 있습니다.`);
                                } else if (error.response?.status === 404) {
                                  alert('카테고리를 찾을 수 없습니다.');
                                } else {
                                  alert(error.response?.data?.message || '카테고리 삭제에 실패했습니다.');
                                }
                              }
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
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#FFF9C4', borderRadius: '6px', border: '1px solid #FBC02D' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#F57F17' }}>
                  <span style={{fontSize: '18px'}}>💡</span> <strong>참고:</strong> 카테고리 타입에서 서브 카테고리를 넣고싶은 카테고리를 선택 후, 이름을 입력하고 추가하면 됨.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
