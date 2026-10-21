/** Web app manifest, read by Android's "Add to Home screen". The icons are the app's own (public/m/icons). */
export default function manifest() {
  return {
    name: 'Plutto',
    short_name: 'Plutto',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      { src: '/m/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/m/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/m/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
