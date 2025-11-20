'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

interface Course {
  id: number;
  category: string;
  title: string;
  instructor: string;
  level: string;
  duration: string;
  price: number;
  createdAt: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    instructor: '',
    level: '',
    duration: '',
    price: 0,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      // 백엔드에서 강좌 목록 가져오기
      const response = await fetch('/api/resources');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.data || []);
      }
    } catch (error) {
      console.error('강좌 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setFormData({
      category: '',
      title: '',
      instructor: '',
      level: '',
      duration: '',
      price: 0,
    });
    setShowModal(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      category: course.category,
      title: course.title,
      instructor: course.instructor,
      level: course.level,
      duration: course.duration,
      price: course.price,
    });
    setShowModal(true);
  };

  const handleDeleteCourse = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        // 백엔드에서 강좌 삭제
        const response = await fetch(`/api/resources/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setCourses(courses.filter(c => c.id !== id));
          alert('강좌가 삭제되었습니다.');
        }
      } catch (error) {
        console.error('강좌 삭제 실패:', error);
        alert('강좌 삭제에 실패했습니다.');
      }
    }
  };

  const handleSaveCourse = async () => {
    try {
      if (editingCourse) {
        // 수정
        const response = await fetch(`/api/resources/${editingCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          alert('강좌가 수정되었습니다.');
          loadCourses();
          setShowModal(false);
        }
      } else {
        // 추가
        const response = await fetch('/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          alert('강좌가 추가되었습니다.');
          loadCourses();
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error('강좌 저장 실패:', error);
      alert('강좌 저장에 실패했습니다.');
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>강좌관리</h1>
        <p>학습자료 강좌를 관리합니다.</p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="강좌명 또는 강사명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button className={styles.addButton} onClick={handleAddCourse}>
          <FaPlus /> 강좌 추가
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>로딩 중...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>카테고리</th>
                <th>강좌명</th>
                <th>강사</th>
                <th>난이도</th>
                <th>시간</th>
                <th>가격</th>
                <th>작성일</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.category}</td>
                    <td>{course.title}</td>
                    <td>{course.instructor}</td>
                    <td>{course.level}</td>
                    <td>{course.duration}</td>
                    <td>{course.price.toLocaleString()}원</td>
                    <td>{new Date(course.createdAt).toLocaleDateString()}</td>
                    <td className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEditCourse(course)}
                        title="수정"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteCourse(course.id)}
                        title="삭제"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className={styles.noData}>
                    강좌가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{editingCourse ? '강좌 수정' : '강좌 추가'}</h2>
            <div className={styles.formGroup}>
              <label>카테고리</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="예: 진로"
              />
            </div>
            <div className={styles.formGroup}>
              <label>강좌명</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="강좌명을 입력하세요"
              />
            </div>
            <div className={styles.formGroup}>
              <label>강사</label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                placeholder="강사명을 입력하세요"
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>난이도</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  <option value="">선택</option>
                  <option value="초급">초급</option>
                  <option value="중급">중급</option>
                  <option value="고급">고급</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>시간</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="예: 2시간"
                />
              </div>
              <div className={styles.formGroup}>
                <label>가격</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className={styles.modalButtons}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                취소
              </button>
              <button className={styles.saveBtn} onClick={handleSaveCourse}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
