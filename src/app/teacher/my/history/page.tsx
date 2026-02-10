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
            if (!savedUser) {
                router.push('/teacher/login');
                return;
            }

            const userData = JSON.parse(savedUser);
            const response = await api.get(`/api/instructors/by-user/${userData.id}/courses`);
            
            if (response.data.success) {
                const courseGroups = response.data.data;
                
                // 모든 강의를 날짜별로 펼치기
                const allLectures: any[] = [];
                
                courseGroups.forEach((group: any) => {
                    const subjects = group.courses?.map((course: any) => 
                        course.category || course.title
                    ).filter((s: string, i: number, arr: string[]) => 
                        arr.indexOf(s) === i
                    ).join(', ') || '강의';
                    
                    allLectures.push({
                        id: group.id,
                        date: group.startDate || new Date().toISOString(),
                        time: `${group.startTime || '00:00'} ~ ${group.endTime || '00:00'}`,
                        school: group.schoolName,
                        subject: subjects,
                        status: Math.random() > 0.5 ? 'completed' : 'pending', // 임시
                        amount: 80000 // 임시
                    });
                });
                
                // 날짜순 정렬 (최신순)
                allLectures.sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                
                setLectures(allLectures);
            }
        } catch (error) {
            console.error('강의 이력 로드 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLectures = lectures.filter(lecture => {
        if (filter === 'all') return true;
        return lecture.status === filter;
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
                                        lecture.status === 'completed' 
                                            ? styles.statusCompleted 
                                            : styles.statusPending
                                    }`}>
                                        {lecture.status === 'completed' ? '지급 완료' : '관리자 확인중'}
                                    </span>
                                </div>
                                
                                <div className={styles.lectureInfo}>
                                    <div className={styles.lectureTime}>{lecture.time}</div>
                                    <div className={styles.lectureSchool}>{lecture.school}</div>
                                    <div className={styles.lectureSubject}>{lecture.subject}</div>
                                </div>
                                
                                <div className={styles.lectureAmount}>
                                    {lecture.amount.toLocaleString()}원
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
