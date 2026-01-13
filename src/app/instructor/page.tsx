'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Image from 'next/image';
import styles from './page.module.css';
import api from '@/lib/axios';

interface Education {
    school: string;
    major: string;
    degree: string;
    graduationYear: number;
}

interface Certificate {
    name: string;
    issuer: string;
    issueDate: string;
}

interface Experience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface Award {
    name: string;
    issuer: string;
    awardDate: string;
    description: string;
}

interface Instructor {
    id: number;
    name: string;
    region: string;
    subtitle: string;
    imageUrl: string;
    profileDescription?: string;
    curriculum?: string | null;
    education?: Education[];
    certificates?: Certificate[];
    experience?: Experience[];
    awards?: Award[];
    isFeatured?: boolean;
}

export default function InstructorPage() {
    const router = useRouter();
    const [selectedRegion, setSelectedRegion] = React.useState('전체');
    const [instructors, setInstructors] = React.useState<Instructor[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
    }, []);

    // 강사 데이터 가져오기
    React.useEffect(() => {
        const fetchInstructors = async () => {
            try {
                setLoading(true);
                setError(null);

                const endpoint = selectedRegion === '전체'
                    ? '/api/instructors'
                    : `/api/instructors/region/${selectedRegion}`;

                // Axios 사용 (인증 토큰 자동 포함)
                const response = await api.get(endpoint);

                console.log('📚 강사 데이터:', response.data);

                const result = response.data;

                // result가 배열이거나 result.data가 배열인 경우 처리
                let instructorData: Instructor[] = Array.isArray(result) ? result : (Array.isArray(result.data) ? result.data : []);

                // 이미지 경로 전체 URL로 변환
                instructorData = instructorData.map((instructor: Instructor) => ({
                    ...instructor,
                    imageUrl: instructor.imageUrl.startsWith('http')
                        ? instructor.imageUrl
                        : `https://api.nallijaku.com${instructor.imageUrl}`
                }));

                console.log('📍 변환된 강사 데이터:', instructorData);
                setInstructors(instructorData);
            } catch (err: any) {
                console.error('강사 데이터 로드 실패:', err);
                if (err.response?.status === 401) {
                    alert('로그인이 필요한 페이지입니다.');
                    window.location.href = '/';
                } else {
                    setError('강사 정보를 불러올 수 없습니다');
                }
            } finally {
                setLoading(false);
                console.log('⏹️ 로딩 완료');
            }
        };

        fetchInstructors();
    }, [selectedRegion]);

    const regions = ['전체', '서울', '경기', '충북', '충남', '강원', '전북', '전남', '경북', '경남', '제주'];
    const categories = ['전체', '창업', '드론', 'AI', '환경'];
    const [selectedCategory, setSelectedCategory] = React.useState('전체');

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

                    {/* 카테고리 필터 추가 */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        justifyContent: 'center',
                        marginTop: '20px',
                        marginBottom: '20px',
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                style={{
                                    padding: '10px 24px',
                                    border: selectedCategory === category ? '2px solid #04AD74' : '1px solid #ddd',
                                    backgroundColor: selectedCategory === category ? '#E8F5E9' : '#ffffff',
                                    color: selectedCategory === category ? '#04AD74' : '#666',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {category}
                            </button>
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

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#999', gridColumn: '1 / -1' }}>
                                    <p>강사 정보를 불러오는 중입니다...</p>
                                </div>
                            ) : error ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f', gridColumn: '1 / -1' }}>
                                    <p>{error}</p>
                                </div>
                            ) : instructors.length > 0 ? (
                                instructors.map((instructor) => (
                                    <div key={instructor.id} style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '16px', minHeight: '350px' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#04AD74', backgroundColor: '#f0f8f5', padding: '4px 8px', borderRadius: '4px' }}>{instructor.region}</span>
                                            <span style={{ fontSize: '15px', fontWeight: '700', color: '#383838' }}>{instructor.name}</span>
                                        </div>
                                        <p style={{ textAlign: 'center', fontSize: '14px', color: '#565D6DFF', margin: '0 0 16px 0' }}>{instructor.subtitle}</p>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                                            <img
                                                src={instructor.imageUrl}
                                                alt={instructor.name}
                                                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f0f0f0' }}
                                            />
                                        </div>
                                        <button style={{ width: '100%', padding: '10px 16px', backgroundColor: '#04AD74', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}>강사님 모셔오기</button>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => router.push(`/instructor/${instructor.id}`)}
                                                style={{ flex: 1, padding: '10px 12px', backgroundColor: '#F3F4F6', color: '#323742', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>프로필</button>
                                            <button style={{ flex: 1, padding: '10px 12px', backgroundColor: '#F3F4F6', color: '#323742', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>커리큘럼</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#999', gridColumn: '1 / -1' }}>
                                    <p>강사 정보가 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
