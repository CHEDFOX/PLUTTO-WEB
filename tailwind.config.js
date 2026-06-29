/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        goldFaint: 'rgba(212,175,55,0.15)',
        void: '#000000',
        abyss: '#050508',
        card: '#0c0b12',
        mediaBg: '#0b0b12',
        silver: '#8A8A8E',
        ash: '#3A3A3C',
        ember: '#8B7355',
        whisper: 'rgba(255,255,255,0.06)',
        mist: 'rgba(255,255,255,0.12)',
        scrim: 'rgba(0,0,0,0.85)',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        wider2: '0.08em',
      },
    },
  },
  plugins: [],
};
