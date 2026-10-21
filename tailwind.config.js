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
        // THE MAGAZINE EDITION. The site was written in white-on-black classes
        // (text-white/60, border-white/10, bg-black …); the palette is turned
        // over here, once, so every page prints as ink on paper: "white" is the
        // ink and "black" is the paper. Colour is otherwise sacred — sindoor for
        // the one line or date to keep, gold for a reader's own sky, indigo for
        // the night — and never a fill.
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
