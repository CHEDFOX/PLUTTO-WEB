/** Root layout: the document, its four faces, Google Tag Manager and the touch-screen viewport scaling. */
import { Bodoni_Moda, Source_Serif_4, IBM_Plex_Mono, Caveat } from 'next/font/google';
import './globals.css';
import { GTM_HEAD, GTM_NOSCRIPT_SRC } from './lib/analytics/gtm';

// Faces: Bodoni Moda --font-display, Source Serif 4 --font-body, IBM Plex Mono --font-mono, Caveat --font-hand (app/components/ink).
const bodoni = Bodoni_Moda({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});
const sourceSerif = Source_Serif_4({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-hand',
  display: 'swap',
});

// No canonical here: a root canonical is inherited by every page without its own and tells Google
// they are all the home page. Each page sets its own through pageMeta.
export const metadata = {
  metadataBase: new URL('https://plutto.space'),
  title: {
    default: 'Plutto — Astrology App You Can Talk To | Vedic, Western, Chinese',
    template: '%s — Plutto',
  },
  description:
    'Plutto is an astrology app you can talk to: Vedic, Western, Chinese, KP and numerology readings from your real birth chart, spoken in your own language. Free to start.',
  applicationName: 'Plutto',
  keywords: [
    'astrology app', 'AI astrology', 'Vedic astrology', 'Jyotish', 'kundli', 'birth chart', 'KP astrology',
    'Western astrology', 'Chinese astrology', 'BaZi', 'Four Pillars', 'numerology', 'tarot',
    'horoscope', 'dasha', 'compatibility', 'Guna Milan', 'synastry', 'astrocartography',
  ],
  authors: [{ name: 'Xooteq Lab', url: 'https://xooteq.com' }],
  creator: 'Xooteq Lab',
  publisher: 'XOOTEQ LAB PRIVATE LIMITED',
  category: 'lifestyle',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    title: 'Plutto — the astrology app you can talk to',
    description:
      'Vedic, Western, Chinese, KP and numerology readings from your real birth chart — computed with Swiss Ephemeris, spoken in your language.',
    url: 'https://plutto.space',
    siteName: 'Plutto',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plutto — the astrology app you can talk to',
    description:
      'Vedic, Western, Chinese, KP and numerology readings from your real birth chart, spoken in your language.',
  },
  // app/icon.png and app/apple-icon.png (Next's file-based icons) are Plutto-Frontend/assets/icon.png resized.
  appleWebApp: { title: 'Plutto', statusBarStyle: 'black' },
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

// Touch screens get a scaled copy of a layout instead of their own sizes: a tablet (short side ≥ 600)
// a TABLET_W-wide layout viewport, an upright phone PHONE_W, a sideways phone its own width. The
// viewport tag does the scaling, so taps land where they look. Next renders the tag as device-width
// and may set it again while hydrating, so SCALE_SCRIPT re-asserts it whenever it changes.
// html.scaled-tab caps the screen-height sections at desktop proportions (globals.css).
const TABLET_W = 1280;
const PHONE_W = 450;
const SCALE_SCRIPT = `(function(){try{
var el=document.documentElement,mm=function(q){try{return matchMedia(q).matches}catch(e){return false}};
var touch=mm('(pointer: coarse)')||(navigator.maxTouchPoints>1&&mm('(hover: none)'));
if(!touch)return;
var kind=Math.min(screen.width,screen.height)<600?'phone':'tab';
el.classList.add(kind==='tab'?'scaled-tab':'scaled-phone');
var want=function(){
  if(kind==='tab')return 'width=${TABLET_W}';
  var up=(screen.orientation&&screen.orientation.type)?screen.orientation.type.indexOf('portrait')===0:(innerHeight>=innerWidth);
  return up?'width=${PHONE_W}':'width=device-width, initial-scale=1';
};
var apply=function(){var c=want(),ms=document.querySelectorAll('meta[name="viewport"]');if(!ms.length){var m=document.createElement('meta');m.name='viewport';m.setAttribute('content',c);document.head.appendChild(m);return;}for(var i=0;i<ms.length;i++){if(ms[i].getAttribute('content')!==c)ms[i].setAttribute('content',c);}};
apply();
new MutationObserver(apply).observe(document.head,{subtree:true,childList:true,attributes:true,attributeFilter:['content']});
var turn=function(){setTimeout(apply,50)};
if(screen.orientation&&screen.orientation.addEventListener)screen.orientation.addEventListener('change',turn);else addEventListener('orientationchange',turn);
}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${sourceSerif.variable} ${plexMono.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Google Tag Manager, first in <head> as Google asks (app/lib/analytics/gtm.js). */}
        <script dangerouslySetInnerHTML={{ __html: GTM_HEAD }} />
        <script dangerouslySetInnerHTML={{ __html: SCALE_SCRIPT }} />
      </head>
      {/* The marketing chrome (nav, footer, JSON-LD, pixel) is in (site)/layout.js. */}
      <body className="min-h-screen bg-black text-foreground font-body antialiased">
        <noscript>
          <iframe src={GTM_NOSCRIPT_SRC} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
        </noscript>
        <main className="flex min-h-screen flex-col">{children}</main>
      </body>
    </html>
  );
}
