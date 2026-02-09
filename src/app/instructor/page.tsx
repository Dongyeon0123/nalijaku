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
    education?: Array<{
        school: string;
        major: string;
        degree: string;
        graduationYear: number;
    }>;
    certificates?: Array<{
        name: string;
        issuer: string;
        issueDate: string;
    }>;
    experience?: Array<{
        company: string;
        position: string;
        startDate: string;
        endDate: string;
        description: string;
    }>;
    awards?: Array<{
        name: string;
        issuer: string;
        awardDate: string;
        description: string;
    }>;
}

export default function InstructorPage() {
    const [instructors, setInstructors] = React.useState<Instructor[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedInstructor, setSelectedInstructor] = React.useState<Instructor | null>(null);
    const [showModal, setShowModal] = React.useState(false);
    const [visibleCards, setVisibleCards] = React.useState<Set<number>>(new Set());

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

    // Intersection Observer로 스크롤 애니메이션
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const cardId = parseInt(entry.target.getAttribute('data-card-id') || '0');
                        setVisibleCards((prev) => new Set(prev).add(cardId));
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        const cards = document.querySelectorAll('[data-card-id]');
        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, [instructors]);

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
                                {instructors.map((instructor, index) => (
                                    <div 
                                        key={instructor.id} 
                                        className={`${styles.instructorCard} ${visibleCards.has(instructor.id) ? styles.visible : ''}`}
                                        data-card-id={instructor.id}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <img
                                            src={instructor.imageUrl}
                                            alt={instructor.name}
                                            className={styles.cardBackgroundImage}
                                        />
                                        <div className={styles.cardOverlay}>
                                            <div className={styles.cardContent}>
                                                <div className={styles.cardHeader}>
                                                    <span className={styles.cardRegion}>{instructor.category}</span>
                                                </div>
                                                <h3 className={styles.cardName}>
                                                    {instructor.name}
                                                    <span className={styles.cardNameSuffix}> 선생님</span>
                                                </h3>
                                                <p className={styles.cardSubtitle}>{instructor.profileDescription || instructor.subtitle}</p>
                                            </div>
                                            <div style={{ padding: '24px', textAlign: 'right' }}>
                                                <button 
                                                    className={styles.cardButton}
                                                    onClick={() => {
                                                        setSelectedInstructor(instructor);
                                                        setShowModal(true);
                                                    }}
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

            {/* 강사 프로필 모달 */}
            {showModal && selectedInstructor && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setShowModal(false)}>
                            ×
                        </button>
                        
                        <div className={styles.modalHeader}>
                            <div className={styles.modalImageSection}>
                                <img
                                    src={selectedInstructor.imageUrl}
                                    alt={selectedInstructor.name}
                                    className={styles.modalImage}
                                />
                            </div>
                            <div className={styles.modalHeaderInfo}>
                                <div className={styles.modalTags}>
                                    <span className={styles.modalRegion}>{selectedInstructor.region}</span>
                                    {selectedInstructor.category && (
                                        <span className={styles.modalCategory}>{selectedInstructor.category}</span>
                                    )}
                                </div>
                                <h2 className={styles.modalName}>
                                    {selectedInstructor.name}
                                    <span className={styles.modalNameSuffix}> 선생님</span>
                                </h2>
                                <p className={styles.modalSubtitle}>{selectedInstructor.subtitle}</p>
                            </div>
                        </div>

                        <div className={styles.modalBody}>
                            {selectedInstructor.profileDescription && (
                                <div className={styles.modalSection}>
                                    <h3 className={styles.modalSectionTitle}>💬 소개</h3>
                                    <p className={styles.modalText}>{selectedInstructor.profileDescription}</p>
                                </div>
                            )}

                            {selectedInstructor.education && selectedInstructor.education.length > 0 && (
                                <div className={styles.modalSection}>
                                    <h3 className={styles.modalSectionTitle}>🎓 학력</h3>
                                    <div className={styles.modalList}>
                                        {selectedInstructor.education.map((edu, index) => (
                                            <div key={index} className={styles.modalListItem}>
                                                <div className={styles.modalListTitle}>
                                                    {edu.school} - {edu.major}
                                                </div>
                                                <div className={styles.modalListMeta}>
                                                    {edu.degree} | {edu.graduationYear}년 졸업
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedInstructor.experience && selectedInstructor.experience.length > 0 && (
                                <div className={styles.modalSection}>
                                    <h3 className={styles.modalSectionTitle}>💼 경력</h3>
                                    <div className={styles.modalList}>
                                        {selectedInstructor.experience.map((exp, index) => (
                                            <div key={index} className={styles.modalListItem}>
                                                <div className={styles.modalListTitle}>
                                                    {exp.company} - {exp.position}
                                                </div>
                                                <div className={styles.modalListMeta}>
                                                    {exp.startDate} ~ {exp.endDate}
                                                </div>
                                                {exp.description && (
                                                    <div className={styles.modalListDesc}>
                                                        {exp.description}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedInstructor.certificates && selectedInstructor.certificates.length > 0 && (
                                <div className={styles.modalSection}>
                                    <h3 className={styles.modalSectionTitle}>📜 자격증</h3>
                                    <div className={styles.modalList}>
                                        {selectedInstructor.certificates.map((cert, index) => (
                                            <div key={index} className={styles.modalListItem}>
                                                <div className={styles.modalListTitle}>
                                                    {cert.name}
                                                </div>
                                                <div className={styles.modalListMeta}>
                                                    {cert.issuer} | {cert.issueDate}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedInstructor.awards && selectedInstructor.awards.length > 0 && (
                                <div className={styles.modalSection}>
                                    <h3 className={styles.modalSectionTitle}>🏆 수상</h3>
                                    <div className={styles.modalList}>
                                        {selectedInstructor.awards.map((award, index) => (
                                            <div key={index} className={styles.modalListItem}>
                                                <div className={styles.modalListTitle}>
                                                    {award.name}
                                                </div>
                                                <div className={styles.modalListMeta}>
                                                    {award.issuer} | {award.awardDate}
                                                </div>
                                                {award.description && (
                                                    <div className={styles.modalListDesc}>
                                                        {award.description}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
