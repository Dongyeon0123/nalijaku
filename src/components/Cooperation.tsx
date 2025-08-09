'use client';

import React from 'react';
import styles from '@/styles/Cooperation.module.css';

export default function Cooperation() {
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
        threshold: 0.1, // 10% 보일 때 애니메이션 시작 (더 일찍)
        rootMargin: '-100px 0px', // 더 많은 마진으로 스크롤 시 확실하게 보이도록
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
      className={`${styles.cooperationSection} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.container}>
        <h2 className={`${styles.title} ${styles.animateUp}`}>협력업체</h2>
        <p className={`${styles.subtitle} ${styles.animateUp} ${styles.delay1}`}>
          이미 많은 업체에서 <span style={{color: '#00A169', fontWeight: 'bold'}}>날리자쿠</span>와 함께하고 있습니다
        </p>

        <div className={`${styles.marquee} ${styles.rowTop} ${styles.animateUp} ${styles.delay2}`}>
          <div className={styles.marqueeInner}>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/1arrbot.jpg" alt="협력사 1" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/2dello.jpg" alt="협력사 2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/3curioud.jpg" alt="협력사 3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/4spark.jpg" alt="협력사 4" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/5kitech.jpg" alt="협력사 5" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/1arrbot.jpg" alt="협력사 1-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/2dello.jpg" alt="협력사 2-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/3curioud.jpg" alt="협력사 3-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/4spark.jpg" alt="협력사 4-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/5kitech.jpg" alt="협력사 5-dup" /></div>
          </div>
        </div>

        <div className={`${styles.marquee} ${styles.rowBottom} ${styles.animateUp} ${styles.delay3}`}>
          <div className={styles.marqueeInner}>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/6seoul.jpg" alt="협력사 6" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/7chungju.jpg" alt="협력사 7" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/8KU.jpg" alt="협력사 8" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/9sori.jpg" alt="협력사 9" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/6seoul.jpg" alt="협력사 6-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/7chungju.jpg" alt="협력사 7-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/8KU.jpg" alt="협력사 8-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/9sori.jpg" alt="협력사 9-dup" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}