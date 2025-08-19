'use client';

import React from 'react';
import styles from '@/styles/Who.module.css';

export default function Who() {
    return (
        <section className={styles.whoSection}>
            <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    <div className={styles.ImageSection}>
                        <img src="/Who/Child1.png" alt="Child1" />
                    </div>
                    <div className={styles.textContent}>
                        <h2 className={styles.title}>WHO?</h2>
                        <p className={styles.subTitle}>
                            아이부터 성인까지,<br></br>
                            <span style={{fontWeight: '500'}}>다양한 연령의 드론 교육</span>
                        </p>
                        <div className={styles.buttonSection}>
                            <button className={styles.button1}>Child</button>
                            <button className={styles.button2}>Adult</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}