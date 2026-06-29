import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://plutto.space'),
  title: {
    default: 'Plutto — One Place To Ask Better Questions.',
    template: '%s — Plutto',
  },
  description:
    'Three traditions, one place to ask better questions. Vedic, Western and BaZi — explored with curiosity, not certainty.',
  applicationName: 'Plutto',
  openGraph: {
    title: 'Plutto — One Place To Ask Better Questions.',
    description:
      'Three traditions, one place to ask better questions. Vedic, Western and BaZi.',
    url: 'https://plutto.space',
    siteName: 'Plutto',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plutto — One Place To Ask Better Questions.',
    description:
      'Three traditions, one place to ask better questions.',
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
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-void text-white font-body antialiased">
        {children}
      </body>
    </html>
  );
}
