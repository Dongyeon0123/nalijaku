'use client';

import React from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import baseStyles from '../../education-intro/page.module.css';
import styles from './page.module.css';
import { FaInstagram, FaYoutube, FaBloggerB } from 'react-icons/fa';
import { convertBlocksToHTML, NotionPage } from '@/services/notionService';

interface MaterialDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MaterialDetailPage({ params }: MaterialDetailProps) {
  const [notionContent, setNotionContent] = React.useState<NotionPage | null>(null);
  const [selectedLesson, setSelectedLesson] = React.useState<number | null>(1);
  const [isNotionLoading, setIsNotionLoading] = React.useState(false);
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

  // 카드 데이터 (실제로는 API에서 가져와야 함)
  const materialsData = [
    {
      id: 1,
      category: '진로',
      image: '/학습자료/진로-배송.png',
      alt: '진로-배송',
      instructor: '유한상 강사',
      title: '진로-배송',
      subtitle: '24년 2학기 디지털 새싹 데이터 분석가 전용<br></br>커리큘럼',
      description: '미래 유망 직업인 드론 배송 전문가가 되기 위한 구체적인 진로를 탐색하고 설계',
      notionId: '2740141a895f8050896ae4ea0d0dafed'
    },
    {
      id: 2,
      category: '항공법',
      image: '/학습자료/항공법 atoz.png',
      alt: '항공법 A to Z',
      instructor: '하가연 강사',
      title: '항공법 A to Z',
      subtitle: '자격증 시험에 나오는 기본적인 항공법 지식',
      description: '드론 조종에 필요한 항공법의 모든 것을 체계적으로 학습할 수 있는 교육 자료입니다.',
      notionId: '2690141a895f8053893fc943b2846322'
    },
    {
      id: 3,
      category: '군 드론',
      image: '/학습자료/군드론.png',
      alt: '군 드론',
      instructor: '하가연 강사',
      title: '군드론',
      subtitle: '최초 드론은 세계1차대전부터 이용되었습니다.<br></br>생각보다 오래전에 쓰인 기술, 과거에는 어떤<br></br>모습이었을까요?',
      description: '군사용 드론의 역사와 발전 과정을 통해 드론 기술의 진화를 이해할 수 있는 교육 자료입니다.',
      notionId: '2690141a895f8053893fc943b2846322'
    },
    {
      id: 4,
      category: '드론 기초',
      image: '/학습자료/드론기초자료.png',
      alt: '드론 기초자료',
      instructor: '유한상 강사',
      title: '드론 기초 자료',
      subtitle: '드론을 처음 접하는 사람들을 위한 자료',
      description: '드론에 대한 기본적인 지식부터 조종 방법까지 체계적으로 학습할 수 있는 입문자용 교육 자료입니다.',
      notionId: '2690141a895f8053893fc943b2846322',
      hasLessons: true,
      lessons: [
        {
          id: 1,
          title: '1차시',
          subtitle: '드론의 기본 구조와 원리',
          materials: '드론 키트, 조종기, 배터리',
          shortDescription: '드론의 기본 구조를 이해하고 조립 방법을 학습합니다.',
          description: '드론의 기본 구조를 이해하고 조립 방법을 학습합니다.',
          notionId: '2690141a895f8053893fc943b2846322'
        },
        {
          id: 2,
          title: '2차시',
          subtitle: '드론 조종 기초',
          materials: '드론, 조종기, 충전기',
          shortDescription: '기본적인 드론 조종법과 안전 수칙을 익힙니다.',
          description: '기본적인 드론 조종법과 안전 수칙을 익힙니다.',
          notionId: '2740141a895f805f82ebc758f7d1d71a'
        },
        {
          id: 3,
          title: '3차시',
          subtitle: '고급 조종 기법',
          materials: '드론, 조종기, 콘',
          shortDescription: '고급 조종 기법과 비행 패턴을 연습합니다.',
          description: '고급 조종 기법과 비행 패턴을 연습합니다.',
          notionId: '2740141a895f8082afd3ce928b63748c'
        },
        {
          id: 4,
          title: '4차시',
          subtitle: '실전 비행과 응용',
          materials: '드론, 조종기, 카메라',
          shortDescription: '실전 비행 연습과 다양한 응용 분야를 탐구합니다.',
          description: '실전 비행 연습과 다양한 응용 분야를 탐구합니다.',
          notionId: '2740141a895f808f9c47fd8ae495d376'
        }
      ]
    },
    {
      id: 5,
      category: '진로',
      image: '/학습자료/진로-방제.png',
      alt: '진로-방제',
      instructor: '임승원 강사',
      title: '진로-방제',
      subtitle: '드론 산업분야에서 가장 성공한 드론 방제',
      description: '농업용 드론 방제 기술과 관련 진로에 대해 학습할 수 있는 교육 자료입니다.',
      notionId: '2690141a895f8053893fc943b2846322'
    },
    {
      id: 6,
      category: '진로',
      image: '/학습자료/진로-촬영.png',
      alt: '진로-촬영',
      instructor: '하가연 강사',
      title: '진로-촬영',
      subtitle: '영화촬영시, 핑수적으로 넣는 항공촬영샷',
      description: '드론을 활용한 항공 촬영 기술과 관련 진로에 대해 학습할 수 있는 교육 자료입니다.',
      notionId: '2690141a895f8053893fc943b2846322'
    },
    {
      id: 7,
      category: '항공 역학',
      image: '/학습자료/항공역학.png',
      alt: '항공역학',
      instructor: '유한상 강사',
      title: '양력의 원리를 쉽게 배우는 교육자료',
      subtitle: '드론의 기초 작동 원리와 관련 개념을 이해하고<br></br>직접 드론을 제작하여 비행하는 실습으로<br></br>구성된 커리큘럼입니다.',
      description: '드론이 하늘을 날 수 있는 원리를 이해하기 위한 항공 역학 교육 자료입니다.',
      notionId: '2690141a895f8053893fc943b2846322'
    },
    {
      id: 8,
      category: '드론 조종',
      image: '/학습자료/드론 조종.png',
      alt: '드론 조종',
      instructor: '유한상 강사',
      title: '드론 조종법 고급편',
      subtitle: '드론 조종법은 알지만 아직 조종이 미숙한<br></br>사람들을 위한 교육',
      description: '기본적인 드론 조종법을 익힌 후 더욱 정교하고 안전한 조종 기술을 습득하기 위한 고급 교육 자료입니다.',
      notionId: '2690141a895f8053893fc943b2846322'
    },
    {
      id: 9,
      category: '진로',
      image: '/학습자료/진로-소방.png',
      alt: '진로-소방',
      instructor: '임승원 강사',
      title: '진로-소방',
      subtitle: '산불, 안전 초기진압이 가능한 소방드론',
      description: '소방 분야에서 활용되는 드론 기술과 관련 진로에 대해 학습할 수 있는 교육 자료입니다.',
      notionId: '2690141a895f8053893fc943b2846322'
    },
    {
      id: 10,
      category: '진로',
      image: '/학습자료/진로-스포츠.png',
      alt: '진로-스포츠',
      instructor: '하가연 강사',
      title: '진로-스포츠',
      subtitle: '축구드론, 레이싱드론 등 새로운 드론형태를 찾아보자',
      description: '드론을 활용한 새로운 스포츠 분야와 관련 진로에 대해 학습할 수 있는 교육 자료입니다.',
      notionId: '2690141a895f8053893fc943b2846322'
    },
    {
      id: 11,
      category: '진로',
      image: '/학습자료/진로-시설.png',
      alt: '진로-시설점검드론',
      instructor: '유한상 강사',
      title: '진로-시설점검드론',
      subtitle: '사람이 직접 확인하기 어려운 곳을 드론으로 점검',
      description: '시설물 점검에 활용되는 드론 기술과 관련 진로에 대해 학습할 수 있는 교육 자료입니다.',
      notionId: '2690141a895f8053893fc943b2846322'
    },
    {
      id: 12,
      category: '항공촬영기법',
      image: '/학습자료/항공촬영.png',
      alt: '항공촬영',
      instructor: '유한상 강사',
      title: '항공 촬영 기법',
      subtitle: '패닝샷, 트레킹, 버드아이뷰 등 다양한<br></br>촬영기법 활용',
      description: '드론을 활용한 전문적인 항공 촬영 기법을 학습할 수 있는 교육 자료입니다.',
      notionId: '2690141a895f8053893fc943b2846322'
    }
  ];

