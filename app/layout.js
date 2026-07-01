import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://plutto.space'),
  title: {
    default: 'Plutto — Every reading. Every system.',
    template: '%s — Plutto',
  },
  description:
    'Plutto is a voice-first astrology Oracle. Vedic, Western, Chinese, KP, Numerology — one home for every reading.',
  applicationName: 'Plutto',
  openGraph: {
    title: 'Plutto — Every reading. Every system.',
    description:
      'Voice-first astrology Oracle. Vedic, Western, Chinese, KP, Numerology — one home for every reading.',
    url: 'https://plutto.space',
    siteName: 'Plutto',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plutto — Every reading. Every system.',
    description:
      'Voice-first astrology Oracle. Vedic, Western, Chinese, KP, Numerology.',
  },
  icons: {
    icon: '/icon.svg',
  },
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-black text-foreground font-body antialiased">
        {children}
      </body>
    </html>
  );
}
