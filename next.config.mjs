/** @type {import('next').NextConfig} */

const API = 'https://api.plutto.space';
const SUPABASE = 'https://auth.plutto.space';
// The realtime voice leg posts its SDP offer straight to OpenAI with a
// short-lived token, so that origin has to be reachable from the page.
const OPENAI = 'https://api.openai.com';
// PADDLE — web checkout. Paddle.js is loaded from their CDN, the checkout runs
// in an iframe from their origin, and both the live and sandbox hosts are named
// because the sandbox is where this gets tested and a CSP that only works in
// production is a CSP that gets discovered at the worst moment.
const PADDLE_CDN = 'https://cdn.paddle.com https://sandbox-cdn.paddle.com';
const PADDLE = 'https://*.paddle.com https://*.paddlejs.com';
// RAZORPAY — the web checkout. checkout.js comes from checkout.razorpay.com, the
// payment form is an iframe from api.razorpay.com, and the form calls back to
// *.razorpay.com (its API, its CDN for bank logos, its error reporting). Missing
// any one of these, the window opens empty or the pay button does nothing.
const RAZORPAY_JS = 'https://checkout.razorpay.com';
const RAZORPAY = 'https://*.razorpay.com';

/**
 * Content-Security-Policy — the single most valuable header here: even if a
 * dependency were compromised or some text escaped React's escaping, the
 * browser refuses to load or contact anything not listed.
 *
 * Notes on the awkward entries:
 *  • style-src needs 'unsafe-inline' for Next's runtime style injection.
 *  • script-src needs 'unsafe-inline' for Next's bootstrap, and 'unsafe-eval'
 *    ONLY in dev (React Refresh); production omits it.
 *  • connect-src is what actually bounds data exfiltration — it names exactly
 *    the hosts this app may talk to, and nothing else.
 */
const csp = (dev) =>
  [
    "default-src 'self'",
    // 'wasm-unsafe-eval' is CanvasKit (Skia) — the orb, the globe and the maps
    // in the app at /app are drawn with it. It permits WebAssembly only, not eval.
    `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' ${PADDLE_CDN} ${RAZORPAY_JS}${dev ? " 'unsafe-eval'" : ''}`,
    "worker-src 'self' blob:",
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${API} ${PADDLE} ${RAZORPAY}`,
    `media-src 'self' data: blob: ${API}`,
    // The app screens are set in the same faces the phone downloads, served from
    // the backend — without this the browser refuses them and silently falls back
    // to the system font, which looks like a design choice rather than a block.
    `font-src 'self' data: ${API}`,
    `connect-src 'self' blob: data: ${API} ${SUPABASE} ${OPENAI} ${PADDLE} ${RAZORPAY} wss://*.openai.com${dev ? ' ws://localhost:*' : ''}`,
    // The checkout is an iframe from Paddle's origin. Without this it falls back
    // to default-src 'self' and the overlay opens empty — no error, no content.
    `frame-src 'self' ${PADDLE} ${RAZORPAY}`,
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
  // The page uses the microphone (voice mode) and, on the panchang, the
  // location (asked only on a tap, to find sunrise; never sent). Everything else
  // is switched off, so a compromised script cannot reach it.
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), geolocation=(self), usb=(), microphone=(self), ' +
      // Paddle Billing's checkout iframe is buy.paddle.com (checkout.* was
      // Paddle Classic); Apple Pay / Google Pay inside it need this permission.
      'payment=(self "https://buy.paddle.com" "https://sandbox-buy.paddle.com" ' +
      '"https://checkout.paddle.com" "https://sandbox-checkout.paddle.com" ' +
      // Razorpay's form uses the Payment Request API for Google Pay and saved cards.
      '"https://api.razorpay.com" "https://checkout.razorpay.com")',
  },
  // allow-popups: Paddle's PayPal option opens a window that has to report
  // back to the checkout; plain same-origin severs that link.
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
  // Don't advertise the framework version — free reconnaissance for an attacker.
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
      // THE EMBEDS are the one thing another site may frame: a calculator with no
      // account and no cookies, so there is nothing to click-jack. They get the
      // same headers with frame-ancestors * and without X-Frame-Options DENY
      // (a browser that honoured only XFO would refuse the frame).
      { source: '/embed/:path*', headers: securityHeaders(dev).filter((h) => h.key !== 'X-Frame-Options')
          .map((h) => (h.key === 'Content-Security-Policy' ? { ...h, value: h.value.replace("frame-ancestors 'none'", 'frame-ancestors *') } : h)) },
      // A worker that is cached keeps an old copy running; always revalidate it.
      { source: '/plutto-sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }] },
      // THE WEB APP IS A TOOL, NOT A PAGE. /app is a signed-in screen that renders
      // in JavaScript; indexed, it is a thin page competing with the home page for
      // "Plutto". noindex keeps it out of results while the links to it still count.
      // (robots.txt deliberately does NOT block /app — a blocked page's noindex is
      // never read.) /m/ is its bundle and assets.
      { source: '/app', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] },
      { source: '/app/', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] },
      { source: '/m/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
    ];
  },
  // THE APP. /app is the phone's own app built for the browser (Plutto-Frontend,
  // scripts/build-web.mjs), placed in public/m. `beforeFiles` so nothing under
  // app/ can shadow it. The bundle's own asset URLs already start with /m.
  async rewrites() {
    // /plutto-sw.js is the app's notification worker (built beside the bundle).
    // Served from the root so its scope is the whole site — the same scope as
    // the manifest — which is what an iPhone's Home Screen app needs to receive.
    return { beforeFiles: [
      { source: '/app', destination: '/m/index.html' },
      { source: '/app/', destination: '/m/index.html' },
      { source: '/plutto-sw.js', destination: '/m/plutto-sw.js' },
    ] };
  },
};

export default nextConfig;
