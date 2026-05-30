import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata = {
  title: '전현식 포트폴리오 | Hyunsik Jeon Portfolio',
  description:
    '전현식 (Hyunsik Jeon) — 프론트엔드 & AI 개발자 포트폴리오. Frontend & AI Developer Portfolio.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
