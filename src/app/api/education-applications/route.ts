import { NextRequest, NextResponse } from 'next/server';

// 임시 데이터 저장소 (실제로는 데이터베이스 사용)
let educationApplications: any[] = [
  {
    id: '1',
    schoolName: '서울초등학교',
    contactPerson: '김선생',
    email: 'kim@seoul.edu',
    phone: '010-1234-5678',
    studentCount: 30,
    grade: '초등학교',
    preferredDate: '2024-03-15',
    budget: '300-500만원',
    additionalInfo: '드론 교육에 관심이 많습니다. 학생들이 과학에 대한 흥미를 가질 수 있도록 도와주세요.',
    status: 'pending',
    submittedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    schoolName: '부산중학교',
    contactPerson: '이교사',
    email: 'lee@busan.edu',
    phone: '010-2345-6789',
    studentCount: 50,
    grade: '중학교',
    preferredDate: '2024-04-01',
    budget: '500-1000만원',
    additionalInfo: '과학 동아리 학생들을 위한 교육을 원합니다. 실습 위주의 교육을 희망합니다.',
    status: 'completed',
    submittedAt: '2024-01-10T14:20:00Z'
  },
  {
    id: '3',
    schoolName: '대구고등학교',
    contactPerson: '박교장',
    email: 'park@daegu.edu',
    phone: '010-3456-7890',
    studentCount: 25,
    grade: '고등학교',
    preferredDate: '2024-05-10',
    budget: '1000만원 이상',
    additionalInfo: '진로 탐색 프로그램의 일환으로 드론 교육을 도입하고 싶습니다.',
    status: 'pending',
    submittedAt: '2024-01-20T09:15:00Z'
  },
  {
    id: '4',
    schoolName: '인천초등학교',
    contactPerson: '최선생',
    email: 'choi@incheon.edu',
    phone: '010-4567-8901',
    studentCount: 40,
    grade: '초등학교',
    preferredDate: '2024-03-25',
    budget: '100-300만원',
    additionalInfo: '아이들이 미래 기술에 대해 배울 수 있는 기회를 주고 싶습니다.',
    status: 'in_progress',
    submittedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: '5',
    schoolName: '광주중학교',
    contactPerson: '정교사',
    email: 'jung@gwangju.edu',
    phone: '010-5678-9012',
    studentCount: 35,
    grade: '중학교',
    preferredDate: '2024-04-15',
    budget: '300-500만원',
    additionalInfo: 'STEAM 교육의 일환으로 드론 교육을 도입하고 싶습니다.',
    status: 'pending',
    submittedAt: '2024-01-12T11:30:00Z'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 데이터 검증
    const requiredFields = ['schoolName', 'contactPerson', 'email', 'phone', 'studentCount'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} 필드는 필수입니다.` },
          { status: 400 }
        );
      }
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 전화번호 형식 검증
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        { error: '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)' },
        { status: 400 }
      );
    }

    // 신청 데이터 생성
    const application = {
      id: Date.now().toString(),
      ...body,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    // 데이터 저장 (실제로는 데이터베이스에 저장)
    educationApplications.push(application);

    // 성공 응답
    return NextResponse.json(
      { 
        message: '교육 도입 신청이 성공적으로 접수되었습니다.',
        applicationId: application.id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Education application error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 관리자용: 모든 신청 조회
    return NextResponse.json({
      applications: educationApplications,
      total: educationApplications.length
    });
  } catch (error) {
    console.error('Get education applications error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
