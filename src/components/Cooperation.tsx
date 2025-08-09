'use client';

import React from 'react';
import styles from '@/styles/Cooperation.module.css';

export default function Cooperation() {
  return (
    <section className={styles.cooperationSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>협력업체</h2>
        <p className={styles.subtitle}>이미 많은 업체에서 <span style={{color: '#00C187', fontWeight: 'bold'}}>날리자쿠</span>와 함께하고 있습니다</p>

        <div className={`${styles.marquee} ${styles.rowTop}`}>
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

        <div className={`${styles.marquee} ${styles.rowBottom}`}>
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