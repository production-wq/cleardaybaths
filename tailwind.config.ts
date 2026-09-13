import type { Config } from 'tailwindcss';

/**
 * Design tokens sampled from the two approved artifacts and the Clear Day logo
 * (teal/sage gradient droplet). Section backgrounds alternate ink -> mint -> cream.
 */
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#14211D', soft: '#1E3A33' },   // body copy · dark sections
        forest: {                                        // hero / footer ground
          50: '#EFF5F2', 100: '#D9E9E2', 200: '#B4D3C7', 300: '#8FBCAB',
          400: '#63A18C', 500: '#3E8C74', 600: '#317059', 700: '#265646',
          800: '#1E3A33', 900: '#152A25', 950: '#0D1B17',
        },
        teal: { DEFAULT: '#3E8C74', hover: '#317059' },  // primary CTA + links
        sage: '#7FB9A6',
        mint: '#D9E9E2',                                 // alt section ground
        cream: '#F4F7F5',
        greige: '#8A8F94',                               // logo wordmark sub-label
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid scale — the designs run 2.5rem mobile to 4rem desktop for H1.
        'display-xl': ['clamp(2.5rem, 1.6rem + 3.8vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['clamp(2rem, 1.4rem + 2.6vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['clamp(1.5rem, 1.2rem + 1.4vw, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.18em', fontWeight: '600' }],
      },
      borderRadius: { card: '1rem', panel: '1.25rem' },
      maxWidth: { content: '75rem', prose: '42rem' },
      spacing: { section: 'clamp(3.5rem, 2rem + 6vw, 6.5rem)' },
      backgroundImage: {
        /*
         * Ground for every dark section that has no photo behind it (the CTA
         * form, the stats/reviews block, any service or city page without a
         * hero image). Originally just the diagonal stripe on flat forest-950,
         * which read as under-designed once the stock photography came out —
         * a single flat color with a faint texture, no depth.
         *
         * Two soft brand-color glows (teal top-left, sage bottom-right) sit
         * behind the stripe, both far enough into the corners and diffuse
         * enough that they never compete with foreground text or a card —
         * they read as ambient light, not as shapes.
         */
        'stripe-dark': `
          radial-gradient(60rem 40rem at -10% -20%, rgba(62,140,116,.35), transparent 60%),
          radial-gradient(50rem 36rem at 110% 120%, rgba(127,185,166,.22), transparent 55%),
          repeating-linear-gradient(135deg, rgba(255,255,255,.035) 0 2px, transparent 2px 14px)
        `,
      },
    },
  },
  plugins: [],
} satisfies Config;
