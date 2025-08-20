'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HiArrowDown } from 'react-icons/hi2';
import styles from '@/styles/How.module.css';

export default function How() {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const image1Ref = useRef<HTMLImageElement>(null);
  const image2Ref = useRef<HTMLImageElement>(null);
  const image3Ref = useRef<HTMLImageElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const info1Ref = useRef<HTMLDivElement>(null);
  const info2Ref = useRef<HTMLDivElement>(null);
  const info3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3, // 요소가 30% 보일 때 애니메이션 시작
      rootMargin: '0px 0px -50px 0px' // 화면 하단에서 50px 전에 애니메이션 시작
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const elementId = entry.target.getAttribute('data-element-id');
        if (elementId) {
          if (entry.isIntersecting) {
            // 약간의 지연을 두고 애니메이션 시작
            setTimeout(() => {
              setVisibleElements(prev => new Set(prev).add(elementId));
            }, 100);
          }
        }
      });
    }, observerOptions);

    // 각 요소들을 관찰
    const elements = [
      { ref: headerRef, id: 'header' },
      { ref: image1Ref, id: 'image1' },
      { ref: image2Ref, id: 'image2' },
      { ref: image3Ref, id: 'image3' },
      { ref: step1Ref, id: 'step1' },
      { ref: step2Ref, id: 'step2' },
      { ref: step3Ref, id: 'step3' },
      { ref: info1Ref, id: 'info1' },
      { ref: info2Ref, id: 'info2' },
      { ref: info3Ref, id: 'info3' }
    ];

    elements.forEach(({ ref, id }) => {
      if (ref.current) {
        ref.current.setAttribute('data-element-id', id);
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef}>
      <div 
        ref={headerRef}
        className={`${styles.howHeader} ${visibleElements.has('header') ? styles.animate : ''}`}
      >
        <h2 className={styles.howTitle}>HOW?</h2>
        <p className={styles.howSubtitle}>
          이론 교육부터 실습까지, 원스탑 교육 솔루션
        </p>
        <div className={styles.arrowIcon}>
          <HiArrowDown className={styles.arrowIconStyle} />
        </div>
      </div>
      
      <div className={styles.howCanvas} aria-hidden>
        {/* STEP 1 섹션 */}
        <div className={styles.mobileSection}>
          <img 
            ref={image1Ref}
            className={`${styles.howImage1} ${visibleElements.has('image1') ? styles.animate : ''}`} 
            src="/How/how1.png" 
            alt="how1" 
          />
          <div 
            ref={step1Ref}
            className={`${styles.stepContainer1} ${visibleElements.has('step1') ? styles.animate : ''}`}
          >
            <button className={`${styles.Step1} ${styles.step1}`}>STEP 1</button>
            <span className={styles.stepText1}>배우고</span>
          </div>
          <div 
            ref={info1Ref}
            className={`${styles.infoBox1} ${visibleElements.has('info1') ? styles.animate : ''}`}
          >
            <h3 className={styles.infoTitle}>최신화된 이론 교육 자료</h3>
            <p className={styles.infoSubtitle}>
              단순 드론 이론 강의를 넘어서 아이들에게 배워야하는<br />
              이유와, 산업과 연결된 다양한 이론 수업 진행
            </p>
          </div>
        </div>

        {/* STEP 2 섹션 */}
        <div className={styles.mobileSection}>
          <img 
            ref={image2Ref}
            className={`${styles.howImage2} ${visibleElements.has('image2') ? styles.animate : ''}`} 
            src="/How/how2.png" 
            alt="how2" 
          />
          <div 
            ref={step2Ref}
            className={`${styles.stepContainer2} ${visibleElements.has('step2') ? styles.animate : ''}`}
          >
            <button className={`${styles.Step2} ${styles.step2}`}>STEP 2</button>
            <span className={styles.stepText2}>복습하고</span>
          </div>
          <div 
            ref={info2Ref}
            className={`${styles.infoBox2} ${visibleElements.has('info2') ? styles.animate : ''}`}
          >
            <h3 className={styles.infoTitle}>퀴즈형 학습으로 재미있게 복습</h3>
            <p className={styles.infoSubtitle}>
              학생 직접 참여 및 동기 부여 증진과 학습 효과<br />
              및 역량 개발 향상
            </p>
          </div>
        </div>

        {/* STEP 3 섹션 */}
        <div className={styles.mobileSection}>
          <img 
            ref={image3Ref}
            className={`${styles.howImage3} ${visibleElements.has('image3') ? styles.animate : ''}`} 
            src="/How/how3.png" 
            alt="how3" 
          />
          <div 
            ref={step3Ref}
            className={`${styles.stepContainer3} ${visibleElements.has('step3') ? styles.animate : ''}`}
          >
            <button className={`${styles.Step3} ${styles.step3}`}>STEP 3</button>
            <span className={styles.stepText3}>직접 날려봐</span>
          </div>
          <div 
            ref={info3Ref}
            className={`${styles.infoBox3} ${visibleElements.has('info3') ? styles.animate : ''}`}
          >
            <h3 className={styles.infoTitle}>드론 레크리에이션을 통한 드론 실습</h3>
            <p className={styles.infoSubtitle}>
              직접 조립하고 비행하는 DIY 방식을 통해 드론의 비행 원리와<br />
              구조 등 과학-기술(STEM) 핵심 지식을 재밌게 습득
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}