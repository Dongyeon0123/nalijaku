'use client';

import React from 'react';
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

  // 연속 스크롤 애니메이션
  React.useEffect(() => {
    if (!isVisible) return;

    let topPosition = 0;
    let bottomPosition = -200; // 초기값을 음수로 설정하여 왼쪽에서 시작
    const speed = 0.8; // 픽셀/프레임 속도

    const animate = () => {
      const topRow = topRowRef.current;
      const bottomRow = bottomRowRef.current;

      if (topRow && bottomRow) {
        // 첫 번째 행: 오른쪽으로 이동
        topPosition -= speed;
        topRow.style.transform = `translateX(${topPosition}px)`;

        // 두 번째 행: 왼쪽으로 이동 (오른쪽에서 시작해서 왼쪽으로)
        bottomPosition += speed;
        bottomRow.style.transform = `translateX(${bottomPosition}px)`;

        // 더 정교한 리셋 로직
        // 실제 카드 너비를 계산해서 정확한 리셋 지점 설정
        const sampleCard = topRow.querySelector(`.${styles.card}`) as HTMLElement;
        if (sampleCard) {
          const cardWidth = sampleCard.offsetWidth + 20; // gap 포함
          const originalSetWidth = cardWidth * 5; // 원본 5개
          
          // 첫 번째 세트가 완전히 지나가면 리셋
          if (Math.abs(topPosition) >= originalSetWidth) {
            topPosition = 0;
          }
          // 두 번째 행은 양수가 되어 화면 오른쪽 끝에 도달하면 다시 왼쪽으로
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
      className={`${styles.cooperationSection} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.container}>
        <h2 className={`${styles.title} ${styles.animateUp}`}>협력업체</h2>
        <p className={`${styles.subtitle} ${styles.animateUp} ${styles.delay1}`}>
          이미 많은 업체에서 <span style={{color: '#00A169', fontWeight: 'bold'}}>날리자쿠</span>와 함께하고 있습니다
        </p>

        <div className={`${styles.marquee} ${styles.rowTop} ${styles.animateUp} ${styles.delay2}`}>
          <div ref={topRowRef} className={styles.marqueeInner}>
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
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/1arrbot.jpg" alt="협력사 1-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/2dello.jpg" alt="협력사 2-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/3curioud.jpg" alt="협력사 3-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/4spark.jpg" alt="협력사 4-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/5kitech.jpg" alt="협력사 5-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/1arrbot.jpg" alt="협력사 1-dup3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/2dello.jpg" alt="협력사 2-dup3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/3curioud.jpg" alt="협력사 3-dup3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/4spark.jpg" alt="협력사 4-dup3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/5kitech.jpg" alt="협력사 5-dup3" /></div>
          </div>
        </div>

        <div className={`${styles.marquee} ${styles.rowBottom} ${styles.animateUp} ${styles.delay3}`}>
          <div ref={bottomRowRef} className={styles.marqueeInner}>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/6seoul.jpg" alt="협력사 6" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/7chungju.jpg" alt="협력사 7" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/8KU.jpg" alt="협력사 8" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/9sori.jpg" alt="협력사 9" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/6seoul.jpg" alt="협력사 6-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/7chungju.jpg" alt="협력사 7-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/8KU.jpg" alt="협력사 8-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/9sori.jpg" alt="협력사 9-dup" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/6seoul.jpg" alt="협력사 6-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/7chungju.jpg" alt="협력사 7-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/8KU.jpg" alt="협력사 8-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/9sori.jpg" alt="협력사 9-dup2" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/6seoul.jpg" alt="협력사 6-dup3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/7chungju.jpg" alt="협력사 7-dup3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/8KU.jpg" alt="협력사 8-dup3" /></div>
            <div className={styles.card}><img className={styles.logo} src="/Cooperation/9sori.jpg" alt="협력사 9-dup3" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}