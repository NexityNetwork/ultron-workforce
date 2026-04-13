import { Suspense } from 'react'
import { FooterCTA } from '@/app/(home)/components/footer/footer-cta'
import {
  Collaboration,
  Enterprise,
  Features,
  Navbar,
  Pricing,
  StructuredData,
  Templates,
} from '@/app/(home)/components'
import PersonalizedHero from '@/app/(home)/components/personalized-hero'

export default async function Landing() {
  return (
    <div
      className='min-h-screen bg-[var(--landing-bg)]'
    >
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:font-medium focus:text-black focus:text-sm'
      >
        Skip to main content
      </a>
      <StructuredData />
      <header>
        <Suspense fallback={<div className='h-[52px]' />}>
          <Navbar />
        </Suspense>
      </header>
      <main id='main-content'>
        <PersonalizedHero />
        <Templates />
        <Features />
        <Collaboration />
        <Enterprise />
        <Pricing />
        <FooterCTA />
      </main>
    </div>
  )
}
