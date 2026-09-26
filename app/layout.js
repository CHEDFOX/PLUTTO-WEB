import { Julius_Sans_One, Josefin_Sans, Syne, DM_Sans, JetBrains_Mono, Instrument_Serif, Inter, Baloo_2, Caveat } from 'next/font/google';
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

// THE SITE'S VOICE. One sans, set bold and tight, the way product companies set
// their pages — the serif and the spaced capitals read as a boutique, and this
// has to read as a company.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ui',
  display: 'swap',
});

// THE APP'S OWN FACE — Baloo 2, which the phone registers as "Plutto". Used only
// inside the phone frames on the landing page, so the screens there are set in
// the type the app actually uses.
const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-app',
  display: 'swap',
});

// THE HAND IN THE MARGINS — Caveat, for the handwritten asides and the word
// under a drawn line (components/site/ink). Latin only; it is never body text.
const caveat = Caveat({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-hand',
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
    'Plutto is astrology you can talk back to. Vedic, Western, Chinese, KP, Numerology — one home for every reading.',
  applicationName: 'Plutto',
  openGraph: {
    title: 'Plutto — Every reading. Every system.',
    description:
      'Astrology you can talk back to. Vedic, Western, Chinese, KP, Numerology — one home for every reading.',
    url: 'https://plutto.space',
    siteName: 'Plutto',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plutto — Every reading. Every system.',
    description:
      'Astrology you can talk back to. Vedic, Western, Chinese, KP, Numerology.',
  },
  // The home-screen icon is the app's own, the same file the phone app ships
  // (Plutto-Frontend/assets/icon.png, resized by its build-web script into
  // public/m/icons), so the site added to a home screen and the app sit side by
  // side with one face.
  icons: {
    icon: '/icon.svg',
    apple: [{ url: '/m/icons/icon-180.png', sizes: '180x180', type: 'image/png' }],
  },
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
      className={`${julius.variable} ${josefin.variable} ${syne.variable} ${dmSans.variable} ${jetbrains.variable} ${instrument.variable} ${inter.variable} ${baloo.variable} ${caveat.variable}`}
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
