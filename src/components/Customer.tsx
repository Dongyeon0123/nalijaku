'use client';

import React from 'react';
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

  // 연속 스크롤 애니메이션 (협력사와 반대 방향)
  React.useEffect(() => {
    if (!isVisible) return;

    let topPosition = 0; // 첫 번째 행: 오른쪽에서 왼쪽으로 (협력사와 동일)
    let bottomPosition = -200; // 두 번째 행: 왼쪽에서 오른쪽으로 (협력사와 반대)
    const speed = 0.8; // 픽셀/프레임 속도

    const animate = () => {
      const topRow = topRowRef.current;
      const bottomRow = bottomRowRef.current;

      if (topRow && bottomRow) {
        // 첫 번째 행: 오른쪽에서 왼쪽으로 이동 (협력사와 동일)
        topPosition -= speed;
        topRow.style.transform = `translateX(${topPosition}px)`;

        // 두 번째 행: 왼쪽에서 오른쪽으로 이동 (협력사와 반대)
        bottomPosition += speed;
        bottomRow.style.transform = `translateX(${bottomPosition}px)`;

        // 더 정교한 리셋 로직
        // 실제 카드 너비를 계산해서 정확한 리셋 지점 설정
        const sampleCard = topRow.querySelector(`.${styles.card}`) as HTMLElement;
        if (sampleCard) {
          const cardWidth = sampleCard.offsetWidth + 20; // gap 포함
          const originalSetWidth = cardWidth * 5; // 원본 5개
          
          // 첫 번째 행: 왼쪽으로 완전히 지나가면 리셋
          if (Math.abs(topPosition) >= originalSetWidth) {
            topPosition = 0;
          }
          // 두 번째 행: 오른쪽으로 완전히 지나가면 왼쪽에서 다시 시작
          if (bottomPosition >= originalSetWidth) {
            bottomPosition = -originalSetWidth;
          }
        }
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
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
            <div className={styles.card}><img className={styles.logo} src="/Company/11edu.jpg" alt="고객사 1-dup3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/12lib.jpg" alt="고객사 2-dup3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/13emart.jpg" alt="고객사 3-dup3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/14bang.jpg" alt="고객사 4-dup3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/15center.jpg" alt="고객사 5-dup3" /></div>
          </div>
        </div>

        <div className={`${styles.marquee} ${styles.rowBottom} ${styles.animateUp} ${styles.delay3}`}>
          <div ref={bottomRowRef} className={styles.marqueeInner}>
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
            <div className={styles.card}><img className={styles.logo} src="/Company/16design.jpg" alt="고객사 6-dup3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/17tra.jpg" alt="고객사 7-dup3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/18lotte.jpg" alt="고객사 8-dup3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/19chungju.jpg" alt="고객사 9-dup3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Company/20squ.jpg" alt="고객사 10-dup3" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
