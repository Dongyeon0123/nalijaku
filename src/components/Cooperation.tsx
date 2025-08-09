'use client';

import React from 'react';
import styles from '@/styles/Cooperation.module.css';

export default function Cooperation() {
  return (
    <section className={styles.cooperationSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>협력 파트너</h2>
        <p className={styles.subtitle}>함께하는 기관과 기업</p>

        <div className={styles.grid}>
          <div className={styles.card}>파트너 A</div>
          <div className={styles.card}>파트너 B</div>
          <div className={styles.card}>파트너 C</div>
          <div className={styles.card}>파트너 D</div>
        </div>
      </div>
    </section>
  );
}