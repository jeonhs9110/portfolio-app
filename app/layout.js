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
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* SVG noise filter referenced by the .aura-shiny gradient text
            utility (borrowed from the Aura landing aesthetic). Defined once
            here so any element on any page can `filter: url(#aura-noise)`. */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <defs>
            <filter id="aura-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
              <feComposite in2="SourceGraphic" operator="in" result="noise" />
              <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
            </filter>
          </defs>
        </svg>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
