import type { Metadata, Viewport } from 'next'
import { martianMono } from '@/app/fonts/martian-mono'
import { season } from '@/app/fonts/season'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1c1c1c' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1c1c' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://sim.ai'),
  title: {
    absolute: 'Sim — Build AI Agents & Run Your Agentic Workforce',
  },
  description:
    'Sim is the open-source platform to build AI agents and run your agentic workforce. Connect 1,000+ integrations and LLMs to orchestrate agentic workflows.',
  keywords:
    'AI agents, agentic workforce, open-source AI agent platform, agentic workflows, LLM orchestration, AI automation, knowledge base, workflow builder, AI integrations, SOC2 compliant, enterprise AI',
  authors: [{ name: 'Sim' }],
  creator: 'Sim',
  publisher: 'Sim',
  openGraph: {
    title: 'Sim — Build AI Agents & Run Your Agentic Workforce',
    description:
      'Sim is the open-source platform to build AI agents and run your agentic workforce. Connect 1,000+ integrations and LLMs to orchestrate agentic workflows.',
    type: 'website',
    url: 'https://sim.ai',
    siteName: 'Sim',
    locale: 'en_US',
    images: [
      {
        url: '/logo/426-240/primary/small.png',
        width: 2130,
        height: 1200,
        alt: 'Sim — Build AI Agents & Run Your Agentic Workforce',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@simdotai',
    creator: '@simdotai',
    title: 'Sim — Build AI Agents & Run Your Agentic Workforce',
    description:
      'Sim is the open-source platform to build AI agents and run your agentic workforce.',
    images: {
      url: '/logo/426-240/primary/small.png',
      alt: 'Sim — Build AI Agents & Run Your Agentic Workforce',
    },
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
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta name='color-scheme' content='light dark' />
        <meta name='format-detection' content='telephone=no' />
      </head>
      <body
        className={`${season.variable} ${martianMono.variable} font-season`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
