'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import api from '@/lib/axios';
import styles from './page.module.css';

interface LectureDetail {
    id: number;
    schoolName: string;
    time: string;
    subject: string;
    courses: Array<{
        id: number;
        title: string;
        category: string;
        contents: Array<{
            id: number;
            title: string;
            order: number;
        }>;
    }>;
    isCompleted: boolean;
    completedAt?: string;
    status?: 'pending' | 'confirmed';
    expectedPayment?: number;
}

export default function LectureDetailPage() {
    const router = useRouter();
    const params = useParams();
    const lectureId = params.id;
    
    const [lecture, setLecture] = useState<LectureDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLectureDetail();
    }, [lectureId]);

    const loadLectureDetail = async () => {
        try {
            setLoading(true);
            
            // 사용자 정보 가져오기
            const savedUser = localStorage.getItem('user');
            console.log('📦 localStorage user:', savedUser);
            
            if (!savedUser) {
                router.push('/teacher/login');
                return;
            }

            const userData = JSON.parse(savedUser);
            console.log('👤 파싱된 사용자 데이터:', userData);
            
            // user 객체가 중첩되어 있는 경우 처리
            const user = userData.user || userData;
            const userId = user.id;
            
            console.log('🆔 사용자 ID:', userId);
            
            if (!userId) {
                console.error('❌ 사용자 ID가 없습니다');
                alert('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
                router.push('/teacher/login');
                return;
            }
            
            // 강의 목록 조회
            const response = await api.get(`/api/instructors/by-user/${userId}/courses`);
            
            if (response.data.success) {
                const courseGroups = response.data.data;
                
                // lectureId에 해당하는 그룹 찾기
                const group = courseGroups.find((g: any) => g.id === parseInt(lectureId as string));
                
                if (group) {
                    console.log('📚 그룹 데이터:', group);
                    
                    // lessons를 contents로 매핑
                    const normalizedCourses = group.courses?.map((course: any) => {
                        console.log('📘 강좌:', course.title);
                        console.log('  - lessons:', course.lessons);
                        
                        return {
                            id: course.id,
                            title: course.title,
                            category: course.category,
                            contents: course.lessons?.map((lesson: any) => ({
                                id: lesson.id,
                                title: lesson.materials || `${lesson.order}차시`,
                                order: lesson.order,
                                description: lesson.description,
                                type: lesson.type,
                                pdfUrl: lesson.pdfUrl
                            })) || []
                        };
                    }) || [];
                    
                    console.log('✅ 변환된 강좌:', normalizedCourses);
                    
                    // 과목 중복 제거
                    const subjects = group.courses?.map((c: any) => c.category || c.title)
                        .filter((s: string, i: number, arr: string[]) => arr.indexOf(s) === i)
                        .join(', ') || '강의';
                    
                    // 강의 상세 정보 구성
                    const detail: LectureDetail = {
                        id: group.id,
                        schoolName: group.schoolName,
                        time: `${group.startTime || '00:00'} ~ ${group.endTime || '00:00'}`,
                        subject: subjects,
                        courses: normalizedCourses,
                        isCompleted: false, // TODO: 실제 완료 상태 확인
                        completedAt: undefined,
                        status: 'pending',
                        expectedPayment: 60000 // TODO: 실제 정산 금액 계산
                    };
                    
                    console.log('📋 최종 상세 정보:', detail);
                    
                    setLecture(detail);
                }
            }
        } catch (error) {
            console.error('강의 상세 정보 로드 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = () => {
        // TODO: 강의 완료 처리
        alert('강의 완료 처리 기능 구현 예정');
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    fontSize: '16px',
                    color: '#666'
                }}>
                    로딩 중...
                </div>
            </div>
        );
    }

    if (!lecture) {
        return (
            <div className={styles.container}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    fontSize: '16px',
                    color: '#666'
                }}>
                    강의 정보를 찾을 수 없습니다.
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <IoChevronBack size={24} />
                </button>
                <h1 className={styles.headerTitle}>강의 상세</h1>
            </header>

            <div className={styles.content}>
                {/* 기본 정보 */}
                <div className={styles.infoSection}>
                    <h2 className={styles.schoolName}>{lecture.schoolName}</h2>
                    
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>🕐 시간</span>
                        <span className={styles.infoValue}>{lecture.time}</span>
                    </div>
                    
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>📚 강의 내용</span>
                        <span className={styles.subjectBadge}>{lecture.subject}</span>
                    </div>
                </div>

                {/* 학습자료 */}
                <div className={styles.materialSection}>
                    <h3 className={styles.sectionTitle}>📖 학습자료</h3>
                    
                    {lecture.courses.length > 0 ? (
                        lecture.courses.map((course) => (
                            <div key={course.id} className={styles.courseItem}>
                                <div className={styles.courseTitle}>
                                    {course.title} ({course.category})
                                </div>
                                
                                {course.contents.length > 0 ? (
                                    <div className={styles.lessonList}>
                                        {course.contents.map((content) => (
                                            <div key={content.id} className={styles.lessonItem}>
                                                {content.order}차시: {content.title}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={styles.emptyText}>등록된 차시가 없습니다.</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className={styles.emptyText}>등록된 강좌가 없습니다.</p>
                    )}
                </div>

                {/* 수행 기록 (완료된 경우만) */}
                {lecture.isCompleted && (
                    <>
                        <div className={styles.recordSection}>
                            <h3 className={styles.sectionTitle}>✅ 수행 기록</h3>
                            
                            <div className={styles.recordRow}>
                                <span className={styles.recordLabel}>완료 시간</span>
                                <span className={styles.recordValue}>
                                    {lecture.completedAt || '2026년 2월 10일 18시 30분'}
                                </span>
                            </div>
                            
                            <div className={styles.recordRow}>
                                <span className={styles.recordLabel}>상태</span>
                                <span className={`${styles.statusBadge} ${
                                    lecture.status === 'confirmed' 
                                        ? styles.statusConfirmed 
                                        : styles.statusPending
                                }`}>
                                    {lecture.status === 'confirmed' 
                                        ? '관리자 확인 완료' 
                                        : '관리자 확인 전'}
                                </span>
                            </div>
                        </div>

                        {/* 예상 정산 금액 */}
                        <div className={styles.paymentSection}>
                            <h3 className={styles.paymentTitle}>💰 예상 정산 금액</h3>
                            <p className={styles.paymentAmount}>
                                {lecture.expectedPayment?.toLocaleString()}원
                            </p>
                        </div>
                    </>
                )}

                {/* 강의 완료 버튼 (미완료 시) */}
                {!lecture.isCompleted && (
                    <button className={styles.completeButton} onClick={handleComplete}>
                        강의 완료하기
                    </button>
                )}
            </div>
        </div>
    );
}
