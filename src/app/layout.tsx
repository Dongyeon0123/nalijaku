import React from 'react';
import CollaborationSidebar from '@/components/CollaborationSidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <meta name="naver-site-verification" content="5d07fbec5c7214a2aa549c9e290eea204ceab2e6" />
        <meta name="google-site-verification" content="N6nZQYHXxDVkRfgMM85UNZHbMYCnCKz9sqKtDMl6sCc" />
      </head>
      <body>
        {children}
        <CollaborationSidebar />
      </body>
    </html>
  );
}