'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/RecruitmentPopup.module.css';

export default function RecruitmentPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 오늘 하루 동안 안보기 체크
    const hideUntil = localStorage.getItem('hideRecruitmentPopup');
    if (hideUntil) {
      const hideDate = new Date(hideUntil);
      const now = new Date();
      if (now < hideDate) {
        return; // 팝업을 보여주지 않음
      }
    }
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleHideToday = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // 다음날 자정으로 설정
    localStorage.setItem('hideRecruitmentPopup', tomorrow.toISOString());
    setIsVisible(false);
  };

  const handleImageClick = () => {
    window.open('https://forms.gle/6pLbXYqHtTHx88e9A', '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.imageContainer}>
          <img 
            src="/강사모집.png" 
            alt="강사 모집" 
            className={styles.image}
            onClick={handleImageClick}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleHideToday} className={styles.hideTodayButton}>
            오늘 하루 동안 안보기
          </button>
          <button onClick={handleClose} className={styles.closeButton}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
