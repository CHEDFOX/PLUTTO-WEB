import { Julius_Sans_One, Josefin_Sans, Syne, DM_Sans, JetBrains_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';

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

// EDITORIAL — the one face on the site with real stroke contrast and a true
// italic. Everything else here is geometric (Julius, Josefin, Syne) or
// mechanical (JetBrains); a page made only of those reads as a product, and the
// thing Plutto is selling is a voice that has been speaking for three thousand
// years. This is the face the readings are quoted in, and it is used for
// quotation only — never for chrome, never below about 18px.
const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
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
      className={`${julius.variable} ${josefin.variable} ${syne.variable} ${dmSans.variable} ${jetbrains.variable} ${instrument.variable}`}
    >
      {/* Root carries the document and the faces, and nothing else. The site's
          chrome moved into (site)/layout.js so that /app inherits none of it —
          see the note there. */}
      <body className="min-h-screen bg-black text-foreground font-body antialiased">
        <main className="flex min-h-screen flex-col">{children}</main>
      </body>
    </html>
  );
}
