import { Bodoni_Moda, Source_Serif_4, IBM_Plex_Mono, Baloo_2, Caveat } from 'next/font/google';
import './globals.css';

// THE MAGAZINE EDITION — three faces, one printed page.
//   Bodoni Moda   the masthead, headlines, numerals, pull quotes (display, mark, editorial)
//   Source Serif  everything read: body, captions, buttons (body, reading, ui)
//   IBM Plex Mono kickers, labels, folios (mono)
// The CSS variable names are kept, so every class that asked for a register
// (font-display, font-ui, font-mono …) gets the magazine's face for it.
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

// THE APP'S OWN FACE — Baloo 2, used only inside the phone frames on the landing
// page, where it is the app's type, not the site's.
const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-app',
  display: 'swap',
});

// THE HAND IN THE MARGINS — Caveat, for the handwritten asides (components/site/ink).
const caveat = Caveat({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-hand',
  display: 'swap',
});

// SEARCH: the title leads with what people type ("astrology app"), the brand
// stays first, and the description is the entity sentence answer engines lift
// (app/lib/seo.js). No canonical here on purpose — a root canonical is inherited
// by every page that forgets its own and tells Google they are all the home
// page; each page sets its own (pageMeta).
export const metadata = {
  metadataBase: new URL('https://plutto.space'),
  title: {
    default: 'Plutto — Astrology App You Can Talk To | Vedic, Western, Chinese',
    template: '%s — Plutto',
  },
  description:
    'Plutto is an astrology app you can talk to: Vedic, Western, Chinese, KP and numerology readings from your real birth chart, spoken in 109 languages. Free to start.',
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
  // The favicon and the home-screen icon are the app's own: app/icon.png and
  // app/apple-icon.png are Plutto-Frontend/assets/icon.png resized (Next's
  // file-based icons, which it links on every page), so the tab, a search
  // result and a home screen all wear the face the phone app has.
  appleWebApp: { title: 'Plutto', statusBarStyle: 'black' },
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

// ONE PICTURE, SCALED BY RATIO. The site is designed at the PC's composition;
// every other screen gets a scaled copy of a layout rather than its own sizes:
//   · a tablet (touch, short side ≥ 600) is given a layout viewport TABLET_W
//     wide — the PC composition — drawn to fit its width;
//   · a phone held upright is given PHONE_W — the one-column layout, the same
//     proportions on every phone, never oversized; turned sideways it is its
//     own width.
// The browser does the scaling (the viewport tag), so taps land where they
// look on every engine. Next renders the tag as device-width and may set it
// again while hydrating, so it is re-asserted whenever it changes.
// `html.scaled-tab` caps the screen-height sections at the PC's proportions
// (globals.css), since a tablet held upright is far taller than a monitor.
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
      className={`${bodoni.variable} ${sourceSerif.variable} ${plexMono.variable} ${baloo.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCALE_SCRIPT }} />
      </head>
      {/* Root carries the document and the faces, and nothing else. The site's
          chrome moved into (site)/layout.js so that /app inherits none of it —
          see the note there. */}
      <body className="min-h-screen bg-black text-foreground font-body antialiased">
        <main className="flex min-h-screen flex-col">{children}</main>
      </body>
    </html>
  );
}
