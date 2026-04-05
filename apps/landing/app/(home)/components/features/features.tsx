'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { type MotionValue, motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Badge, ChevronDown } from '@/components/emcn'

function hexToRgba(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const FEATURE_TABS = [
  {
    label: 'Command Center',
    mobileLabel: 'Command',
    color: '#FA4EDF',
    title: 'Your command center',
    description:
      'Every agent, skill, and canvas lives here. Manage work, review outputs, and direct your workforce without leaving the interface.',
    cta: 'Explore command center',
  },
  {
    label: 'Agents',
    color: '#2ABBF8',
    title: 'Five agents. Always running.',
    description:
      'Cortex, Specter, Striker, Pulse, and Sentinel. Each owns a domain. Each runs in parallel. Each gets sharper over time.',
    cta: 'Explore agents',
  },
  {
    label: 'Skills',
    color: '#FFCC02',
    badgeColor: '#EAB308',
    title: '35+ specialized sub-agents',
    description:
      'Triggered by a single command. Research, lead generation, cold outreach, content, and operations. Ready to deploy out of the box.',
    cta: 'Explore skills',
  },
  {
    label: 'Memory',
    color: '#8B5CF6',
    title: 'A brain that compounds',
    description:
      'Brain Graph maps every session. 3-layer compression. Lessons system. Your agents get sharper with every run.',
    cta: 'Explore memory',
  },
  {
    label: 'Integrations',
    hideOnMobile: true,
    color: '#FF6B35',
    title: 'Plug in what you already use',
    description:
      '250+ integrations via Composio. 50+ MCP servers preloaded. Connect your CRM, inbox, calendar, and more in minutes.',
    cta: 'Explore integrations',
  },
]

const HEADING_TEXT = 'Everything you need to run'
const HEADING_TEXT_2 = 'an autonomous company.'
const HEADING_LETTERS = HEADING_TEXT.split('')
const HEADING_LETTERS_2 = HEADING_TEXT_2.split('')
const ALL_LETTERS_COUNT = HEADING_LETTERS.length + HEADING_LETTERS_2.length
const LETTER_REVEAL_SPAN = 0.85
const LETTER_FADE_IN = 0.04

const AUTO_PLAY_INTERVAL = 5000

interface ScrollLetterProps {
  scrollYProgress: MotionValue<number>
  charIndex: number
  children: string
}

function ScrollLetter({ scrollYProgress, charIndex, children }: ScrollLetterProps) {
  const threshold = (charIndex / ALL_LETTERS_COUNT) * LETTER_REVEAL_SPAN
  const opacity = useTransform(scrollYProgress, [threshold, threshold + LETTER_FADE_IN], [0.4, 1])
  return <motion.span style={{ opacity }}>{children}</motion.span>
}

function DotGrid({ cols, rows, width, borderLeft }: { cols: number; rows: number; width?: number; borderLeft?: boolean }) {
  return (
    <div
      aria-hidden='true'
      className={`h-full shrink-0 bg-[var(--landing-bg-section)] p-1.5 ${borderLeft ? 'border-[var(--divider)] border-l' : ''}`}
      style={{
        width: width ? `${width}px` : undefined,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 4,
        placeItems: 'center',
      }}
    >
      {Array.from({ length: cols * rows }, (_, i) => (
        <div key={i} className='h-[1.5px] w-[1.5px] rounded-full bg-[#DEDEDE]' />
      ))}
    </div>
  )
}

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [direction, setDirection] = useState(1)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.9', 'start 0.2'],
  })

  const goToTab = useCallback((index: number) => {
    setDirection(index > activeTab ? 1 : -1)
    setActiveTab(index)
  }, [activeTab])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDirection(1)
      setActiveTab((prev) => (prev + 1) % FEATURE_TABS.length)
    }, AUTO_PLAY_INTERVAL)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [activeTab])

  const tab = FEATURE_TABS[activeTab]

  return (
    <section
      id='features'
      aria-labelledby='features-heading'
      className='relative overflow-hidden bg-[var(--landing-bg-section)]'
    >
      <div aria-hidden='true' className='absolute top-0 left-0 w-full'>
        <Image
          src='/landing/features-transition.svg'
          alt=''
          width={1440}
          height={366}
          className='h-auto w-full'
        />
      </div>

      <div className='relative z-10 pt-[60px] lg:pt-[100px]'>
        <div ref={sectionRef} className='flex flex-col items-start gap-5 px-6 lg:px-20'>
          <Badge
            variant='blue'
            size='md'
            dot
            className='font-season uppercase tracking-[0.02em] transition-colors duration-200'
            style={{
              color: (tab as typeof tab & { badgeColor?: string }).badgeColor ?? tab.color,
              backgroundColor: hexToRgba(
                (tab as typeof tab & { badgeColor?: string }).badgeColor ?? tab.color,
                0.1
              ),
            }}
          >
            Platform
          </Badge>
          <h2
            id='features-heading'
            className='max-w-[900px] font-[430] font-season text-[28px] text-[var(--landing-text-dark)] leading-[110%] tracking-[-0.02em] md:text-[40px]'
          >
            {HEADING_LETTERS.map((char, i) => (
              <ScrollLetter key={i} scrollYProgress={scrollYProgress} charIndex={i}>
                {char}
              </ScrollLetter>
            ))}
            <br />
            {HEADING_LETTERS_2.map((char, i) => (
              <ScrollLetter key={`l2-${i}`} scrollYProgress={scrollYProgress} charIndex={HEADING_LETTERS.length + i}>
                {char}
              </ScrollLetter>
            ))}
          </h2>
        </div>

        <div className='relative mt-10 pb-10 lg:mt-[73px] lg:pb-20'>
          <div aria-hidden='true' className='absolute top-0 bottom-0 left-[80px] z-20 hidden w-px bg-[var(--divider)] lg:block' />
          <div aria-hidden='true' className='absolute top-0 right-[80px] bottom-0 z-20 hidden w-px bg-[var(--divider)] lg:block' />

          {/* Tab bar */}
          <div className='flex h-[68px] border border-[var(--divider)] lg:overflow-hidden'>
            <div className='h-full shrink-0'>
              <div className='h-full lg:hidden'><DotGrid cols={3} rows={8} width={24} /></div>
              <div className='hidden h-full lg:block'><DotGrid cols={10} rows={8} width={80} /></div>
            </div>

            <div role='tablist' aria-label='Feature categories' className='flex flex-1'>
              {FEATURE_TABS.map((t, index) => (
                <button
                  key={t.label}
                  type='button'
                  role='tab'
                  aria-selected={index === activeTab}
                  onClick={() => goToTab(index)}
                  className={`relative h-full flex-1 items-center justify-center whitespace-nowrap px-3 font-medium font-season text-[var(--landing-text-dark)] text-[12px] uppercase lg:px-0 lg:text-sm${(t as typeof t & { hideOnMobile?: boolean }).hideOnMobile ? ' hidden lg:flex' : ' flex'}${index > 0 ? ' border-[var(--divider)] border-l' : ''}`}
                  style={{ backgroundColor: index === activeTab ? '#FDFDFD' : '#F6F6F6' }}
                >
                  {(t as typeof t & { mobileLabel?: string }).mobileLabel ? (
                    <>
                      <span className='lg:hidden'>{(t as typeof t & { mobileLabel?: string }).mobileLabel}</span>
                      <span className='hidden lg:inline'>{t.label}</span>
                    </>
                  ) : t.label}
                  {index === activeTab && (
                    <motion.div
                      layoutId='feature-tab-underline'
                      className='absolute right-0 bottom-0 left-0 h-[3px] rounded-full'
                      style={{ backgroundColor: t.color }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className='h-full shrink-0'>
              <div className='h-full lg:hidden'><DotGrid cols={3} rows={8} width={24} /></div>
              <div className='hidden h-full lg:block'><DotGrid cols={10} rows={8} width={80} /></div>
            </div>
          </div>

          {/* Carousel content */}
          <div className='relative mx-6 mt-10 overflow-hidden lg:mx-[120px] lg:mt-[60px]'>
            <div className='relative h-[280px] lg:h-[260px]'>
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={activeTab}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -60 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className='absolute inset-0 flex flex-col items-center text-center'
                >
                  <div
                    className='mb-6 flex h-12 w-12 items-center justify-center rounded-2xl'
                    style={{ backgroundColor: hexToRgba(tab.color, 0.1) }}
                  >
                    <div
                      className='h-2.5 w-2.5 rounded-full'
                      style={{ backgroundColor: tab.color }}
                    />
                  </div>

                  <h3 className='font-[430] font-season text-[24px] text-[var(--landing-text-dark)] leading-[120%] tracking-[-0.02em] lg:text-[32px]'>
                    {tab.title}
                  </h3>

                  <p className='mt-4 max-w-[520px] font-[430] font-season text-[color-mix(in_srgb,var(--landing-text-dark)_50%,transparent)] text-base leading-[160%] tracking-[0.02em] lg:text-lg'>
                    {tab.description}
                  </p>

                  <a
                    href='https://app.51ultron.com/signup'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group/cta mt-8 inline-flex h-[36px] items-center gap-1.5 rounded-[5px] border border-[#1D1D1D] bg-[#1D1D1D] px-3 font-[430] font-season text-sm text-white transition-colors hover:border-[var(--landing-bg-elevated)] hover:bg-[var(--landing-bg-elevated)]'
                  >
                    {tab.cta}
                    <span className='relative h-[10px] w-[10px] shrink-0'>
                      <ChevronDown className='-rotate-90 absolute inset-0 h-[10px] w-[10px] transition-opacity duration-150 group-hover/cta:opacity-0' />
                      <svg className='absolute inset-0 h-[10px] w-[10px] opacity-0 transition-opacity duration-150 group-hover/cta:opacity-100' viewBox='0 0 10 10' fill='none'>
                        <path d='M1 5H8M5.5 2L8.5 5L5.5 8' stroke='currentColor' strokeWidth='1.33' strokeLinecap='square' strokeLinejoin='miter' fill='none' />
                      </svg>
                    </span>
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className='mt-10 flex items-center justify-center gap-2'>
              {FEATURE_TABS.map((t, i) => (
                <button
                  key={i}
                  type='button'
                  aria-label={`Go to ${t.label}`}
                  onClick={() => goToTab(i)}
                  className='relative h-1.5 overflow-hidden rounded-full transition-all duration-300'
                  style={{
                    width: i === activeTab ? 32 : 8,
                    backgroundColor: i === activeTab ? 'transparent' : '#D4D4D4',
                  }}
                >
                  {i === activeTab && (
                    <>
                      <div
                        className='absolute inset-0 rounded-full opacity-25'
                        style={{ backgroundColor: tab.color }}
                      />
                      <motion.div
                        className='absolute inset-y-0 left-0 rounded-full'
                        style={{ backgroundColor: tab.color }}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: 'linear' }}
                        key={`progress-${activeTab}`}
                      />
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div aria-hidden='true' className='mt-[60px] hidden h-px bg-[var(--divider)] lg:block' />
        </div>
      </div>
    </section>
  )
}
