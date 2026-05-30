import './globals.css';
import { Geist, JetBrains_Mono } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
  weight: ['400', '500'],
});

export const metadata = {
  title: 'Hyunsik Jeon · Translator between capital and code',
  description:
    'AI architect at the capital–code interface. Six years routing Korea–Middle East capital and sovereign-allocator logic; now shipping agentic systems in production.',
  openGraph: {
    title: 'Hyunsik Jeon — Translator between capital and code',
    description:
      'AI architect bridging cross-border deal work and shipped agentic systems. AIIM in production: 5,300+ creators, 14 languages, 24/7.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} ${jetbrainsMono.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
