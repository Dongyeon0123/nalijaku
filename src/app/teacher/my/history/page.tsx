'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import api from '@/lib/axios';
import styles from './page.module.css';

export default function LectureHistoryPage() {
    const router = useRouter();
    const [lectures, setLectures] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

    useEffect(() => {
        loadLectureHistory();
    }, []);

    const loadLectureHistory = async () => {
        try {
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
                return;
            }

            // 강사 정보 조회
            const instructorResponse = await api.get(`/api/instructors/by-user/${userId}`);
            if (!instructorResponse.data.success || !instructorResponse.data.data) {
                console.error('강사 정보를 찾을 수 없습니다');
                return;
            }
            
            const instructorId = instructorResponse.data.data.id;
            
            // 출근 이력 조회 (최근 3개월)
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            
            const startDate = threeMonthsAgo.toISOString().split('T')[0];
            const endDate = new Date().toISOString().split('T')[0];
            
            const response = await api.get(
                `/api/instructors/${instructorId}/attendances?startDate=${startDate}&endDate=${endDate}`
            );
            
            if (response.data.success) {
                setLectures(response.data.data);
            }
        } catch (error) {
            console.error('강의 이력 로드 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLectures = lectures.filter(lecture => {
        if (filter === 'all') return true;
        if (filter === 'completed') return lecture.status === 'COMPLETED';
        if (filter === 'pending') return lecture.status === 'PENDING';
        return true;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.push('/teacher?tab=my')}>
                    <IoChevronBack size={24} />
                </button>
                <h1 className={styles.title}>내 강의 이력</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <div className={styles.filterBar}>
                <button 
                    className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
                    onClick={() => setFilter('all')}
                >
                    전체
                </button>
                <button 
                    className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    완료
                </button>
                <button 
                    className={`${styles.filterButton} ${filter === 'pending' ? styles.active : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    대기중
                </button>
            </div>

            <div className={styles.content}>
                {isLoading ? (
                    <div className={styles.loading}>로딩 중...</div>
                ) : filteredLectures.length > 0 ? (
                    <div className={styles.lectureList}>
                        {filteredLectures.map((lecture, index) => (
                            <div 
                                key={index} 
                                className={styles.lectureCard}
                                onClick={() => router.push(`/teacher/lecture/${lecture.id}`)}
                            >
                                <div className={styles.lectureHeader}>
                                    <span className={styles.lectureDate}>
                                        {formatDate(lecture.date)}
                                    </span>
                                    <span className={`${styles.statusBadge} ${
                                        lecture.status === 'COMPLETED' 
                                            ? styles.statusCompleted 
                                            : styles.statusPending
                                    }`}>
                                        {lecture.status === 'COMPLETED' ? '지급 완료' : '관리자 확인중'}
                                    </span>
                                </div>
                                
                                <div className={styles.lectureInfo}>
                                    <div className={styles.lectureTime}>
                                        {lecture.checkInTime} ~ {lecture.checkOutTime || '진행중'}
                                    </div>
                                    <div className={styles.lectureSchool}>{lecture.schoolName}</div>
                                </div>
                                
                                <div className={styles.lectureAmount}>
                                    {lecture.payment ? `${lecture.payment.toLocaleString()}원` : '-'}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📚</div>
                        <p className={styles.emptyText}>강의 이력이 없습니다</p>
                    </div>
                )}
            </div>
        </div>
    );
}
