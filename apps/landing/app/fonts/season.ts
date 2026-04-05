import { Inter } from 'next/font/google'

/**
 * Season Sans substitute using Google Inter
 * Inter is a clean geometric sans-serif — visually close to Season Sans.
 * Uses the same CSS variable --font-season so all existing font-season classes work.
 */
export const season = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-season',
  weight: ['300', '400', '500', '600', '700', '800'],
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans'],
})
