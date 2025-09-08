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


