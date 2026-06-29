import { Playfair_Display } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
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
    <html lang="en" className={playfair.variable}>
      <body className="min-h-screen bg-void text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
