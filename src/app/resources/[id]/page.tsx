'use client';

import React from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import baseStyles from '../../education-intro/page.module.css';
import styles from './page.module.css';
import { FaInstagram, FaYoutube, FaBloggerB } from 'react-icons/fa';


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
}

interface Material {
  id: number;
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
    const savedUserInfo = localStorage.getItem('userInfo');
    if (!savedUserInfo) {
      // 로그인하지 않은 사용자는 홈페이지로 리다이렉트
      window.location.href = '/';
    }
  }, []);

  // 백엔드에서 학습자료 데이터 불러오기
  React.useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.nallijaku.com/';
        const response = await fetch(`${API_BASE_URL}api/resources/${resolvedParams.id}`);
        
        if (response.ok) {
          const result = await response.json();
          console.log('📚 학습자료 데이터:', result);
          
          // 응답 형식에 따라 처리
          const materialData = result.success ? result.data : result.data || result;
          setMaterial(materialData);
          
          // 첫 번째 차시 선택
          if (materialData.lessons && materialData.lessons.length > 0) {
            setSelectedLesson(materialData.lessons[0].id);
          }
        } else {
          console.error('학습자료 로드 실패:', response.status);
        }
      } catch (error) {
        console.error('학습자료 로드 중 오류:', error);
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
                      <div className={styles.categoryTag}>{material.category}</div>
                      <div className={styles.materialTitle}>{material.title}</div>
                      <div className={styles.instructorInfo}>{material.instructor}</div>
                      <div className={styles.materialDescription}>{material.description}</div>
                      <button className={styles.syllabusButton}>
                        강의 계획서
                      </button>
                    </div>
                  </div>
                  
                  {material.lessons && material.lessons.length > 0 && (
                    <div className={styles.lessonsContainer}>
                      <div className={styles.lessonsList}>
                        {material.lessons.map((lesson) => (
                          <div 
                            key={lesson.id} 
                            className={`${styles.lessonItem} ${selectedLesson === lesson.id ? styles.selected : ''}`} 
                            onClick={() => handleLessonClick(lesson)}
                          >
                            <div className={styles.lessonLeft}>
                              <h4 className={styles.lessonTitle}>{lesson.order}차시</h4>
                            </div>
                            <div className={styles.lessonRight}>
                              <div className={styles.lessonMaterials}>
                                <strong>준비물:</strong> {lesson.materials}
                              </div>
                              <p className={styles.lessonShortDescription}><strong>설명:</strong> {lesson.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={styles.rightSection}>
                  <div className={styles.notionContainer}>
                    {material.lessons && material.lessons.length > 0 && selectedLesson ? (
                      (() => {
                        const selectedLessonData = material.lessons.find(l => l.id === selectedLesson);
                        return selectedLessonData && selectedLessonData.pdfUrl ? (
                          <div style={{ width: '100%', height: '600px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                            <iframe
                              src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedLessonData.pdfUrl)}&embedded=true`}
                              style={{ width: '100%', height: '100%', border: 'none' }}
                              title="PDF Viewer"
                            />
                          </div>
                        ) : (
                          <div className={styles.errorContainer}>
                            <h3>PDF를 불러올 수 없습니다</h3>
                            <p>이 차시에는 PDF 파일이 없습니다.</p>
                          </div>
                        );
                      })()
                    ) : (
                      <div className={styles.errorContainer}>
                        <h3>콘텐츠를 선택해주세요</h3>
                        <p>왼쪽에서 차시를 선택하면 PDF가 표시됩니다.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* 학습 버튼들 */}
                  <div className={styles.learningButtons}>
                    <button className={styles.lectureButton}>
                      강의하기
                    </button>
                    <button className={styles.quizButton}>
                      퀴즈하기
                    </button>
                    <button className={styles.practiceButton}>
                      실습하기
                    </button>
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