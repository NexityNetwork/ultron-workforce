import { Suspense } from 'react'
import { getNavBlogPosts } from '@/lib/blog/registry'
import { martianMono } from '@/app/fonts/martian-mono'
import { FooterCTA } from '@/app/(home)/components/footer/footer-cta'
import {
  Collaboration,
  Enterprise,
  Features,
  Hero,
  Navbar,
  Pricing,
  StructuredData,
  Templates,
} from '@/app/(home)/components'

export default async function Landing() {
  const blogPosts = await getNavBlogPosts()

  return (
    <div
      className={`${martianMono.variable} min-h-screen bg-[var(--landing-bg)]`}
    >
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:font-medium focus:text-black focus:text-sm'
      >
        Skip to main content
      </a>
      <StructuredData />
      <header>
        <Suspense fallback={<div className='h-[52px] border-[var(--landing-bg-elevated)] border-b bg-[var(--landing-bg)]' />}>
          <Navbar blogPosts={blogPosts} />
        </Suspense>
      </header>
      <main id='main-content'>
        <Hero />
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
