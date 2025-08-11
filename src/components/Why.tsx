'use client';

import React from 'react';
import Image from 'next/image';
import { HiArrowRight } from 'react-icons/hi2';
import styles from '@/styles/Why.module.css';

export default function Why() {
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
        threshold: 0.1,
        rootMargin: '-100px 0px',
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
      className={`${styles.whySection} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.container}>
        <h2 className={`${styles.title} ${styles.animateUp}`}>Why</h2>
        <p className={`${styles.subtitle} ${styles.animateUp} ${styles.delay1}`}>
          <span style={{color: '#00A169', fontWeight: 'bold'}}>날리자쿠</span> 드론 교육만의 차별성
        </p>

        <div className={styles.imageGridWrapper}>
          <div className={styles.imageGrid}>
          <div className={`${styles.imageCard} ${styles.animateUp} ${styles.delay2}`}>
            <div className={styles.pointLabel}>Point 1</div>
            <div className={styles.descriptionText}>
              진로 위주의 수업 구성
              <div className={styles.additionalText}>
                드론 활용 직업군 분석과 미래 산업 등을 반영하여<br></br>배워야 할 이유를 체계적으로 제공
              </div>
              <div className={styles.arrowIcon}>
                <HiArrowRight />
              </div>
            </div>
            <Image 
              src="/Why/why1.png" 
              alt="날리자쿠 차별성 1" 
              width={1200} 
              height={900} 
              className={styles.whyImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
          </div>
          <div className={`${styles.imageCard} ${styles.animateUp} ${styles.delay3}`}>
            <div className={styles.pointLabel}>Point 2</div>
            <div className={styles.descriptionText}>
              특허받은 실습 키트
              <div className={styles.additionalText}>
                특허명: '드론 조작 연습 및 테스트 시스템'<br></br>특허 출원 번호: 10-2025-0085638
              </div>
              <div className={styles.arrowIcon}>
                <HiArrowRight />
              </div>
            </div>
            <Image 
              src="/Why/why2.png" 
              alt="날리자쿠 차별성 2" 
              width={1200} 
              height={900} 
              className={styles.whyImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
          </div>
          <div className={`${styles.imageCard} ${styles.animateUp} ${styles.delay4}`}>
            <div className={styles.pointLabel}>Point 3</div>
            <div className={styles.descriptionText}>
              XR/AI기반의 디지털 기업
              <div className={styles.additionalText}>
                XR과 AI 기술을 활용해 실감형, 맞춤형 디지털<br></br>학습 경험 제공
              </div>
              <div className={styles.arrowIcon}>
                <HiArrowRight />
              </div>
            </div>
            <Image 
              src="/Why/why3.png" 
              alt="날리자쿠 차별성 3" 
              width={1200} 
              height={900} 
              className={styles.whyImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
          </div>
          </div>
        </div>
      </div>
    </section>
  );
} 