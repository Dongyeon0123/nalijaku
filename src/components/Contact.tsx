'use client';

import React from 'react';
import Image from 'next/image';
import { IoChevronForward, IoLogoInstagram, IoLogoYoutube, IoBusiness } from 'react-icons/io5';
import styles from '@/styles/Contact.module.css';

export default function Contact() {
  return (
    <div className={styles.contactWrapper}>
      <div className={styles.imageSection}>
        <Image 
          src="/Contact/contact.png" 
          alt="Contact Us" 
          fill
          style={{ objectFit: 'fill' }}
        />
        <div className={styles.overlay}>
          <h1 className={styles.title}>Contact us!</h1>
          <p className={styles.subtitle}>드론을 배우고 싶은 학생과 선생님을 연결합니다</p>
          <div className={styles.serviceButtonContainer}>
            <button className={styles.serviceButton}>
              서비스 소개서 보기
              <IoChevronForward size={20} />
            </button>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.primaryButton}>교육 도입하기</button>
            <button className={styles.secondaryButton}>교육 파트너 모집</button>
          </div>
        </div>
      </div>
      <div className={styles.colorSection}>
        <div className={styles.footerContent}>
          {/* 왼쪽: 로고 */}
          <div className={styles.logoSection}>
            <Image 
              src="/transparentLogo.png" 
              alt="날리자쿠 로고" 
              width={120} 
              height={60}
            />
          </div>
          
          {/* 중앙: 회사 정보 */}
          <div className={styles.companyInfo}>
            <h3 className={styles.companyName}>날리자쿠</h3>
            <div className={styles.infoList}>
              <p><span>대표</span>|  이민상</p>
              <p><span>사업자 등록번호</span>|  215-65-00727</p>
              <p><span>연락처</span>|  010.5029.6452</p>
              <p><span>주소</span>|  충청북도 청주시 서원구 서원서로 30-23<br /><br></br>SK 하이닉스 창업관</p>
            </div>
            <div className={styles.legalLinks}>
              <a href="#" className={styles.legalLink}>서비스 이용약관</a>
              <a href="#" className={styles.legalLink}>개인정보처리방침</a>
            </div>
          </div>
          
          {/* 오른쪽: 메뉴 */}
          <div className={styles.menuSection}>
            <h4 className={styles.menuTitle}>메뉴</h4>
            <div className={styles.menuList}>
              <a href="#" className={styles.menuLink}>학습자료</a>
              <a href="#" className={styles.menuLink}>커뮤니티</a>
              <a href="#" className={styles.menuLink}>날리자쿠 소개</a>
              <a href="#" className={styles.menuLink}>사용 가이드</a>
            </div>
          </div>
          
          {/* SNS 섹션 */}
          <div className={styles.snsSection}>
            <h4 className={styles.snsTitle}>날리자쿠 SNS</h4>
            <div className={styles.snsIcons}>
              <a href="#" className={styles.snsIcon}>
                <IoLogoInstagram size={24} />
              </a>
              <a href="#" className={styles.snsIcon}>
                <IoLogoYoutube size={24} />
              </a>
              <a href="#" className={styles.snsIcon}>
                <IoBusiness size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
