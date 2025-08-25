'use client';

import React from 'react';
import Image from 'next/image';
import { IoChevronForward } from 'react-icons/io5';
import styles from '@/styles/Contact.module.css';

export default function Contact() {
  return (
    <div className={styles.contactWrapper}>
      <div className={styles.imageSection}>
        <Image 
          src="/Contact/contact.png" 
          alt="Contact Us" 
          fill
          style={{ objectFit: 'fill' }}
        />
        <div className={styles.overlay}>
          <h1 className={styles.title}>Contact us!</h1>
          <p className={styles.subtitle}>드론을 배우고 싶은 학생과 선생님을 연결합니다</p>
          <div className={styles.serviceButtonContainer}>
            <button className={styles.serviceButton}>
              서비스 소개서 보기
              <IoChevronForward size={20} />
            </button>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.primaryButton}>교육 도입하기</button>
            <button className={styles.secondaryButton}>교육 파트너 모집</button>
          </div>
        </div>
      </div>
      <div className={styles.colorSection}></div>
    </div>
  );
}
