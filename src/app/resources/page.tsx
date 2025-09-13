'use client';

import React from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import baseStyles from '../education-intro/page.module.css';
import styles from './page.module.css';
import { FiSearch } from 'react-icons/fi';

export default function ResourcesPage() {
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, []);

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
                <p className={styles.topicItem}>전체</p>
                <p className={styles.topicItem}>진로</p>
                <p className={styles.topicItem}>항공법</p>
                <p className={styles.topicItem}>항공 역학</p>
                <p className={styles.topicItem}>항공촬영기법</p>
                <p className={styles.topicItem}>드론 기초</p>
                <p className={styles.topicItem}>군 드론</p>
                <p className={styles.topicItem}>과학교과연계</p>
                <p className={styles.topicItem}>전보교과연계</p>
                <p className={styles.topicItem}>메이커톤</p>
                <p className={styles.topicItem}>더아이엠씨</p>
                <p className={styles.topicItem}>젯슨나노</p>
            </div>

            <div className={styles.materialsGrid}>
              {/* 첫 번째 행 */}
              <div className={styles.materialItem}>
                <div className={styles.imageContainer}>
                  <Image 
                    src="/학습자료/진로-배송.png" 
                    alt="진로-배송" 
                    width={200} 
                    height={200}
                    className={styles.materialImage}
                  />
                  <div className={styles.categoryTag}>진로</div>
                </div>
                <div className={styles.materialContent}>
                  <p className={styles.instructorInfo}>유한상 강사</p>
                  <p className={styles.materialTitle}>진로-배송</p>
                  <p className={styles.subtitle}>24년 2학기 디지털 새싹 데이터 분석가 전용 커리큘럼</p>
                </div>
              </div>
              <div className={styles.materialItem}>
                <div className={styles.imageContainer}>
                  <Image 
                    src="/학습자료/항공법 atoz.png" 
                    alt="항공법 A to Z" 
                    width={200} 
                    height={200}
                    className={styles.materialImage}
                  />
                  <div className={styles.categoryTag}>항공법</div>
                </div>
                <div className={styles.materialContent}>
                  <p className={styles.instructorInfo}>하가연 강사</p>
                  <p className={styles.materialTitle}>항공법 A to Z</p>
                  <p className={styles.subtitle}>자격증 시험에 나오는 기본적인 항공법 지식</p>
                </div>
              </div>
              <div className={styles.materialItem}>
                <div className={styles.imageContainer}>
                  <Image 
                    src="/학습자료/군드론.png" 
                    alt="군 드론" 
                    width={200} 
                    height={200}
                    className={styles.materialImage}
                  />
                  <div className={styles.categoryTag}>군 드론</div>
                </div>
                <div className={styles.materialContent}>
                  <p className={styles.instructorInfo}>하가연 강사</p>
                  <p className={styles.materialTitle}>군드론</p>
                  <p className={styles.subtitle}>최초 드론은 세계1차대전부터 이용되었습니다.<br></br>생각보다 오래전에 쓰인 기술, 과거에는 어떤<br></br>모습이었을까요?</p>
                </div>
              </div>
              <div className={styles.materialItem}>
                <div className={styles.imageContainer}>
                  <Image 
                    src="/학습자료/드론기초자료.png" 
                    alt="드론 기초자료" 
                    width={200} 
                    height={200}
                    className={styles.materialImage}
                  />
                  <div className={styles.categoryTag}>드론기초</div>
                </div>
                <div className={styles.materialContent}>
                  <p className={styles.instructorInfo}>유한상 강사</p>
                  <p className={styles.materialTitle}>드론 기초 자료</p>
                  <p className={styles.subtitle}>드론을 처음 접하는 사람들을 위한 자료</p>
                </div>
              </div>

              {/* 두 번째 행 */}
              <div className={styles.materialItem}>
                <div className={styles.imageContainer}>
                  <Image 
                    src="/학습자료/진로-방제.png" 
                    alt="진로-방제" 
                    width={200} 
                    height={200}
                    className={styles.materialImage}
                  />
                  <div className={styles.categoryTag}>진로</div>
                </div>
                <div className={styles.materialContent}>
                  <p className={styles.instructorInfo}>임승원 강사</p>
                  <p className={styles.materialTitle}>진로-방제</p>
                  <p className={styles.subtitle}>드론 산업분야에서 가장 성공한 드론 방제</p>
                </div>
              </div>
              <div className={styles.materialItem}>
                <div className={styles.imageContainer}>
                  <Image 
                    src="/학습자료/진로-촬영.png" 
                    alt="진로-촬영" 
                    width={200} 
                    height={200}
                    className={styles.materialImage}
                  />
                  <div className={styles.categoryTag}>진로</div>
                </div>
                <div className={styles.materialContent}>
                  <p className={styles.instructorInfo}>하가연 강사</p>
                  <p className={styles.materialTitle}>진로-촬영</p>
                  <p className={styles.subtitle}>영화촬영시, 핑수적으로 넣는 항공촬영샷</p>
                </div>
              </div>
              <div className={styles.materialItem}>
                <div className={styles.imageContainer}>
                  <Image 
                    src="/학습자료/항공역학.png" 
                    alt="항공역학" 
                    width={200} 
                    height={200}
                    className={styles.materialImage}
                  />
                  <div className={styles.categoryTag}>항공역학</div>
                </div>
                <div className={styles.materialContent}>
                  <p className={styles.instructorInfo}>유한상 강사</p>
                  <p className={styles.materialTitle}>양력의 원리를 쉽게 배우는 교육자료</p>
                  <p className={styles.subtitle}>드론의 기초 작동 원리와 관련 개념을 이해하고<br></br>직접 드론을 제작하여 비행하는 실습으로<br></br>구성된 커리큘럼입니다.</p>
                </div>
              </div>
              <div className={styles.materialItem}>
                <div className={styles.imageContainer}>
                  <Image 
                    src="/학습자료/드론 조종.png" 
                    alt="드론 조종" 
                    width={200} 
                    height={200}
                    className={styles.materialImage}
                  />
                  <div className={styles.categoryTag}>드론 조종</div>
                </div>
                <div className={styles.materialContent}>
                  <p className={styles.instructorInfo}>유한상 강사</p>
                  <p className={styles.materialTitle}>드론 조종법 고급편</p>
                  <p className={styles.subtitle}>드론 조종법은 알지만 아직 조종이 미숙한<br></br>사람들을 위한 교육</p>
                </div>
              </div>

              {/* 세 번째 행 */}
              <div className={styles.materialItem}>
                <div className={styles.imageContainer}>
                  <Image 
                    src="/학습자료/진로-소방.png" 
                    alt="진로-소방" 
                    width={200} 
                    height={200}
                    className={styles.materialImage}
                  />
                  <div className={styles.categoryTag}>진로</div>
                </div>
                <div className={styles.materialContent}>
                  <p className={styles.instructorInfo}>임승원 강사</p>
                  <p className={styles.materialTitle}>진로-소방</p>
                  <p className={styles.subtitle}>산불, 안전 초기진압이 가능한 소방드론</p>
                </div>
              </div>
              <div className={styles.materialItem}>
                <div className={styles.imageContainer}>
                  <Image 
                    src="/학습자료/진로-스포츠.png" 
                    alt="진로-스포츠" 
                    width={200} 
                    height={200}
                    className={styles.materialImage}
                  />
                  <div className={styles.categoryTag}>진로</div>
                </div>
                <div className={styles.materialContent}>
                  <p className={styles.instructorInfo}>하가연 강사</p>
                  <p className={styles.materialTitle}>진로-스포츠</p>
                  <p className={styles.subtitle}>축구드론, 레이싱드론 등 새로운 드론형태를 찾아보자</p>
                </div>
              </div>
              <div className={styles.materialItem}>
                <div className={styles.imageContainer}>
                  <Image 
                    src="/학습자료/진로-시설.png" 
                    alt="진로-시설" 
                    width={200} 
                    height={200}
                    className={styles.materialImage}
                  />
                  <div className={styles.categoryTag}>진로</div>
                </div>
                <div className={styles.materialContent}>
                  <p className={styles.instructorInfo}>유한상 강사</p>
                  <p className={styles.materialTitle}>진로-시설점검드론</p>
                  <p className={styles.subtitle}>사람이 직접 확인하기 어려운 곳을 드론으로 점검</p>
                </div>
              </div>
              <div className={styles.materialItem}>
                <div className={styles.imageContainer}>
                  <Image 
                    src="/학습자료/항공촬영.png" 
                    alt="항공촬영" 
                    width={200} 
                    height={200}
                    className={styles.materialImage}
                  />
                  <div className={styles.categoryTag}>항공촬영기법</div>
                </div>
                <div className={styles.materialContent}>
                  <p className={styles.instructorInfo}>유한상 강사</p>
                  <p className={styles.materialTitle}>항공 촬영 기법</p>
                  <p className={styles.subtitle}>패닝샷, 트레킹, 버드아이뷰 등 다양한<br></br>촬영기법 활용</p>
                </div>
              </div>
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
              <a href="#" className={baseStyles.snsIcon}>IG</a>
              <a href="#" className={baseStyles.snsIcon}>YT</a>
              <a href="#" className={baseStyles.snsIcon}>BR</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


