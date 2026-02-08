'use client';

import React from 'react';
import styles from '@/styles/Services.module.css';

export default function Services() {
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
        <p 
          className={`${styles.description} ${visibleElements.has('title') ? styles.fadeInUp : ''}`}
          data-animate-id="title"
        >
          모든 교육을 성장의 데이터로!
        </p>
        <h2 
          className={`${styles.title} ${visibleElements.has('title') ? styles.fadeInUp : ''}`}
          data-animate-id="title"
          style={{ animationDelay: '0.2s' }}
        >
          비교과 교육의 새로운 패러다임
        </h2>
        
        <div className={styles.boxContainer}>
          <div 
            className={`${styles.box} ${styles.box1} ${visibleElements.has('box1') ? styles.slideInFromLeft : ''}`}
            data-animate-id="box1"
            style={{ animationDelay: '0.1s' }}
          >
            <div className={styles.boxContent}>
              <h3 className={styles.boxTitle}>문제 해결력을 키워주는 AI 튜터</h3>
              <p className={styles.boxText}>학생 스스로 문제를 해결하는 힘을 길러주는<br/><span style={{color:"#00A881", fontWeight:"600"}}>'AI 튜터'</span>가 함께해요. 검증된 교육 DB만<br/>학습한 안전한 환경에서 아이들의<br/>학습을 보조합니다.</p>
            </div>
            <img src="/service/robot.png" alt="AI 튜터" className={styles.box1Image} />
          </div>
          <div 
            className={`${styles.box} ${styles.box2} ${visibleElements.has('box2') ? styles.slideInFromLeft : ''}`}
            data-animate-id="box2"
            style={{ animationDelay: '0.2s' }}
          >
            <div className={`${styles.boxContent} ${styles.boxContentRight}`}>
              <h3 className={styles.boxTitle}>기관별 맞춤형 교육 솔루션</h3>
              <p className={styles.boxText}>원하는 수업을 선택하고 추천도 받아보세요.<br/>날리자쿠만의 <span style={{color:"#00A881", fontWeight:"600"}}>ai 추천 서비스</span>가 도입되어<br/>기관별 예산, 상황, 희망 교육에 맞게<br/>매칭해 드려요.</p>
            </div>
            <img src="/service/sol.png" alt="교육 솔루션" className={styles.box2Image} />
          </div>
          <div 
            className={`${styles.box} ${styles.box3} ${visibleElements.has('box3') ? styles.slideInFromRight : ''}`}
            data-animate-id="box3"
            style={{ animationDelay: '0.1s' }}
          >
            <div className={styles.boxContent}>
              <h3 className={styles.boxTitle}>원스톱 행정 업무 자동화</h3>
              <p className={styles.boxText}>맞춤형 견적서를 1초만에 생성하고,<br/>강사 이력서까지 즉시 조회하여<br/>선생님의 업무시간을 <span style={{color:"#00A881", fontWeight:"600"}}>80% 단축</span>해요.</p>
            </div>
            <img src="/service/document.png" alt="행정 업무" className={styles.box3Image} />
          </div>
          <div 
            className={`${styles.box} ${styles.box4} ${visibleElements.has('box4') ? styles.slideInFromRight : ''}`}
            data-animate-id="box4"
            style={{ animationDelay: '0.2s' }}
          >
            <div className={styles.boxContent}>
              <h3 className={styles.boxTitle}>AI 기반 진로 큐레이션 서비스</h3>
              <p className={styles.boxText}>학생 성적·활동·성향부터 입시·산업 분석까지<br/>통합하여, 학부모와 교사가 믿고 쓸 수 있는<br/><span style={{color:"#00A881", fontWeight:"600"}}>맞춤 진로 리포트</span>를 제공합니다.</p>
            </div>
            <img src="/service/ai.png" alt="진로 큐레이션" className={styles.box4Image} />
          </div>
        </div>
      </div>
    </div>
  );
}
