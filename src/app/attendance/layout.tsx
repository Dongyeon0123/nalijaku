import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: '날리자쿠 강사 출근부',
  description: '날리자쿠 강사님들을 위한 출퇴근 관리 앱',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '출근부',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#916AFF',
};

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="icon" href="/nallijaku.png" />
      <link rel="apple-touch-icon" href="/nallijaku.png" />
      {children}
    </>
  );
}
