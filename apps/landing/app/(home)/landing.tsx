import { getNavBlogPosts } from '@/lib/blog/registry'
import { martianMono } from '@/app/fonts/martian-mono'
import { season } from '@/app/fonts/season'
import {
  Collaboration,
  Enterprise,
  Features,
  Footer,
  Hero,
  Navbar,
  Pricing,
  StructuredData,
  Templates,
  Testimonials,
} from '@/app/(home)/components'

/**
 * Landing page root component.
 *
 * ## SEO Architecture
 * - Single `<h1>` inside Hero (only one per page).
 * - Heading hierarchy: H1 (Hero) -> H2 (each section) -> H3 (sub-items).
 * - Semantic landmarks: `<header>`, `<main>`, `<footer>`.
 * - Every `<section>` has an `id` for anchor linking and `aria-labelledby` for accessibility.
 * - `StructuredData` emits JSON-LD before any visible content.
 */
export default async function Landing() {
  const blogPosts = await getNavBlogPosts()

  return (
    <div
      className={`${season.variable} ${martianMono.variable} min-h-screen bg-[var(--landing-bg)]`}
    >
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:font-medium focus:text-black focus:text-sm'
      >
        Skip to main content
      </a>
      <StructuredData />
      <header>
        <Navbar blogPosts={blogPosts} />
      </header>
      <main id='main-content'>
        <Hero />
        <Templates />
        <Features />
        <Collaboration />
        <Enterprise />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
