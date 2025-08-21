'use client';

import React from 'react';
import { FaPeopleGroup } from 'react-icons/fa6';
import { BsGraphUpArrow } from 'react-icons/bs';
import { PiGraph } from 'react-icons/pi';
import styles from '@/styles/Why2.module.css';

export default function Why2() {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(currentSection);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    observer.observe(currentSection);

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`${styles.why2Section} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.textContent}>
            <h2 className={`${styles.title} ${styles.animateUp}`}>WHY?</h2>
            
            <div className={`${styles.mainPoint} ${styles.animateUp} ${styles.delay1}`}>
              <div className={styles.highlightText}>검증된</div>드론 전문가 강사풀
            </div>
            
            <div className={`${styles.subPoint} ${styles.animateUp} ${styles.delay2}`}>
              드론 전문교육원 원장, 드론 강사 경력 5년, 드론봇<br />
              전문 부사관이 검증하는 강사풀
            </div>

            <div className={`${styles.feature} ${styles.firstFeature} ${styles.animateUp} ${styles.delay3}`}>
              <div className={styles.featureHeader}>
                <div className={styles.iconCircle}>
                  <FaPeopleGroup className={styles.featureIcon} />
                </div>
                <div className={styles.featureContent}>
                  <div className={styles.featureTitle}>
                    <span className={styles.greenText}>찾아가는 교사 연수제</span>
                  </div>
                  <div className={styles.featureDescription}>
                    팀이 직접 학교 현장을 방문하여 교사들의 필요에<br></br>맞춘 실질적 역량 강화 교육을 제공
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.feature} ${styles.animateUp} ${styles.delay4}`}>
              <div className={styles.featureHeader}>
                <div className={styles.iconCircle}>
                  <BsGraphUpArrow className={styles.featureIcon} />
                </div>
                <div className={styles.featureContent}>
                  <div className={styles.featureTitle}>
                    <span className={styles.greenText}>실질적 성과 검증</span>
                  </div>
                  <div className={styles.featureDescription}>
                    강사별 교육 효과성과 수강생 만족도, 안전 관리 기록<br />
                    데이터를 정량적으로 수집 및 분석
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.feature} ${styles.animateUp} ${styles.delay5}`}>
              <div className={styles.featureHeader}>
                <div className={styles.iconCircle}>
                  <PiGraph className={styles.featureIcon} />
                </div>
                <div className={styles.featureContent}>
                  <div className={styles.featureTitle}>
                    <span className={styles.greenText}>지속가능한 드론 교육 생태계 구축</span>
                  </div>
                  <div className={styles.featureDescription}>
                    강사들이 교육에만 집중하도록 행정 및 마케팅을<br />
                    지원하여, 지속가능한 드론교육 생태계 구축
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.imageSection} ${styles.animateUp} ${styles.delay6}`}>
             <div className={styles.imagePlaceholder}>
               <img 
                 src="/Why/Rectangle 60.png" 
                 alt="Rectangle 60" 
                 className={styles.rectangle60}
               />
               <img 
                 src="/Why/Rectangle 61.png" 
                 alt="Rectangle 61" 
                 className={styles.rectangle61}
               />
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