  // 현재 자료 찾기
  const currentMaterial = materialsData.find(material => material.id === parseInt(resolvedParams.id));

  // 노션 콘텐츠 가져오기
  React.useEffect(() => {
    const loadNotionContent = async () => {
      if (!currentMaterial) return;
      
      try {
        setIsNotionLoading(true);
        
        // 차시가 있는 경우 첫 번째 차시의 노션 콘텐츠 로드
        if (currentMaterial.hasLessons && currentMaterial.lessons && currentMaterial.lessons.length > 0) {
          const firstLesson = currentMaterial.lessons[0];
          const response = await fetch(`/api/notion/page?pageId=${firstLesson.notionId}`);
          
          if (!response.ok) {
            throw new Error('API 요청 실패');
          }
          
          const content = await response.json();
          setNotionContent(content);
        } else if (currentMaterial.notionId) {
          // 차시가 없는 경우 기본 노션 콘텐츠 로드
          const response = await fetch(`/api/notion/page?pageId=${currentMaterial.notionId}`);
          
          if (!response.ok) {
            throw new Error('API 요청 실패');
          }
          
          const content = await response.json();
          setNotionContent(content);
        }
      } catch (error) {
        console.error('노션 콘텐츠 로드 실패:', error);
      } finally {
        setIsNotionLoading(false);
      }
    };

    if (currentMaterial) {
      loadNotionContent();
    }
  }, [currentMaterial]);

