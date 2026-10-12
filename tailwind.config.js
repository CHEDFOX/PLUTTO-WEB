/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        // THE MAGAZINE EDITION. The site was written in white-on-black classes
        // (text-white/60, border-white/10, bg-black …); the palette is turned
        // over here, once, so every page prints as ink on paper: "white" is the
        // ink and "black" is the paper. Colour is otherwise sacred — sindoor for
        // the one line or date to keep, gold for a reader's own sky, indigo for
        // the night — and never a fill.
        white: '#111111',
        black: '#F2EFE8',
        paper: '#F2EFE8',
        ink: '#111111',
        graphite: '#55514C',
        sindoor: '#C8341F',
        gold: '#D4AF37',
        night: '#26368C',
        void: '#F2EFE8',
        whisper: 'rgba(17,17,17,0.06)',
        mist: 'rgba(17,17,17,0.12)',
        scrim: 'rgba(17,17,17,0.85)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Julius Sans One', 'system-ui', 'sans-serif'],
        mark: ['var(--font-mark)', 'Josefin Sans', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'DM Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        editorial: ['var(--font-editorial)', 'Instrument Serif', 'Georgia', 'serif'],
        ui: ['var(--font-ui)', 'Inter', 'system-ui', 'sans-serif'],
        app: ['var(--font-app)', '"Baloo 2"', 'system-ui', 'sans-serif'],
        hand: ['var(--font-hand)', 'Caveat', 'cursive'],
        serif: ['var(--font-reading)', 'Syne', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        wider2: '0.08em',
        // The display register: wide enough that the eye reads the word as a
        // shape before it reads the letters.
        title: '0.3em',
        // The mark is spaced further than anything else on the page. Past roughly
        // 0.7em the letters stop reading as a word and start reading as a row of
        // marks — which is the effect.
        mark: '0.72em',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // Magazine corners: cards and panels square up; only true circles stay round.
        xl: '2px',
        '2xl': '2px',
        '3xl': '2px',
      },
      keyframes: {
        'x-kick': {
          '0%':   { transform: 'translateX(0)' },
          '30%':  { transform: 'translateX(6px)' },
          '60%':  { transform: 'translateX(-2px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'x-kick': 'x-kick 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
