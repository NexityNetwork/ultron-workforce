'use client'

import dynamic from 'next/dynamic'

const ChatInterface = dynamic(
  () => import('@/components/ChatInterface'),
  {
    ssr: false,
    loading: () => <div className='aspect-[1116/549] w-full rounded bg-[var(--landing-bg)]' />,
  }
)

export default function Hero() {
  return (
    <section
      id='hero'
      aria-labelledby='hero-heading'
      className='relative flex flex-col items-center overflow-hidden bg-[var(--landing-bg)] pt-[60px] pb-3 lg:pt-[100px]'
    >
      <p className='sr-only'>
        Ultron is the AI workforce platform that helps companies hire AI employees, set GTM goals,
        and scale results without scaling headcount. Five AI agents run in parallel, covering
        research, outreach, content, operations, and intelligence. 250 plus integrations, 35 plus
        specialized skills, and a memory system that gets smarter every run.
      </p>

      <div className='relative z-10 flex flex-col items-center gap-3'>
        <h1
          id='hero-heading'
          className='text-balance text-center font-[430] font-season text-[36px] text-white leading-[105%] tracking-[-0.02em] sm:text-[48px] lg:text-[64px]'
        >
          Hire AI Employees.
          <br />
          Scale GTM without scaling headcount.
        </h1>
        <p className='max-w-[560px] text-balance text-center font-[430] font-season text-[color-mix(in_srgb,var(--landing-text-subtle)_60%,transparent)] text-base leading-[145%] tracking-[0.02em] lg:text-lg'>
          Your team is buried in tasks humans should not be doing anymore.
          Delegate 50% of GTM work to AI Agents within 6 months.
        </p>
      </div>

      <div className='relative z-10 mx-auto mt-[3.2vw] w-[78.9vw] px-[1.4vw]'>
        <ChatInterface />
      </div>
    </section>
  )
}
