'use client';

import React from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import baseStyles from '../../education-intro/page.module.css';
import styles from './page.module.css';
import { FaInstagram, FaYoutube, FaBloggerB } from 'react-icons/fa';
import api from '@/lib/axios';


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

interface Material {
  id: number;
  category: string;
  subCategory?: string;
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
  const [material, setMaterial] = React.useState<Material | null>(null);
  const [loading, setLoading] = React.useState(true);
  const resolvedParams = React.use(params);

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

  // 백엔드에서 학습자료 데이터 불러오기
  React.useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setLoading(true);
        
        console.log('📡 학습자료 API 호출:', `/api/resources/${resolvedParams.id}`);
        
        // Axios 사용 (인증 토큰 자동 포함)
        const response = await api.get(`/api/resources/${resolvedParams.id}`);
        
        console.log('📚 학습자료 데이터:', response.data);
        
        // 응답 형식에 따라 처리
        const materialData = response.data.success ? response.data.data : response.data.data || response.data;
        console.log('✅ 처리된 자료 데이터:', materialData);
        
        // 카테고리 영어 → 한글 변환
        const categoryToKorean: { [key: string]: string } = {
          'ALL': '전체',
          'STARTUP': '창업',
          'DRONE': '드론',
          'AI': 'AI',
          'ENVIRONMENT': '환경'
        };
        
        if (materialData.category) {
          materialData.category = categoryToKorean[materialData.category] || materialData.category;
        }
        
        setMaterial(materialData);
        
        // 첫 번째 차시 선택
        if (materialData.lessons && materialData.lessons.length > 0) {
          console.log('📖 차시 목록:', materialData.lessons);
          setSelectedLesson(materialData.lessons[0].id);
        }
      } catch (error: any) {
        console.error('❌ 학습자료 로드 중 오류:', error);
        if (error.response?.status === 401) {
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/';
        }
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchMaterial();
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
          ) : material ? (
            <div className={styles.materialContainer}>
              
              <div className={styles.materialContent}>
                <div className={styles.leftSection}>
                  <div className={styles.courseInfoContainer}>
                    <div className={styles.courseInfo}>
                      <div className={styles.categoryTag}>
                        {material.category}
                        {material.subCategory && (
                          <span style={{ marginLeft: '8px', fontSize: '13px', opacity: 0.9 }}>
                            · {material.subCategory}
                          </span>
                        )}
                      </div>
                      <div className={styles.materialTitle}>{material.title}</div>
                      <div className={styles.materialDescription}>{material.description}</div>
                      <button className={styles.syllabusButton}>
                        강의 계획서
                      </button>
                    </div>
                  </div>
                  
                  {material.lessons && material.lessons.length > 0 && (
                    <div className={styles.lessonsContainer}>
                      <div className={styles.lessonsList}>
                        {material.lessons.map((lesson) => {
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
                              className={`${styles.lessonItem} ${selectedLesson === lesson.id ? styles.selected : ''}`} 
                              onClick={() => handleLessonClick(lesson)}
                              style={{ position: 'relative' }}
                            >
                              <span style={{ 
                                position: 'absolute',
                                top: '12px',
                                right: '16px',
                                padding: '4px 10px', 
                                backgroundColor: typeColor.bg, 
                                color: typeColor.text, 
                                borderRadius: '6px', 
                                fontSize: '11px', 
                                fontWeight: '600',
                                zIndex: 1
                              }}>
                                {lesson.type || '이론'}
                              </span>
                              <div className={styles.lessonLeft}>
                                <h4 className={styles.lessonTitle}>{lesson.order}차시</h4>
                              </div>
                              <div className={styles.lessonRight}>
                                <div className={styles.lessonMaterials}>
                                  <strong>{lesson.materials}</strong>
                                </div>
                                <p className={styles.lessonShortDescription}>{lesson.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={styles.rightSection}>
                  <div className={styles.notionContainer}>
                    {material.lessons && material.lessons.length > 0 && selectedLesson ? (
                      (() => {
                        const selectedLessonData = material.lessons.find(l => l.id === selectedLesson);
                        if (selectedLessonData && selectedLessonData.pdfUrl) {
                          const fullPdfUrl = `https://api.nallijaku.com${selectedLessonData.pdfUrl}`;
                          const pdfViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullPdfUrl)}&embedded=true`;
                          
                          console.log('📄 PDF URL:', fullPdfUrl);
                          console.log('🔗 Viewer URL:', pdfViewerUrl);
                          
                          return (
                            <div style={{ width: '100%', height: '600px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                              <iframe
                                src={pdfViewerUrl}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                title="PDF Viewer"
                                onError={() => console.error('PDF 로드 실패:', fullPdfUrl)}
                              />
                            </div>
                          );
                        } else {
                          return (
                            <div className={styles.errorContainer}>
                              <h3>PDF를 불러올 수 없습니다</h3>
                              <p>이 차시에는 PDF 파일이 없습니다.</p>
                            </div>
                          );
                        }
                      })()
                    ) : (
                      <div className={styles.errorContainer}>
                        <h3>콘텐츠를 선택해주세요</h3>
                        <p>왼쪽에서 차시를 선택하면 PDF가 표시됩니다.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h2>자료를 찾을 수 없습니다</h2>
              <p>요청하신 학습 자료가 존재하지 않습니다.</p>
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