'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { IoChevronBack } from 'react-icons/io5';
import styles from '@/styles/Header.module.css';
import Link from 'next/link';
import { SignupData, LoginData } from '@/types/auth';
import { signup, login, checkServerHealth, getUserCount, checkAdminStatus } from '@/services/authService';
import { validateSignupStep1, validateSignupStep2, validateSignupStep3 } from '@/utils/validation';

interface HeaderProps {
  forceLightMode?: boolean;
}



export default function Header({ forceLightMode = false }: HeaderProps) {
  const [progress, setProgress] = React.useState(0);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState<'login' | 'signup'>('login');
  const [signupStep, setSignupStep] = React.useState<0 | 1 | 2>(0);
  const [showLogoutSuccessModal, setShowLogoutSuccessModal] = React.useState(false);
  const [hasDroneExp, setHasDroneExp] = React.useState<'있음' | '없음' | null>(null);
  const [affiliation, setAffiliation] = React.useState('');
  const [role, setRole] = React.useState('');
  const [isMounted, setIsMounted] = React.useState(false);
  const headerRef = React.useRef<HTMLElement | null>(null);

  // 폼 데이터 상태
  const [signupForm, setSignupForm] = React.useState<SignupData>({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    organization: '',
    role: '',
    phone: '',
    droneExperience: false,
    termsAgreed: false
  });

  // 체크박스 개별 상태
  const [ageCheck, setAgeCheck] = React.useState(false);
  const [termsCheck, setTermsCheck] = React.useState(false);

  const [loginForm, setLoginForm] = React.useState<LoginData>({
    username: '',
    password: '',
    rememberMe: false
  });

  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<{username: string; token?: string; role?: string} | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);



  // 회원가입 처리
  const handleSignup = async () => {
    // 최종 유효성 검사
    const errors = validateSignupStep3(signupForm.phone, ageCheck, termsCheck);
    if (errors.length > 0) {
      setErrorMessage(errors[0]);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // 먼저 서버 상태 확인
      console.log('🔍 서버 상태 확인 중...');
      await checkServerHealth();
      await getUserCount();

      // role 매핑 (프론트엔드 값 → 백엔드 enum 값)
      const roleMapping: { [key: string]: string } = {
        '1': 'GENERAL',
        '2': 'STUDENT', 
        '3': 'TEACHER',
        '4': 'INSTRUCTOR',
        '5': 'ADMIN'
      };
      
      const signupData = {
        ...signupForm,
        organization: affiliation,
        role: roleMapping[role] || 'GENERAL', // 매핑된 role 사용, 없으면 GENERAL
        termsAgreed: ageCheck && termsCheck // 두 체크박스 모두 체크되어야 true
      };

      const result = await signup(signupData);
      
      if (result.success) {
        setSuccessMessage('회원가입이 완료되었습니다!');
        setTimeout(() => {
          setIsLoginOpen(false);
          setSignupStep(0);
          resetSignupForm();
          setSuccessMessage('');
        }, 2000);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.';
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 처리
  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      setErrorMessage('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await login(loginForm);
      
      if (result.success) {
        // 로그인 상태 업데이트
        console.log('🔍 로그인 응답 데이터:', result.data);
        console.log('🔍 사용자 role:', result.data?.role);
        
        const userData: {username: string; token?: string; role?: string} = {
          username: loginForm.username,
          token: result.data?.token,
          role: result.data?.role || 'GENERAL' // 백엔드에서 role 정보 받기
        };
        
        console.log('🔍 저장할 userData:', userData);
        setIsLoggedIn(true);
        setUserInfo(userData);
        
        // localStorage에 사용자 정보 저장
        localStorage.setItem('userInfo', JSON.stringify(userData));
        
        // 관리자 권한 확인
        try {
          const adminResult = await checkAdminStatus(loginForm.username);
          setIsAdmin(adminResult.data.isAdmin);
          console.log('🔐 관리자 권한 확인 결과:', adminResult.data.isAdmin);
        } catch (error) {
          console.log('❌ 관리자 권한 확인 실패:', error);
          setIsAdmin(false);
        }
        
        setSuccessMessage('로그인되었습니다!');
        
        // 로그인 성공 이벤트 발생
        window.dispatchEvent(new CustomEvent('loginSuccess'));
        
        setTimeout(() => {
          setIsLoginOpen(false);
          resetLoginForm();
          setSuccessMessage('');
        }, 2000);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.';
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출 (선택사항)
      // await logout();
      
      // 현재 페이지가 resources인지 확인
      const isOnResourcesPage = window.location.pathname === '/resources';
      
      // 로그인 상태 초기화
      setIsLoggedIn(false);
      setUserInfo(null);
      setIsAdmin(false);
      
      // localStorage에서 사용자 정보 삭제
      localStorage.removeItem('userInfo');
      
      // 로그아웃 성공 모달 표시
      setShowLogoutSuccessModal(true);
      
      setTimeout(() => {
        setShowLogoutSuccessModal(false);
        // resources 페이지에서 로그아웃한 경우 메인 페이지로 이동
        if (isOnResourcesPage) {
          window.location.href = '/';
        }
      }, 2000);
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    }
  };

  // 폼 초기화 함수들
  const resetSignupForm = () => {
    setSignupForm({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      organization: '',
      role: '',
      phone: '',
      droneExperience: false,
      termsAgreed: false
    });
    setHasDroneExp(null);
    setAffiliation('');
    setRole('');
    setAgeCheck(false);
    setTermsCheck(false);
  };

  const resetLoginForm = () => {
    setLoginForm({
      username: '',
      password: '',
      rememberMe: false
    });
  };

  // 모달 닫기 시 폼 초기화
  const handleCloseModal = () => {
    setIsLoginOpen(false);
    setSignupStep(0);
    resetSignupForm();
    resetLoginForm();
    setErrorMessage('');
    setSuccessMessage('');
  };

  // 회원가입 단계별 데이터 저장 및 유효성 검사
  const handleSignupStepChange = (step: number) => {
    if (step === 1) {
      // 1단계 유효성 검사
      const errors = validateSignupStep1(
        signupForm.username, 
        signupForm.password, 
        signupForm.confirmPassword, 
        signupForm.email
      );
      
      if (errors.length > 0) {
        setErrorMessage(errors[0]);
        return;
      }
      
      setErrorMessage(''); // 에러 메시지 초기화
    } else if (step === 2) {
      // 2단계 유효성 검사
      const errors = validateSignupStep2(affiliation, role, hasDroneExp);
      
      if (errors.length > 0) {
        setErrorMessage(errors[0]);
        return;
      }
      
      setErrorMessage(''); // 에러 메시지 초기화
      
      // 2단계 데이터 저장
      setSignupForm(prev => ({
        ...prev,
        organization: affiliation,
        role: role,
        droneExperience: hasDroneExp === '있음'
      }));
    }
    
    setSignupStep(step as 0 | 1 | 2);
  };

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
    
    // 페이지 로드 시 로그인 상태 확인
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        const userData = JSON.parse(savedUserInfo);
        setIsLoggedIn(true);
        setUserInfo(userData);
        
        // 저장된 사용자의 관리자 권한 확인
        if (userData.username) {
          try {
            const adminResult = await checkAdminStatus(userData.username);
            setIsAdmin(adminResult.data.isAdmin);
            console.log('🔐 저장된 사용자 관리자 권한 확인 결과:', adminResult.data.isAdmin);
          } catch (error) {
            console.log('❌ 저장된 사용자 관리자 권한 확인 실패:', error);
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error('저장된 사용자 정보 파싱 오류:', error);
        localStorage.removeItem('userInfo');
      }
    }
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

  // 다른 컴포넌트에서 로그인 모달을 열기 위한 커스텀 이벤트 처리
  React.useEffect(() => {
    const handleOpenLoginModal = () => {
      setModalType('login');
      setSignupStep(0);
      setIsLoginOpen(true);
    };

    window.addEventListener('openLoginModal', handleOpenLoginModal);
    return () => {
      window.removeEventListener('openLoginModal', handleOpenLoginModal);
    };
  }, []);

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
          <button 
            className={styles.navLink}
            onClick={() => {
              if (isLoggedIn) {
                window.location.href = '/resources';
              } else {
                setModalType('login');
                setSignupStep(0);
                setIsLoginOpen(true);
              }
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            학습 자료
          </button>
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
          {isLoggedIn ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>{userInfo?.username}님</span>
              {isAdmin && (
                <button className={styles.adminButton} onClick={() => window.open('/admin', '_blank')}>
                  관리자
                </button>
              )}
              <button className={styles.logoutButton} onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <button className={styles.loginButton} onClick={() => { setModalType('login'); setSignupStep(0); setIsLoginOpen(true); }}>
              로그인
            </button>
          )}
        </div>
      </div>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>

      {isMounted && isLoginOpen && createPortal(
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          {modalType === 'login' ? (
            <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
              <div className={styles.modalHeader}>
                <h3 id="login-modal-title" className={styles.modalTitle}>로그인</h3>
                <button className={styles.modalClose} onClick={handleCloseModal} aria-label="닫기">×</button>
              </div>
              <div className={styles.modalBody}>
                {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                <p>아이디</p>
                <input 
                  type="text" 
                  placeholder="아이디" 
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                />
                <p>비밀번호</p>
                <input 
                  type="password" 
                  placeholder="비밀번호" 
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                />
                <div className={styles.rememberMeRow}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, rememberMe: e.target.checked }))}
                    />
                    <span>로그인 상태 유지</span>
                  </label>
                </div>
                <div className={styles.signupRow}>
                  <a href="#" className={styles.signupLink} onClick={(e) => { e.preventDefault(); setModalType('signup'); setSignupStep(0); }}>회원가입</a>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button 
                  className={styles.primaryAction} 
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? '로그인 중...' : '로그인'}
                </button>
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
                <button className={styles.modalClose} onClick={handleCloseModal} aria-label="닫기">×</button>
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
                {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                {signupStep === 0 && (
                  <>
                    <p>아이디 <span style={{ color: 'red' }}>*</span></p>
                    <input 
                      type="text" 
                      placeholder="사용할 아이디를 입력하세요." 
                      value={signupForm.username}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, username: e.target.value }))}
                    />
                    <p>비밀번호 <span style={{ color: 'red' }}>*</span></p>
                    <input 
                      type="password" 
                      placeholder="비밀번호를 입력하세요." 
                      value={signupForm.password}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <p>비밀번호 확인 <span style={{ color: 'red' }}>*</span></p>
                    <input 
                      type="password" 
                      placeholder="비밀번호를 다시 입력하세요." 
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                    <p>이메일 <span style={{ color: 'red' }}>*</span></p>
                    <input 
                      type="text" 
                      placeholder="학습 자료를 받을 이메일 주소를 입력하세요." 
                      value={signupForm.email}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                    />
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
                    <p>소속 <span style={{ color: 'red' }}>*</span></p>
                    <input 
                      type="text" 
                      placeholder="소속을 입력하세요." 
                      value={affiliation} 
                      onChange={(e) => setAffiliation(e.target.value)} 
                    />
                    <p className={styles.exampleText}>ex) ㅇㅇ중학교, 충주시 ㅇㅇ센터 등</p>
                    <p>직무/역할 <span style={{ color: 'red' }}>*</span></p>
                    <input 
                      type="text" 
                      placeholder="현재 직무/역할을 입력하세요." 
                      value={role} 
                      onChange={(e) => setRole(e.target.value)} 
                    />
                    <p className={styles.exampleText}>ex) 교사, 과장, 교육담당자, 학생 등</p>
                  </>
                )}
                {signupStep === 2 && (
                  <>
                    <p>연락처 <span style={{ color: 'red' }}>*</span></p>
                    <input 
                      type="tel" 
                      placeholder="연락처를 입력하세요." 
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                    <p className={styles.exampleText}>숫자만 입력해 주세요. ex) 01012345678</p>
                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          checked={ageCheck}
                          onChange={(e) => setAgeCheck(e.target.checked)}
                        />
                        <span>만 14세 이상입니다.</span>
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          checked={termsCheck}
                          onChange={(e) => setTermsCheck(e.target.checked)}
                        />
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
                  <button 
                    className={styles.primaryAction} 
                    onClick={() => handleSignupStepChange(signupStep + 1)}
                  >
                    다음
                  </button>
                ) : (
                  <button 
                    className={styles.primaryAction} 
                    onClick={handleSignup}
                    disabled={isLoading}
                  >
                    {isLoading ? '회원가입 중...' : '회원가입 완료'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* 로그아웃 성공 모달 */}
      {isMounted && showLogoutSuccessModal && createPortal(
        <div className={styles.modalOverlay}>
          <div className={styles.logoutSuccessModal}>
            <div className={styles.modalContent}>
              <div className={styles.successIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#04AD74"/>
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={styles.modalTitle}>로그아웃 완료</h3>
              <p className={styles.modalMessage}>
                안전하게 로그아웃되었습니다.
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
