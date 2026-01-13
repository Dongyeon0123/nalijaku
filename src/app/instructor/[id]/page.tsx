'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import api from '@/lib/axios';
import styles from './page.module.css';

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

export default function InstructorDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [instructor, setInstructor] = React.useState<Instructor | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchInstructorDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get(`/api/instructors/${params.id}`);
                const detailData = response.data;
                
                // 이미지 URL 처리
                if (detailData.imageUrl && !detailData.imageUrl.startsWith('http')) {
                    detailData.imageUrl = `https://api.nallijaku.com${detailData.imageUrl}`;
                }
                
                setInstructor(detailData);
            } catch (err: any) {
                console.error('강사 상세 정보 로드 실패:', err);
                if (err.response?.status === 401) {
                    alert('로그인이 필요한 페이지입니다.');
                    router.push('/');
                } else {
                    setError('강사 정보를 불러올 수 없습니다');
                }
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchInstructorDetail();
        }
    }, [params.id, router]);

    if (loading) {
        return (
            <div className={styles.container}>
                <Header forceLightMode={true} />
                <div className={styles.loadingContainer}>
                    <p>강사 정보를 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

    if (error || !instructor) {
        return (
            <div className={styles.container}>
                <Header forceLightMode={true} />
                <div className={styles.errorContainer}>
                    <p>{error || '강사 정보를 찾을 수 없습니다'}</p>
                    <button onClick={() => router.push('/instructor')} className={styles.backButton}>
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Header forceLightMode={true} />
            <main className={styles.main}>
                <div className={styles.content}>
                    <button onClick={() => router.back()} className={styles.backButton}>
                        ← 뒤로 가기
                    </button>

                    <div className={styles.profileHeader}>
                        <img
                            src={instructor.imageUrl}
                            alt={instructor.name}
                            className={styles.profileImage}
                            onError={(e) => {
                                console.error('이미지 로드 실패:', instructor.imageUrl);
                                (e.target as HTMLImageElement).src = '/placeholder.png';
                            }}
                        />
                        <div className={styles.profileInfo}>
                            <div className={styles.regionBadge}>{instructor.region}</div>
                            <h1 className={styles.instructorName}>{instructor.name}</h1>
                            <p className={styles.subtitle}>{instructor.subtitle}</p>
                        </div>
                    </div>

                    {instructor.profileDescription && (
                        <div className={styles.descriptionSection}>
                            <h2>소개</h2>
                            <p>{instructor.profileDescription}</p>
                        </div>
                    )}

                    <div className={styles.detailSections}>
                        {/* 학력 */}
                        <div className={styles.section}>
                            <h2>학력</h2>
                            {instructor.education && instructor.education.length > 0 ? (
                                <div className={styles.itemList}>
                                    {instructor.education.map((edu, idx) => (
                                        <div key={idx} className={styles.item}>
                                            {typeof edu === 'string' ? (
                                                <p className={styles.itemTitle}>{edu}</p>
                                            ) : (
                                                <>
                                                    <p className={styles.itemTitle}>{edu.school}</p>
                                                    <p className={styles.itemSubtitle}>{edu.major} ({edu.degree})</p>
                                                    <p className={styles.itemDate}>{edu.graduationYear}년</p>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.noData}>정보가 없습니다.</p>
                            )}
                        </div>

                        {/* 자격증 */}
                        <div className={styles.section}>
                            <h2>자격증</h2>
                            {instructor.certificates && instructor.certificates.length > 0 ? (
                                <div className={styles.itemList}>
                                    {instructor.certificates.map((cert, idx) => (
                                        <div key={idx} className={styles.item}>
                                            {typeof cert === 'string' ? (
                                                <p className={styles.itemTitle}>{cert}</p>
                                            ) : (
                                                <>
                                                    <p className={styles.itemTitle}>{cert.name}</p>
                                                    <p className={styles.itemSubtitle}>{cert.issuer}</p>
                                                    <p className={styles.itemDate}>{cert.issueDate}</p>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.noData}>정보가 없습니다.</p>
                            )}
                        </div>

                        {/* 경력 */}
                        <div className={styles.section}>
                            <h2>경력</h2>
                            {instructor.experience && instructor.experience.length > 0 ? (
                                <div className={styles.itemList}>
                                    {instructor.experience.map((exp, idx) => (
                                        <div key={idx} className={styles.item}>
                                            {typeof exp === 'string' ? (
                                                <p className={styles.itemTitle}>{exp}</p>
                                            ) : (
                                                <>
                                                    <p className={styles.itemTitle}>{exp.company}</p>
                                                    <p className={styles.itemSubtitle}>{exp.position}</p>
                                                    <p className={styles.itemDate}>{exp.startDate} ~ {exp.endDate}</p>
                                                    <p className={styles.itemDescription}>{exp.description}</p>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.noData}>정보가 없습니다.</p>
                            )}
                        </div>

                        {/* 수상 */}
                        <div className={styles.section}>
                            <h2>수상</h2>
                            {instructor.awards && instructor.awards.length > 0 ? (
                                <div className={styles.itemList}>
                                    {instructor.awards.map((award, idx) => (
                                        <div key={idx} className={styles.item}>
                                            {typeof award === 'string' ? (
                                                <p className={styles.itemTitle}>{award}</p>
                                            ) : (
                                                <>
                                                    <p className={styles.itemTitle}>{award.name}</p>
                                                    <p className={styles.itemSubtitle}>{award.issuer}</p>
                                                    <p className={styles.itemDate}>{award.awardDate}</p>
                                                    <p className={styles.itemDescription}>{award.description}</p>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.noData}>정보가 없습니다.</p>
                            )}
                        </div>
                    </div>

                    <div className={styles.actionButtons}>
                        <button className={styles.primaryButton}>강사님 모셔오기</button>
                        <button onClick={() => router.push('/instructor')} className={styles.secondaryButton}>
                            목록으로
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
