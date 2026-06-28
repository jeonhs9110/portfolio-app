import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

const SITE_URL = 'https://portfolio-app-5ca9.vercel.app';
const TITLE = 'Hyunsik Jeon · 전현식 — Global AI Strategist';
const DESCRIPTION =
  'Production AI builder × cross-border dealmaker. Six years bridging Korea and the Middle East at the National Assembly and Korea\'s top-tier law firms, now shipping production AI systems end-to-end.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'Hyunsik Jeon', '전현식', 'Global AI Strategist',
    'cross-border BD', 'production AI', 'AI strategy',
    'Korea Middle East', 'Seoul AI', 'Lee & Ko', 'HMP Law',
  ],
  authors: [{ name: 'Hyunsik Jeon', url: SITE_URL }],
  openGraph: {
    type: 'profile',
    locale: 'ko_KR',
    alternateLocale: ['en_US'],
    url: SITE_URL,
    siteName: 'Hyunsik Jeon · 전현식',
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: '/jeon_pose_contact.png',
        width: 1200,
        height: 630,
        alt: 'Hyunsik Jeon — Global AI Strategist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/jeon_pose_contact.png'],
  },
  robots: { index: true, follow: true },
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
