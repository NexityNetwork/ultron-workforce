import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './partners/midday/apps/website/src/components/sections/**/*.{ts,tsx}',
    './partners/midday/apps/website/src/components/homepage/**/*.{ts,tsx}',
    './partners/cap/apps/web/components/pages/HomePage/**/*.{ts,tsx}',
    './partners/cap/packages/ui/src/components/**/*.{ts,tsx}',
    './partners/inboxzero/apps/web/app/(landing)/home/Features.tsx',
    './partners/supabase/packages/marketing/src/go/sections/**/*.{ts,tsx}',
    '!**/node_modules/**',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['IBM Plex Sans', 'sans-serif'],
        season: ['var(--font-season)'],
        'body-fallback': [
          'ui-sans-serif',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Helvetica',
          'Apple Color Emoji',
          'Arial',
          'sans-serif',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
        ],
        mono: [
          'var(--font-martian-mono, ui-monospace)',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      fontSize: {
        micro: '10px',
        xs: '11px',
        caption: '12px',
        small: '13px',
        base: '15px',
        md: '16px',
      },
      spacing: {
        '4.5': '18px',
      },
      colors: {
        // Ultron dark theme tokens
        'surface': '#0A0A0A',
        'surface-elevated': '#0A0A0A',
        'surface-hover': '#141414',
        'border-ultron': 'rgba(255, 255, 255, 0.08)',
        'border-light': 'rgba(255, 255, 255, 0.12)',
        'primary-ultron': '#DA4E24',
        'primary-hover': '#E8622C',
        'primary-muted': 'rgba(218, 78, 36, 0.12)',
        'secondary-ultron': '#0098F3',
        'secondary-muted': 'rgba(0, 152, 243, 0.12)',
        'accent-ultron': '#FF8918',
        'success-ultron': '#34C759',
        'success-muted': 'rgba(52, 199, 89, 0.12)',
        'warning-ultron': '#FFD60A',
        'warning-muted': 'rgba(255, 214, 10, 0.12)',
        'danger': '#FF453A',
        'danger-muted': 'rgba(255, 69, 58, 0.12)',
        'text-primary': '#FFFFFF',
        'text-secondary': 'rgba(255, 255, 255, 0.5)',
        'text-tertiary': 'rgba(255, 255, 255, 0.3)',
        'text-ghost': 'rgba(255, 255, 255, 0.08)',
        // Existing HSL-based tokens
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
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
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      borderRadius: {
        xs: '2px',
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        medium: 'var(--shadow-medium)',
        overlay: 'var(--shadow-overlay)',
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'dash-animation': {
          from: { strokeDashoffset: '0' },
          to: { strokeDashoffset: '-24' },
        },
        'placeholder-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.8' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
        logoSpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'slide-left': 'slide-left 80s linear infinite',
        'slide-right': 'slide-right 80s linear infinite',
        'dash-animation': 'dash-animation 1.5s linear infinite',
        'placeholder-pulse': 'placeholder-pulse 1.5s ease-in-out infinite',
        'collapsible-down': 'collapsible-down 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'collapsible-up': 'collapsible-up 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'logo-spin': 'logoSpin 8s linear infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('tailwindcss/plugin')(
      ({ addVariant }: { addVariant: (name: string, definition: string) => void }) => {
        addVariant('hover-hover', '@media (hover: hover) and (pointer: fine) { &:hover }')
      }
    ),
  ],
} satisfies Config
