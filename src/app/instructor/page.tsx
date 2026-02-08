'use client';

import React from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import { IoChevronForward, IoChevronDown } from 'react-icons/io5';
import api from '@/lib/axios';
import styles from './page.module.css';

interface Instructor {
    id: number;
    name: string;
    region: string;
    category?: string;
    subtitle: string;
    imageUrl: string;
    profileDescription?: string;
}

export default function InstructorPage() {
    const [instructors, setInstructors] = React.useState<Instructor[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
    }, []);

    React.useEffect(() => {
        const fetchInstructors = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/instructors');
                console.log('강사 데이터:', response.data);

                let instructorData: Instructor[] = Array.isArray(response.data) 
                    ? response.data 
                    : (Array.isArray(response.data.data) ? response.data.data : []);

                // 이미지 경로 전체 URL로 변환
                instructorData = instructorData.map((instructor: Instructor) => ({
                    ...instructor,
                    imageUrl: instructor.imageUrl.startsWith('http')
                        ? instructor.imageUrl
                        : `https://api.nallijaku.com${instructor.imageUrl}`
                }));

                setInstructors(instructorData);
            } catch (err: any) {
                console.error('강사 데이터 로드 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, []);

    return (
        <div className={styles.container}>
            <Header forceLightMode={true} />
            <main className={styles.main}>
                <div className={styles.content}>
                    {/* 배경 이미지 섹션 */}
                    <div className={styles.heroSection}>
                        <Image
                            src="/instructor/Rectangle.png"
                            alt="강사 소개 배경"
                            width={1920}
                            height={1080}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                            priority
                        />
                        <div className={styles.heroContent}>
                            <div className={styles.heroText}>
                                <h1 className={styles.heroTitle}>NALIJAKU PARTNERS</h1>
                                <h2 className={styles.heroSubtitle}>날리자쿠 파트너</h2>
                                <p className={styles.heroDescription}>
                                    아이들의 데이터가 증명하는 교육 만족감! 국내 최고 비교과 에듀테크 전문가,<br />
                                    날리자쿠 파트너를 소집합니다.
                                </p>
                                <button 
                                    className={styles.heroButton}
                                    onClick={() => window.location.href = '/resources'}
                                >
                                    <span>교육 도입 바로가기</span>
                                    <IoChevronForward size={24} />
                                </button>
                                <div className={styles.scrollIndicator}>
                                    <IoChevronDown size={80} color="#d5d5d5ff" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* 강사 목록 섹션 */}
                    <div className={styles.instructorSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>날리자쿠 파트너</h2>
                            <p className={styles.sectionSubtitle}>전문성과 열정을 갖춘 최고의 강사진을 만나보세요</p>
                        </div>

                        {loading ? (
                            <div className={styles.loadingState}>
                                <p>강사 정보를 불러오는 중입니다...</p>
                            </div>
                        ) : instructors.length > 0 ? (
                            <div className={styles.instructorGrid}>
                                {instructors.map((instructor) => (
                                    <div key={instructor.id} className={styles.instructorCard}>
                                        <img
                                            src={instructor.imageUrl}
                                            alt={instructor.name}
                                            className={styles.cardBackgroundImage}
                                        />
                                        <div className={styles.cardOverlay}>
                                            <div className={styles.cardContent}>
                                                <div className={styles.cardHeader}>
                                                    <span className={styles.cardRegion}>{instructor.region}</span>
                                                    {instructor.category && (
                                                        <span className={styles.cardCategory}>{instructor.category}</span>
                                                    )}
                                                </div>
                                                <h3 className={styles.cardName}>{instructor.name}</h3>
                                                <p className={styles.cardSubtitle}>{instructor.profileDescription || instructor.subtitle}</p>
                                            </div>
                                            <div style={{ padding: '24px', textAlign: 'right' }}>
                                                <button 
                                                    className={styles.cardButton}
                                                    onClick={() => window.location.href = `/instructor/${instructor.id}`}
                                                >
                                                    <span className={styles.buttonText}>강사 프로필 더보기</span>
                                                    <span className={styles.buttonIcon}>&gt;</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <p>등록된 강사가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
