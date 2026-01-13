'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import styles from './page.module.css';
import { FaUsers, FaCalendar, FaClock, FaChevronDown, FaBook, FaFile, FaBullhorn, FaUser, FaBell, FaArrowLeft } from 'react-icons/fa';

interface Classroom {
  id: number;
  title: string;
  description: string;
  instructor: string;
  students: number;
  startDate: string;
  duration: string;
  status: 'active' | 'upcoming' | 'completed';
}

export default function ClassroomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = React.useState('강의 전체보기');
  const [isMyPageOpen, setIsMyPageOpen] = React.useState(true);
  const [classroom, setClassroom] = React.useState<Classroom | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // 실제로는 API에서 데이터를 가져와야 하지만, 임시로 더미 데이터 사용
    const dummyClassrooms: Classroom[] = [
      {
        id: 1,
        title: '드론 기초 조종법',
        description: '드론의 기본 조종법을 배우는 강의입니다.',
        instructor: '이동연',
        students: 15,
        startDate: '2024-12-01',
        duration: '4주',
        status: 'active',
      },
      {
        id: 2,
        title: '드론 고급 기술',
        description: '드론의 고급 기술과 촬영 기법을 배웁니다.',
        instructor: '이동연',
        students: 8,
        startDate: '2024-12-15',
        duration: '6주',
        status: 'upcoming',
      },
    ];

    const foundClassroom = dummyClassrooms.find(c => c.id === Number(params.id));
    setClassroom(foundClassroom || null);
    setLoading(false);
  }, [params.id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className={`${styles.statusBadge} ${styles.active}`}>진행 중</span>;
      case 'upcoming':
        return <span className={`${styles.statusBadge} ${styles.upcoming}`}>예정</span>;
      case 'completed':
        return <span className={`${styles.statusBadge} ${styles.completed}`}>완료</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <>
        <Header forceLightMode={true} />
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <nav className={styles.sidebarNav}>
              <div className={styles.menuGroup}>
                <button className={styles.menuToggle}>
                  <span>My Page</span>
                  <FaChevronDown />
                </button>
              </div>
            </nav>
          </aside>
          <main className={styles.content}>
            <div className={styles.loadingContainer}>
              <p>강의 정보를 불러오는 중입니다...</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (!classroom) {
    return (
      <>
        <Header forceLightMode={true} />
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <nav className={styles.sidebarNav}>
              <div className={styles.menuGroup}>
                <button className={styles.menuToggle}>
                  <span>My Page</span>
                  <FaChevronDown />
                </button>
              </div>
            </nav>
          </aside>
          <main className={styles.content}>
            <div className={styles.errorContainer}>
              <p>강의를 찾을 수 없습니다.</p>
              <button onClick={() => router.push('/classroom')} className={styles.backButton}>
                목록으로 돌아가기
              </button>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Header forceLightMode={true} />
      <div className={styles.container}>
        {/* 사이드바 */}
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            <div className={styles.menuGroup}>
              <button
                className={styles.menuToggle}
                onClick={() => setIsMyPageOpen(!isMyPageOpen)}
              >
                <span>My Page</span>
                <FaChevronDown
                  style={{
                    transform: isMyPageOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </button>

              {isMyPageOpen && (
                <ul className={styles.submenu}>
                  <li>
                    <button
                      className={`${styles.submenuItem} ${activeMenu === '강의 전체보기' ? styles.active : ''}`}
                      onClick={() => setActiveMenu('강의 전체보기')}
                    >
                      <FaBook /> 강의 전체보기
                    </button>
                  </li>
                  <li>
                    <button
                      className={`${styles.submenuItem} ${activeMenu === '파일 관리' ? styles.active : ''}`}
                      onClick={() => setActiveMenu('파일 관리')}
                    >
                      <FaFile /> 파일 관리
                    </button>
                  </li>
                  <li>
                    <button
                      className={`${styles.submenuItem} ${activeMenu === '진행강좌 공지' ? styles.active : ''}`}
                      onClick={() => setActiveMenu('진행강좌 공지')}
                    >
                      <FaBullhorn /> 진행강좌 공지
                    </button>
                  </li>
                  <li>
                    <button
                      className={`${styles.submenuItem} ${activeMenu === '강사 프로필 수정' ? styles.active : ''}`}
                      onClick={() => setActiveMenu('강사 프로필 수정')}
                    >
                      <FaUser /> 강사 프로필 수정
                    </button>
                  </li>
                </ul>
              )}
            </div>

            <button className={styles.noticeButton}>
              <FaBell /> 공지사항
            </button>
          </nav>
        </aside>

        {/* 본문 */}
        <main className={styles.content}>
          <button onClick={() => router.back()} className={styles.backButton}>
            <FaArrowLeft /> 뒤로 가기
          </button>

          <div className={styles.detailHeader}>
            <div className={styles.headerTop}>
              <h1 className={styles.title}>{classroom.title}</h1>
              {getStatusBadge(classroom.status)}
            </div>
            <p className={styles.description}>{classroom.description}</p>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <FaUser className={styles.infoIcon} />
              <div>
                <p className={styles.infoLabel}>강사</p>
                <p className={styles.infoValue}>{classroom.instructor}</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <FaUsers className={styles.infoIcon} />
              <div>
                <p className={styles.infoLabel}>수강생</p>
                <p className={styles.infoValue}>{classroom.students}명</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <FaCalendar className={styles.infoIcon} />
              <div>
                <p className={styles.infoLabel}>시작일</p>
                <p className={styles.infoValue}>{classroom.startDate}</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <FaClock className={styles.infoIcon} />
              <div>
                <p className={styles.infoLabel}>기간</p>
                <p className={styles.infoValue}>{classroom.duration}</p>
              </div>
            </div>
          </div>

          <div className={styles.sectionsContainer}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>강의 자료</h2>
              <div className={styles.sectionContent}>
                <p className={styles.emptyMessage}>아직 등록된 강의 자료가 없습니다.</p>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>공지사항</h2>
              <div className={styles.sectionContent}>
                <p className={styles.emptyMessage}>아직 등록된 공지사항이 없습니다.</p>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>과제</h2>
              <div className={styles.sectionContent}>
                <p className={styles.emptyMessage}>아직 등록된 과제가 없습니다.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
