'use client';

import React from 'react';
import Image from 'next/image';
import styles from '@/styles/Customer.module.css';

export default function Customer() {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const topRowRef = React.useRef<HTMLDivElement | null>(null);
  const bottomRowRef = React.useRef<HTMLDivElement | null>(null);
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

  // CSS 클래스 기반 애니메이션
  React.useEffect(() => {
    if (!isVisible) return;

    const topRow = topRowRef.current;
    const bottomRow = bottomRowRef.current;

    if (topRow && bottomRow) {
      // CSS 클래스 추가
      topRow.classList.add(styles.scrollRightAnimation);
      bottomRow.classList.add(styles.scrollLeftAnimation);
    }

    return () => {
      if (topRow && bottomRow) {
        topRow.classList.remove(styles.scrollRightAnimation);
        bottomRow.classList.remove(styles.scrollLeftAnimation);
      }
    };
  }, [isVisible]);

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
          <div ref={topRowRef} className={styles.marqueeInner}>
            <div className={styles.card}><Image className={styles.logo} src="/Company/11edu.jpg" alt="고객사 1" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/12lib.jpg" alt="고객사 2" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/13emart.jpg" alt="고객사 3" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/14bang.jpg" alt="고객사 4" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/15center.jpg" alt="고객사 5" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/11edu.jpg" alt="고객사 1-dup" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/12lib.jpg" alt="고객사 2-dup" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/13emart.jpg" alt="고객사 3-dup" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/14bang.jpg" alt="고객사 4-dup" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/15center.jpg" alt="고객사 5-dup" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/11edu.jpg" alt="고객사 1-dup2" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/12lib.jpg" alt="고객사 2-dup2" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/13emart.jpg" alt="고객사 3-dup2" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/14bang.jpg" alt="고객사 4-dup2" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/15center.jpg" alt="고객사 5-dup2" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/11edu.jpg" alt="고객사 1-dup3" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/12lib.jpg" alt="고객사 2-dup3" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/13emart.jpg" alt="고객사 3-dup3" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/14bang.jpg" alt="고객사 4-dup3" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/15center.jpg" alt="고객사 5-dup3" width={200} height={120} /></div>
          </div>
        </div>

        <div className={`${styles.marquee} ${styles.rowBottom} ${styles.animateUp} ${styles.delay3}`}>
          <div ref={bottomRowRef} className={styles.marqueeInner}>
            <div className={styles.card}><Image className={styles.logo} src="/Company/16design.jpg" alt="고객사 6" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/17tra.jpg" alt="고객사 7" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/18lotte.jpg" alt="고객사 8" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/19chungju.jpg" alt="고객사 9" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/20squ.jpg" alt="고객사 10" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/16design.jpg" alt="고객사 6-dup" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/17tra.jpg" alt="고객사 7-dup" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/18lotte.jpg" alt="고객사 8-dup" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/19chungju.jpg" alt="고객사 9-dup" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/20squ.jpg" alt="고객사 10-dup" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/16design.jpg" alt="고객사 6-dup2" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/17tra.jpg" alt="고객사 7-dup2" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/18lotte.jpg" alt="고객사 8-dup2" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/19chungju.jpg" alt="고객사 9-dup2" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/20squ.jpg" alt="고객사 10-dup2" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/16design.jpg" alt="고객사 6-dup3" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/17tra.jpg" alt="고객사 7-dup3" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/18lotte.jpg" alt="고객사 8-dup3" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/19chungju.jpg" alt="고객사 9-dup3" width={200} height={120} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Company/20squ.jpg" alt="고객사 10-dup3" width={200} height={120} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
