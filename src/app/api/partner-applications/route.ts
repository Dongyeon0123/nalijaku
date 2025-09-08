import { NextRequest, NextResponse } from 'next/server';

// 임시 데이터 저장소 (실제로는 데이터베이스 사용)
const partnerApplications: Array<{
  id: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  certificates: string[];
  status: string;
  submittedAt: string;
}> = [
  {
    id: '1',
    contactPerson: '박강사',
    email: 'park@email.com',
    phone: '010-3456-7890',
    location: '서울시 강남구',
    experience: '드론 교육 2년 경력, 항공우주공학 전공',
    certificates: ['실기평가조종 자격증', '1종 조종 자격증'],
    status: 'pending',
    submittedAt: '2024-01-12T13:20:00Z'
  },
  {
    id: '2',
    contactPerson: '최교관',
    email: 'choi@email.com',
    phone: '010-4567-8901',
    location: '경기도 수원시',
    experience: '항공교육 5년 경력, 전직 공군 조종사',
    certificates: ['교관 자격증', '2종 조종 자격증'],
    status: 'completed',
    submittedAt: '2024-01-08T10:15:00Z'
  },
  {
    id: '3',
    contactPerson: '김강사',
    email: 'kim@email.com',
    phone: '010-5678-9012',
    location: '부산시 해운대구',
    experience: '드론 촬영 3년 경력, 영상제작 전문가',
    certificates: ['3종 조종 자격증', '실기평가조종 자격증'],
    status: 'pending',
    submittedAt: '2024-01-19T15:30:00Z'
  },
  {
    id: '4',
    contactPerson: '이교수',
    email: 'lee@email.com',
    phone: '010-6789-0123',
    location: '대구시 수성구',
    experience: '대학교 항공우주공학과 교수, 드론 연구 10년',
    certificates: ['교관 자격증', '1종 조종 자격증', '2종 조종 자격증'],
    status: 'in_progress',
    submittedAt: '2024-01-14T09:45:00Z'
  },
  {
    id: '5',
    contactPerson: '정강사',
    email: 'jung@email.com',
    phone: '010-7890-1234',
    location: '인천시 연수구',
    experience: '드론 교육 1년 경력, 컴퓨터공학 전공',
    certificates: ['실기평가조종 자격증'],
    status: 'pending',
    submittedAt: '2024-01-16T14:10:00Z'
  },
  {
    id: '6',
    contactPerson: '한강사',
    email: 'han@email.com',
    phone: '010-8901-2345',
    location: '광주시 서구',
    experience: '드론 교육 4년 경력, 기계공학 전공',
    certificates: ['1종 조종 자격증', '3종 조종 자격증'],
    status: 'pending',
    submittedAt: '2024-01-21T11:25:00Z'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 데이터 검증
    const requiredFields = ['contactPerson', 'email', 'phone', 'location', 'experience'];
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

    // 개인정보 동의 확인
    if (!body.privacyAgreement) {
      return NextResponse.json(
        { error: '개인정보 수집 및 이용에 동의해주세요.' },
        { status: 400 }
      );
    }

    // 자격증 정보 수집
    const certificates = [];
    if (body.practicalCert) certificates.push('실기평가조종 자격증');
    if (body.class1Cert) certificates.push('1종 조종 자격증');
    if (body.class2Cert) certificates.push('2종 조종 자격증');
    if (body.class3Cert) certificates.push('3종 조종 자격증');
    if (body.instructorCert) certificates.push('교관 자격증');
    if (body.other && body.otherText) certificates.push(body.otherText);

    // 신청 데이터 생성
    const application = {
      id: Date.now().toString(),
      contactPerson: body.contactPerson,
      email: body.email,
      phone: body.phone,
      location: body.location,
      experience: body.experience,
      certificates,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    // 데이터 저장 (실제로는 데이터베이스에 저장)
    partnerApplications.push(application);

    // 성공 응답
    return NextResponse.json(
      { 
        message: '파트너 모집 신청이 성공적으로 접수되었습니다.',
        applicationId: application.id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Partner application error:', error);
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
      applications: partnerApplications,
      total: partnerApplications.length
    });
  } catch (error) {
    console.error('Get partner applications error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
