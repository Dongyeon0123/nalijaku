'use client';

import React from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import baseStyles from '../education-intro/page.module.css';
import styles from './page.module.css';
import { FiSearch } from 'react-icons/fi';
import { FaInstagram, FaYoutube, FaBloggerB } from 'react-icons/fa';

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('전체');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    (document.body.style as any).webkitOverflowScrolling = 'touch';
    
    // 로딩 시뮬레이션 (실제로는 데이터 로딩 시간에 맞춰 조정)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // 로그인 상태 확인
  React.useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    if (!savedUserInfo) {
      // 로그인하지 않은 사용자는 홈페이지로 리다이렉트
      window.location.href = '/';
    }
  }, []);

  // 카테고리별 카드 데이터
  const materialsData = [
    {
      id: 1,
      category: '진로',
      image: '/학습자료/진로-배송.png',
      alt: '진로-배송',
      instructor: '유한상 강사',
      title: '진로-배송',
      subtitle: '24년 2학기 디지털 새싹 데이터 분석가 전용<br></br>커리큘럼'
    },
    {
      id: 2,
      category: '항공법',
      image: '/학습자료/항공법 atoz.png',
      alt: '항공법 A to Z',
      instructor: '하가연 강사',
      title: '항공법 A to Z',
      subtitle: '자격증 시험에 나오는 기본적인 항공법 지식'
    },
    {
      id: 3,
      category: '군 드론',
      image: '/학습자료/군드론.png',
      alt: '군 드론',
      instructor: '하가연 강사',
      title: '군드론',
      subtitle: '최초 드론은 세계1차대전부터 이용되었습니다.<br></br>생각보다 오래전에 쓰인 기술, 과거에는 어떤<br></br>모습이었을까요?'
    },
    {
      id: 4,
      category: '드론 기초',
      image: '/학습자료/드론기초자료.png',
      alt: '드론 기초자료',
      instructor: '유한상 강사',
      title: '드론 기초 자료',
      subtitle: '드론을 처음 접하는 사람들을 위한 자료'
    },
    {
      id: 5,
      category: '진로',
      image: '/학습자료/진로-방제.png',
      alt: '진로-방제',
      instructor: '임승원 강사',
      title: '진로-방제',
      subtitle: '드론 산업분야에서 가장 성공한 드론 방제'
    },
    {
      id: 6,
      category: '진로',
      image: '/학습자료/진로-촬영.png',
      alt: '진로-촬영',
      instructor: '하가연 강사',
      title: '진로-촬영',
      subtitle: '영화촬영시, 핑수적으로 넣는 항공촬영샷'
    },
    {
      id: 7,
      category: '항공 역학',
      image: '/학습자료/항공역학.png',
      alt: '항공역학',
      instructor: '유한상 강사',
      title: '양력의 원리를 쉽게 배우는 교육자료',
      subtitle: '드론의 기초 작동 원리와 관련 개념을 이해하고<br></br>직접 드론을 제작하여 비행하는 실습으로<br></br>구성된 커리큘럼입니다.'
    },
    {
      id: 8,
      category: '드론 조종',
      image: '/학습자료/드론 조종.png',
      alt: '드론 조종',
      instructor: '유한상 강사',
      title: '드론 조종법 고급편',
      subtitle: '드론 조종법은 알지만 아직 조종이 미숙한<br></br>사람들을 위한 교육'
    },
    {
      id: 9,
      category: '진로',
      image: '/학습자료/진로-소방.png',
      alt: '진로-소방',
      instructor: '임승원 강사',
      title: '진로-소방',
      subtitle: '산불, 안전 초기진압이 가능한 소방드론'
    },
    {
      id: 10,
      category: '진로',
      image: '/학습자료/진로-스포츠.png',
      alt: '진로-스포츠',
      instructor: '하가연 강사',
      title: '진로-스포츠',
      subtitle: '축구드론, 레이싱드론 등 새로운 드론형태를 찾아보자'
    },
    {
      id: 11,
      category: '진로',
      image: '/학습자료/진로-시설.png',
      alt: '진로-시설',
      instructor: '유한상 강사',
      title: '진로-시설점검드론',
      subtitle: '사람이 직접 확인하기 어려운 곳을 드론으로 점검'
    },
    {
      id: 12,
      category: '항공촬영기법',
      image: '/학습자료/항공촬영.png',
      alt: '항공촬영',
      instructor: '유한상 강사',
      title: '항공 촬영 기법',
      subtitle: '패닝샷, 트레킹, 버드아이뷰 등 다양한<br></br>촬영기법 활용'
    }
  ];

  // 필터링된 카드 데이터
  const filteredMaterials = selectedCategory === '전체' 
    ? materialsData 
    : materialsData.filter(material => material.category === selectedCategory);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  // 로딩 중일 때 표시할 컴포넌트
  if (isLoading) {
    return (
      <div className={baseStyles.container}>
        <Header forceLightMode={true} />
        <main className={baseStyles.main} style={{ background: '#ffffff', minHeight: '60vh' }}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <div className={styles.loadingText}>학습 자료를 불러오는 중...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={baseStyles.container}>
      <Header forceLightMode={true} />
      <main className={baseStyles.main} style={{ background: '#ffffff', minHeight: '60vh' }}>
        <div className={styles.content}>
            <h1 className={styles.title}>학습자료실</h1>
            <p className={styles.subtitle}>필터 또는 검색 기능으로 원하는 주제의 커리큘럼을 찾아보세요.</p>

            <div className={styles.actionsRow}>
              <div className={styles.searchBox}>
                <input 
                  type="text" 
                  className={styles.searchInput} 
                  placeholder="키워드를 입력하세요"
                />
                <button className={styles.searchButton} aria-label="검색">
                  <FiSearch size={18} />
                </button>
              </div>
            </div>
            <div className={styles.grayLine}></div>

            <div className={styles.topicList}>
                <p 
                  className={`${styles.topicItem} ${selectedCategory === '전체' ? styles.selected : ''}`}
                  onClick={() => handleCategoryClick('전체')}
                >
                  전체
                </p>
                <p 
                  className={`${styles.topicItem} ${selectedCategory === '진로' ? styles.selected : ''}`}
                  onClick={() => handleCategoryClick('진로')}
                >
                  진로
                </p>
                <p 
                  className={`${styles.topicItem} ${selectedCategory === '항공법' ? styles.selected : ''}`}
                  onClick={() => handleCategoryClick('항공법')}
                >
                  항공법
                </p>
                <p 
                  className={`${styles.topicItem} ${selectedCategory === '항공 역학' ? styles.selected : ''}`}
                  onClick={() => handleCategoryClick('항공 역학')}
                >
                  항공 역학
                </p>
                <p 
                  className={`${styles.topicItem} ${selectedCategory === '항공촬영기법' ? styles.selected : ''}`}
                  onClick={() => handleCategoryClick('항공촬영기법')}
                >
                  항공촬영기법
                </p>
                <p 
                  className={`${styles.topicItem} ${selectedCategory === '드론 기초' ? styles.selected : ''}`}
                  onClick={() => handleCategoryClick('드론 기초')}
                >
                  드론 기초
                </p>
                <p 
                  className={`${styles.topicItem} ${selectedCategory === '군 드론' ? styles.selected : ''}`}
                  onClick={() => handleCategoryClick('군 드론')}
                >
                  군 드론
                </p>
                <p 
                  className={`${styles.topicItem} ${selectedCategory === '드론 조종' ? styles.selected : ''}`}
                  onClick={() => handleCategoryClick('드론 조종')}
                >
                  드론 조종
                </p>
                <p className={styles.topicItem}>과학교과연계</p>
                <p className={styles.topicItem}>전보교과연계</p>
                <p className={styles.topicItem}>메이커톤</p>
                <p className={styles.topicItem}>더아이엠씨</p>
                <p className={styles.topicItem}>젯슨나노</p>
            </div>

            <div className={styles.materialsGrid}>
              {filteredMaterials.map((material) => (
                <div key={material.id} className={styles.materialItem}>
                  <div className={styles.imageContainer}>
                    <Image 
                      src={material.image} 
                      alt={material.alt} 
                      width={200} 
                      height={200}
                      className={styles.materialImage}
                    />
                    <div className={styles.categoryTag}>{material.category}</div>
                  </div>
                  <div className={styles.materialContent}>
                    <p className={styles.instructorInfo}>{material.instructor}</p>
                    <p className={styles.materialTitle}>{material.title}</p>
                    <p 
                      className={styles.subtitle}
                      dangerouslySetInnerHTML={{ __html: material.subtitle }}
                    />
                  </div>
                </div>
              ))}
            </div>
        </div>
        
      </main>

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


