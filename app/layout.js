import { Julius_Sans_One, Josefin_Sans, Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Nav from './components/Nav';
import Footer from './components/Footer';
import SiteChrome from './components/SiteChrome';

// DISPLAY — thin geometric capitals, set wide. It only ever appears in caps and
// at large sizes: the headline of a section. It has one weight and no italic on
// purpose; in this register emphasis comes from space, not from slant or heft.
const julius = Julius_Sans_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
});

// THE MARK gets its own cut, at hairline weight. A logotype is set once, at one
// size, always in isolation — so it can carry a more delicate stroke than a
// headline, which has to survive being long, wrapped, and read. Julius at 100
// does not exist; this is the thinnest geometric cut with a true circular O.
const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['100', '200'],
  variable: '--font-mark',
  display: 'swap',
});

// Syne stays as the READING face for the app screens (chat replies, feature
// text, settings). Julius is beautiful at 54px and tiring at 17px, so the two
// jobs get two faces.
const syne = Syne({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-reading',
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
      className={`${julius.variable} ${josefin.variable} ${syne.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-black text-foreground font-body antialiased">
        <Nav />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <SiteChrome />
      </body>
    </html>
  );
}
