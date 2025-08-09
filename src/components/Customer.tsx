'use client';

import React from 'react';
import styles from '@/styles/Customer.module.css';

export default function Customer() {
  return (
    <section className={styles.customerSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>고객사</h2>
        <p className={styles.subtitle}>아이들과 선생님을 위해서 드론 교육 솔루션을<br></br> <span style={{color: '#00A169', fontWeight: 'bold'}}>함께</span> 만들어가고 있습니다</p>

        <div className={`${styles.marquee} ${styles.rowTop}`}>
          <div className={styles.marqueeInner}>
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
          </div>
        </div>

        <div className={`${styles.marquee} ${styles.rowBottom}`}>
          <div className={styles.marqueeInner}>
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
          </div>
        </div>
      </div>
    </section>
  );
}
