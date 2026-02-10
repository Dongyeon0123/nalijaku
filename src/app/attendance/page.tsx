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

    // 캘린더 상태
    const [currentDate, setCurrentDate] = useState(new Date());
    const [allCourseGroups, setAllCourseGroups] = useState<any[]>([]);

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
                
                // 전체 강의 그룹 저장 (캘린더용)
                setAllCourseGroups(courseGroups);
                
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

    // 캘린더 관련 함수
    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // 이번 달 첫날과 마지막 날
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // 첫날의 요일 (0: 일요일)
        const firstDayOfWeek = firstDay.getDay();
        
        // 달력에 표시할 날짜들
        const days = [];
        
        // 이전 달 날짜들
        const prevLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: prevLastDay - i,
                isCurrentMonth: false
            });
        }
        
        // 이번 달 날짜들
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push({
                date: i,
                isCurrentMonth: true
            });
        }
        
        // 다음 달 날짜들 (6주 채우기)
        const remainingDays = 42 - days.length; // 6주 * 7일
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: i,
                isCurrentMonth: false
            });
        }
        
        return days;
    };

    const goToPrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const formatYearMonth = (date: Date) => {
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    };

    // 특정 날짜에 강의가 있는지 확인
    const hasLectureOnDate = (year: number, month: number, date: number) => {
        const targetDate = new Date(year, month, date);
        const dayOfWeek = targetDate.getDay(); // 0(일) ~ 6(토)
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[dayOfWeek];
        
        // 해당 요일에 강의가 있고, 날짜 범위 내에 있는지 확인
        return allCourseGroups.some((group: any) => {
            // 요일 체크
            if (!group.dayOfWeek || !group.dayOfWeek.includes(dayName)) {
                return false;
            }
            
            // 날짜 범위 체크
            const startDate = group.startDate ? new Date(group.startDate) : null;
            const endDate = group.endDate ? new Date(group.endDate) : null;
            
            // 시작일이 있으면 시작일 이후인지 확인
            if (startDate && targetDate < startDate) {
                return false;
            }
            
            // 종료일이 있으면 종료일 이전인지 확인
            if (endDate && targetDate > endDate) {
                return false;
            }
            
            return true;
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
                                    <div 
                                        key={lecture.id} 
                                        className={styles.lectureCard}
                                        onClick={() => router.push(`/attendance/lecture/${lecture.id}`)}
                                    >
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
                                        <div className={styles.lectureStatus}>
                                            <span className={`${styles.statusBadge} ${styles.statusBefore}`}>
                                                출근전
                                            </span>
                                            <span className={`${styles.statusBadge} ${styles.statusCompleted}`}>
                                                강의완료
                                            </span>
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
                    <div className={styles.scheduleContent}>
                        {/* 월 선택 */}
                        <div className={styles.monthSelector}>
                            <button className={styles.monthButton} onClick={goToPrevMonth}>
                                ←
                            </button>
                            <h2 className={styles.monthTitle}>
                                {formatYearMonth(currentDate)}
                            </h2>
                            <button className={styles.monthButton} onClick={goToNextMonth}>
                                →
                            </button>
                        </div>

                        {/* 캘린더 */}
                        <div className={styles.calendar}>
                            {/* 요일 헤더 */}
                            <div className={styles.weekDays}>
                                {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                                    <div 
                                        key={day} 
                                        className={`${styles.weekDay} ${
                                            index === 0 ? styles.sunday : 
                                            index === 6 ? styles.saturday : ''
                                        }`}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* 날짜 그리드 */}
                            <div className={styles.daysGrid}>
                                {getCalendarDays().map((day, index) => {
                                    const year = currentDate.getFullYear();
                                    const month = currentDate.getMonth();
                                    const hasLecture = day.isCurrentMonth && hasLectureOnDate(year, month, day.date);
                                    
                                    return (
                                        <div
                                            key={index}
                                            className={`${styles.dayCell} ${
                                                !day.isCurrentMonth ? styles.otherMonth : ''
                                            } ${
                                                index % 7 === 0 ? styles.sunday :
                                                index % 7 === 6 ? styles.saturday : ''
                                            } ${
                                                hasLecture ? styles.hasLecture : ''
                                            }`}
                                        >
                                            <span className={styles.dayNumber}>{day.date}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
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
