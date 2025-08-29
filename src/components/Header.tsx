'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { IoChevronBack } from 'react-icons/io5';
import styles from '@/styles/Header.module.css';
import Link from 'next/link';

interface HeaderProps {
  forceLightMode?: boolean;
}

export default function Header({ forceLightMode = false }: HeaderProps) {
  const [progress, setProgress] = React.useState(0);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState<'login' | 'signup'>('login');
  const [signupStep, setSignupStep] = React.useState<0 | 1 | 2>(0);
  const [hasDroneExp, setHasDroneExp] = React.useState<'있음' | '없음' | null>(null);
  const [affiliation, setAffiliation] = React.useState('');
  const [role, setRole] = React.useState('');
  const [isMounted, setIsMounted] = React.useState(false);
  const headerRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      const mainElement = document.querySelector('main');
      if (!mainElement) return;

      const scrollTop = mainElement.scrollTop;
      
      // 스크롤 진행도 계산
      const { scrollHeight, clientHeight } = mainElement;
      const maxScrollable = scrollHeight - clientHeight;
      const percent = maxScrollable > 0 ? (scrollTop / maxScrollable) * 100 : 0;
      setProgress(percent);
      
      // 현재 섹션 확인하여 헤더 스타일 결정
      const homeSection = document.getElementById('home');
      if (homeSection) {
        const homeSectionBottom = homeSection.offsetTop + homeSection.offsetHeight - mainElement.offsetTop;
        const isInHomeSection = scrollTop < homeSectionBottom - 100; // 100px 여유
        setIsScrolled(!isInHomeSection);
      } else {
        // fallback: 50px 이상 스크롤하면 흰색 배경 활성화
        setIsScrolled(scrollTop > 50);
      }
    };

    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true });
      // 초기 상태 설정
      handleScroll();
      return () => {
        mainElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  React.useEffect(() => {
    const updateHeaderHeight = () => {
      const height = headerRef.current?.offsetHeight ?? 80;
      document.documentElement.style.setProperty('--header-height', `${height}px`);
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLoginOpen(false);
      }
    };
    if (isLoginOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLoginOpen]);

  const handleScrollToHome = () => {
    const homeSection = document.getElementById('home');
    const mainElement = document.querySelector('main');
    
    if (homeSection && mainElement) {
      // main 요소 내에서 home 섹션으로 스크롤
      const targetTop = homeSection.offsetTop - mainElement.offsetTop;
      mainElement.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    } else {
      // fallback으로 맨 위로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header ref={headerRef} className={`${styles.header} ${forceLightMode ? styles.scrolled : (isScrolled ? styles.scrolled : styles.transparent)}`}>
      <div className={styles.container}>
        <div className={styles.logoSection} onClick={handleScrollToHome}>
          <Image 
            src="/logo.png" 
            alt="날리자쿠 로고" 
            width={72} 
            height={40}
            className={styles.logoImage}
          />
          <Link href="/" className={styles.logoText}>
            날리자쿠
          </Link>
        </div>

        <nav className={styles.navigation}>
          <a href="#" className={styles.navLink}>
            학습 자료
          </a>
          <a href="#" className={styles.navLink}>
            날리자쿠 소개
          </a>
          <a href="#" className={styles.navLink}>
            강의하기
          </a>
        </nav>

        <div className={styles.buttonSection}>
          <button className={styles.curriculumButton}>
            전체 커리큘럼
          </button>
          <button className={styles.loginButton} onClick={() => { setModalType('login'); setSignupStep(0); setIsLoginOpen(true); }}>
            로그인
          </button>
        </div>
      </div>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>

      {isMounted && isLoginOpen && createPortal(
        <div className={styles.modalOverlay} onClick={() => { setIsLoginOpen(false); setSignupStep(0); }}>
          {modalType === 'login' ? (
            <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
              <div className={styles.modalHeader}>
                <h3 id="login-modal-title" className={styles.modalTitle}>로그인</h3>
                <button className={styles.modalClose} onClick={() => { setIsLoginOpen(false); setSignupStep(0); }} aria-label="닫기">×</button>
              </div>
              <div className={styles.modalBody}>
                <p>아이디</p>
                <input type="text" placeholder="아이디" />
                <p>비밀번호</p>
                <input type="password" placeholder="비밀번호" />
                <div className={styles.signupRow}>
                  <a href="#" className={styles.signupLink} onClick={(e) => { e.preventDefault(); setModalType('signup'); setSignupStep(0); }}>회원가입</a>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.primaryAction} onClick={() => setIsLoginOpen(false)}>로그인</button>
              </div>
            </div>
          ) : (
            <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="signup-modal-title">
              <div className={styles.modalHeader}>
                {signupStep > 0 && (
                  <button
                    className={styles.modalBack}
                    onClick={() => setSignupStep((s) => (s - 1) as 0 | 1 | 2)}
                    aria-label="이전"
                  >
                    <IoChevronBack size={24} />
                  </button>
                )}
                <h3 id="signup-modal-title" className={styles.modalTitle}>회원가입</h3>
                <button className={styles.modalClose} onClick={() => { setIsLoginOpen(false); setSignupStep(0); }} aria-label="닫기">×</button>
              </div>
              <div className={styles.progressIndicator}>
                <div className={`${styles.progressStep} ${signupStep === 0 ? styles.active : signupStep > 0 ? styles.completed : ''}`}>
                  <span className={styles.stepNumber}>1</span>
                </div>
                <div className={`${styles.progressLine} ${signupStep >= 1 ? styles.active : ''}`}></div>
                <div className={`${styles.progressStep} ${signupStep === 1 ? styles.active : signupStep > 1 ? styles.completed : ''}`}>
                  <span className={styles.stepNumber}>2</span>
                </div>
                <div className={`${styles.progressLine} ${signupStep >= 2 ? styles.active : ''}`}></div>
                <div className={`${styles.progressStep} ${signupStep === 2 ? styles.active : ''}`}>
                  <span className={styles.stepNumber}>3</span>
                </div>
              </div>
              <div className={styles.modalBody}>
                {signupStep === 0 && (
                  <>
                    <p>아이디 <span style={{ color: 'red' }}>*</span></p>
                    <input type="text" placeholder="사용할 아이디를 입력하세요." />
                    <p>비밀번호 <span style={{ color: 'red' }}>*</span></p>
                    <input type="password" placeholder="비밀번호를 입력하세요." />
                    <p>비밀번호 확인 <span style={{ color: 'red' }}>*</span></p>
                    <input type="password" placeholder="비밀번호를 다시 입력하세요." />
                    <p>이메일 <span style={{ color: 'red' }}>*</span></p>
                    <input type="text" placeholder="학습 자료를 받을 이메일 주소를 입력하세요." />
                  </>
                )}
                {signupStep === 1 && (
                  <>
                    <div className={styles.experienceRow}>
                      <p className={styles.experienceLabel}>드론 강의 경험 <span style={{ color: 'red' }}>*</span></p>
                      <div className={styles.toggleGroup}>
                        <button
                          type="button"
                          className={`${styles.toggleButton} ${hasDroneExp === '있음' ? styles.toggleButtonSelected : ''}`}
                          onClick={() => setHasDroneExp('있음')}
                        >
                          있음
                        </button>
                        <button
                          type="button"
                          className={`${styles.toggleButton} ${hasDroneExp === '없음' ? styles.toggleButtonSelected : ''}`}
                          onClick={() => setHasDroneExp('없음')}
                        >
                          없음
                        </button>
                      </div>
                    </div>
                    <p>소속</p>
                    <input type="text" placeholder="소속을 입력하세요." value={affiliation} onChange={(e) => setAffiliation(e.target.value)} />
                    <p className={styles.exampleText}>ex) ㅇㅇ중학교, 충주시 ㅇㅇ센터 등</p>
                    <p>직무/역할</p>
                    <input type="text" placeholder="현재 직무/역할을 입력하세요." value={role} onChange={(e) => setRole(e.target.value)} />
                    <p className={styles.exampleText}>ex) 교사, 과장, 교육담당자, 학생 등</p>
                  </>
                )}
                {signupStep === 2 && (
                  <>
                    <p>연락처</p>
                    <input type="tel" placeholder="연락처를 입력하세요." />
                    <p className={styles.exampleText}>숫자만 입력해 주세요. ex) 01012345678</p>
                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" />
                        <span>만 14세 이상입니다.</span>
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" />
                        <span>이용약관 및 개인정보처리방침 동의 <span style={{ color: 'red' }}>(필수)</span></span>
                      </label>
                    </div>
                  </>
                )}
                <div className={styles.signupRow}>
                  <a href="#" className={styles.signupLink} onClick={(e) => { e.preventDefault(); setModalType('login'); setSignupStep(0); }}>로그인으로 돌아가기</a>
                </div>
              </div>
              <div className={styles.modalFooter}>
                {signupStep < 2 ? (
                  <button className={styles.primaryAction} onClick={() => setSignupStep((s) => (s + 1) as 0 | 1 | 2)}>다음</button>
                ) : (
                  <button className={styles.primaryAction} onClick={() => { setIsLoginOpen(false); setSignupStep(0); setHasDroneExp(null); setAffiliation(''); setRole(''); }}>회원가입 완료</button>
                )}
              </div>
            </div>
          )}
        </div>,
        document.body
      )}
    </header>
  );
}
