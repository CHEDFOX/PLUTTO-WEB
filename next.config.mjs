/** @type {import('next').NextConfig} */

const API = 'https://api.plutto.space';
const SUPABASE = 'https://auth.plutto.space';
// The realtime voice leg posts its SDP offer straight to OpenAI with a
// short-lived token, so that origin has to be reachable from the page.
const OPENAI = 'https://api.openai.com';

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
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${API}`,
    `media-src 'self' data: blob: ${API}`,
    "font-src 'self' data:",
    `connect-src 'self' ${API} ${SUPABASE} ${OPENAI} wss://*.openai.com${dev ? ' ws://localhost:*' : ''}`,
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
    value: 'camera=(), geolocation=(), payment=(), usb=(), microphone=(self)',
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
