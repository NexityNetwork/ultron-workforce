'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { DemoRequestModal } from '@/app/(home)/components/demo-request/demo-request-modal'
import {
  BlocksLeftAnimated,
  BlocksRightAnimated,
  BlocksRightSideAnimated,
  BlocksTopLeftAnimated,
  BlocksTopRightAnimated,
  useBlockCycle,
} from '@/app/(home)/components/hero/components/animated-blocks'

const LandingPreview = dynamic(
  () =>
    import('@/app/(home)/components/landing-preview/landing-preview').then(
      (mod) => mod.LandingPreview
    ),
  {
    ssr: false,
    loading: () => <div className='aspect-[1116/549] w-full rounded bg-[var(--landing-bg)]' />,
  }
)

/** Shared base classes for CTA link buttons */
const CTA_BASE =
  'inline-flex items-center h-[32px] rounded-[5px] border px-2.5 font-[430] font-season text-sm'

export default function Hero() {
  const blockStates = useBlockCycle()

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

      <div
        aria-hidden='true'
        className='pointer-events-none absolute top-[-0.7vw] left-[-2.8vw] z-0 aspect-[344/328] w-[23.9vw]'
      >
        <Image src='/landing/card-left.svg' alt='' fill className='object-contain' />
      </div>

      <div
        aria-hidden='true'
        className='pointer-events-none absolute top-[-2.8vw] right-[-4vw] z-0 aspect-[471/470] w-[32.7vw]'
      >
        <Image src='/landing/card-right.svg' alt='' fill className='object-contain' />
      </div>

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

        <div className='mt-3 flex items-center gap-2'>
          <DemoRequestModal>
            <button
              type='button'
              className={`${CTA_BASE} gap-2 border-white bg-white text-black transition-colors hover:border-[#E0E0E0] hover:bg-[#E0E0E0]`}
              aria-label='Get a demo'
            >
              Get a demo
            </button>
          </DemoRequestModal>
        </div>
      </div>

      <div
        aria-hidden='true'
        className='pointer-events-none absolute top-0 right-[13.1vw] z-20 w-[calc(140px_+_10.76vw)] max-w-[295px]'
      >
        <BlocksTopRightAnimated animState={blockStates.topRight} />
      </div>

      <div
        aria-hidden='true'
        className='pointer-events-none absolute top-0 left-[16vw] z-20 w-[calc(140px_+_10.76vw)] max-w-[295px]'
      >
        <BlocksTopLeftAnimated animState={blockStates.topLeft} />
      </div>

      <div className='relative z-10 mx-auto mt-[3.2vw] w-[78.9vw] px-[1.4vw]'>
        <div
          aria-hidden='true'
          className='-translate-y-1/2 pointer-events-none absolute top-[50%] right-[calc(100%-1.41vw)] z-20 w-[calc(16px_+_1.25vw)] max-w-[34px]'
        >
          <BlocksLeftAnimated animState={blockStates.left} />
        </div>

        <div
          aria-hidden='true'
          className='-translate-y-1/2 pointer-events-none absolute top-[50%] left-[calc(100%-1.41vw)] z-20 w-[calc(16px_+_1.25vw)] max-w-[34px] scale-x-[-1]'
        >
          <BlocksRightSideAnimated animState={blockStates.rightSide} />
        </div>

        <div className='relative z-10 overflow-hidden rounded border border-[var(--landing-bg-elevated)]'>
          <LandingPreview />
        </div>
      </div>

      <div
        aria-hidden='true'
        className='-translate-y-1/2 pointer-events-none absolute top-[50%] right-0 z-20 w-[calc(16px_+_1.25vw)] max-w-[34px]'
      >
        <BlocksRightAnimated animState={blockStates.rightEdge} />
      </div>
    </section>
  )
}
