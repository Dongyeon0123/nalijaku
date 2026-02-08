'use client';

import React from 'react';
import styles from '@/styles/Services.module.css';

export default function Services() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Our Services</h2>
        <p className={styles.description}>
          날리자쿠가 제공하는 서비스를 소개합니다
        </p>
      </div>
    </div>
  );
}
