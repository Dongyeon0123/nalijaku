'use client';

import React from 'react';
import styles from '@/styles/Customer.module.css';

export default function Customer() {
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
      className={`${styles.customerSection} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.container}>
        <h2 className={`${styles.title} ${styles.animateUp}`}>고객사</h2>
        <p className={`${styles.subtitle} ${styles.animateUp} ${styles.delay1}`}>
          아이들과 선생님을 위해서 드론 교육 솔루션을<br></br> <span style={{color: '#00A169', fontWeight: 'bold'}}>함께</span> 만들어가고 있습니다
        </p>

        <div className={`${styles.marquee} ${styles.rowTop} ${styles.animateUp} ${styles.delay2}`}>
          <div className={styles.marqueeInner}>
            <div className={styles.card}><img className={styles.logo} src="/Company/11edu.jpg" alt="고객사 1" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/12lib.jpg" alt="고객사 2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/13emart.jpg" alt="고객사 3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/14bang.jpg" alt="고객사 4" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/15center.jpg" alt="고객사 5" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/11edu.jpg" alt="고객사 1-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/12lib.jpg" alt="고객사 2-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/13emart.jpg" alt="고객사 3-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/14bang.jpg" alt="고객사 4-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/15center.jpg" alt="고객사 5-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/11edu.jpg" alt="고객사 1-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/12lib.jpg" alt="고객사 2-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/13emart.jpg" alt="고객사 3-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/14bang.jpg" alt="고객사 4-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/15center.jpg" alt="고객사 5-dup2" /></div>
          </div>
        </div>

        <div className={`${styles.marquee} ${styles.rowBottom} ${styles.animateUp} ${styles.delay3}`}>
          <div className={styles.marqueeInner}>
            <div className={styles.card}><img className={styles.logo} src="/Company/16design.jpg" alt="고객사 6" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/17tra.jpg" alt="고객사 7" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/18lotte.jpg" alt="고객사 8" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/19chungju.jpg" alt="고객사 9" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/20squ.jpg" alt="고객사 10" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/16design.jpg" alt="고객사 6-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/17tra.jpg" alt="고객사 7-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/18lotte.jpg" alt="고객사 8-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/19chungju.jpg" alt="고객사 9-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/20squ.jpg" alt="고객사 10-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/16design.jpg" alt="고객사 6-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/17tra.jpg" alt="고객사 7-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/18lotte.jpg" alt="고객사 8-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/19chungju.jpg" alt="고객사 9-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/20squ.jpg" alt="고객사 10-dup2" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
