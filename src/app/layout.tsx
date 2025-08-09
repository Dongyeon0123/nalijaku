import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}