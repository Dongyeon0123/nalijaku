'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem('userInfo');
      
      if (!userStr) {
        alert('로그인이 필요합니다.');
        router.push('/');
        return;
      }

      try {
        const user = JSON.parse(userStr);
        const userRole = user.role?.toUpperCase();
        
        if (userRole !== 'ADMIN') {
          alert('관리자 권한이 필요합니다.');
          router.push('/');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('인증 정보 파싱 실패:', error);
        alert('인증 정보가 올바르지 않습니다.');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isAuthorized, isLoading };
}
