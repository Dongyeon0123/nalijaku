'use client';

import React from 'react';
import Header from '@/components/Header';
import styles from './page.module.css';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaCalendar, FaClock, FaChevronDown, FaBook, FaFile, FaBullhorn, FaUser, FaBell } from 'react-icons/fa';

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

export default function ClassroomPage() {
  const [activeMenu, setActiveMenu] = React.useState('강의 전체보기');
  const [isMyPageOpen, setIsMyPageOpen] = React.useState(true);
  const [classrooms, setClassrooms] = React.useState<Classroom[]>([
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
  ]);

  const [showModal, setShowModal] = React.useState(false);
  const [editingClassroom, setEditingClassroom] = React.useState<Classroom | null>(null);
  const [formData, setFormData] = React.useState<{
    title: string;
    description: string;
    instructor: string;
    startDate: string;
    duration: string;
    status: 'active' | 'upcoming' | 'completed';
  }>({
    title: '',
    description: '',
    instructor: '',
    startDate: '',
    duration: '',
    status: 'upcoming',
  });

  const handleAddClassroom = () => {
    setEditingClassroom(null);
    setFormData({
      title: '',
      description: '',
      instructor: '',
      startDate: '',
      duration: '',
      status: 'upcoming',
    });
    setShowModal(true);
  };

  const handleEditClassroom = (classroom: Classroom) => {
    setEditingClassroom(classroom);
    setFormData({
      title: classroom.title,
      description: classroom.description,
      instructor: classroom.instructor,
      startDate: classroom.startDate,
      duration: classroom.duration,
      status: classroom.status,
    });
    setShowModal(true);
  };

  const handleDeleteClassroom = (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setClassrooms(classrooms.filter(c => c.id !== id));
    }
  };

  const handleSaveClassroom = () => {
    if (!formData.title || !formData.description) {
      alert('제목과 설명을 입력해주세요.');
      return;
    }

    if (editingClassroom) {
      setClassrooms(classrooms.map(c =>
        c.id === editingClassroom.id
          ? { ...c, ...formData, students: c.students }
          : c
      ));
    } else {
      const newClassroom: Classroom = {
        id: Math.max(...classrooms.map(c => c.id), 0) + 1,
        ...formData,
        students: 0,
      };
      setClassrooms([...classrooms, newClassroom]);
    }

    setShowModal(false);
  };

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
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>내 강의실</h1>
              <p className={styles.subtitle}>강의를 관리하고 학생들과 소통하세요.</p>
            </div>
            <button className={styles.addButton} onClick={handleAddClassroom}>
              <FaPlus /> 강의 추가
            </button>
          </div>

          <div className={styles.classroomsGrid}>
            {classrooms.length > 0 ? (
              classrooms.map((classroom) => (
                <div 
                  key={classroom.id} 
                  className={styles.classroomCard}
                  onClick={() => window.location.href = `/classroom/${classroom.id}`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.cardHeader}>
                    <h3 className={styles.classroomTitle}>{classroom.title}</h3>
                    {getStatusBadge(classroom.status)}
                  </div>

                  <p className={styles.description}>{classroom.description}</p>

                  <div className={styles.classroomInfo}>
                    <div className={styles.infoItem}>
                      <FaUsers className={styles.icon} />
                      <span>{classroom.students}명</span>
                    </div>
                  </div>

                  <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEditClassroom(classroom)}
                    >
                      <FaEdit /> 수정
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteClassroom(classroom.id)}
                    >
                      <FaTrash /> 삭제
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>아직 강의가 없습니다.</p>
                <button className={styles.addButton} onClick={handleAddClassroom}>
                  <FaPlus /> 첫 강의 추가하기
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{editingClassroom ? '강의 수정' : '강의 추가'}</h2>

            <div className={styles.formGroup}>
              <label>강의 제목</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="강의 제목을 입력하세요"
              />
            </div>

            <div className={styles.formGroup}>
              <label>설명</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="강의 설명을 입력하세요"
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label>강사명</label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                placeholder="강사명을 입력하세요"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>시작 날짜</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>기간</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="예: 4주"
                />
              </div>

              <div className={styles.formGroup}>
                <label>상태</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'upcoming' | 'completed' })}
                >
                  <option value="upcoming">예정</option>
                  <option value="active">진행 중</option>
                  <option value="completed">완료</option>
                </select>
              </div>
            </div>

            <div className={styles.modalButtons}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                취소
              </button>
              <button className={styles.saveBtn} onClick={handleSaveClassroom}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
