'use client';

import React from 'react';
import Image from 'next/image';
import styles from '@/styles/Cooperation.module.css';

export default function Cooperation() {
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
      className={`${styles.cooperationSection} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.container}>
        <h2 className={`${styles.title} ${styles.animateUp}`}>협력업체</h2>
        <p className={`${styles.subtitle} ${styles.animateUp} ${styles.delay1}`}>
          이미 많은 업체에서 <span style={{color: '#00A169', fontWeight: 'bold'}}>날리자쿠</span>와 함께하고 있습니다
        </p>

        <div className={`${styles.marquee} ${styles.rowTop} ${styles.animateUp} ${styles.delay2}`}>
          <div ref={topRowRef} className={styles.marqueeInner}>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/1arrbot.jpg" alt="협력사 1" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/2dello.jpg" alt="협력사 2" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/3curioud.jpg" alt="협력사 3" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/4spark.jpg" alt="협력사 4" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/5kitech.jpg" alt="협력사 5" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/1arrbot.jpg" alt="협력사 1-dup" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/2dello.jpg" alt="협력사 2-dup" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/3curioud.jpg" alt="협력사 3-dup" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/4spark.jpg" alt="협력사 4-dup" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/5kitech.jpg" alt="협력사 5-dup" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/1arrbot.jpg" alt="협력사 1-dup2" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/2dello.jpg" alt="협력사 2-dup2" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/3curioud.jpg" alt="협력사 3-dup2" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/4spark.jpg" alt="협력사 4-dup2" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/5kitech.jpg" alt="협력사 5-dup2" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/1arrbot.jpg" alt="협력사 1-dup3" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/2dello.jpg" alt="협력사 2-dup3" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/3curioud.jpg" alt="협력사 3-dup3" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/4spark.jpg" alt="협력사 4-dup3" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/5kitech.jpg" alt="협력사 5-dup3" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
          </div>
        </div>

        <div className={`${styles.marquee} ${styles.rowBottom} ${styles.animateUp} ${styles.delay3}`}>
          <div ref={bottomRowRef} className={styles.marqueeInner}>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/6seoul.jpg" alt="협력사 6" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/7chungju.jpg" alt="협력사 7" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/8KU.jpg" alt="협력사 8" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/9sori.jpg" alt="협력사 9" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/6seoul.jpg" alt="협력사 6-dup" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/7chungju.jpg" alt="협력사 7-dup" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/8KU.jpg" alt="협력사 8-dup" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/9sori.jpg" alt="협력사 9-dup" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/6seoul.jpg" alt="협력사 6-dup2" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/7chungju.jpg" alt="협력사 7-dup2" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/8KU.jpg" alt="협력사 8-dup2" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/9sori.jpg" alt="협력사 9-dup2" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/6seoul.jpg" alt="협력사 6-dup3" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/7chungju.jpg" alt="협력사 7-dup3" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/8KU.jpg" alt="협력사 8-dup3" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
            <div className={styles.card}><Image className={styles.logo} src="/Cooperation/9sori.jpg" alt="협력사 9-dup3" width={200} height={120} sizes="(max-width: 768px) 100px, 200px" priority={false} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}