  // 차시별 콘텐츠 로드
  const loadLessonContent = async (lessonId: string) => {
    try {
      setIsNotionLoading(true);
      const response = await fetch(`/api/notion/page?pageId=${lessonId}`);
      
      if (!response.ok) {
        throw new Error('API 요청 실패');
      }
      
      const content = await response.json();
      setNotionContent(content);
    } catch (error) {
      console.error('차시 콘텐츠 로드 실패:', error);
    } finally {
      setIsNotionLoading(false);
    }
  };

  // 차시 버튼 클릭 핸들러
  const handleLessonClick = (lesson: { id: number; notionId: string }) => {
    setSelectedLesson(lesson.id);
    loadLessonContent(lesson.notionId);
  };


  return (
    <div className={baseStyles.container}>
      <Header forceLightMode={true} />
      <main className={baseStyles.main} style={{ background: '#ffffff', minHeight: '60vh' }}>
        <div className={styles.content}>
          {currentMaterial ? (
            <div className={styles.materialContainer}>
              
              <div className={styles.materialContent}>
                <div className={styles.leftSection}>
                  <div className={styles.courseInfoContainer}>
                    <div className={styles.courseInfo}>
                      <div className={styles.categoryTag}>{currentMaterial.category}</div>
                      <div className={styles.materialTitle}>{currentMaterial.title}</div>
                      <div className={styles.instructorInfo}>{currentMaterial.instructor}</div>
                      <div className={styles.materialDescription}>{currentMaterial.description}</div>
                      <button className={styles.syllabusButton}>
                        강의 계획서
                      </button>
                    </div>
                  </div>
                  
                  {currentMaterial.hasLessons && currentMaterial.lessons && (
                    <div className={styles.lessonsContainer}>
                      <div className={styles.lessonsList}>
                        {currentMaterial.lessons.map((lesson) => (
                          <div 
                            key={lesson.id} 
                            className={`${styles.lessonItem} ${selectedLesson === lesson.id ? styles.selected : ''}`} 
                            onClick={() => handleLessonClick(lesson)}
                          >
                            <div className={styles.lessonLeft}>
                              <h4 className={styles.lessonTitle}>{lesson.title}</h4>
                            </div>
                            <div className={styles.lessonRight}>
                              <h5 className={styles.lessonSubtitle}>{lesson.subtitle}</h5>
                              <div className={styles.lessonMaterials}>
                                <strong>준비물:</strong> {lesson.materials}
                              </div>
                              <p className={styles.lessonShortDescription}><strong>설명:</strong> {lesson.shortDescription}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={styles.rightSection}>
                  <div className={styles.notionContainer}>
                    {isNotionLoading ? (
                      <div className={styles.loadingContainer} style={{ minHeight: '400px', margin: '0', padding: '40px' }}>
                        <div className={styles.loadingSpinner}>
                          <div className={styles.dot}></div>
                        </div>
                        <div className={styles.loadingText}>노션 콘텐츠를 불러오는 중...</div>
                        <div className={styles.loadingProgress}></div>
                      </div>
                    ) : notionContent ? (
                    <div className={styles.notionContent}>
                      <h2 className={styles.notionTitle}>{notionContent.title}</h2>
                      <div 
                        className={styles.notionBody}
                        dangerouslySetInnerHTML={{ 
                          __html: convertBlocksToHTML(notionContent.content) 
                        }}
                      />
                    </div>
                  ) : (
                    <div className={styles.errorContainer}>
                      <h3>콘텐츠를 불러올 수 없습니다</h3>
                      <p>노션 API 설정을 확인해주세요.</p>
                      <a 
                        href={`https://www.notion.so/${currentMaterial.notionId}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.notionButton}
                      >
                        노션에서 보기
                      </a>
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