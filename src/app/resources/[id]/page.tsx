'use client';

import React from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import baseStyles from '../../education-intro/page.module.css';
import styles from './page.module.css';
import { FaInstagram, FaYoutube, FaBloggerB } from 'react-icons/fa';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';


interface MaterialDetailProps {
  params: Promise<{
    id: string;
  }>;
}

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
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  instructor: string;
  difficulty?: string;
  duration?: string;
  displayOrder?: number;
  learningMaterials?: Material[];
  createdAt?: string;
  updatedAt?: string;
}

interface Material {
  id: number;
  courseId?: number;
  orderInCourse?: number;
  category: string;
  image: string;
  alt: string;
  instructor: string;
  title: string;
  subtitle: string;
  description: string;
  lessons?: Lesson[];
}

export default function MaterialDetailPage({ params }: MaterialDetailProps) {
  const [selectedLesson, setSelectedLesson] = React.useState<number | null>(1);
  const [course, setCourse] = React.useState<Course | null>(null);
  const [loading, setLoading] = React.useState(true);
  const resolvedParams = React.use(params);
  const router = useRouter();

  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    (document.body.style as CSSStyleDeclaration & { webkitOverflowScrolling?: string }).webkitOverflowScrolling = 'touch';
  }, []);

  // 로그인 상태 확인
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user') || localStorage.getItem('userInfo');
    if (!savedUser) {
      // 로그인하지 않은 사용자는 홈페이지로 리다이렉트
      console.log('❌ 로그인 정보 없음, 홈으로 리다이렉트');
      window.location.href = '/';
    } else {
      console.log('✅ 로그인 확인됨:', savedUser);
    }
  }, []);

  // 백엔드에서 데이터 불러오기
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        console.log('📡 데이터 API 호출:', `/api/courses/${resolvedParams.id}`);
        
        // 먼저 코스인지 확인
        try {
          const courseResponse = await api.get(`/api/courses/${resolvedParams.id}`);
          console.log('📚 코스 데이터:', courseResponse.data);
          
          const courseData = courseResponse.data.success ? courseResponse.data.data : courseResponse.data.data || courseResponse.data;
          console.log('✅ 처리된 코스 데이터:', courseData);
          
          setCourse(courseData);
        } catch (courseError: any) {
          // 코스가 아니면 강좌(학습자료)로 시도
          if (courseError.response?.status === 400 || courseError.response?.status === 404) {
            console.log('📖 강좌 데이터로 시도:', `/api/resources/${resolvedParams.id}`);
            
            const materialResponse = await api.get(`/api/resources/${resolvedParams.id}`);
            console.log('📖 강좌 데이터:', materialResponse.data);
            
            const materialData = materialResponse.data.success ? materialResponse.data.data : materialResponse.data.data || materialResponse.data;
            
            // 강좌 데이터를 코스 형식으로 변환
            const convertedCourse = {
              id: materialData.id,
              title: materialData.title,
              description: materialData.description || materialData.subtitle,
              category: materialData.category,
              thumbnail: materialData.image,
              instructor: materialData.instructor,
              difficulty: materialData.level,
              duration: materialData.duration,
              learningMaterials: [{
                ...materialData,
                orderInCourse: 1
              }]
            };
            
            setCourse(convertedCourse);
            
            // 첫 번째 차시 선택
            if (materialData.lessons && materialData.lessons.length > 0) {
              console.log('📖 차시 목록:', materialData.lessons);
              setSelectedLesson(materialData.lessons[0].id);
            }
          } else {
            throw courseError;
          }
        }
      } catch (error: any) {
        console.error('❌ 데이터 로드 중 오류:', error);
        if (error.response?.status === 401) {
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/';
        }
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchData();
    }
  }, [resolvedParams.id]);

  // 차시 버튼 클릭 핸들러
  const handleLessonClick = React.useCallback((lesson: { id: number }) => {
    setSelectedLesson(lesson.id);
  }, []);


  return (
    <div className={baseStyles.container}>
      <Header forceLightMode={true} />
      <main className={baseStyles.main} style={{ background: '#ffffff', minHeight: '60vh' }}>
        <div className={styles.content}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>로딩 중...</p>
            </div>
          ) : course ? (
            <div className={styles.materialContainer}>
              
              <div className={styles.materialContent}>
                <div style={{ width: '100%', padding: '0 20px' }}>
                  
                  {/* 코스에 포함된 학습자료들을 카드로 표시 */}
                  {course.learningMaterials && course.learningMaterials.length > 0 && (
                    <>
                      {course.learningMaterials.length > 1 ? (
                        <>
                          {/* 뒤로가기 버튼 */}
                          <button
                            onClick={() => router.back()}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '10px 20px',
                              backgroundColor: '#fff',
                              border: '1px solid #e0e0e0',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#333',
                              cursor: 'pointer',
                              margin: '20px 0',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                              width: 'fit-content'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f8f9fa';
                              e.currentTarget.style.transform = 'translateX(-4px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#fff';
                              e.currentTarget.style.transform = 'translateX(0)';
                            }}
                          >
                            <span style={{ fontSize: '18px' }}>←</span>
                            뒤로가기
                          </button>

                          {/* 코스 정보 헤더 */}
                          <div style={{ padding: '20px 0', borderBottom: '1px solid #e5e7eb', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                              <div style={{
                                backgroundColor: course.category === '창업' ? '#E3F2FD' : 
                                               course.category === '드론' ? '#F3E5F5' : 
                                               course.category === 'AI' ? '#FFF3E0' : '#E8F5E9',
                                color: course.category === '창업' ? '#1976D2' : 
                                       course.category === '드론' ? '#7B1FA2' : 
                                       course.category === 'AI' ? '#E65100' : '#2E7D32',
                                padding: '6px 14px',
                                borderRadius: '20px',
                                fontSize: '14px',
                                fontWeight: '600'
                              }}>
                                {course.category}
                              </div>
                              {course.difficulty && (
                                <div style={{
                                  backgroundColor: '#f5f5f5',
                                  color: '#666',
                                  padding: '6px 14px',
                                  borderRadius: '20px',
                                  fontSize: '14px',
                                  fontWeight: '600'
                                }}>
                                  {course.difficulty}
                                </div>
                              )}
                            </div>
                            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#333', margin: '0 0 12px 0' }}>
                              {course.title}
                            </h2>
                            <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', margin: '0' }}>
                              {course.description}
                            </p>
                            
                            {/* 강의계획서 버튼 */}
                            <button
                              onClick={() => {
                                // 코스의 강의계획서 PDF URL (백엔드에서 제공하는 경우)
                                // 임시로 알림 표시
                                alert('강의계획서가 준비 중입니다.');
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                backgroundColor: '#01c187',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(1, 193, 135, 0.3)',
                                marginTop: '16px'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#00a876';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(1, 193, 135, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#01c187';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(1, 193, 135, 0.3)';
                              }}
                            >
                              <span>📋</span>
                              강의계획서
                            </button>
                          </div>

                          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
                            📚 이 코스에 포함된 강좌
                          </h3>
                        </>
                      ) : (
                        <div style={{ 
                          display: 'flex', 
                          gap: '24px',
                          width: '100%',
                          minHeight: 'calc(100vh - 150px)'
                        }}>
                          {/* 왼쪽: 뒤로가기 + 차시 목록 */}
                          <div style={{ 
                            flex: '0 0 400px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                          }}>
                            {/* 뒤로가기 버튼 */}
                            <button
                              onClick={() => router.back()}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                backgroundColor: '#fff',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#333',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                width: 'fit-content'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                                e.currentTarget.style.transform = 'translateX(-4px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#fff';
                                e.currentTarget.style.transform = 'translateX(0)';
                              }}
                            >
                              <span style={{ fontSize: '18px' }}>←</span>
                              뒤로가기
                            </button>

                            {/* 강좌 정보 카드 (작게) */}
                            <div style={{ 
                              backgroundColor: '#f8f9fa',
                              borderRadius: '8px',
                              border: '1px solid #e0e0e0',
                              padding: '10px 14px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                <div style={{
                                  backgroundColor: course.category === '창업' ? '#E3F2FD' : 
                                                 course.category === '드론' ? '#F3E5F5' : 
                                                 course.category === 'AI' ? '#FFF3E0' : '#E8F5E9',
                                  color: course.category === '창업' ? '#1976D2' : 
                                         course.category === '드론' ? '#7B1FA2' : 
                                         course.category === 'AI' ? '#E65100' : '#2E7D32',
                                  padding: '3px 8px',
                                  borderRadius: '10px',
                                  fontSize: '10px',
                                  fontWeight: '600'
                                }}>
                                  {course.category}
                                </div>
                                {course.difficulty && (
                                  <div style={{
                                    backgroundColor: '#e0e0e0',
                                    color: '#666',
                                    padding: '3px 8px',
                                    borderRadius: '10px',
                                    fontSize: '10px',
                                    fontWeight: '600'
                                  }}>
                                    {course.difficulty}
                                  </div>
                                )}
                              </div>
                              <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#333', margin: '0 0 2px 0' }}>
                                {course.title}
                              </h3>
                              <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.3', margin: '0' }}>
                                {course.description}
                              </p>
                            </div>

                            {/* 차시 목록 박스 */}
                            <div style={{
                              backgroundColor: '#fff',
                              borderRadius: '12px',
                              border: '1px solid #e0e0e0',
                              overflow: 'hidden',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              <h3 style={{ 
                                padding: '12px 16px', 
                                fontSize: '14px', 
                                fontWeight: '600', 
                                borderBottom: '1px solid #f0f0f0', 
                                backgroundColor: '#f8f9fa',
                                margin: 0,
                                flexShrink: 0
                              }}>
                                📚 학습 목록
                              </h3>
                              <div style={{ flex: 1, overflowY: 'auto' }}>
                                {course.learningMaterials[0].lessons && course.learningMaterials[0].lessons.map((lesson) => {
                                  const typeColors: { [key: string]: { bg: string; text: string } } = {
                                    '이론': { bg: '#E1BEE7', text: '#6A1B9A' },
                                    '실습': { bg: '#C8E6C9', text: '#2E7D32' },
                                    '게임': { bg: '#FFF9C4', text: '#F57F17' },
                                    '토론': { bg: '#B3E5FC', text: '#01579B' },
                                    '수료증': { bg: '#FFCDD2', text: '#C62828' }
                                  };
                                  const typeColor = typeColors[lesson.type || '이론'] || typeColors['이론'];
                                  
                                  return (
                                    <div 
                                      key={lesson.id} 
                                      onClick={() => handleLessonClick(lesson)}
                                      style={{ 
                                        position: 'relative',
                                        padding: '16px 20px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #f0f0f0',
                                        backgroundColor: selectedLesson === lesson.id ? '#ECF7F3' : '#fff',
                                        transition: 'all 0.2s ease',
                                        borderLeft: selectedLesson === lesson.id ? '4px solid #01c187' : '4px solid transparent'
                                      }}
                                      onMouseEnter={(e) => {
                                        if (selectedLesson !== lesson.id) {
                                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (selectedLesson !== lesson.id) {
                                          e.currentTarget.style.backgroundColor = '#fff';
                                        }
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <div style={{ 
                                            fontSize: '14px', 
                                            fontWeight: '600', 
                                            color: '#333',
                                            marginBottom: '4px'
                                          }}>
                                            {lesson.materials}
                                          </div>
                                          <div style={{ 
                                            fontSize: '12px', 
                                            color: '#666',
                                            lineHeight: '1.4'
                                          }}>
                                            {lesson.description}
                                          </div>
                                        </div>
                                        <span style={{ 
                                          padding: '4px 10px', 
                                          backgroundColor: typeColor.bg, 
                                          color: typeColor.text, 
                                          borderRadius: '6px', 
                                          fontSize: '11px', 
                                          fontWeight: '600',
                                          flexShrink: 0
                                        }}>
                                          {lesson.type || '이론'}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* 오른쪽: PDF 뷰어 */}
                          <div style={{ 
                            flex: 1, 
                            minWidth: 0,
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <div style={{
                              backgroundColor: '#fff',
                              borderRadius: '12px',
                              border: '1px solid #e0e0e0',
                              overflow: 'hidden',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                              height: '100%',
                              width: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              minHeight: 'calc(100vh - 150px)'
                            }}>
                              {course.learningMaterials[0].lessons && selectedLesson ? (
                                (() => {
                                  const selectedLessonData = course.learningMaterials[0].lessons.find(l => l.id === selectedLesson);
                                  
                                  if (selectedLessonData && selectedLessonData.pdfUrl) {
                                    const fullPdfUrl = `https://api.nallijaku.com${selectedLessonData.pdfUrl}`;
                                    const pdfViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullPdfUrl)}&embedded=true`;
                                    
                                    return (
                                      <iframe
                                        src={pdfViewerUrl}
                                        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                                        title="PDF Viewer"
                                      />
                                    );
                                  } else {
                                    return (
                                      <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        color: '#999',
                                        padding: '40px'
                                      }}>
                                        <h3 style={{ fontSize: '18px', marginBottom: '8px', margin: 0 }}>PDF를 불러올 수 없습니다</h3>
                                        <p style={{ fontSize: '14px', margin: '8px 0 0 0' }}>이 항목에는 PDF 파일이 없습니다.</p>
                                      </div>
                                    );
                                  }
                                })()
                              ) : (
                                <div style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '100%',
                                  color: '#999',
                                  padding: '40px'
                                }}>
                                  <h3 style={{ fontSize: '18px', marginBottom: '8px', margin: 0 }}>콘텐츠를 선택해주세요</h3>
                                  <p style={{ fontSize: '14px', margin: '8px 0 0 0' }}>왼쪽에서 항목을 선택하면 PDF가 표시됩니다.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* 코스인 경우: 강좌 카드 그리드 */}
                      {course.learningMaterials.length > 1 && (
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(4, 1fr)', 
                          gap: '20px',
                          marginBottom: '40px',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}>
                        {course.learningMaterials
                          .sort((a, b) => (a.orderInCourse || 0) - (b.orderInCourse || 0))
                          .map((material) => {
                            // 카테고리별 색상
                            const categoryColors: { [key: string]: { bg: string; text: string } } = {
                              '창업': { bg: '#E3F2FD', text: '#1976D2' },
                              '드론': { bg: '#F3E5F5', text: '#7B1FA2' },
                              'AI': { bg: '#FFF3E0', text: '#E65100' },
                              '환경': { bg: '#E8F5E9', text: '#2E7D32' }
                            };
                            const categoryColor = categoryColors[material.category] || { bg: '#F5F5F5', text: '#666' };

                            // 이미지 URL 처리
                            const getImageUrl = (image: string) => {
                              if (!image) return '/nallijaku.png';
                              if (image.startsWith('http://') || image.startsWith('https://')) {
                                return image;
                              }
                              if (image.startsWith('/uploads/')) {
                                return `https://api.nallijaku.com${image}`;
                              }
                              if (image.startsWith('/학습자료/')) {
                                return `https://api.nallijaku.com${image}`;
                              }
                              if (image.startsWith('/')) {
                                return image;
                              }
                              return `https://api.nallijaku.com/uploads/${image}`;
                            };

                            return (
                              <div
                                key={material.id}
                                style={{
                                  border: '1px solid #e0e0e0',
                                  borderRadius: '12px',
                                  overflow: 'hidden',
                                  backgroundColor: '#fff',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                  transition: 'all 0.3s ease',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  flexDirection: 'column'
                                }}
                                onClick={() => router.push(`/resources/${material.id}`)}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-4px)';
                                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                }}
                              >
                                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                                  <img
                                    src={getImageUrl(material.image)}
                                    alt={material.alt || material.title}
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                      console.warn('이미지 로드 실패:', material.image, '→ 대체 이미지 사용');
                                      (e.target as HTMLImageElement).src = '/nallijaku.png';
                                    }}
                                  />
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: '12px',
                                      right: '12px',
                                      backgroundColor: categoryColor.bg,
                                      color: categoryColor.text,
                                      padding: '6px 14px',
                                      borderRadius: '20px',
                                      fontSize: '13px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    {material.category}
                                  </div>
                                  {material.orderInCourse && (
                                    <div
                                      style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                        color: 'white',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: '600'
                                      }}
                                    >
                                      {material.orderInCourse}번째
                                    </div>
                                  )}
                                </div>
                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                  <h4 style={{ 
                                    margin: '0 0 10px 0', 
                                    fontSize: '18px', 
                                    fontWeight: '600', 
                                    color: '#333',
                                    lineHeight: '1.4'
                                  }}>
                                    {material.title}
                                  </h4>
                                  <p style={{ 
                                    margin: '0 0 16px 0', 
                                    fontSize: '14px', 
                                    color: '#666',
                                    lineHeight: '1.6',
                                    flex: 1
                                  }}>
                                    {material.subtitle}
                                  </p>
                                  {material.lessons && material.lessons.length > 0 && (
                                    <div style={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: '8px',
                                      fontSize: '13px',
                                      color: '#999',
                                      paddingTop: '12px',
                                      borderTop: '1px solid #f0f0f0'
                                    }}>
                                      <span>📖</span>
                                      <span>{material.lessons.length}개 차시</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h2>코스를 찾을 수 없습니다</h2>
              <p>요청하신 코스가 존재하지 않습니다.</p>
            </div>
          )}
        </div>
      </main>

      {/* 푸터 */}
      <footer className={baseStyles.footer}>
        <div className={baseStyles.footerContent}>
          <div className={styles.logoSection}>
            <Image 
              src="/transparentLogo.png" 
              alt="날리자쿠 로고" 
              width={120} 
              height={60}
            />
          </div>

          <div className={baseStyles.companyInfo}>
            <h3 className={baseStyles.companyName}>날리자쿠</h3>
            <div className={baseStyles.infoList}>
              <p><span>대표</span>|<span></span>이민상</p>
              <p><span>사업자 등록번호</span>|<span></span>215-65-00727</p>
              <p><span>연락처</span>|<span></span>010.5029.6452</p>
              <p><span>주소</span>|<span></span>충청북도 청주시 서원구 서원서로 30-23</p>
              <p>SK 하이닉스 창업관</p>
            </div>
            <div className={baseStyles.legalLinks}>
              <a href="#" className={baseStyles.legalLink}>서비스 이용약관</a>
              <a href="#" className={baseStyles.legalLink}>개인정보처리방침</a>
            </div>
          </div>

          <div className={baseStyles.menuSection}>
            <h4 className={baseStyles.menuTitle}>메뉴</h4>
            <div className={baseStyles.menuList}>
              <a href="#" className={baseStyles.menuLink}>학습자료</a>
              <a href="#" className={baseStyles.menuLink}>커뮤니티</a>
              <a href="#" className={baseStyles.menuLink}>날리자쿠 소개</a>
              <a href="#" className={baseStyles.menuLink}>사용 가이드</a>
            </div>
          </div>

          <div className={baseStyles.snsSection}>
            <h4 className={baseStyles.snsTitle}>날리자쿠 SNS</h4>
            <div className={baseStyles.snsIcons}>
              <a href="https://instagram.com/nalijaku" target="_blank" rel="noopener noreferrer" className={baseStyles.snsIcon}>
                <FaInstagram size={24} />
              </a>
              <a href="https://youtube.com/@nalijaku" target="_blank" rel="noopener noreferrer" className={baseStyles.snsIcon}>
                <FaYoutube size={24} />
              </a>
              <a href="https://blog.naver.com/nalijaku" target="_blank" rel="noopener noreferrer" className={baseStyles.snsIcon}>
                <FaBloggerB size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}