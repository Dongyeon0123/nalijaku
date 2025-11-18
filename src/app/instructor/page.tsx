'use client';

import React from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import styles from './page.module.css';

export default function InstructorPage() {
    const [selectedRegion, setSelectedRegion] = React.useState('전체');

    React.useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
    }, []);

    const regions = ['전체', '서울', '경기', '충북', '충남', '강원', '전북', '전남', '경북', '경남', '제주'];

    return (
        <div className={styles.container}>
            <Header forceLightMode={true} />
            <main className={styles.main}>
                <div className={styles.content}>

                    <div className={styles.menuContainer}>
                        {regions.map((region) => (
                            <span
                                key={region}
                                className={`${styles.menuItem} ${selectedRegion === region ? styles.active : ''}`}
                                onClick={() => setSelectedRegion(region)}
                            >
                                {region}
                            </span>
                        ))}
                    </div>

                    <div className={styles.instructorContent}>
                        <div className={styles.backgroundContainer}>
                            <Image
                                src="/instructor/background.png"
                                alt="강사 소개 배경"
                                width={1200}
                                height={600}
                                style={{ width: '100%', height: 'auto' }}
                            />
                            <div className={styles.leftContent}>
                                <p className={styles.subtitle}>드론 운용병을 꿈꾸는 청년을 위한 구조적인 특강</p>
                                <h2 className={styles.mainTitle}>이민상의 드론 기초교육</h2>
                                <div className={styles.courseTag}>드론운용병</div>
                                <div className={styles.courseTag}>군 드론</div><br></br>
                                <a href="#" className={styles.detailLink}>자세히 보기 &gt;</a>
                            </div>
                            <div className={styles.profileCircle}>
                                <Image
                                    src="/instructor/minsang.png"
                                    alt="민상 강사"
                                    width={200}
                                    height={200}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                        <div className={styles.subImageContainer}>
                            <Image
                                src="/instructor/subImage.png"
                                alt="서브 배경"
                                width={1200}
                                height={200}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </div>
                    </div>
                    <div className={styles.instructor}>
                        <div className={styles.instructorHeader}>
                            <h2 className={styles.instructorTitle}>전체</h2>
                            <button className={styles.registerButton}>강사 등록</button>
                        </div>

                        <div className={styles.instructorGrid}>
                            {[
                                { region: '수원', name: '이동연', image: 'dongyeon.jpeg', subtitle: '코딩으로 배우는 드론' },
                                { region: '충북', name: '유한상', image: 'hansang.png', subtitle: '대한드론협회 주강사 출신' },
                                { region: '서울', name: '임승원', image: 'seungwon.png', subtitle: '드론으로 세상을 열다' },
                                { region: '경남', name: '이민상', image: 'minsang.png', subtitle: '드론운용병 출신 강사' }
                            ].map((instructor, index) => (
                                <div key={index} className={styles.instructorCard}>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.region}>{instructor.region}</span>
                                        <span className={styles.name}>{instructor.name}</span>
                                    </div>
                                    <p className={styles.cardSubtext}>{instructor.subtitle}</p>
                                    <div className={styles.cardImageContainer}>
                                        <Image
                                            src={`/instructor/${instructor.image}`}
                                            alt={instructor.name}
                                            width={150}
                                            height={150}
                                        />
                                    </div>
                                    <button className={styles.inviteButton}>강사님 모셔오기</button>
                                    <div className={styles.cardButtonGroup}>
                                        <button className={styles.secondaryButton}>프로필</button>
                                        <button className={styles.secondaryButton}>커리큘럼</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
