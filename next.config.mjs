/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.plutto.space', pathname: '/static/**' },
    ],
  },
};

export default nextConfig;
