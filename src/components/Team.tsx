'use client';

import Image from 'next/image';
import styles from '@/styles/Team.module.css';

export default function Team() {
    return (
        <section className={styles.teamSection}>
            <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    <div className={styles.leftContent}>
                        <div className={styles.textContent}>
                            <h2 className={styles.title}>Team 날리자쿠</h2>
                            <p className={styles.subTitle}>
                                직원 절반이 드론 교관,<br></br>교육에 정말<br></br>자신 있습니다.
                            </p>
                        </div>
                        <div className={styles.subText}>
                            <p>날리자KU 팀은 지속가능성 있는 드론 교육 시장을<br></br> 만들어가고 있습니다.
                            드론이라는 꿈을 꾸는 아이들부터<br></br>드론 선생님을 희망하는 분들까지 모두 <span className={styles.subTextSpan}>드론을 '쉽고<br></br>
                            재미있게' 교육하는 시스템</span>을 연구합니다.</p>
                        </div>
                    </div>
                    <div className={styles.rightContent}>
                        <div className={styles.imageContainer}>
                            <Image 
                                src="/Team/team1.png" 
                                alt="Team 날리자쿠" 
                                width={580} 
                                height={400}
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 575px"
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.imageWrapper}>
                    <div className={styles.leftImage}>
                        <Image 
                            src="/Team/team2.png" 
                            alt="Team 날리자쿠" 
                            width={600} 
                            height={500}
                        />
                    </div>
                    <div className={styles.rightImage}>
                        <Image 
                            src="/Team/team3.png" 
                            alt="Team 날리자쿠" 
                            width={500} 
                            height={500}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}