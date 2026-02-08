'use client';

import React from 'react';
import styles from '@/styles/AboutUs.module.css';

export default function AboutUs() {
  const [visibleElements, setVisibleElements] = React.useState<Set<string>>(new Set());
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elementId = entry.target.getAttribute('data-animate-id');
            if (elementId) {
              setVisibleElements((prev) => new Set(prev).add(elementId));
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const elements = containerRef.current?.querySelectorAll('[data-animate-id]');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.content}>
        
        <div className={styles.boxContainer}>
          <div 
            className={`${styles.boxRow} ${visibleElements.has('box1') ? styles.fadeInLeft : ''}`}
            data-animate-id="box1"
            style={{ animationDelay: '0.1s' }}
          >
            <div className={`${styles.box} ${styles.box1}`}>
              <p className={styles.boxText}>
                "복잡한 행정 업무는 줄이고, 믿을 수 있는<br></br><strong>'검증된 수업'</strong>만 바로 도입할 순 없을까?"
              </p>
              <img src="/AboutUs/about1.png" alt="About 1" className={`${styles.boxImage} ${styles.imageRight} ${styles.image1}`} />
            </div>
          </div>
          
          <div 
            className={`${styles.boxRow} ${visibleElements.has('box2') ? styles.fadeInRight : ''}`}
            data-animate-id="box2"
            style={{ animationDelay: '0.2s' }}
          >
            <div className={`${styles.box} ${styles.box2}`}>
              <img src="/AboutUs/about2.png" alt="About 2" className={`${styles.boxImage} ${styles.imageLeft}`} />
              <p className={styles.boxText}>
                "나중에 우리 아이 입시, 진로 너무 막막해요...<br></br><strong>객관적인 데이터
                  </strong>로 <strong>진로 방향</strong>을 잡아주는 수업 없을까요?"
              </p>
            </div>
          </div>
          
          <div 
            className={`${styles.boxWrapper} ${visibleElements.has('box3') ? styles.fadeInLeft : ''}`}
            data-animate-id="box3"
            style={{ animationDelay: '0.3s' }}
          >
            <div className={`${styles.box} ${styles.box3}`}>
              <p className={styles.boxText}>
                "제 생각을 직접 결과물로 만드는<br></br><strong>'진짜' 재미있는 수업</strong>을 하고 싶어요."
              </p>
              <img src="/AboutUs/about3.png" alt="About 3" className={`${styles.boxImage} ${styles.imageRight}`} />
            </div>
            <div className={styles.sideText}>
              <p className={styles.sideTextNormal}>수업 선택부터 강사 매칭까지,</p>
              <p className={styles.sideTextBold}>저희가 다 준비했어요.</p>
            </div>
          </div>
        </div>
        
        <div 
          className={styles.platformSection}
          data-animate-id="platform"
        >
          <div 
            className={`${styles.platformText} ${visibleElements.has('platform') ? styles.slideInFromLeft : ''}`}
            style={{ animationDelay: '0.1s' }}
          >
            <h3 className={styles.platformTitle}>AI 기반<br></br>디지털 비교과<br></br>교육 플랫폼</h3>
            <p className={styles.platformDescription}>
              드론, 창업, AI 활용 등 다양한 비교과 수업을<br></br>온라인 플랫폼을 통해 교육하고,
            </p>
            <p className={styles.platformDescription}>결과를 AI가 소중한 데이터 자산으로<br></br>만들어 드립니다.</p>
          </div>
          <img 
            src="/AboutUs/book.png" 
            alt="Book" 
            className={`${styles.bookImage} ${visibleElements.has('platform') ? styles.slideInFromRight : ''}`}
            style={{ animationDelay: '0.1s' }}
          />
        </div>
      </div>
    </div>
  );
}
