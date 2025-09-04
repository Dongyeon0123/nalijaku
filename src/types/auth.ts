// API 응답 타입 정의
export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    userId?: string;
    token?: string;
    role?: string;
    [key: string]: unknown;
  };
}

// 회원가입 데이터 타입
export interface SignupData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  organization: string;
  role: string;
  phone: string;
  droneExperience: boolean;
  termsAgreed: boolean;
}

// 로그인 데이터 타입
export interface LoginData {
  username: string;
  password: string;
  rememberMe: boolean;
}

// 교육 문의 데이터 타입
export interface EducationInquiryData {
  organizationName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  studentCount: string;
  grade: string;
  preferredDate: string;
  message: string;
  purchaseInquiry: boolean;
  schoolVisit: boolean;
  consultingInquiry: boolean;
  customProgram: boolean;
  contactAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
}

// 파트너 지원 데이터 타입
export interface PartnerApplicationData {
  applicantName: string;
  phoneNumber: string;
  email: string;
  location: string;
  experience: string;
  practicalCert: boolean;
  class1Cert: boolean;
  class2Cert: boolean;
  class3Cert: boolean;
  class4Cert: boolean;
  instructorCert: boolean;
  repairCert: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
}
