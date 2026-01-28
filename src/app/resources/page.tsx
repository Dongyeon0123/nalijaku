'use client';

import React from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import baseStyles from '../education-intro/page.module.css';
import styles from './page.module.css';
import { FiSearch } from 'react-icons/fi';
import { FaInstagram, FaYoutube, FaBloggerB } from 'react-icons/fa';
import { IoCartOutline, IoChevronDown, IoChevronForward, IoChevronBack } from 'react-icons/io5';
import { MdDragIndicator } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

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
  description?: string;
  price?: number;
  duration?: string;
  level?: string;
  lessons?: Lesson[];
}

interface Lesson {
  id: number;
  order: number;
  materials: string;
  description: string;
  pdfUrl?: string;
  type?: string;
}

interface CartItem extends Course {
  quantity: number;
  selectedModules?: number[]; // 선택된 모듈(레슨) ID 배열
  droneOption?: 'none' | 'purchase' | 'rental'; // 드론 교구 옵션
}

export default function ResourcesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = React.useState('전체');
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<number[]>([]); // 펼쳐진 아이템 ID 배열
  const [cartWidth, setCartWidth] = React.useState(400); // 장바구니 너비
  const [isResizing, setIsResizing] = React.useState(false);
  const [coursesData, setCoursesData] = React.useState<Course[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    (document.body.style as CSSStyleDeclaration & { webkitOverflowScrolling?: string }).webkitOverflowScrolling = 'touch';
  }, []);

  // 로그인 상태 확인
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user') || localStorage.getItem('userInfo');
    if (!savedUser) {
      alert('로그인이 필요한 페이지입니다.');
      window.location.href = '/';
    }
  }, []);

  // 백엔드에서 코스 데이터 가져오기
  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('코스 API 호출');

        // 코스 목록 가져오기
        const response = await api.get('/api/courses');

        console.log('코스 로드 성공:', response.data);

        const result = response.data;

        if (result.success && result.data) {
          // 백엔드 응답: { success, message, data: { courses: [...] } }
          const coursesArray = result.data.courses || result.data;
          setCoursesData(coursesArray);
        } else if (result.data && Array.isArray(result.data)) {
          setCoursesData(result.data);
        } else if (Array.isArray(result)) {
          setCoursesData(result);
        } else {
          console.warn('예상치 못한 API 응답 형식:', result);
          setError('코스 데이터 형식이 올바르지 않습니다.');
        }

        // 카테고리는 별도 API에서 가져오기
        try {
          const categoriesResponse = await api.get('/api/categories');
          console.log('카테고리 로드 성공:', categoriesResponse.data);
          
          if (categoriesResponse.data.success && categoriesResponse.data.data?.categories) {
            const categoryData = categoriesResponse.data.data.categories;
            
            // 메인 카테고리만 추출 (서브카테고리 제거)
            const mainCategories = categoryData.map((cat: any) => cat.name);
            setCategories(mainCategories);
            
          } else if (Array.isArray(categoriesResponse.data)) {
            setCategories(categoriesResponse.data);
          } else if (categoriesResponse.data.data && Array.isArray(categoriesResponse.data.data)) {
            setCategories(categoriesResponse.data.data);
          } else {
            // 카테고리 API 실패 시 기본값
            setCategories(['전체', '창업', '드론', 'AI', '환경']);
          }
        } catch (categoryError) {
          console.error('카테고리 로드 실패:', categoryError);
          // 카테고리 API 실패 시 기본값
          setCategories(['전체', '창업', '드론', 'AI', '환경']);
        }
      } catch (err: any) {
        console.error('코스 로드 실패:', err);
        if (err.response?.status === 401) {
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          localStorage.clear();
          window.location.href = '/';
        } else if (err.response?.status === 500) {
          setError('백엔드 서버 오류가 발생했습니다. 백엔드 개발자에게 /api/courses 엔드포인트 확인을 요청하세요.');
        } else {
          setError('코스를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 필터링된 코스 데이터
  const filteredCourses = coursesData.filter(course => {
    // 카테고리 필터
    if (selectedCategory !== '전체' && course.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCourseClick = (courseId: number) => {
    router.push(`/resources/${courseId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, courseId: number) => {
    e.stopPropagation();
    const course = coursesData.find(c => c.id === courseId);
    if (course) {
      const existingItem = cartItems.find(item => item.id === courseId);
      if (existingItem) {
        setCartItems(cartItems.map(item =>
          item.id === courseId ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setCartItems([...cartItems, { 
          ...course, 
          quantity: 1,
          selectedModules: [],
          droneOption: 'none'
        }]);
      }
      setIsCartOpen(true);
    }
  };

  const handleRemoveFromCart = (courseId: number) => {
    setCartItems(cartItems.filter(item => item.id !== courseId));
  };

  // 모듈 선택 토글
  const handleModuleToggle = (courseId: number, moduleId: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === courseId) {
        const selectedModules = item.selectedModules || [];
        const isSelected = selectedModules.includes(moduleId);
        return {
          ...item,
          selectedModules: isSelected
            ? selectedModules.filter(id => id !== moduleId)
            : [...selectedModules, moduleId]
        };
      }
      return item;
    }));
  };

  // 드론 교구 옵션 변경
  const handleDroneOptionChange = (courseId: number, option: 'none' | 'purchase' | 'rental') => {
    setCartItems(cartItems.map(item =>
      item.id === courseId ? { ...item, droneOption: option } : item
    ));
  };

  // 아코디언 토글
  const toggleExpanded = (courseId: number) => {
    setExpandedItems(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  // 총 가격 계산
  const calculateTotalPrice = () => {
    let total = 0;
    cartItems.forEach(item => {
      // 선택된 모듈 가격 합산
      const selectedModules = item.selectedModules || [];
      const modules = item.learningMaterials || [];
      selectedModules.forEach(moduleId => {
        const module = modules.find(m => m.id === moduleId);
        if (module && module.price) {
          total += module.price;
        }
      });

      // 드론 교구 가격 추가 (현재는 0원)
      if (item.droneOption === 'purchase') {
        total += 0; // 구매 가격
      } else if (item.droneOption === 'rental') {
        total += 0; // 대여 가격
      }
    });
    return total;
  };

  // 리사이즈 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      // 최소 300px, 최대 800px
      if (newWidth >= 300 && newWidth <= 800) {
        setCartWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleCreateClass = () => {
    if (cartItems.length === 0) {
      alert('장바구니에 자료를 추가해주세요.');
      return;
    }
    // 장바구니 데이터를 URL 쿼리 파라미터로 인코딩
    const cartData = JSON.stringify(cartItems);
    const encodedCart = encodeURIComponent(cartData);
    router.push(`/education-intro?cart=${encodedCart}`);
  };


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
            {categories.map((category) => (
              <p
                key={category}
                className={`${styles.topicItem} ${selectedCategory === category ? styles.selected : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </p>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>코스를 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
              <p>{error}</p>
            </div>
          ) : (
            <div className={styles.materialsGrid}>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => {
                  // 카테고리별 색상 정의
                  const categoryColors: { [key: string]: { bg: string; text: string } } = {
                    '창업': { bg: '#E3F2FD', text: '#1976D2' },
                    '드론': { bg: '#F3E5F5', text: '#7B1FA2' },
                    'AI': { bg: '#FFF3E0', text: '#E65100' },
                    '환경': { bg: '#E8F5E9', text: '#2E7D32' }
                  };
                  const categoryColor = categoryColors[course.category] || { bg: '#F5F5F5', text: '#666' };

                  // 이미지 URL 처리
                  const getImageUrl = (thumbnail: string) => {
                    if (!thumbnail) return '/nallijaku.png';
                    if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) {
                      return thumbnail;
                    }
                    if (thumbnail.startsWith('/uploads/')) {
                      return `https://api.nallijaku.com${thumbnail}`;
                    }
                    if (thumbnail.startsWith('/')) {
                      return thumbnail; // public 폴더의 이미지
                    }
                    return `https://api.nallijaku.com/uploads/${thumbnail}`;
                  };

                  return (
                    <div
                      key={course.id}
                      className={styles.materialItem}
                      onClick={() => handleCourseClick(course.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.imageContainer}>
                        <img
                          src={getImageUrl(course.thumbnail)}
                          alt={course.title}
                          className={styles.materialImage}
                          onError={(e) => {
                            console.warn('이미지 로드 실패:', course.thumbnail);
                            (e.target as HTMLImageElement).src = '/nallijaku.png';
                          }}
                        />
                        <div 
                          className={styles.categoryTag}
                          style={{
                            backgroundColor: categoryColor.bg,
                            color: categoryColor.text,
                            fontWeight: '600'
                          }}
                        >
                          {course.category}
                        </div>
                        {course.difficulty && (
                          <div 
                            className={styles.difficultyTag}
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              color: 'white',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            {course.difficulty}
                          </div>
                        )}
                      </div>
                      <div className={styles.materialContent}>
                        <p className={styles.materialTitle}>{course.title}</p>
                        <p
                          className={styles.subtitle}
                          dangerouslySetInnerHTML={{ __html: course.description || '' }}
                        />
                        <button
                          className={styles.addToCartButton}
                          onClick={(e) => handleAddToCart(e, course.id)}
                          aria-label="장바구니에 담기"
                        >
                          <IoCartOutline size={18} />
                          장바구니 담기
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999', gridColumn: '1 / -1' }}>
                  <p>해당 카테고리의 코스가 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 장바구니 토글 버튼 (사이드바 닫혔을 때) */}
        {!isCartOpen && cartItems.length > 0 && (
          <button
            className={styles.cartToggleButton}
            onClick={() => setIsCartOpen(true)}
            aria-label="장바구니 열기"
          >
            <IoChevronBack size={24} />
            <div className={styles.cartBadge}>{cartItems.length}</div>
          </button>
        )}

        {/* 장바구니 사이드바 */}
        <div 
          className={`${styles.cartSidebar} ${isCartOpen ? styles.cartOpen : ''}`}
          style={{ width: `${cartWidth}px` }}
        >
          {/* 리사이즈 핸들 */}
          <div 
            className={styles.resizeHandle}
            onMouseDown={handleMouseDown}
          >
            <div className={styles.resizeButton}>
              <div className={styles.resizeDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          
          <div className={styles.cartHeader}>
            <div>
              <span style={{ fontSize: '24px', fontWeight: 600 }}>수업 쇼핑 카트 확인</span>
              <br></br><br></br>
              <span style={{ fontSize: '14px', color: 'grey' }}>원하는 수업을 바탕으로<br></br>학교 맞춤형 교육 커리큘럼 생성</span>
            </div>
            <button
              className={styles.cartClose}
              onClick={() => setIsCartOpen(false)}
              aria-label="장바구니 닫기"
            >
              <IoChevronForward size={24} />
            </button>
          </div>

          <div className={styles.cartContent}>
            {cartItems.length === 0 ? (
              <p className={styles.emptyCart}>장바구니가 비어있습니다.</p>
            ) : (
              <div className={styles.cartItems}>
                {cartItems.map((item) => {
                  const isDrone = item.category === '드론';
                  const modules = item.learningMaterials || [];
                  const isExpanded = expandedItems.includes(item.id);
                  
                  return (
                    <div key={item.id} className={styles.cartItem}>
                      {/* 헤더 (항상 보임) */}
                      <div 
                        className={styles.cartItemHeader}
                        onClick={() => toggleExpanded(item.id)}
                      >
                        <div className={styles.cartItemTitle}>
                          <h4>{item.title}</h4>
                          <span className={styles.itemCount}>
                            {modules.length > 0 && `${modules.length}개 모듈`}
                            {isDrone && modules.length > 0 && ' • '}
                            {isDrone && '드론 교구 옵션'}
                          </span>
                        </div>
                        <IoChevronDown 
                          className={`${styles.chevronIcon} ${isExpanded ? styles.chevronExpanded : ''}`}
                          size={20}
                        />
                      </div>

                      {/* 펼쳐지는 내용 */}
                      <div className={`${styles.cartItemContent} ${isExpanded ? styles.contentExpanded : ''}`}>
                        <div className={styles.cartItemInfo}>
                          {/* 모듈 선택 */}
                          {modules.length > 0 && (
                            <div className={styles.moduleSelection}>
                              <p className={styles.moduleTitle}>모듈 선택:</p>
                              {modules.map((module, index) => (
                                <label key={module.id} className={styles.moduleCheckbox}>
                                  <input
                                    type="checkbox"
                                    checked={(item.selectedModules || []).includes(module.id)}
                                    onChange={() => handleModuleToggle(item.id, module.id)}
                                  />
                                  <span className={styles.moduleName}>
                                    {module.title || `모듈 ${index + 1}`}
                                  </span>
                                  <span className={styles.modulePrice}>
                                    {module.price ? `${module.price.toLocaleString()}원` : '0원'}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}

                          {/* 드론 교구 옵션 */}
                          {isDrone && (
                            <div className={styles.droneOptions}>
                              <p className={styles.droneTitle}>드론 교구:</p>
                              <div className={styles.droneRadioGroup}>
                                <label className={styles.droneRadio}>
                                  <input
                                    type="radio"
                                    name={`drone-${item.id}`}
                                    checked={item.droneOption === 'none'}
                                    onChange={() => handleDroneOptionChange(item.id, 'none')}
                                  />
                                  <span>선택 안함</span>
                                </label>
                                <label className={styles.droneRadio}>
                                  <input
                                    type="radio"
                                    name={`drone-${item.id}`}
                                    checked={item.droneOption === 'purchase'}
                                    onChange={() => handleDroneOptionChange(item.id, 'purchase')}
                                  />
                                  <span>교구 구매 (0원)</span>
                                </label>
                                <label className={styles.droneRadio}>
                                  <input
                                    type="radio"
                                    name={`drone-${item.id}`}
                                    checked={item.droneOption === 'rental'}
                                    onChange={() => handleDroneOptionChange(item.id, 'rental')}
                                  />
                                  <span>교구 대여 (0원)</span>
                                </label>
                              </div>
                            </div>
                          )}

                          <button
                            className={styles.removeBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromCart(item.id);
                            }}
                          >
                            제거
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 총 가격 표시 */}
          {cartItems.length > 0 && (
            <div style={{ padding: '0 20px' }}>
              <div className={styles.totalPriceSection}>
                <div className={styles.totalPriceRow}>
                  <span className={styles.totalPriceLabel}>총 금액</span>
                  <span className={styles.totalPriceValue}>
                    {calculateTotalPrice().toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          )}

          <div style={{ width: '100%', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'grey' }}>위 수업들을 바탕으로<br></br>기관별 맞춤형 수업을 제작해드릴게요 !</p>
          </div>
          <button
            className={styles.createClassBtn}
            onClick={handleCreateClass}
            disabled={cartItems.length === 0}
          >
            수업 생성
          </button>
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


