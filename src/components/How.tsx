'use client';

import React from 'react';
import { HiArrowDown } from 'react-icons/hi2';
import styles from '@/styles/How.module.css';

export default function How() {

  return (
    <>
      <div className={styles.howHeader}>
        <h2 className={styles.howTitle}>HOW?</h2>
        <p className={styles.howSubtitle}>
          이론 교육부터 실습까지, 원스탑 교육 솔루션
        </p>
        <div className={styles.arrowIcon}>
          <HiArrowDown className={styles.arrowIconStyle} />
        </div>
      </div>
      
      <div className={styles.howCanvas} aria-hidden>
        <img className={styles.howImage1} src="/How/how1.png" alt="how1" />
        <img className={styles.howImage2} src="/How/how2.png" alt="how2" />
        <img className={styles.howImage3} src="/How/how3.png" alt="how3" />
        
        {/* Step 버튼들 */}
        <div className={styles.stepContainer1}>
          <button className={`${styles.Step1} ${styles.step1}`}>STEP 1</button>
          <span className={styles.stepText1}>배우고</span>
        </div>
        <div className={styles.stepContainer2}>
          <button className={`${styles.Step2} ${styles.step2}`}>STEP 2</button>
          <span className={styles.stepText2}>복습하고</span>
        </div>
        <div className={styles.stepContainer3}>
          <button className={`${styles.Step3} ${styles.step3}`}>STEP 3</button>
          <span className={styles.stepText3}>직접 날려봐</span>
        </div>
        
        {/* 설명 박스들 */}
        <div className={styles.infoBox1}>
          <h3 className={styles.infoTitle}>최신화된 이론 교육 자료</h3>
          <p className={styles.infoSubtitle}>
            단순 드론 이론 강의를 넘어서 아이들에게 배워야하는<br />
            이유와, 산업과 연결된 다양한 이론 수업 진행
          </p>
        </div>
        
        <div className={styles.infoBox2}>
          <h3 className={styles.infoTitle}>퀴즈형 학습으로 재미있게 복습</h3>
          <p className={styles.infoSubtitle}>
            학생 직접 참여 및 동기 부여 증진과 학습 효과<br />
            및 역량 개발 향상
          </p>
        </div>
        
        <div className={styles.infoBox3}>
          <h3 className={styles.infoTitle}>드론 레크리에이션을 통한 드론 실습</h3>
          <p className={styles.infoSubtitle}>
            직접 조립하고 비행하는 DIY 방식을 통해 드론의 비행 원리와<br />
            구조 등 과학-기술(STEM) 핵심 지식을 재밌게 습득
          </p>
        </div>
      </div>
    </>
  );
}