'use client';

import React from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import baseStyles from '../education-intro/page.module.css';
import styles from './page.module.css';
import { FiSearch } from 'react-icons/fi';
import { FaInstagram, FaYoutube, FaBloggerB } from 'react-icons/fa';
import { IoCartOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface Material {
  id: number;
  category: string;
  subCategory?: string;
  image: string;
  alt: string;
  instructor: string;
  title: string;
  subtitle: string;
  description?: string;
  price?: number;
  duration?: string;
  level?: string;
}

interface CartItem extends Material {
  quantity: number;
}

export default function ResourcesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = React.useState('전체');
  const [selectedSubCategory, setSelectedSubCategory] = React.useState<string | null>(null);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [materialsData, setMaterialsData] = React.useState<Material[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [subCategories, setSubCategories] = React.useState<{ [key: string]: string[] }>({});
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

  // 백엔드에서 학습자료 데이터 가져오기
  React.useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('학습자료 API 호출');

        // Axios 사용 (인증 토큰 자동 포함)
        const response = await api.get('/api/resources');

        console.log('학습자료 로드 성공:', response.data);

        const result = response.data;

        if (result.success && result.data) {
          // 백엔드가 이제 한글 카테고리를 반환하므로 변환 불필요
          setMaterialsData(result.data);
        } else if (result.data && Array.isArray(result.data)) {
          // success 필드가 없어도 data가 배열이면 처리
          setMaterialsData(result.data);
        } else {
          console.warn('예상치 못한 API 응답 형식:', result);
          setError('학습자료 데이터 형식이 올바르지 않습니다.');
        }

        // 카테고리는 별도 API에서 가져오기
        try {
          // 새로운 계층형 카테고리 API 사용
          const categoriesResponse = await api.get('/api/categories');
          console.log('카테고리 로드 성공:', categoriesResponse.data);
          
          if (categoriesResponse.data.success && categoriesResponse.data.data?.categories) {
            const categoryData = categoriesResponse.data.data.categories;
            
            // 메인 카테고리 추출
            const mainCategories = categoryData.map((cat: any) => cat.name);
            setCategories(mainCategories);
            
            // 서브카테고리 맵 생성
            const subCategoryMap: { [key: string]: string[] } = {};
            categoryData.forEach((cat: any) => {
              if (cat.subCategories && cat.subCategories.length > 0) {
                subCategoryMap[cat.name] = cat.subCategories.map((sub: any) => sub.name);
              }
            });
            setSubCategories(subCategoryMap);
            
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
        console.error('학습자료 로드 실패:', err);
        if (err.response?.status === 401) {
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          localStorage.clear();
          window.location.href = '/';
        } else {
          setError('학습자료를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // 필터링된 카드 데이터
  const filteredMaterials = materialsData.filter(material => {
    // 카테고리 필터
    if (selectedCategory !== '전체' && material.category !== selectedCategory) {
      return false;
    }
    // 서브카테고리 필터
    if (selectedSubCategory && material.subCategory !== selectedSubCategory) {
      return false;
    }
    return true;
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null); // 카테고리 변경 시 서브카테고리 초기화
  };

  const handleMaterialClick = (materialId: number) => {
    router.push(`/resources/${materialId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, materialId: number) => {
    e.stopPropagation();
    const material = materialsData.find(m => m.id === materialId);
    if (material) {
      const existingItem = cartItems.find(item => item.id === materialId);
      if (existingItem) {
        setCartItems(cartItems.map(item =>
          item.id === materialId ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setCartItems([...cartItems, { ...material, quantity: 1 }]);
      }
      setIsCartOpen(true);
    }
  };

  const handleRemoveFromCart = (materialId: number) => {
    setCartItems(cartItems.filter(item => item.id !== materialId));
  };

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

          {/* 서브카테고리 필터 */}
          {selectedCategory !== '전체' && subCategories[selectedCategory] && (
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              flexWrap: 'wrap', 
              marginTop: '20px',
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <button
                onClick={() => setSelectedSubCategory(null)}
                style={{
                  padding: '8px 16px',
                  border: selectedSubCategory === null ? '2px solid #04AD74' : '1px solid #ddd',
                  backgroundColor: selectedSubCategory === null ? '#E8F5E9' : '#ffffff',
                  color: selectedSubCategory === null ? '#04AD74' : '#666',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                전체
              </button>
              {subCategories[selectedCategory].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub)}
                  style={{
                    padding: '8px 16px',
                    border: selectedSubCategory === sub ? '2px solid #04AD74' : '1px solid #ddd',
                    backgroundColor: selectedSubCategory === sub ? '#E8F5E9' : '#ffffff',
                    color: selectedSubCategory === sub ? '#04AD74' : '#666',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>학습자료를 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
              <p>{error}</p>
            </div>
          ) : (
            <div className={styles.materialsGrid}>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    className={styles.materialItem}
                    onClick={() => handleMaterialClick(material.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.imageContainer}>
                      <img
                        src={material.image.startsWith('http') ? material.image : `https://api.nallijaku.com${material.image}`}
                        alt={material.alt}
                        className={styles.materialImage}
                        onError={(e) => {
                          console.error('이미지 로드 실패:', material.image);
                          (e.target as HTMLImageElement).src = '/placeholder.png';
                        }}
                      />
                      <div className={styles.categoryTag}>
                        {material.category}
                        {material.subCategory && (
                          <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.9 }}>
                            · {material.subCategory}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={styles.materialContent}>
                      <p className={styles.materialTitle}>{material.title}</p>
                      <p
                        className={styles.subtitle}
                        dangerouslySetInnerHTML={{ __html: material.subtitle }}
                      />
                      <button
                        className={styles.addToCartButton}
                        onClick={(e) => handleAddToCart(e, material.id)}
                        aria-label="장바구니에 담기"
                      >
                        <IoCartOutline size={18} />
                        장바구니 담기
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999', gridColumn: '1 / -1' }}>
                  <p>해당 카테고리의 학습자료가 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 장바구니 사이드바 */}
        <div className={`${styles.cartSidebar} ${isCartOpen ? styles.cartOpen : ''}`}>
          <div className={styles.cartHeader}>
            <div>
              <span style={{ fontSize: '24px', fontWeight: 600 }}>수업 쇼핑 카트 확인</span>
              <br></br><br></br>
              <span style={{ fontSize: '14px', color: 'grey' }}>원하는 수업을 바탕으로<br></br>학교 맞춤형 교육 커리큘럼 생성</span>
            </div>
            <button
              className={styles.cartClose}
              onClick={() => setIsCartOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className={styles.cartContent}>
            {cartItems.length === 0 ? (
              <p className={styles.emptyCart}>장바구니가 비어있습니다.</p>
            ) : (
              <div className={styles.cartItems}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.cartItemInfo}>
                      <h4>{item.title}</h4>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      제거
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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


