'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import styles from './page.module.css';
import api from '@/lib/axios';
import { FiEdit2, FiSave, FiX, FiAward, FiBook, FiClock, FiTrendingUp } from 'react-icons/fi';
import ExcelJS from 'exceljs';

// 날리자쿠 사업자 정보
const COMPANY_INFO = {
  registrationNumber: '215-65-00727',
  companyName: '날리자쿠',
  representative: '이민상',
  address: '충청북도 청주시 서원구 서원서로 30-23',
  businessType: '교육 서비스업',
  businessItem: '온라인 교육 콘텐츠 제공 및 강사와 기관 매칭 시스템',
  phone: '010-5029-6452'
};

interface UserProfile {
  id: number;
  username: string;
  email: string;
  organization: string;
  role: string;
  phone: string;
  droneExperience: boolean;
  createdAt: string;
}

interface EnrolledCourse {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  completedAt?: string;
  thumbnail?: string;
}

interface CourseGroup {
  id: number;
  schoolName: string;
  studentCount: number;
  startDate: string;
  endDate: string;
  dayOfWeek?: string[]; // 요일
  startTime?: string; // 시작 시간
  endTime?: string; // 종료 시간
  locationName?: string; // 위치명
  latitude?: number; // 위도
  longitude?: number; // 경도
  address?: string; // 주소
  status: string;
  courseCount: number;
  courses: Array<{
    id: number;
    title: string;
    subtitle?: string;
    thumbnail?: string;
    category?: string;
    contents?: Array<{
      id: number;
      title: string;
      description?: string;
      type?: string;
      order?: number;
      duration?: string;
      price?: number;
      pdfUrl?: string;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
  classLink?: string;
  announcement?: string;
}

interface Inquiry {
  id: number;
  organizationName: string;
  contactPerson: string;
  phone: string;
  email: string;
  studentCount: number;
  preferredDate: string;
  message: string;
  status: 'pending' | 'reviewing' | 'completed';
  courses: Array<{
    id: number;
    title: string;
    category: string;
    price?: number;
    learningMaterials?: Array<{
      id: number;
      title: string;
      price?: number;
      duration?: string;
    }>;
  }>;
  courseDetails?: Array<{
    courseId: number;
    selectedModules: number[];
    droneOption: 'none' | 'purchase' | 'rental';
    droneQuantity?: number;
  }>;
  createdAt: string;
}

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [instructorCourses, setInstructorCourses] = useState<CourseGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'courses' | 'inquiries' | 'settings' | 'certificates'>('profile');
  const [selectedCourse, setSelectedCourse] = useState<CourseGroup | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  
  // 수정 모드 상태
  const [editMode, setEditMode] = useState({
    organization: false,
    phone: false,
    droneExperience: false
  });

  // 수정 중인 값
  const [editValues, setEditValues] = useState({
    organization: '',
    phone: '',
    droneExperience: false
  });
  
  // 비밀번호 변경
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 통계 데이터
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalStudyTime: 0,
    certificates: 0
  });

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) {
        alert('로그인이 필요합니다.');
        router.push('/');
        return;
      }
      
      try {
        const userData = JSON.parse(savedUser);
        loadUserProfile(userData.id);
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  const loadUserProfile = async (userId: number) => {
    try {
      setLoading(true);
      
      // 사용자 프로필 조회
      const profileResponse = await api.get(`/api/users/${userId}`);
      if (profileResponse.data.success) {
        const userData = profileResponse.data.data;
        setUser(userData);
        setEditValues({
          organization: userData.organization || '',
          phone: userData.phone || '',
          droneExperience: userData.droneExperience || false
        });
      }

      // 수강 중인 강의 목록 조회 (API 구현 필요)
      try {
        const coursesResponse = await api.get(`/api/users/${userId}/courses`);
        if (coursesResponse.data.success) {
          const courses = coursesResponse.data.data;
          setEnrolledCourses(courses);
          
          // 통계 계산
          setStats({
            totalCourses: courses.length,
            completedCourses: courses.filter((c: EnrolledCourse) => c.completedAt).length,
            totalStudyTime: courses.reduce((acc: number, c: EnrolledCourse) => acc + (c.progress * 2), 0), // 임시 계산
            certificates: courses.filter((c: EnrolledCourse) => c.completedAt).length
          });
        }
      } catch (error) {
        console.log('수강 강의 목록 API 미구현');
        setEnrolledCourses([]);
      }

      // 내 문의 내역 조회
      try {
        const inquiriesResponse = await api.get(`/api/inquiries/my`);
        if (inquiriesResponse.data.success) {
          // 백엔드에서 대문자로 오는 상태값을 소문자로 변환
          const mappedInquiries = inquiriesResponse.data.data.map((inq: any) => ({
            ...inq,
            status: inq.status?.toLowerCase() || 'pending'
          }));
          setInquiries(mappedInquiries);
        }
      } catch (error) {
        console.log('문의 내역 API 미구현 또는 오류');
        setInquiries([]);
      }

      // 강사인 경우 담당 강의 목록 조회
      if (profileResponse.data.data.role === 'TEACHER') {
        try {
          console.log('🔍 강사 강의 목록 조회 시작, userId:', userId);
          
          // userId로 강의 목록 조회 (백엔드에서 userId → instructorId 변환)
          const instructorCoursesResponse = await api.get(`/api/instructors/by-user/${userId}/courses`);
          
          console.log('✅ 강사 강의 목록 응답:', instructorCoursesResponse.data);
          console.log('📊 응답 데이터 구조:', JSON.stringify(instructorCoursesResponse.data, null, 2));
          
          if (instructorCoursesResponse.data.success) {
            const courseGroups = instructorCoursesResponse.data.data;
            console.log('📚 강의 그룹 수:', courseGroups.length);
            
            // lessons를 contents로 매핑
            const normalizedGroups = courseGroups.map((group: any) => ({
              ...group,
              courses: group.courses?.map((course: any) => ({
                ...course,
                // lessons 배열을 contents로 변환
                contents: course.lessons?.map((lesson: any) => ({
                  id: lesson.id,
                  title: lesson.materials || `${lesson.order}차시`,
                  description: lesson.description,
                  type: lesson.type,
                  order: lesson.order,
                  pdfUrl: lesson.pdfUrl
                })) || []
              })) || []
            }));
            
            // 각 그룹의 강좌와 차시 정보 로그
            normalizedGroups.forEach((group: any, idx: number) => {
              console.log(`\n📖 그룹 ${idx + 1}: ${group.schoolName}`);
              console.log(`  - 강좌 수: ${group.courses?.length || 0}`);
              
              if (group.courses && group.courses.length > 0) {
                group.courses.forEach((course: any, courseIdx: number) => {
                  console.log(`\n  📘 강좌 ${courseIdx + 1}: ${course.title}`);
                  console.log(`    - ID: ${course.id}`);
                  console.log(`    - 카테고리: ${course.category}`);
                  console.log(`    - contents 존재: ${course.contents ? 'O' : 'X'}`);
                  console.log(`    - contents 길이: ${course.contents?.length || 0}`);
                  
                  if (course.contents && course.contents.length > 0) {
                    console.log(`    - 차시 목록:`);
                    course.contents.forEach((content: any, contentIdx: number) => {
                      console.log(`      ${contentIdx + 1}. ${content.title || '제목없음'}`);
                      console.log(`         - ID: ${content.id}`);
                      console.log(`         - 타입: ${content.type || '없음'}`);
                      console.log(`         - 순서: ${content.order || '없음'}`);
                      console.log(`         - 설명: ${content.description || '없음'}`);
                    });
                  } else {
                    console.warn(`    ⚠️ 차시 정보가 없습니다!`);
                  }
                });
              } else {
                console.warn(`  ⚠️ 강좌가 없습니다!`);
              }
            });
            
            setInstructorCourses(normalizedGroups);
          }
        } catch (error: any) {
          console.error('❌ 강사 강의 목록 로드 실패:', error);
          console.error('에러 상태:', error.response?.status);
          console.error('에러 메시지:', error.response?.data);
          setInstructorCourses([]);
        }
      }
    } catch (error: any) {
      console.error('프로필 로드 실패:', error);
      alert('프로필을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field: 'organization' | 'phone' | 'droneExperience') => {
    setEditMode(prev => ({ ...prev, [field]: true }));
  };

  const handleCancel = (field: 'organization' | 'phone' | 'droneExperience') => {
    if (user) {
      setEditValues(prev => ({
        ...prev,
        [field]: user[field]
      }));
    }
    setEditMode(prev => ({ ...prev, [field]: false }));
  };

  const handleSave = async (field: 'organization' | 'phone' | 'droneExperience') => {
    if (!user) return;

    try {
      await api.put(`/api/users/${user.id}`, {
        [field]: editValues[field]
      });

      setUser(prev => prev ? { ...prev, [field]: editValues[field] } : null);
      setEditMode(prev => ({ ...prev, [field]: false }));
      alert('정보가 수정되었습니다.');
    } catch (error: any) {
      alert(error.response?.data?.message || '정보 수정에 실패했습니다.');
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    try {
      await api.put(`/api/users/${user?.id}/password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      alert('비밀번호가 변경되었습니다.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('정말로 회원 탈퇴하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    const confirmText = prompt('탈퇴하시려면 "탈퇴"를 입력해주세요.');
    if (confirmText !== '탈퇴') {
      return;
    }

    try {
      await api.delete(`/api/users/${user?.id}`);
      alert('회원 탈퇴가 완료되었습니다.');
      localStorage.clear();
      router.push('/');
    } catch (error: any) {
      alert(error.response?.data?.message || '회원 탈퇴에 실패했습니다.');
    }
  };

  const handleCourseClick = (course: CourseGroup) => {
    setSelectedCourse(course);
  };

  // 견적서 다운로드 함수
  const downloadQuotation = async (inquiry: Inquiry) => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    const validUntil = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const validUntilStr = `${validUntil.getFullYear()}년 ${validUntil.getMonth() + 1}월 ${validUntil.getDate()}일`;

    // 강좌가 없으면 기본 항목 추가
    const courses = inquiry.courses && inquiry.courses.length > 0 
      ? inquiry.courses 
      : [{ id: 0, title: '교육 프로그램', category: '기타', price: 0 }];

    // 강좌별 금액 계산 (선택된 모듈 + 드론 교구 포함)
    const courseItems: any[] = [];
    let itemNo = 1;

    courses.forEach((course) => {
      // courseDetails에서 해당 코스의 세부 정보 찾기
      const courseDetail = (inquiry as any).courseDetails?.find((cd: any) => cd.courseId === course.id);
      const selectedModules = courseDetail?.selectedModules || [];
      const droneOption = courseDetail?.droneOption || 'none';

      // 선택된 모듈이 있으면 모듈별로 항목 추가
      if (selectedModules.length > 0 && course.learningMaterials) {
        selectedModules.forEach((moduleId: number) => {
          const module = course.learningMaterials?.find((m: any) => m.id === moduleId);
          if (module) {
            console.log('📊 모듈 데이터:', module);
            console.log('📊 duration:', module.duration);
            
            // duration에서 숫자만 추출 (예: "2시간" -> 2)
            const durationHours = module.duration ? parseInt(module.duration.replace(/[^0-9]/g, '')) || 1 : 1;
            const pricePerUnit = module.price || 0; // (40분)당 가격
            const quantity = inquiry.studentCount;
            const supplyPrice = durationHours * pricePerUnit; // 학생 수 제외
            const tax = Math.round(supplyPrice * 0.1);
            courseItems.push({
              no: itemNo++,
              title: `${course.title} - ${module.title}`,
              duration: module.duration || '1시간',
              unitPrice: pricePerUnit,
              quantity,
              supplyPrice,
              tax,
              total: supplyPrice + tax
            });
          }
        });
      } else {
        // 선택된 모듈이 없으면 코스 전체 가격
        const unitPrice = course.price || 0;
        const quantity = inquiry.studentCount;
        const supplyPrice = unitPrice; // 학생 수 제외
        const tax = Math.round(supplyPrice * 0.1);
        courseItems.push({
          no: itemNo++,
          title: course.title,
          duration: '-',
          unitPrice,
          quantity,
          supplyPrice,
          tax,
          total: supplyPrice + tax
        });
      }

      // 드론 교구 옵션 추가
      if (course.category === '드론' && droneOption !== 'none') {
        const dronePrice = droneOption === 'purchase' ? 25000 : 10000;
        const droneTitle = droneOption === 'purchase' ? '드론 교구 구매' : '드론 교구 대여';
        const droneQuantity = courseDetail?.droneQuantity || 1;
        const supplyPrice = dronePrice * droneQuantity;
        const tax = Math.round(supplyPrice * 0.1);
        courseItems.push({
          no: itemNo++,
          title: `${course.title} - ${droneTitle}`,
          duration: '-',
          unitPrice: dronePrice,
          quantity: droneQuantity,
          supplyPrice,
          tax,
          total: supplyPrice + tax
        });
      }
    });

    // 총 수업시간 계산 (모든 선택된 모듈의 duration 합계)
    let totalHours = 0;
    courses.forEach((course) => {
      const courseDetail = (inquiry as any).courseDetails?.find((cd: any) => cd.courseId === course.id);
      const selectedModules = courseDetail?.selectedModules || [];
      
      if (selectedModules.length > 0 && course.learningMaterials) {
        selectedModules.forEach((moduleId: number) => {
          const module = course.learningMaterials?.find((m: any) => m.id === moduleId);
          if (module && module.duration) {
            const durationHours = parseInt(module.duration.replace(/[^0-9]/g, '')) || 0;
            totalHours += durationHours;
          }
        });
      }
    });

    console.log('📊 총 수업시간:', totalHours);

    // 강사비 추가 (2시간당 60,000원 = 시간당 30,000원)
    const instructorPricePerHour = 30000;
    const instructorSupplyPrice = totalHours * instructorPricePerHour;
    const instructorTax = Math.round(instructorSupplyPrice * 0.1);
    courseItems.push({
      no: itemNo++,
      title: '주강사',
      duration: `${totalHours}시간`,
      unitPrice: instructorPricePerHour,
      quantity: 1,
      supplyPrice: instructorSupplyPrice,
      tax: instructorTax,
      total: instructorSupplyPrice + instructorTax
    });

    // 보조강사비 추가 (학생 수 15명 초과 시, 2시간당 20,000원 = 시간당 10,000원)
    if (inquiry.studentCount > 15) {
      const assistantPricePerHour = 10000;
      const assistantSupplyPrice = totalHours * assistantPricePerHour;
      const assistantTax = Math.round(assistantSupplyPrice * 0.1);
      courseItems.push({
        no: itemNo++,
        title: '보조강사',
        duration: `${totalHours}시간`,
        unitPrice: assistantPricePerHour,
        quantity: 1,
        supplyPrice: assistantSupplyPrice,
        tax: assistantTax,
        total: assistantSupplyPrice + assistantTax
      });
    }

    const totalSupplyPrice = courseItems.reduce((sum, item) => sum + item.supplyPrice, 0);
    const totalTax = courseItems.reduce((sum, item) => sum + item.tax, 0);
    const grandTotal = totalSupplyPrice + totalTax;

    // 금액을 한글로 변환
    const numberToKorean = (num: number): string => {
      if (num === 0) return '영';
      const units = ['', '만', '억', '조'];
      const digits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
      const smallUnits = ['', '십', '백', '천'];
      let result = '';
      let unitIndex = 0;
      while (num > 0) {
        const chunk = num % 10000;
        if (chunk > 0) {
          let chunkStr = '';
          let tempChunk = chunk;
          let smallUnitIndex = 0;
          while (tempChunk > 0) {
            const digit = tempChunk % 10;
            if (digit > 0) chunkStr = digits[digit] + smallUnits[smallUnitIndex] + chunkStr;
            tempChunk = Math.floor(tempChunk / 10);
            smallUnitIndex++;
          }
          result = chunkStr + units[unitIndex] + result;
        }
        num = Math.floor(num / 10000);
        unitIndex++;
      }
      return result;
    };

    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('견적서');

    // 열 너비 설정
    ws.columns = [
      { width: 10 }, { width: 20 }, { width: 14 }, { width: 16 },
      { width: 8 }, { width: 14 }, { width: 14 }, { width: 14 }
    ];

    // 스타일 정의
    const thinBorder: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' }, bottom: { style: 'thin' },
      left: { style: 'thin' }, right: { style: 'thin' }
    };
    const thickBorder: Partial<ExcelJS.Borders> = {
      top: { style: 'medium' }, bottom: { style: 'medium' },
      left: { style: 'medium' }, right: { style: 'medium' }
    };

    // 공급자/공급받는자 정보 행 스타일 함수
    const setLabelStyle = (cell: ExcelJS.Cell) => {
      cell.font = { bold: true, size: 10, name: '맑은 고딕' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = thinBorder;
    };
    const setValueStyle = (cell: ExcelJS.Cell) => {
      cell.font = { size: 10, name: '맑은 고딕' };
      cell.alignment = { horizontal: 'left', vertical: 'middle' };
      cell.border = thinBorder;
    };

    // Row 1: 견적서 제목
    ws.mergeCells('A1:H1');
    const titleCell = ws.getCell('A1');
    titleCell.value = '견  적  서';
    titleCell.font = { bold: true, size: 28, name: '맑은 고딕' };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
    titleCell.border = thickBorder;
    ws.getRow(1).height = 45;

    // Row 2~3: 빈 행 병합
    ws.mergeCells('A2:H3');

    // Row 4: 날짜 (우측)
    ws.mergeCells('A4:H4');
    ws.getCell('A4').value = dateStr;
    ws.getCell('A4').font = { size: 12, name: '맑은 고딕' };
    ws.getCell('A4').alignment = { horizontal: 'right' };

    // Row 5: 귀하
    ws.mergeCells('A5:H5');
    ws.getCell('A5').value = `${inquiry.organizationName} 귀하`;
    ws.getCell('A5').font = { bold: true, size: 14, name: '맑은 고딕' };
    ws.getRow(5).height = 30;

    // Row 6: 아래와 같이
    ws.mergeCells('A6:H6');
    ws.getCell('A6').value = '아래와 같이 견적합니다.';
    ws.getCell('A6').font = { size: 11, name: '맑은 고딕' };

    // Row 7: 빈 행
    ws.mergeCells('A7:H7');

    // Row 8: 공급자/공급받는자 헤더
    ws.mergeCells('A8:D8');
    ws.mergeCells('E8:H8');
    const supplierHeader = ws.getCell('A8');
    supplierHeader.value = '공  급  자';
    supplierHeader.font = { bold: true, size: 11, name: '맑은 고딕', color: { argb: 'FFFFFFFF' } };
    supplierHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E7D32' } };
    supplierHeader.alignment = { horizontal: 'center', vertical: 'middle' };
    supplierHeader.border = thinBorder;
    ws.getRow(8).height = 25;

    const receiverHeader = ws.getCell('E8');
    receiverHeader.value = '공 급 받 는 자';
    receiverHeader.font = { bold: true, size: 11, name: '맑은 고딕', color: { argb: 'FFFFFFFF' } };
    receiverHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E7D32' } };
    receiverHeader.alignment = { horizontal: 'center', vertical: 'middle' };
    receiverHeader.border = thinBorder;

    // Row 9: 등록번호/상호
    ws.mergeCells('B9:D9');
    ws.mergeCells('F9:H9');
    setLabelStyle(ws.getCell('A9')); ws.getCell('A9').value = '등록번호';
    setValueStyle(ws.getCell('B9')); ws.getCell('B9').value = COMPANY_INFO.registrationNumber;
    setLabelStyle(ws.getCell('E9')); ws.getCell('E9').value = '상호';
    setValueStyle(ws.getCell('F9')); ws.getCell('F9').value = inquiry.organizationName;

    // Row 10: 상호/담당자 + 도장
    ws.mergeCells('B10:C10');
    ws.mergeCells('F10:H10');
    setLabelStyle(ws.getCell('A10')); ws.getCell('A10').value = '상호';
    setValueStyle(ws.getCell('B10')); ws.getCell('B10').value = COMPANY_INFO.companyName;
    setLabelStyle(ws.getCell('E10')); ws.getCell('E10').value = '담당자';
    setValueStyle(ws.getCell('F10')); ws.getCell('F10').value = inquiry.contactPerson;
    
    // D10: 도장 이미지 삽입
    try {
      const stampResponse = await fetch('/날쿠인.png');
      const stampBlob = await stampResponse.blob();
      const stampBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(stampBlob);
      });
      
      const imageId = workbook.addImage({
        base64: stampBase64.split(',')[1],
        extension: 'png',
      });
      
      ws.addImage(imageId, {
        tl: { col: 3, row: 8.5 },
        ext: { width: 70, height: 70 }
      });
    } catch (e) {
      ws.getCell('D10').value = '【날리자쿠】';
      ws.getCell('D10').font = { bold: true, size: 12, name: '맑은 고딕', color: { argb: 'FFC62828' } };
      ws.getCell('D10').alignment = { horizontal: 'center', vertical: 'middle' };
    }

    // Row 11: 대표자/연락처
    ws.mergeCells('B11:D11');
    ws.mergeCells('F11:H11');
    setLabelStyle(ws.getCell('A11')); ws.getCell('A11').value = '대표자';
    setValueStyle(ws.getCell('B11')); ws.getCell('B11').value = COMPANY_INFO.representative;
    setLabelStyle(ws.getCell('E11')); ws.getCell('E11').value = '연락처';
    setValueStyle(ws.getCell('F11')); ws.getCell('F11').value = inquiry.phone;

    // Row 12: 주소/이메일
    ws.mergeCells('B12:D12');
    ws.mergeCells('F12:H12');
    setLabelStyle(ws.getCell('A12')); ws.getCell('A12').value = '주소';
    setValueStyle(ws.getCell('B12')); ws.getCell('B12').value = COMPANY_INFO.address;
    setLabelStyle(ws.getCell('E12')); ws.getCell('E12').value = '이메일';
    setValueStyle(ws.getCell('F12')); ws.getCell('F12').value = inquiry.email;

    // Row 13: 업태/종목/전화
    ws.mergeCells('F13:H13');
    setLabelStyle(ws.getCell('A13')); ws.getCell('A13').value = '업태';
    setValueStyle(ws.getCell('B13')); ws.getCell('B13').value = COMPANY_INFO.businessType;
    setLabelStyle(ws.getCell('C13')); ws.getCell('C13').value = '종목';
    setValueStyle(ws.getCell('D13')); ws.getCell('D13').value = COMPANY_INFO.businessItem;
    ws.getCell('D13').font = { size: 8, name: '맑은 고딕' };
    setLabelStyle(ws.getCell('E13')); ws.getCell('E13').value = '전화';
    setValueStyle(ws.getCell('F13')); ws.getCell('F13').value = COMPANY_INFO.phone;

    // Row 15: 합계금액
    ws.mergeCells('B15:H15');
    const amountLabel = ws.getCell('A15');
    amountLabel.value = '합계금액';
    amountLabel.font = { bold: true, size: 14, name: '맑은 고딕', color: { argb: 'FFFFFFFF' } };
    amountLabel.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1565C0' } };
    amountLabel.alignment = { horizontal: 'center', vertical: 'middle' };
    amountLabel.border = thickBorder;
    
    const amountValue = ws.getCell('B15');
    amountValue.value = `금 ${numberToKorean(grandTotal)}원정 (₩${grandTotal.toLocaleString()})`;
    amountValue.font = { bold: true, size: 14, name: '맑은 고딕', color: { argb: 'FFFFFFFF' } };
    amountValue.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1565C0' } };
    amountValue.alignment = { horizontal: 'center', vertical: 'middle' };
    amountValue.border = thickBorder;
    ws.getRow(15).height = 30;

    // Row 17: 견적 내역 헤더
    ws.mergeCells('B17:C17');
    const headers = ['No', '품목 (강의명)', '', '수업시간(h)', '(40분)당', '공급가액', '세액(10%)', '합계'];
    headers.forEach((h, i) => {
      const cell = ws.getCell(17, i + 1);
      cell.value = h;
      cell.font = { bold: true, size: 11, name: '맑은 고딕', color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E7D32' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = thinBorder;
    });
    ws.getRow(17).height = 25;

    // 강좌 데이터
    courseItems.forEach((item, idx) => {
      const r = 18 + idx;
      ws.mergeCells(`B${r}:C${r}`);
      ws.getRow(r).height = 22;
      
      ws.getCell(`A${r}`).value = item.no;
      ws.getCell(`A${r}`).alignment = { horizontal: 'center', vertical: 'middle' };
      ws.getCell(`A${r}`).border = thinBorder;
      
      ws.getCell(`B${r}`).value = item.title;
      ws.getCell(`B${r}`).border = thinBorder;
      
      // D열: 수업시간(h) - duration
      ws.getCell(`D${r}`).value = item.duration;
      ws.getCell(`D${r}`).alignment = { horizontal: 'center' };
      ws.getCell(`D${r}`).border = thinBorder;
      
      // E열: (40분)당 - 모듈 가격
      ws.getCell(`E${r}`).value = item.unitPrice;
      ws.getCell(`E${r}`).numFmt = '#,##0';
      ws.getCell(`E${r}`).alignment = { horizontal: 'right' };
      ws.getCell(`E${r}`).border = thinBorder;
      
      ws.getCell(`F${r}`).value = item.supplyPrice;
      ws.getCell(`F${r}`).numFmt = '#,##0';
      ws.getCell(`F${r}`).alignment = { horizontal: 'right' };
      ws.getCell(`F${r}`).border = thinBorder;
      
      ws.getCell(`G${r}`).value = item.tax;
      ws.getCell(`G${r}`).numFmt = '#,##0';
      ws.getCell(`G${r}`).alignment = { horizontal: 'right' };
      ws.getCell(`G${r}`).border = thinBorder;
      
      ws.getCell(`H${r}`).value = item.total;
      ws.getCell(`H${r}`).numFmt = '#,##0';
      ws.getCell(`H${r}`).alignment = { horizontal: 'right' };
      ws.getCell(`H${r}`).border = thinBorder;
    });

    // 합계 행
    const sumRow = 18 + courseItems.length;
    ws.mergeCells(`A${sumRow}:E${sumRow}`);
    ws.getCell(`A${sumRow}`).value = '합    계';
    ws.getCell(`A${sumRow}`).font = { bold: true, size: 11, name: '맑은 고딕' };
    ws.getCell(`A${sumRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC8E6C9' } };
    ws.getCell(`A${sumRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getCell(`A${sumRow}`).border = thinBorder;
    
    ['F', 'G', 'H'].forEach((col, i) => {
      const cell = ws.getCell(`${col}${sumRow}`);
      cell.value = [totalSupplyPrice, totalTax, grandTotal][i];
      cell.numFmt = '#,##0';
      cell.font = { bold: true, size: 11, name: '맑은 고딕' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC8E6C9' } };
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
      cell.border = thinBorder;
    });

    // 기타 사항
    const etcRow = sumRow + 2;
    const etcItems = [
      { label: '유효기간', value: `견적일로부터 30일 (${validUntilStr}까지)` },
      { label: '결제조건', value: '계약 후 협의' },
      { label: '비고', value: inquiry.message || '-' }
    ];
    
    etcItems.forEach((item, i) => {
      const r = etcRow + i;
      ws.mergeCells(`B${r}:H${r}`);
      setLabelStyle(ws.getCell(`A${r}`));
      ws.getCell(`A${r}`).value = item.label;
      setValueStyle(ws.getCell(`B${r}`));
      ws.getCell(`B${r}`).value = item.value;
    });

    // 푸터
    ws.mergeCells(`A${etcRow + 4}:H${etcRow + 4}`);
    ws.getCell(`A${etcRow + 4}`).value = '본 견적서는 날리자쿠에서 발행한 공식 견적서입니다.';
    ws.getCell(`A${etcRow + 4}`).font = { size: 9, color: { argb: 'FF888888' }, name: '맑은 고딕' };
    ws.getCell(`A${etcRow + 4}`).alignment = { horizontal: 'center' };

    // 파일 다운로드
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `날리자쿠_견적서_${inquiry.organizationName}_${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'GENERAL': return '일반 사용자';
      case 'TEACHER': return '강사';
      case 'ADMIN': return '관리자';
      default: return role;
    }
  };

  return (
    <>
      <Header forceLightMode={true} />
      <div className={styles.container}>
        <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          내 정보
        </button>
        {user.role === 'TEACHER' && (
          <button
            className={`${styles.tab} ${activeTab === 'courses' ? styles.active : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            내 강의
          </button>
        )}
        <button
          className={`${styles.tab} ${activeTab === 'inquiries' ? styles.active : ''}`}
          onClick={() => setActiveTab('inquiries')}
        >
          내 문의 내역
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          설정
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'certificates' ? styles.active : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          수료증
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'profile' && (
          <div className={styles.profileSection}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className={styles.profileInfo}>
                  <h2>{user.username}</h2>
                  <span className={styles.roleBadge}>{getRoleText(user.role)}</span>
                </div>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>이메일</label>
                  <span>{user.email}</span>
                </div>

                {/* 소속 - 수정 가능 */}
                <div className={styles.infoItem}>
                  <label>소속</label>
                  {editMode.organization ? (
                    <div className={styles.editField}>
                      <input
                        type="text"
                        value={editValues.organization}
                        onChange={(e) => setEditValues(prev => ({ ...prev, organization: e.target.value }))}
                        placeholder="소속을 입력하세요"
                      />
                      <button className={styles.saveBtn} onClick={() => handleSave('organization')}>
                        <FiSave />
                      </button>
                      <button className={styles.cancelBtn} onClick={() => handleCancel('organization')}>
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <div className={styles.editableField}>
                      <span>{user.organization || '-'}</span>
                      <button className={styles.editBtn} onClick={() => handleEdit('organization')}>
                        <FiEdit2 />
                      </button>
                    </div>
                  )}
                </div>

                {/* 전화번호 - 수정 가능 */}
                <div className={styles.infoItem}>
                  <label>전화번호</label>
                  {editMode.phone ? (
                    <div className={styles.editField}>
                      <input
                        type="tel"
                        value={editValues.phone}
                        onChange={(e) => setEditValues(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="전화번호를 입력하세요"
                      />
                      <button className={styles.saveBtn} onClick={() => handleSave('phone')}>
                        <FiSave />
                      </button>
                      <button className={styles.cancelBtn} onClick={() => handleCancel('phone')}>
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <div className={styles.editableField}>
                      <span>{user.phone || '-'}</span>
                      <button className={styles.editBtn} onClick={() => handleEdit('phone')}>
                        <FiEdit2 />
                      </button>
                    </div>
                  )}
                </div>

                {/* 드론 경험 - 수정 가능 */}
                <div className={styles.infoItem}>
                  <label>드론 경험</label>
                  {editMode.droneExperience ? (
                    <div className={styles.editField}>
                      <select
                        value={editValues.droneExperience ? 'true' : 'false'}
                        onChange={(e) => setEditValues(prev => ({ ...prev, droneExperience: e.target.value === 'true' }))}
                      >
                        <option value="true">있음</option>
                        <option value="false">없음</option>
                      </select>
                      <button className={styles.saveBtn} onClick={() => handleSave('droneExperience')}>
                        <FiSave />
                      </button>
                      <button className={styles.cancelBtn} onClick={() => handleCancel('droneExperience')}>
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <div className={styles.editableField}>
                      <span>{user.droneExperience ? '있음' : '없음'}</span>
                      <button className={styles.editBtn} onClick={() => handleEdit('droneExperience')}>
                        <FiEdit2 />
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <label>가입일</label>
                  <span>{new Date(user.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && user.role === 'TEACHER' && (
          <div className={styles.instructorCoursesSection}>
            {!selectedCourse ? (
              <>
                <div className={styles.courseStatsGrid}>
                  <div className={styles.courseStatCard}>
                    <div className={styles.courseStatIcon}>📚</div>
                    <div className={styles.courseStatInfo}>
                      <p className={styles.courseStatLabel}>담당 그룹</p>
                      <p className={styles.courseStatValue}>{instructorCourses.length}개</p>
                    </div>
                  </div>
                  <div className={styles.courseStatCard}>
                    <div className={styles.courseStatIcon}>🎓</div>
                    <div className={styles.courseStatInfo}>
                      <p className={styles.courseStatLabel}>총 강의</p>
                      <p className={styles.courseStatValue}>
                        {instructorCourses.reduce((acc, g) => acc + (g.courseCount || 0), 0)}개
                      </p>
                    </div>
                  </div>
                  <div className={styles.courseStatCard}>
                    <div className={styles.courseStatIcon}>👥</div>
                    <div className={styles.courseStatInfo}>
                      <p className={styles.courseStatLabel}>총 수강생</p>
                      <p className={styles.courseStatValue}>
                        {instructorCourses.reduce((acc, g) => acc + (g.studentCount || 0), 0)}명
                      </p>
                    </div>
                  </div>
                </div>

                {instructorCourses.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📖</div>
                    <h3>아직 담당 강의가 없습니다</h3>
                    <p>관리자가 강의를 할당하면 여기에 표시됩니다.</p>
                  </div>
                ) : (
                  <div className={styles.instructorCourseGrid}>
                    {instructorCourses.map(group => (
                      <div key={group.id} className={styles.instructorCourseCard} style={{
                        border: 'none',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)'
                      }}>
                        <div className={styles.instructorCourseThumbnail} style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '48px',
                          fontWeight: 'bold',
                          border: 'none',
                          position: 'relative'
                        }}>
                          🏫
                          <div className={`${styles.statusBadge} ${styles[group.status]}`} style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(10px)'
                          }}>
                            {group.status === 'active' ? '✓ 진행중' : '완료'}
                          </div>
                        </div>
                        <div className={styles.instructorCourseInfo}>
                          <h3 style={{ color: '#059669', fontSize: '1.25rem', fontWeight: '700' }}>{group.schoolName}</h3>
                          
                          {/* 강의 기간 */}
                          {group.startDate && group.endDate && (
                            <div className={styles.courseDates} style={{ 
                              backgroundColor: '#f0fdf4',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #bbf7d0'
                            }}>
                              <span style={{ color: '#166534', fontWeight: '500' }}>📅 {new Date(group.startDate).toLocaleDateString('ko-KR')} ~ {new Date(group.endDate).toLocaleDateString('ko-KR')}</span>
                              <span className={styles.courseDuration} style={{ color: '#16a34a' }}>
                                ({Math.ceil((new Date(group.endDate).getTime() - new Date(group.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)}일)
                              </span>
                            </div>
                          )}

                          {/* 강의 요일 */}
                          {group.dayOfWeek && group.dayOfWeek.length > 0 && (
                            <div style={{ 
                              backgroundColor: '#eff6ff',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #bfdbfe',
                              marginTop: '8px'
                            }}>
                              <span style={{ color: '#1e40af', fontWeight: '500' }}>📆 매주 {group.dayOfWeek.join(', ')}</span>
                            </div>
                          )}

                          {/* 강의 시간 */}
                          {group.startTime && group.endTime && (
                            <div style={{ 
                              backgroundColor: '#fef3c7',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #fde68a',
                              marginTop: '8px'
                            }}>
                              <span style={{ color: '#92400e', fontWeight: '500' }}>⏰ {group.startTime} ~ {group.endTime}</span>
                            </div>
                          )}
                          
                          <div className={styles.courseMetrics}>
                            <div className={styles.metric} style={{
                              backgroundColor: '#f0fdf4',
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid #bbf7d0'
                            }}>
                              <span className={styles.metricLabel} style={{ color: '#166534' }}>수강생</span>
                              <span className={styles.metricValue} style={{ color: '#059669', fontSize: '1.5rem' }}>{group.studentCount || 0}명</span>
                            </div>
                            <div className={styles.metric} style={{
                              backgroundColor: '#f0fdf4',
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid #bbf7d0'
                            }}>
                              <span className={styles.metricLabel} style={{ color: '#166534' }}>강의 수</span>
                              <span className={styles.metricValue} style={{ color: '#059669', fontSize: '1.5rem' }}>{group.courseCount || 0}개</span>
                            </div>
                          </div>
                          <button
                            className={styles.manageCourseButton}
                            onClick={() => handleCourseClick(group)}
                            style={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              borderColor: '#059669',
                              color: 'white',
                              fontWeight: '600',
                              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                            }}
                          >
                            상세보기
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.courseManagementView}>
                <div className={styles.courseManagementHeader}>
                  <button className={styles.backButton} onClick={handleBackToCourses}>
                    ← 뒤로가기
                  </button>
                  <h2>🏫 {selectedCourse.schoolName}</h2>
                </div>

                <div className={styles.courseDetailCard}>
                  <div className={styles.courseDetailHeader}>
                    <div className={styles.courseDetailThumbnail} style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '64px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                      🏫
                    </div>
                    <div className={styles.courseDetailInfo}>
                      <h3 style={{ color: '#059669' }}>{selectedCourse.schoolName}</h3>
                      {selectedCourse.startDate && selectedCourse.endDate && (
                        <p className={styles.courseDetailDates} style={{
                          backgroundColor: '#f0fdf4',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #bbf7d0',
                          color: '#166534'
                        }}>
                          📅 {new Date(selectedCourse.startDate).toLocaleDateString('ko-KR')} ~ {new Date(selectedCourse.endDate).toLocaleDateString('ko-KR')}
                          <span style={{ color: '#16a34a' }}> ({Math.ceil((new Date(selectedCourse.endDate).getTime() - new Date(selectedCourse.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)}일)</span>
                        </p>
                      )}
                      {selectedCourse.dayOfWeek && selectedCourse.dayOfWeek.length > 0 && (
                        <p style={{
                          backgroundColor: '#eff6ff',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #bfdbfe',
                          color: '#1e40af',
                          marginTop: '8px',
                          marginLeft: '8px',
                          display: 'inline-block'
                        }}>
                          📆 매주 {selectedCourse.dayOfWeek.join(', ')}
                        </p>
                      )}
                      {selectedCourse.startTime && selectedCourse.endTime && (
                        <p style={{
                          backgroundColor: '#fef3c7',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #fde68a',
                          color: '#92400e',
                          marginTop: '8px',
                          display: 'inline-block',
                          marginLeft: '8px'
                        }}>
                          ⏰ {selectedCourse.startTime} ~ {selectedCourse.endTime}
                        </p>
                      )}
                      {selectedCourse.locationName && (
                        <p style={{
                          backgroundColor: '#fce7f3',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #fbcfe8',
                          color: '#9f1239',
                          marginTop: '8px',
                          display: 'inline-block',
                          marginLeft: '8px'
                        }}>
                          📍 {selectedCourse.locationName}
                        </p>
                      )}
                      {selectedCourse.address && (
                        <p style={{
                          fontSize: '13px',
                          color: '#6b7280',
                          marginTop: '8px',
                          marginLeft: '8px'
                        }}>
                          🗺️ {selectedCourse.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={styles.courseDetailStats}>
                    <div className={styles.statItem} style={{
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px'
                    }}>
                      <span className={styles.statLabel} style={{ color: '#166534' }}>수강생</span>
                      <span className={styles.statValue} style={{ color: '#059669' }}>{selectedCourse.studentCount || 0}명</span>
                    </div>
                    <div className={styles.statItem} style={{
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px'
                    }}>
                      <span className={styles.statLabel} style={{ color: '#166534' }}>강의 수</span>
                      <span className={styles.statValue} style={{ color: '#059669' }}>{selectedCourse.courseCount || 0}개</span>
                    </div>
                    <div className={styles.statItem} style={{
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px'
                    }}>
                      <span className={styles.statLabel} style={{ color: '#166534' }}>상태</span>
                      <span className={styles.statValue} style={{ color: '#059669' }}>{selectedCourse.status === 'active' ? '진행중' : '완료'}</span>
                    </div>
                  </div>
                </div>

                {/* 포함된 강의 목록 */}
                <div className={styles.studentsSection}>
                  <h3>📚 포함된 강의 목록</h3>
                  {selectedCourse.courses && selectedCourse.courses.length > 0 ? (
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {selectedCourse.courses.map((course, idx) => (
                        <div 
                          key={idx}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            padding: '20px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            border: '2px solid #e5e7eb',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {course.thumbnail ? (
                              <img
                                src={course.thumbnail.startsWith('http') 
                                  ? course.thumbnail 
                                  : `https://api.nallijaku.com${course.thumbnail}`
                                }
                                alt={course.title}
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  objectFit: 'cover',
                                  borderRadius: '12px',
                                  flexShrink: 0
                                }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '12px',
                                background: 'white',
                                border: '1px solid #22c55e',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#16a34a',
                                fontSize: '32px',
                                fontWeight: 'bold',
                                flexShrink: 0
                              }}>
                                {course.title.charAt(0)}
                              </div>
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{ 
                                fontSize: '20px', 
                                fontWeight: '700',
                                marginBottom: '8px',
                                color: '#1f2937'
                              }}>
                                {idx + 1}. {course.title}
                              </div>
                              {course.subtitle && (
                                <div style={{ 
                                  fontSize: '14px', 
                                  color: '#6b7280',
                                  marginBottom: '8px'
                                }}>
                                  {course.subtitle}
                                </div>
                              )}
                              {course.category && (
                                <span style={{
                                  display: 'inline-block',
                                  padding: '4px 12px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  backgroundColor: '#e0e7ff',
                                  color: '#4338ca'
                                }}>
                                  {course.category}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* 콘텐츠 목록 */}
                          {course.contents && course.contents.length > 0 && (
                            <div style={{
                              marginTop: '12px',
                              padding: '16px',
                              backgroundColor: '#f9fafb',
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb'
                            }}>
                              <div style={{ 
                                fontSize: '14px', 
                                fontWeight: '600', 
                                color: '#374151',
                                marginBottom: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}>
                                📖 할당된 차시 ({course.contents.length}개)
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {course.contents.map((content, contentIdx) => (
                                  <div
                                    key={contentIdx}
                                    style={{
                                      padding: '12px',
                                      backgroundColor: 'white',
                                      borderRadius: '6px',
                                      border: '1px solid #e5e7eb',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center'
                                    }}
                                  >
                                    <div style={{ flex: 1 }}>
                                      <div style={{ 
                                        fontSize: '14px', 
                                        fontWeight: '600', 
                                        color: '#1f2937',
                                        marginBottom: '4px'
                                      }}>
                                        {content.title}
                                      </div>
                                      {content.description && (
                                        <div style={{ 
                                          fontSize: '12px', 
                                          color: '#6b7280',
                                          marginBottom: '4px'
                                        }}>
                                          {content.description}
                                        </div>
                                      )}
                                      <div style={{ 
                                        fontSize: '12px', 
                                        color: '#6b7280',
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'center'
                                      }}>
                                        {content.type && (
                                          <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            backgroundColor: content.type === '이론' ? '#E1BEE7' : 
                                                           content.type === '실습' ? '#C8E6C9' : 
                                                           content.type === '게임' ? '#FFF9C4' : '#B3E5FC',
                                            color: content.type === '이론' ? '#6A1B9A' : 
                                                   content.type === '실습' ? '#2E7D32' : 
                                                   content.type === '게임' ? '#F57F17' : '#01579B'
                                          }}>
                                            {content.type}
                                          </span>
                                        )}
                                        {content.duration && <span>⏱️ {content.duration}</span>}
                                        {content.price && <span>💰 {content.price.toLocaleString()}원</span>}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyAnnouncement}>
                      <p>📚 포함된 강의가 없습니다.</p>
                    </div>
                  )}
                </div>

                <div className={styles.studentsSection}>
                  <h3>🔗 교육 사이트 링크</h3>
                  {selectedCourse.classLink ? (
                    <div className={styles.announcementCard}>
                      <div className={styles.announcementHeader}>
                        <span className={styles.announcementIcon}>🎓</span>
                        <h4>강의 접속 링크</h4>
                      </div>
                      <div className={styles.announcementContent}>
                        <p>아래 링크를 통해 강의에 접속하실 수 있습니다.</p>
                        <a 
                          href={selectedCourse.classLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.externalLinkButton}
                        >
                          강의 바로가기 →
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.emptyAnnouncement}>
                      <p>🔗 등록된 강의 링크가 없습니다.</p>
                      <p className={styles.emptyAnnouncementSub}>관리자가 링크를 등록하면 표시됩니다.</p>
                    </div>
                  )}
                </div>

                <div className={styles.studentsSection}>
                  <h3>📢 공지사항</h3>
                  {selectedCourse.announcement ? (
                    <div className={styles.announcementCard} style={{ 
                      background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                      border: '2px solid #fed7aa'
                    }}>
                      <div className={styles.announcementHeader}>
                        <span className={styles.announcementIcon}>📋</span>
                        <h4>강의 공지사항</h4>
                      </div>
                      <div className={styles.announcementContent}>
                        <p style={{ 
                          whiteSpace: 'pre-wrap', 
                          lineHeight: '1.8',
                          color: '#9a3412',
                          fontSize: '1rem'
                        }}>
                          {selectedCourse.announcement}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.emptyAnnouncement}>
                      <p>📝 등록된 공지사항이 없습니다.</p>
                      <p className={styles.emptyAnnouncementSub}>관리자가 공지를 등록하면 표시됩니다.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className={styles.inquiriesSection}>
            <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
              📋 내 문의 내역
            </h2>
            
            {inquiries.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📝</div>
                <h3>아직 문의 내역이 없습니다</h3>
                <p>학습자료를 선택하고 교육 도입 문의를 신청해보세요!</p>
                <button
                  className={styles.primaryButton}
                  onClick={() => router.push('/resources')}
                >
                  학습 자료 둘러보기
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      padding: '24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                          {inquiry.organizationName}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')} 신청
                        </p>
                      </div>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: inquiry.status === 'pending' ? '#FEF3C7' :
                                        inquiry.status === 'reviewing' ? '#DBEAFE' : '#D1FAE5',
                        color: inquiry.status === 'pending' ? '#92400E' :
                               inquiry.status === 'reviewing' ? '#1E40AF' : '#065F46'
                      }}>
                        {inquiry.status === 'pending' ? '대기중' :
                         inquiry.status === 'reviewing' ? '검토중' : '완료'}
                      </span>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: '12px',
                      marginBottom: '16px',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>담당자</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{inquiry.contactPerson}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>연락처</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{inquiry.phone}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>예상 인원</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{inquiry.studentCount}명</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>희망 일정</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{inquiry.preferredDate}</span>
                      </div>
                    </div>
                    
                    {inquiry.courses && inquiry.courses.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>
                          선택한 강좌 ({inquiry.courses.length}개)
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {inquiry.courses.map((course) => {
                            // courseDetails에서 해당 코스의 세부 정보 찾기
                            const courseDetail = inquiry.courseDetails?.find(
                              (cd) => cd.courseId === course.id
                            );
                            const selectedModules = courseDetail?.selectedModules || [];
                            const droneOption = courseDetail?.droneOption || 'none';
                            const isDrone = course.category === '드론';

                            return (
                              <div
                                key={course.id}
                                style={{
                                  padding: '12px',
                                  backgroundColor: '#f9fafb',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                  <span style={{
                                    padding: '4px 12px',
                                    backgroundColor: '#E0F2FE',
                                    color: '#0369A1',
                                    borderRadius: '16px',
                                    fontSize: '0.8rem',
                                    fontWeight: '500'
                                  }}>
                                    {course.title}
                                  </span>
                                  {course.category && (
                                    <span style={{
                                      padding: '4px 10px',
                                      backgroundColor: '#E8F5E9',
                                      color: '#2E7D32',
                                      borderRadius: '12px',
                                      fontSize: '0.75rem',
                                      fontWeight: '600'
                                    }}>
                                      {course.category}
                                    </span>
                                  )}
                                </div>

                                {/* 선택된 모듈 표시 */}
                                {selectedModules.length > 0 && course.learningMaterials && (
                                  <div style={{
                                    marginTop: '8px',
                                    padding: '10px',
                                    backgroundColor: 'white',
                                    borderRadius: '6px',
                                    border: '1px solid #e5e7eb'
                                  }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#04AD74', marginBottom: '6px' }}>
                                      📚 선택된 모듈:
                                    </div>
                                    {selectedModules.map((moduleId) => {
                                      const module = course.learningMaterials?.find((m) => m.id === moduleId);
                                      return module ? (
                                        <div key={moduleId} style={{ fontSize: '0.85rem', color: '#374151', padding: '4px 0', paddingLeft: '8px' }}>
                                          • {module.title}
                                          {module.price && (
                                            <span style={{ color: '#04AD74', fontWeight: '600', marginLeft: '4px' }}>
                                              ({module.price.toLocaleString()}원)
                                            </span>
                                          )}
                                        </div>
                                      ) : null;
                                    })}
                                  </div>
                                )}

                                {/* 드론 교구 옵션 표시 */}
                                {isDrone && droneOption !== 'none' && (
                                  <div style={{
                                    marginTop: '8px',
                                    padding: '10px',
                                    backgroundColor: '#FFF8E1',
                                    border: '1px solid #FFE082',
                                    borderRadius: '6px'
                                  }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#7B1FA2', marginBottom: '4px' }}>
                                      🚁 드론 교구:
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#374151', paddingLeft: '8px' }}>
                                      {droneOption === 'purchase' ? '교구 구매' : '교구 대여'} × {courseDetail?.droneQuantity || 1}개
                                      <span style={{ color: '#04AD74', fontWeight: '600', marginLeft: '4px' }}>
                                        ({((droneOption === 'purchase' ? 25000 : 10000) * (courseDetail?.droneQuantity || 1)).toLocaleString()}원)
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {inquiry.message && (
                      <div style={{ 
                        padding: '12px', 
                        backgroundColor: '#f3f4f6', 
                        borderRadius: '8px',
                        marginBottom: '16px'
                      }}>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '4px' }}>요청사항</span>
                        <p style={{ fontSize: '0.9rem', color: '#374151', margin: 0, whiteSpace: 'pre-wrap' }}>
                          {inquiry.message}
                        </p>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: '#04AD74',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                        onClick={() => downloadQuotation(inquiry)}
                      >
                        📄 견적서 다운로드
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: '#3B82F6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                        onClick={() => alert('강의계획서 다운로드 기능 준비 중')}
                      >
                        📋 강의계획서 다운로드
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={styles.settingsSection}>
            <div className={styles.settingsCard}>
              <h3>🔒 비밀번호 변경</h3>
              <div className={styles.formGroup}>
                <label>현재 비밀번호</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="현재 비밀번호를 입력하세요"
                />
              </div>
              <div className={styles.formGroup}>
                <label>새 비밀번호</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="새 비밀번호를 입력하세요 (6자 이상)"
                />
              </div>
              <div className={styles.formGroup}>
                <label>새 비밀번호 확인</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
              </div>
              <button className={styles.primaryButton} onClick={handlePasswordChange}>
                비밀번호 변경
              </button>
            </div>

            <div className={styles.settingsCard}>
              <h3>⚠️ 회원 탈퇴</h3>
              <p className={styles.warningText}>
                회원 탈퇴 시 모든 학습 데이터와 수료증이 삭제되며 복구할 수 없습니다.
              </p>
              <button className={styles.dangerButton} onClick={handleDeleteAccount}>
                회원 탈퇴
              </button>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className={styles.certificatesSection}>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏆</div>
              <h3>아직 수료증이 없습니다</h3>
              <p>강의를 완료하면 수료증을 받을 수 있습니다!</p>
              <button
                className={styles.primaryButton}
                onClick={() => router.push('/resources')}
              >
                학습 자료 둘러보기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
