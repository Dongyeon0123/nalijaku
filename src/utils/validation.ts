// 이메일 형식 검증
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 전화번호 형식 검증 (10-11자리 숫자)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

// 비밀번호 길이 검증 (최소 6자)
export const validatePasswordLength = (password: string): boolean => {
  return password.length >= 6;
};

// 비밀번호 일치 검증
export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

// 필수 필드 검증
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// 회원가입 1단계 유효성 검사
export const validateSignupStep1 = (username: string, password: string, confirmPassword: string, email: string): string[] => {
  const errors: string[] = [];

  if (!validateRequired(username)) errors.push('아이디를 입력해주세요.');
  if (!validateRequired(password)) errors.push('비밀번호를 입력해주세요.');
  if (!validateRequired(confirmPassword)) errors.push('비밀번호 확인을 입력해주세요.');
  if (!validateRequired(email)) errors.push('이메일을 입력해주세요.');

  if (password && !validatePasswordLength(password)) {
    errors.push('비밀번호는 6자 이상이어야 합니다.');
  }

  if (password && confirmPassword && !validatePasswordMatch(password, confirmPassword)) {
    errors.push('비밀번호가 일치하지 않습니다.');
  }

  if (email && !validateEmail(email)) {
    errors.push('올바른 이메일 형식을 입력해주세요.');
  }

  return errors;
};

// 회원가입 2단계 유효성 검사
export const validateSignupStep2 = (affiliation: string, role: string, hasDroneExp: string | null): string[] => {
  const errors: string[] = [];

  if (!validateRequired(affiliation)) errors.push('소속을 입력해주세요.');
  if (!validateRequired(role)) errors.push('직무/역할을 입력해주세요.');
  if (hasDroneExp === null) errors.push('드론 강의 경험을 선택해주세요.');

  return errors;
};

// 회원가입 3단계 유효성 검사
export const validateSignupStep3 = (phone: string, ageCheck: boolean, termsCheck: boolean): string[] => {
  const errors: string[] = [];

  if (!validateRequired(phone)) errors.push('연락처를 입력해주세요.');
  if (phone && !validatePhone(phone)) errors.push('올바른 전화번호 형식을 입력해주세요.');
  if (!ageCheck) errors.push('만 14세 이상임을 확인해주세요.');
  if (!termsCheck) errors.push('이용약관 및 개인정보처리방침에 동의해주세요.');

  return errors;
};
