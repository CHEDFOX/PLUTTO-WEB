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
    `script-src 'self' 'unsafe-inline' ${PADDLE_CDN}${dev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${API} ${PADDLE}`,
    `media-src 'self' data: blob: ${API}`,
    // The app screens are set in the same faces the phone downloads, served from
    // the backend — without this the browser refuses them and silently falls back
    // to the system font, which looks like a design choice rather than a block.
    `font-src 'self' data: ${API}`,
    `connect-src 'self' ${API} ${SUPABASE} ${OPENAI} ${PADDLE} wss://*.openai.com${dev ? ' ws://localhost:*' : ''}`,
    // The checkout is an iframe from Paddle's origin. Without this it falls back
    // to default-src 'self' and the overlay opens empty — no error, no content.
    `frame-src 'self' ${PADDLE}`,
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
  // The page uses the microphone (voice mode) and nothing else. Everything the
  // app does not need is switched off, so a compromised script cannot reach it.
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), geolocation=(), usb=(), microphone=(self), ' +
      'payment=(self "https://checkout.paddle.com" "https://sandbox-checkout.paddle.com")',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
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
    return [{ source: '/:path*', headers: securityHeaders(dev) }];
  },
};

export default nextConfig;
