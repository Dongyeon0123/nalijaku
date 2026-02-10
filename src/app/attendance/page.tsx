'use client';

import React, { useState, useEffect } from 'react';
import { IoHomeOutline, IoCalendarOutline, IoPersonOutline, IoSettingsOutline, IoHome, IoCalendar, IoPerson, IoSettings, IoNotificationsOutline } from 'react-icons/io5';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import styles from './page.module.css';

export default function AttendancePage() {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [activeTab, setActiveTab] = useState('home');
    const [userInfo, setUserInfo] = useState<{ username: string; role?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 임시 강의 데이터 (나중에 API로 교체)
    const [todayLectures, setTodayLectures] = useState<any[]>([]);

    // 로그인 체크 및 강의 데이터 로드
    useEffect(() => {
        const checkAuth = async () => {
            const savedUser = localStorage.getItem('user');
            if (!savedUser) {
                router.push('/attendance/login');
                return;
            }

            try {
                const userData = JSON.parse(savedUser);
                setUserInfo(userData);
                
                // 강사인 경우 강의 목록 조회
                if (userData.role === 'TEACHER') {
                    await loadInstructorCourses(userData.id);
                }
                
                setIsLoading(false);
            } catch (error) {
                console.error('사용자 정보 파싱 실패:', error);
                router.push('/attendance/login');
            }
        };

        checkAuth();
    }, [router]);

    // 강사 강의 목록 로드
    const loadInstructorCourses = async (userId: number) => {
        try {
            const response = await api.get(`/api/instructors/by-user/${userId}/courses`);
            
            if (response.data.success) {
                const courseGroups = response.data.data;
                
                // 오늘 날짜의 강의만 필터링
                const today = new Date();
                const todayDay = today.getDay(); // 0(일) ~ 6(토)
                const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
                const todayDayName = dayNames[todayDay];
                
                const todayCourses: any[] = [];
                
                courseGroups.forEach((group: any) => {
                    // dayOfWeek 배열에 오늘 요일이 포함되어 있는지 확인
                    if (group.dayOfWeek && group.dayOfWeek.includes(todayDayName)) {
                        // 그룹의 모든 강좌 카테고리를 합쳐서 하나의 항목으로 표시
                        const subjects = group.courses?.map((course: any) => 
                            course.category || course.title
                        ).filter((s: string, i: number, arr: string[]) => 
                            arr.indexOf(s) === i // 중복 제거
                        ).join(', ') || '강의';
                        
                        todayCourses.push({
                            id: group.id,
                            time: `${group.startTime || '00:00'} ~ ${group.endTime || '00:00'}`,
                            school: group.schoolName,
                            subject: subjects
                        });
                    }
                });
                
                setTodayLectures(todayCourses);
            }
        } catch (error) {
            console.error('강의 목록 로드 실패:', error);
            setTodayLectures([]);
        }
    };

    // body 여백 제거
    useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // 현재 시간 업데이트
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // 위치 권한 요청
    const requestLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    alert('위치 권한이 필요합니다.');
                }
            );
        }
    };

    // 출근 체크
    const handleCheckIn = () => {
        if (!location) {
            requestLocation();
            return;
        }

        const now = new Date();
        setIsCheckedIn(true);
        setCheckInTime(now.toLocaleTimeString('ko-KR'));
        
        // 진동 피드백
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }

        // TODO: 서버에 출근 기록 저장
        console.log('출근 체크:', {
            time: now,
            location: location
        });
    };

    // 퇴근 체크
    const handleCheckOut = () => {
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
        
        // TODO: 서버에 퇴근 기록 저장
        alert('퇴근 처리되었습니다!');
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    };

    // 로딩 중이면 표시
    if (isLoading) {
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

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <header className={styles.header}>
                <Image 
                    src="/nallijaku.png" 
                    alt="날리자쿠" 
                    width={120} 
                    height={40}
                    className={styles.logo}
                />
                <button className={styles.notificationButton}>
                    <IoNotificationsOutline size={24} />
                </button>
            </header>

            {/* 메인 컨텐츠 */}
            <div className={styles.content}>
                {activeTab === 'home' && (
                    <div className={styles.homeContent}>
                        <h1 className={styles.pageTitle}>오늘의 강의</h1>
                        
                        <div className={styles.todayDate}>
                            {formatDate(currentTime)}
                        </div>

                        {todayLectures.length > 0 ? (
                            <div className={styles.lectureList}>
                                {todayLectures.map((lecture) => (
                                    <div key={lecture.id} className={styles.lectureCard}>
                                        <div className={styles.lectureTime}>
                                            {lecture.time}
                                        </div>
                                        <div className={styles.lectureInfo}>
                                            <div className={styles.lectureSchool}>
                                                {lecture.school}
                                            </div>
                                            <div className={styles.lectureSubject}>
                                                <span className={styles.subjectBadge}>
                                                    {lecture.subject}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>📅</div>
                                <p className={styles.emptyText}>오늘 예정된 강의가 없습니다</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className={styles.tabContent}>
                        <h2>내 일정</h2>
                    </div>
                )}

                {activeTab === 'my' && (
                    <div className={styles.tabContent}>
                        <h2>마이</h2>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className={styles.tabContent}>
                        <h2>설정</h2>
                    </div>
                )}
            </div>

            {/* 하단 네비게이션 바 */}
            <nav className={styles.bottomNav}>
                <button 
                    className={`${styles.navItem} ${activeTab === 'home' ? styles.active : ''}`}
                    onClick={() => setActiveTab('home')}
                >
                    {activeTab === 'home' ? <IoHome size={24} /> : <IoHomeOutline size={24} />}
                    <span className={styles.navLabel}>홈</span>
                </button>
                <button 
                    className={`${styles.navItem} ${activeTab === 'schedule' ? styles.active : ''}`}
                    onClick={() => setActiveTab('schedule')}
                >
                    {activeTab === 'schedule' ? <IoCalendar size={24} /> : <IoCalendarOutline size={24} />}
                    <span className={styles.navLabel}>내 일정</span>
                </button>
                <button 
                    className={`${styles.navItem} ${activeTab === 'my' ? styles.active : ''}`}
                    onClick={() => setActiveTab('my')}
                >
                    {activeTab === 'my' ? <IoPerson size={24} /> : <IoPersonOutline size={24} />}
                    <span className={styles.navLabel}>마이</span>
                </button>
                <button 
                    className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    {activeTab === 'settings' ? <IoSettings size={24} /> : <IoSettingsOutline size={24} />}
                    <span className={styles.navLabel}>설정</span>
                </button>
            </nav>
        </div>
    );
}
