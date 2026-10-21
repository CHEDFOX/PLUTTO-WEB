/** @type {import('next').NextConfig} */

const API = 'https://api.plutto.space';
const SUPABASE = 'https://auth.plutto.space';
// The realtime voice leg posts its SDP offer straight to OpenAI with a short-lived token, so that origin has to be
// reachable from the page.
const OPENAI = 'https://api.openai.com';
// Paddle web checkout: Paddle.js from Paddle's CDN, the checkout in an iframe from Paddle's origin. The sandbox hosts
// are named beside the live ones because the sandbox is where the checkout is tested.
const PADDLE_CDN = 'https://cdn.paddle.com https://sandbox-cdn.paddle.com';
const PADDLE = 'https://*.paddle.com https://*.paddlejs.com';
// Razorpay web checkout: checkout.js from checkout.razorpay.com, the payment form an iframe from api.razorpay.com,
// which calls *.razorpay.com (its API, bank-logo CDN and error reporting). Without any one of these the window
// opens empty or the pay button does nothing.
const RAZORPAY_JS = 'https://checkout.razorpay.com';
const RAZORPAY = 'https://*.razorpay.com';
// Wikimedia Commons: the magazine's photographs load from Commons, where their licences live and each credit links.
// Special:FilePath on commons redirects to the file on upload, so both hosts are named.
const COMMONS = 'https://commons.wikimedia.org https://upload.wikimedia.org';
// Meta pixel (app/api/meta/pixel): fbevents.js from connect.facebook.net, reports to www.facebook.com (an image
// request, or fetch/beacon). The server copy of each event goes from Vercel and needs nothing here.
const META_JS = 'https://connect.facebook.net';
const META = 'https://www.facebook.com';
// Google Tag Manager (app/lib/analytics/gtm.js) and the hosts Google documents for its tags: GTM, Google Analytics 4
// and the GTM Preview mode, for debugging the container on the live site. A tag for any other vendor is blocked until
// its hosts are listed here.
const GTM = 'https://www.googletagmanager.com';
const GOOGLE_TAGS = 'https://*.googletagmanager.com';
const GA = 'https://*.google-analytics.com https://*.analytics.google.com';
const GTM_PREVIEW = 'https://tagmanager.google.com';
const GSTATIC = 'https://ssl.gstatic.com https://www.gstatic.com';

/**
 * Content-Security-Policy: the browser loads and contacts only the hosts listed, even if a dependency were compromised.
 * style-src needs 'unsafe-inline' for Next's runtime style injection; script-src needs it for Next's bootstrap, plus
 * 'unsafe-eval' in dev only (React Refresh). connect-src bounds data exfiltration: it names every host the page may call.
 */
const csp = (dev) =>
  [
    "default-src 'self'",
    // 'wasm-unsafe-eval' is CanvasKit (Skia): the orb, the globe and the maps in the app at /app are drawn with it.
    // It permits WebAssembly only, not eval.
    `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' ${PADDLE_CDN} ${RAZORPAY_JS} ${META_JS} ${GOOGLE_TAGS} ${GTM_PREVIEW}${dev ? " 'unsafe-eval'" : ''}`,
    "worker-src 'self' blob:",
    `style-src 'self' 'unsafe-inline' ${GTM} ${GTM_PREVIEW} https://fonts.googleapis.com`,
    `img-src 'self' data: blob: ${API} ${PADDLE} ${RAZORPAY} ${COMMONS} ${META} ${GOOGLE_TAGS} ${GA} ${GSTATIC}`,
    `media-src 'self' data: blob: ${API}`,
    // The app screens use the faces the phone downloads, served from the backend; without the API host the browser
    // refuses them and silently falls back to the system font.
    `font-src 'self' data: ${API} https://fonts.gstatic.com`,
    `connect-src 'self' blob: data: ${API} ${SUPABASE} ${OPENAI} ${PADDLE} ${RAZORPAY} ${META} ${META_JS} ${GOOGLE_TAGS} ${GA} wss://*.openai.com${dev ? ' ws://localhost:*' : ''}`,
    // The checkout is an iframe from Paddle's origin. Without this it falls back to default-src 'self' and the overlay
    // opens empty, with no error.
    `frame-src 'self' ${PADDLE} ${RAZORPAY} ${GTM}`,
    "frame-ancestors 'none'",   // clickjacking
    "object-src 'none'",
    "base-uri 'none'",          // stops a stray <base> retargeting every URL
    "form-action 'self'",
    ...(dev ? [] : ['upgrade-insecure-requests']),
  ].join('; ');

const securityHeaders = (dev) => [
  { key: 'Content-Security-Policy', value: csp(dev) },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // The page uses the microphone (voice mode) and, on the panchang, the location (asked only on a tap, to find
  // sunrise; never sent). Everything else is off, so a compromised script cannot reach it.
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), geolocation=(self), usb=(), microphone=(self), ' +
      // Paddle Billing's checkout iframe is buy.paddle.com (checkout.* is Paddle Classic); Apple Pay and Google Pay
      // inside it need this permission.
      'payment=(self "https://buy.paddle.com" "https://sandbox-buy.paddle.com" ' +
      '"https://checkout.paddle.com" "https://sandbox-checkout.paddle.com" ' +
      // Razorpay's form uses the Payment Request API for Google Pay and saved cards.
      '"https://api.razorpay.com" "https://checkout.razorpay.com")',
  },
  // allow-popups: Paddle's PayPal option opens a window that has to report back to the checkout; plain same-origin
  // severs that link.
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  ...(dev
    ? []
    : [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ]),
];

const nextConfig = {
  reactStrictMode: true,
  // No X-Powered-By header: the framework version is reconnaissance for an attacker.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.plutto.space', pathname: '/static/**' },
    ],
  },
  async headers() {
    const dev = process.env.NODE_ENV !== 'production';
    return [
      { source: '/((?!embed/).*)', headers: securityHeaders(dev) },
      // /embed is the one thing another site may frame: a calculator with no account and no cookies, so nothing to
      // click-jack. Same headers with frame-ancestors * and without X-Frame-Options DENY (a browser that honoured only
      // XFO would refuse the frame).
      { source: '/embed/:path*', headers: securityHeaders(dev).filter((h) => h.key !== 'X-Frame-Options')
          .map((h) => (h.key === 'Content-Security-Policy' ? { ...h, value: h.value.replace("frame-ancestors 'none'", 'frame-ancestors *') } : h)) },
      // A worker that is cached keeps an old copy running; always revalidate it.
      { source: '/plutto-sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }] },
      // /app is a signed-in screen rendered in JavaScript, a thin page that would compete with the home page for
      // "Plutto": noindex keeps it out of results while links to it still count. robots.txt does not block /app,
      // because a blocked page's noindex is never read. /m/ holds its bundle and assets.
      { source: '/app', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] },
      { source: '/app/', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] },
      { source: '/m/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
    ];
  },
  // /app is the phone app built for the browser (Plutto-Frontend scripts/build-web.mjs) in public/m. `beforeFiles` so
  // nothing under app/ can shadow it; the bundle's asset URLs already start with /m.
  async rewrites() {
    // /plutto-sw.js is the app's notification worker (built beside the bundle), served from the root so its scope is
    // the whole site, the manifest's scope, which an iPhone's Home Screen app needs to receive notifications.
    return { beforeFiles: [
      { source: '/app', destination: '/m/index.html' },
      { source: '/app/', destination: '/m/index.html' },
      { source: '/plutto-sw.js', destination: '/m/plutto-sw.js' },
    ] };
  },
};

export default nextConfig;
