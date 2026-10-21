/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        foreground: 'hsl(var(--foreground))',
        // Paper theme: white is ink (#111111) and black is paper (#F2EFE8), so the white-on-black utilities print
        // dark on light; sindoor marks a highlight, graphite is secondary text.
        white: '#111111',
        black: '#F2EFE8',
        graphite: '#55514C',
        sindoor: '#C8341F',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Julius Sans One', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'DM Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        ui: ['var(--font-ui)', 'Inter', 'system-ui', 'sans-serif'],
        hand: ['var(--font-hand)', 'Caveat', 'cursive'],
        sans: ['var(--font-body)', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Magazine corners: cards and panels square up; only true circles stay round.
        xl: '2px',
        '2xl': '2px',
        '3xl': '2px',
      },
    },
  },
  plugins: [],
};
