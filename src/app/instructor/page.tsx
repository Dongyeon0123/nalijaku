'use client';

import React from 'react';
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
    const [selectedRegion, setSelectedRegion] = React.useState('전체');
    const [instructors, setInstructors] = React.useState<Instructor[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [selectedInstructor, setSelectedInstructor] = React.useState<Instructor | null>(null);
    const [showModal, setShowModal] = React.useState(false);

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
                                                onClick={async () => {
                                                    try {
                                                        const response = await api.get(`/api/instructors/${instructor.id}`);
                                                        const detailData = response.data;
                                                        setSelectedInstructor(detailData);
                                                        setShowModal(true);
                                                    } catch (err) {
                                                        console.error('강사 상세 정보 로드 실패:', err);
                                                        setSelectedInstructor(instructor);
                                                        setShowModal(true);
                                                    }
                                                }}
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

            {/* 프로필 모달 */}
            {showModal && selectedInstructor && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        padding: '40px',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#383838' }}>{selectedInstructor.name}</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '28px',
                                    cursor: 'pointer',
                                    color: '#999',
                                    padding: 0,
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                            <img
                                src={selectedInstructor.imageUrl.startsWith('http')
                                    ? selectedInstructor.imageUrl
                                    : `https://api.nallijaku.com${selectedInstructor.imageUrl}`}
                                alt={selectedInstructor.name}
                                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
                                onError={(e) => {
                                    console.error('이미지 로드 실패:', selectedInstructor.imageUrl);
                                    (e.target as HTMLImageElement).src = '/placeholder.png';
                                }}
                            />
                            <div>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#04AD74', fontWeight: '600' }}>{selectedInstructor.region}</p>
                                <p style={{ margin: 0, fontSize: '16px', color: '#565D6DFF' }}>{selectedInstructor.subtitle}</p>
                            </div>
                        </div>

                        {selectedInstructor.profileDescription && (
                            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                <p style={{ margin: 0, fontSize: '14px', color: '#565D6D', lineHeight: '1.6' }}>{selectedInstructor.profileDescription}</p>
                            </div>
                        )}

                        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '24px' }}>
                            {/* 학력 */}
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: '#383838' }}>학력</h3>
                                {selectedInstructor.education && selectedInstructor.education.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {selectedInstructor.education.map((edu, idx) => (
                                            <div key={idx} style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                                {typeof edu === 'string' ? (
                                                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#383838' }}>{edu}</p>
                                                ) : (
                                                    <>
                                                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#383838' }}>{edu.school}</p>
                                                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#565D6D' }}>{edu.major} ({edu.degree})</p>
                                                        <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{edu.graduationYear}년</p>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>정보가 없습니다.</p>
                                )}
                            </div>

                            {/* 자격증 */}
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: '#383838' }}>자격증</h3>
                                {selectedInstructor.certificates && selectedInstructor.certificates.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {selectedInstructor.certificates.map((cert, idx) => (
                                            <div key={idx} style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                                {typeof cert === 'string' ? (
                                                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#383838' }}>{cert}</p>
                                                ) : (
                                                    <>
                                                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#383838' }}>{cert.name}</p>
                                                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#565D6D' }}>{cert.issuer}</p>
                                                        <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{cert.issueDate}</p>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>정보가 없습니다.</p>
                                )}
                            </div>

                            {/* 경력 */}
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: '#383838' }}>경력</h3>
                                {selectedInstructor.experience && selectedInstructor.experience.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {selectedInstructor.experience.map((exp, idx) => (
                                            <div key={idx} style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                                {typeof exp === 'string' ? (
                                                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#383838' }}>{exp}</p>
                                                ) : (
                                                    <>
                                                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#383838' }}>{exp.company}</p>
                                                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#565D6D' }}>{exp.position}</p>
                                                        <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#999' }}>{exp.startDate} ~ {exp.endDate}</p>
                                                        <p style={{ margin: 0, fontSize: '13px', color: '#565D6D' }}>{exp.description}</p>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>정보가 없습니다.</p>
                                )}
                            </div>

                            {/* 수상 */}
                            <div>
                                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: '#383838' }}>수상</h3>
                                {selectedInstructor.awards && selectedInstructor.awards.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {selectedInstructor.awards.map((award, idx) => (
                                            <div key={idx} style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                                {typeof award === 'string' ? (
                                                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#383838' }}>{award}</p>
                                                ) : (
                                                    <>
                                                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#383838' }}>{award.name}</p>
                                                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#565D6D' }}>{award.issuer}</p>
                                                        <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#999' }}>{award.awardDate}</p>
                                                        <p style={{ margin: 0, fontSize: '13px', color: '#565D6D' }}>{award.description}</p>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>정보가 없습니다.</p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                width: '100%',
                                padding: '12px 24px',
                                marginTop: '32px',
                                backgroundColor: '#04AD74',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
