'use client';

import React, { useState, useEffect } from 'react';
import { IoHomeOutline, IoCalendarOutline, IoPersonOutline, IoSettingsOutline, IoHome, IoCalendar, IoPerson, IoSettings, IoNotificationsOutline, IoChevronBack } from 'react-icons/io5';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import styles from './page.module.css';

export default function AttendancePage() {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [activeTab, setActiveTab] = useState('home');
    const [userInfo, setUserInfo] = useState<{ username: string; role?: string; email?: string; phone?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 캘린더 상태
    const [currentDate, setCurrentDate] = useState(new Date());
    const [allCourseGroups, setAllCourseGroups] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedDateLectures, setSelectedDateLectures] = useState<any[]>([]);

    // 사용자 상세 정보
    const [userDetail, setUserDetail] = useState<any>(null);

    // 임시 강의 데이터 (나중에 API로 교체)
    const [todayLectures, setTodayLectures] = useState<any[]>([]);

    // URL 파라미터로 탭 설정
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab) {
            setActiveTab(tab);
        }

        // Service Worker 등록 및 업데이트 감지
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('✅ Service Worker 등록 성공:', registration);

                    // 업데이트 확인
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('🔄 새 버전 발견!');
                        
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // 새 버전이 설치됨 - 사용자에게 알림
                                    console.log('✨ 새 버전 설치 완료');
                                    
                                    // 자동으로 새 버전 활성화
                                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                                    
                                    // 페이지 새로고침 (선택사항)
                                    if (confirm('새 버전이 있습니다. 업데이트하시겠습니까?')) {
                                        window.location.reload();
                                    }
                                }
                            });
                        }
                    });

                    // 주기적으로 업데이트 확인 (1시간마다)
                    setInterval(() => {
                        registration.update();
                    }, 60 * 60 * 1000);
                })
                .catch((error) => {
                    console.log('❌ Service Worker 등록 실패:', error);
                });

            // Service Worker가 제어권을 가져갔을 때
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('🔄 Service Worker 업데이트됨');
            });
        }
    }, []);

    // 로그인 체크 및 강의 데이터 로드
    useEffect(() => {
        const checkAuth = async () => {
            const savedUser = localStorage.getItem('user');
            console.log('📦 localStorage user:', savedUser);
            
            if (!savedUser) {
                router.push('/teacher/login');
                return;
            }

            try {
                const userData = JSON.parse(savedUser);
                console.log('👤 파싱된 사용자 데이터:', userData);
                
                // user 객체가 중첩되어 있는 경우 처리
                const user = userData.user || userData;
                const userId = user.id;
                
                console.log('🆔 사용자 ID:', userId);
                
                setUserInfo(user);
                
                // 강사인 경우 강의 목록 조회
                if (user.role === 'TEACHER') {
                    await loadInstructorCourses(userId);
                }
                
                // 사용자 상세 정보 조회
                await loadUserDetail(userId);
                
                setIsLoading(false);
            } catch (error) {
                console.error('사용자 정보 파싱 실패:', error);
                router.push('/teacher/login');
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
                
                console.log('📚 전체 강의 그룹:', courseGroups);
                
                // 전체 강의 그룹 저장 (캘린더용)
                setAllCourseGroups(courseGroups);
                
                // 오늘 날짜의 강의만 필터링
                const today = new Date();
                today.setHours(0, 0, 0, 0); // 시간 제거
                const todayDay = today.getDay(); // 0(일) ~ 6(토)
                const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
                const todayDayName = dayNames[todayDay];
                
                console.log('📅 오늘:', today, '요일:', todayDayName);
                
                const todayCourses: any[] = [];
                
                courseGroups.forEach((group: any) => {
                    console.log('🔍 그룹 체크:', group.schoolName);
                    console.log('  - dayOfWeek:', group.dayOfWeek);
                    console.log('  - startDate:', group.startDate);
                    console.log('  - endDate:', group.endDate);
                    
                    // dayOfWeek 배열에 오늘 요일이 포함되어 있는지 확인
                    if (!group.dayOfWeek || !group.dayOfWeek.includes(todayDayName)) {
                        console.log('  ❌ 요일 불일치');
                        return;
                    }
                    
                    // 날짜 범위 체크
                    const startDate = group.startDate ? new Date(group.startDate) : null;
                    const endDate = group.endDate ? new Date(group.endDate) : null;
                    
                    if (startDate) {
                        startDate.setHours(0, 0, 0, 0);
                        if (today < startDate) {
                            console.log('  ❌ 시작일 이전');
                            return;
                        }
                    }
                    
                    if (endDate) {
                        endDate.setHours(0, 0, 0, 0);
                        if (today > endDate) {
                            console.log('  ❌ 종료일 이후');
                            return;
                        }
                    }
                    
                    console.log('  ✅ 오늘 강의 맞음!');
                    
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
                });
                
                console.log('✅ 오늘의 강의:', todayCourses);
                setTodayLectures(todayCourses);
            }
        } catch (error) {
            console.error('강의 목록 로드 실패:', error);
            setTodayLectures([]);
        }
    };

    // 사용자 상세 정보 로드
    const loadUserDetail = async (userId: number) => {
        try {
            // 먼저 강사 정보 조회 (계좌 정보 포함)
            try {
                const instructorResponse = await api.get(`/api/instructors/by-user/${userId}`);
                console.log('👤 강사 정보:', instructorResponse.data);
                
                if (instructorResponse.data.success && instructorResponse.data.data) {
                    const instructorData = instructorResponse.data.data;
                    console.log('✅ 강사 데이터:', instructorData);
                    setUserDetail(instructorData);
                    return;
                }
            } catch (instructorError: any) {
                console.log('강사 정보 조회 실패:', instructorError.response?.status);
            }
            
            // 강사 정보가 없으면 일반 사용자 정보 조회
            try {
                const userResponse = await api.get(`/api/users/${userId}`);
                console.log('👤 사용자 정보:', userResponse.data);
                if (userResponse.data.success) {
                    console.log('✅ 사용자 데이터:', userResponse.data.data);
                    setUserDetail(userResponse.data.data);
                }
            } catch (userError: any) {
                console.error('사용자 정보 조회 실패:', userError.response?.status, userError.response?.data);
                // 사용자 정보를 가져올 수 없어도 앱은 계속 작동
            }
        } catch (error) {
            console.error('사용자 정보 로드 실패:', error);
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

    // 날짜 클릭 핸들러
    const handleDateClick = (year: number, month: number, date: number, isCurrentMonth: boolean) => {
        if (!isCurrentMonth) return;
        
        const clickedDate = new Date(year, month, date);
        setSelectedDate(clickedDate);
        
        // 해당 날짜의 강의 목록 가져오기
        const dayOfWeek = clickedDate.getDay();
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[dayOfWeek];
        
        const lectures: any[] = [];
        
        allCourseGroups.forEach((group: any) => {
            // 요일 체크
            if (!group.dayOfWeek || !group.dayOfWeek.includes(dayName)) {
                return;
            }
            
            // 날짜 범위 체크
            const startDate = group.startDate ? new Date(group.startDate) : null;
            const endDate = group.endDate ? new Date(group.endDate) : null;
            
            if (startDate && clickedDate < startDate) return;
            if (endDate && clickedDate > endDate) return;
            
            // 강의 추가
            const subjects = group.courses?.map((course: any) => 
                course.category || course.title
            ).filter((s: string, i: number, arr: string[]) => 
                arr.indexOf(s) === i
            ).join(', ') || '강의';
            
            lectures.push({
                id: group.id,
                time: `${group.startTime || '00:00'} ~ ${group.endTime || '00:00'}`,
                school: group.schoolName,
                subject: subjects
            });
        });
        
        setSelectedDateLectures(lectures);
    };

    // 날짜 포맷 (년월일)
    const formatFullDate = (date: Date) => {
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
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
        <>
            <PWAInstallPrompt />
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
                                        onClick={() => router.push(`/teacher/lecture/${lecture.id}`)}
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
                        {!selectedDate ? (
                            <>
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
                                                    onClick={() => handleDateClick(year, month, day.date, day.isCurrentMonth)}
                                                >
                                                    <span className={styles.dayNumber}>{day.date}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* 날짜별 일정 */}
                                <div className={styles.dateScheduleHeader}>
                                    <button 
                                        className={styles.backButton} 
                                        onClick={() => setSelectedDate(null)}
                                    >
                                        <IoChevronBack size={24} />
                                    </button>
                                    <h2 className={styles.dateTitle}>
                                        {formatFullDate(selectedDate)} 일정
                                    </h2>
                                </div>

                                {selectedDateLectures.length > 0 ? (
                                    <div className={styles.lectureList}>
                                        {selectedDateLectures.map((lecture) => (
                                            <div 
                                                key={lecture.id} 
                                                className={styles.lectureCard}
                                                onClick={() => router.push(`/teacher/lecture/${lecture.id}`)}
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
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.emptyState}>
                                        <div className={styles.emptyIcon}>📅</div>
                                        <p className={styles.emptyText}>이 날은 예정된 강의가 없습니다</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'my' && (
                    <div className={styles.myContent}>
                        {/* 내 정보 */}
                        <div className={styles.profileSection}>
                            <h3 className={styles.sectionLabel}>내 정보</h3>
                            
                            <div className={styles.profileCard}>
                                <div className={styles.profileRow}>
                                    <span className={styles.profileLabel}>아이디</span>
                                    <span className={styles.profileValue}>
                                        {userDetail?.username || userInfo?.username || '이름 없음'}
                                    </span>
                                </div>
                                
                                <div className={styles.profileRow}>
                                    <span className={styles.profileLabel}>이메일</span>
                                    <span className={styles.profileValue}>
                                        {userDetail?.email || userInfo?.email || '이메일 없음'}
                                    </span>
                                </div>
                                
                                <div className={styles.profileRow}>
                                    <span className={styles.profileLabel}>연락처</span>
                                    <span className={styles.profileValue}>
                                        {userDetail?.phone || userDetail?.phoneNumber || userInfo?.phone || '연락처 없음'}
                                    </span>
                                </div>
                                
                                <div className={styles.profileRow}>
                                    <span className={styles.profileLabel}>계좌 정보</span>
                                    <span className={styles.profileValue}>
                                        {(() => {
                                            if (userDetail?.bankName && userDetail?.accountNumber) {
                                                return `${userDetail.bankName} ${userDetail.accountNumber}`;
                                            }
                                            return '계좌 정보 없음';
                                        })()}
                                    </span>
                                </div>
                                
                                <button 
                                    className={styles.editButton}
                                    onClick={() => router.push('/teacher/settings/account')}
                                >
                                    계좌 정보 변경
                                </button>
                            </div>
                        </div>

                        <div className={styles.divider}></div>

                        {/* 정산 정보 */}
                        <div className={styles.settlementSection}>
                            <div className={styles.settlementHeader}>
                                <h3 className={styles.sectionLabel}>정산 정보</h3>
                                <button 
                                    className={styles.historyButton}
                                    onClick={() => router.push('/teacher/my/history')}
                                >
                                    내 강의 이력
                                </button>
                            </div>

                            {/* 이번 달 누적 */}
                            <div className={styles.totalCard}>
                                <div className={styles.totalLabel}>이번 달 누적 정산 금액</div>
                                <div className={styles.totalAmount}>1,240,000원</div>
                            </div>

                            {/* 월별 정산 내역 */}
                            <div className={styles.monthlySection}>
                                <h4 className={styles.monthlyTitle}>월별 정산 내역</h4>
                                
                                <div className={styles.settlementList}>
                                    {[
                                        { month: '2026년 2월', amount: 1240000, status: 'pending' },
                                        { month: '2026년 1월', amount: 980000, status: 'completed' },
                                        { month: '2025년 12월', amount: 1150000, status: 'completed' }
                                    ].map((item, index) => (
                                        <div key={index} className={styles.settlementItem}>
                                            <div className={styles.settlementInfo}>
                                                <div className={styles.settlementMonth}>{item.month}</div>
                                                <div className={styles.settlementAmount}>
                                                    {item.amount.toLocaleString()}원
                                                </div>
                                            </div>
                                            <div className={`${styles.settlementStatus} ${
                                                item.status === 'completed' 
                                                    ? styles.statusCompleted 
                                                    : styles.statusPending
                                            }`}>
                                                {item.status === 'completed' ? '지급 완료' : '관리자 확인중'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className={styles.settingsContent}>
                        {/* 계정 설정 */}
                        <div className={styles.settingsSection}>
                            <h3 className={styles.settingsSectionTitle}>계정 설정</h3>
                            <div className={styles.settingsList}>
                                <button 
                                    className={styles.settingsItem}
                                    onClick={() => router.push('/teacher/settings/password')}
                                >
                                    <span className={styles.settingsLabel}>비밀번호 변경</span>
                                    <span className={styles.settingsArrow}>›</span>
                                </button>
                                <button 
                                    className={styles.settingsItem}
                                    onClick={() => router.push('/teacher/settings/phone')}
                                >
                                    <span className={styles.settingsLabel}>연락처 변경</span>
                                    <span className={styles.settingsArrow}>›</span>
                                </button>
                                <button 
                                    className={styles.settingsItem}
                                    onClick={() => router.push('/teacher/settings/notification')}
                                >
                                    <span className={styles.settingsLabel}>알림 설정</span>
                                    <span className={styles.settingsArrow}>›</span>
                                </button>
                            </div>
                        </div>

                        {/* 출근 설정 */}
                        <div className={styles.settingsSection}>
                            <h3 className={styles.settingsSectionTitle}>출근 설정</h3>
                            <div className={styles.settingsList}>
                                <button 
                                    className={styles.settingsItem}
                                    onClick={() => router.push('/teacher/settings/location-range')}
                                >
                                    <span className={styles.settingsLabel}>위치 허용 범위</span>
                                    <span className={styles.settingsValue}>100m</span>
                                </button>
                                <div className={styles.settingsItem}>
                                    <span className={styles.settingsLabel}>자동 퇴근 체크</span>
                                    <label className={styles.switch}>
                                        <input type="checkbox" />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* 앱 설정 */}
                        <div className={styles.settingsSection}>
                            <h3 className={styles.settingsSectionTitle}>앱 설정</h3>
                            <div className={styles.settingsList}>
                                <button 
                                    className={styles.settingsItem}
                                    onClick={() => {
                                        // PWA 설치 프롬프트 표시
                                        const event = new Event('show-install-prompt');
                                        window.dispatchEvent(event);
                                    }}
                                >
                                    <span className={styles.settingsLabel}>홈 화면에 추가</span>
                                    <span className={styles.settingsArrow}>›</span>
                                </button>
                                <button 
                                    className={styles.settingsItem}
                                    onClick={() => router.push('/teacher/settings/theme')}
                                >
                                    <span className={styles.settingsLabel}>테마 설정</span>
                                    <span className={styles.settingsValue}>라이트</span>
                                </button>
                                <button 
                                    className={styles.settingsItem}
                                    onClick={() => router.push('/teacher/settings/language')}
                                >
                                    <span className={styles.settingsLabel}>언어 설정</span>
                                    <span className={styles.settingsValue}>한국어</span>
                                </button>
                                <button 
                                    className={styles.settingsItem}
                                    onClick={() => router.push('/teacher/settings/cache')}
                                >
                                    <span className={styles.settingsLabel}>캐시 삭제</span>
                                    <span className={styles.settingsArrow}>›</span>
                                </button>
                            </div>
                        </div>

                        {/* 정보 */}
                        <div className={styles.settingsSection}>
                            <h3 className={styles.settingsSectionTitle}>정보</h3>
                            <div className={styles.settingsList}>
                                <div className={styles.settingsItem}>
                                    <span className={styles.settingsLabel}>앱 버전</span>
                                    <span className={styles.settingsValue} style={{marginRight:"40px"}}>1.0.0</span>
                                </div>
                                <button 
                                    className={styles.settingsItem}
                                    onClick={() => router.push('/teacher/settings/terms')}
                                >
                                    <span className={styles.settingsLabel}>이용약관</span>
                                    <span className={styles.settingsArrow}>›</span>
                                </button>
                                <button 
                                    className={styles.settingsItem}
                                    onClick={() => router.push('/teacher/settings/privacy')}
                                >
                                    <span className={styles.settingsLabel}>개인정보 처리방침</span>
                                    <span className={styles.settingsArrow}>›</span>
                                </button>
                                <button 
                                    className={styles.settingsItem}
                                    onClick={() => router.push('/teacher/settings/notice')}
                                >
                                    <span className={styles.settingsLabel}>공지사항</span>
                                    <span className={styles.settingsArrow}>›</span>
                                </button>
                            </div>
                        </div>

                        {/* 로그아웃 */}
                        <div className={styles.settingsSection}>
                            <button 
                                className={styles.logoutButton}
                                onClick={() => {
                                    if (confirm('로그아웃 하시겠습니까?')) {
                                        localStorage.removeItem('user');
                                        router.push('/teacher/login');
                                    }
                                }}
                            >
                                로그아웃
                            </button>
                        </div>
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
        </>
    );
}
