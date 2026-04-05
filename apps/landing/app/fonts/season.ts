import localFont from 'next/font/local'

/**
 * Season Sans variable font — supports weights 300–800.
 * File copied from apps/sim/app/_styles/fonts/season/SeasonSansUprightsVF.woff2
 */
export const season = localFont({
  src: [
    { path: './season/SeasonSansUprightsVF.woff2', weight: '300 800', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-season',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans'],
  adjustFontFallback: 'Arial',
})
