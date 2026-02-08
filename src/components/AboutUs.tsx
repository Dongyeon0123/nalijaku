'use client';

import React from 'react';
import styles from '@/styles/AboutUs.module.css';

export default function AboutUs() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>About Us</h2>
        <p className={styles.description}>
          날리자쿠를 소개합니다
        </p>
      </div>
    </div>
  );
}
