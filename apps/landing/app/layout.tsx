import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://ultron.nexity.dev'),
  title: {
    absolute: 'Ultron - AI Business Operating System',
  },
  description:
    'Run your entire business with AI agents. Sales, content, and operations on autopilot.',
  keywords:
    'AI agents, business operating system, AI automation, sales AI, content AI, operations AI, Ultron',
  authors: [{ name: 'Ultron' }],
  creator: 'Ultron',
  publisher: 'Ultron',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Ultron - AI Business Operating System',
    description:
      'Run your entire business with AI agents. Sales, content, and operations on autopilot.',
    type: 'website',
    siteName: 'Ultron',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ultron - AI Business Operating System',
    description:
      'Run your entire business with AI agents. Sales, content, and operations on autopilot.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='dark' suppressHydrationWarning>
      <head>
        <meta name='color-scheme' content='dark' />
        <meta name='format-detection' content='telephone=no' />
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body
        className='font-body bg-[#0A0A0A] text-white antialiased min-h-screen'
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
