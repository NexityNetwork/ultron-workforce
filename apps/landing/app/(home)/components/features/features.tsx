'use client'

import { useCallback, useRef, useState } from 'react'
import { type MotionValue, motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Badge } from '@/components/emcn'

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
    title: 'One interface for everything',
    description:
      'Assign tasks, review outputs, trigger skills, and manage all five agents from a single conversational workspace.',
  },
  {
    label: 'Agents',
    color: '#2ABBF8',
    title: 'Five domains. Zero overlap.',
    description:
      'Cortex handles research. Specter finds leads. Striker runs outreach. Pulse creates content. Sentinel monitors infrastructure.',
  },
  {
    label: 'Skills',
    color: '#FFCC02',
    badgeColor: '#EAB308',
    title: '35+ focused sub-agents',
    description:
      'Each skill has its own model, tools, and token budget. Two run concurrently per session. Heavy tasks fork into isolated background threads.',
  },
  {
    label: 'Memory',
    color: '#8B5CF6',
    title: 'Four layers of persistent context',
    description:
      'User preferences, corrections, project context, and research findings. Sonnet retrieves the 5 most relevant entries before every agent turn.',
  },
  {
    label: 'Integrations',
    hideOnMobile: true,
    color: '#FF6B35',
    title: '250+ tools. Connected in minutes.',
    description:
      '50 MCP servers preloaded. OAuth or API key setup. Your CRM, inbox, repo, and analytics available in every session automatically.',
  },
] as const

const HEADING_TEXT = 'Everything you need to run'
const HEADING_TEXT_2 = 'an autonomous company.'
const HEADING_LETTERS = HEADING_TEXT.split('')
const HEADING_LETTERS_2 = HEADING_TEXT_2.split('')
const ALL_LETTERS_COUNT = HEADING_LETTERS.length + HEADING_LETTERS_2.length
const LETTER_REVEAL_SPAN = 0.85
const LETTER_FADE_IN = 0.04


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

/** Command Center visual: mini prompt with quick-action pills */
function CommandCenterVisual() {
  return (
    <div className='flex h-full flex-col justify-center gap-3 lg:gap-4'>
      <div className='rounded-xl border border-[#E8E8E8] bg-white p-3 shadow-sm lg:p-4'>
        <div className='flex items-center gap-2 text-[12px] text-[#999] lg:text-[13px]'>
          <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/></svg>
          What are you working on?
        </div>
      </div>
      <div className='flex flex-wrap gap-1.5 lg:gap-2'>
        {['Research', 'Prospect', 'Outreach', 'Content', 'Strategize'].map((action) => (
          <div key={action} className='rounded-full border border-[#E8E8E8] bg-white px-2.5 py-1 font-season text-[11px] text-[#666] lg:px-3 lg:py-1.5 lg:text-[12px]'>
            {action}
          </div>
        ))}
      </div>
      <div className='flex items-center gap-3 border-t border-[#F0F0F0] pt-2.5 lg:pt-3'>
        <div className='flex items-center gap-1.5 text-[11px] text-[#999] lg:text-[12px]'>
          <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><rect x='3' y='3' width='7' height='7'/><rect x='14' y='3' width='7' height='7'/><rect x='14' y='14' width='7' height='7'/><rect x='3' y='14' width='7' height='7'/></svg>
          Tools (17)
        </div>
        <div className='flex items-center gap-1.5 text-[11px] text-[#999] lg:text-[12px]'>
          <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><circle cx='12' cy='12' r='10'/><path d='M12 6v6l4 2'/></svg>
          Memory
        </div>
        <div className='flex items-center gap-1.5 text-[11px] text-[#999] lg:text-[12px]'>
          <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg>
          Customers
        </div>
      </div>
    </div>
  )
}

const AGENTS = [
  { name: 'Cortex', domain: 'Research and intelligence', color: '#8B5CF6' },
  { name: 'Specter', domain: 'Lead generation and qualification', color: '#2ABBF8' },
  { name: 'Striker', domain: 'Sales execution and outreach', color: '#FA4EDF' },
  { name: 'Pulse', domain: 'Content creation and distribution', color: '#FFCC02' },
  { name: 'Sentinel', domain: 'Infrastructure and monitoring', color: '#33C482' },
] as const

/** Agents visual: five agent rows */
function AgentsVisual() {
  return (
    <div className='flex h-full flex-col justify-center gap-1.5 lg:gap-2'>
      {AGENTS.map((agent) => (
        <div key={agent.name} className='flex items-center gap-2.5 rounded-lg border border-[#F0F0F0] bg-white px-3 py-2 lg:gap-3 lg:px-4 lg:py-3'>
          <div className='h-2 w-2 shrink-0 rounded-full' style={{ backgroundColor: agent.color }} />
          <div className='flex flex-col gap-0.5'>
            <span className='font-season text-[12px] font-medium text-[#1D1D1D] lg:text-[13px]'>{agent.name}</span>
            <span className='font-season text-[10px] text-[#999] lg:text-[11px]'>{agent.domain}</span>
          </div>
          <div className='ml-auto font-season text-[9px] text-[#CCC] uppercase tracking-[0.05em] lg:text-[10px]'>Active</div>
        </div>
      ))}
    </div>
  )
}

/** Skills visual: execution panel showing active skills with modes */
function SkillsVisual() {
  return (
    <div className='flex h-full flex-col justify-center gap-2'>
      {/* Active skill - inline mode */}
      <div className='rounded-xl border border-[#F0F0F0] bg-white p-3 lg:p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-[#EAB308]' />
            <span className='font-season text-[12px] font-medium text-[#1D1D1D] lg:text-[13px]'>Competitive Analysis</span>
          </div>
          <span className='rounded-full bg-[#FEF9C3] px-2 py-0.5 font-season text-[9px] font-medium text-[#A16207] uppercase tracking-[0.04em]'>Inline</span>
        </div>
        <p className='mt-1.5 font-season text-[10px] text-[#999] leading-[150%] lg:mt-2 lg:text-[11px]'>Scanning 4 competitors across pricing, positioning, and feature gaps</p>
        <div className='mt-2 flex items-center gap-3 lg:mt-3'>
          <div className='h-1 flex-1 overflow-hidden rounded-full bg-[#F5F5F5]'>
            <div className='h-full w-[72%] rounded-full bg-[#EAB308]' />
          </div>
          <span className='font-mono text-[10px] text-[#BBB]'>72%</span>
        </div>
      </div>

      {/* Active skill - fork mode */}
      <div className='rounded-xl border border-[#F0F0F0] bg-white p-3 lg:p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-[#8B5CF6]' />
            <span className='font-season text-[12px] font-medium text-[#1D1D1D] lg:text-[13px]'>Lead Enrichment</span>
          </div>
          <span className='rounded-full bg-[#EDE9FE] px-2 py-0.5 font-season text-[9px] font-medium text-[#6D28D9] uppercase tracking-[0.04em]'>Fork</span>
        </div>
        <p className='mt-1.5 font-season text-[10px] text-[#999] leading-[150%] lg:mt-2 lg:text-[11px]'>Enriching 48 leads via Apollo, LinkedIn, and company data</p>
        <div className='mt-2 flex items-center gap-3 lg:mt-3'>
          <div className='h-1 flex-1 overflow-hidden rounded-full bg-[#F5F5F5]'>
            <div className='h-full w-[35%] rounded-full bg-[#8B5CF6]' />
          </div>
          <span className='font-mono text-[10px] text-[#BBB]'>35%</span>
        </div>
      </div>

      {/* Queued skills */}
      <div className='flex flex-wrap items-center gap-1.5 rounded-xl border border-dashed border-[#E8E8E8] bg-[#FAFAFA] px-3 py-2.5 lg:gap-2 lg:px-4 lg:py-3'>
        <span className='font-season text-[10px] text-[#BBB] lg:text-[11px]'>Queue:</span>
        {['Cold Outreach', 'Meeting Prep', 'Pipeline Review'].map((skill) => (
          <span key={skill} className='rounded-full border border-[#ECECEC] bg-white px-2 py-0.5 font-season text-[9px] text-[#999] lg:text-[10px]'>
            {skill}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className='flex items-center justify-between px-1'>
        <span className='font-season text-[9px] text-[#CCC] lg:text-[10px]'>2 of 2 slots active</span>
        <span className='font-season text-[9px] text-[#CCC] lg:text-[10px]'>3 queued</span>
      </div>
    </div>
  )
}

const MEMORY_LAYERS = [
  { layer: 'User', description: 'Role, background, preferences, working style', icon: '01' },
  { layer: 'Feedback', description: 'Corrections, confirmations, what works and what does not', icon: '02' },
  { layer: 'Project', description: 'Business context, timelines, constraints, goals', icon: '03' },
  { layer: 'Reference', description: 'Research findings, external data, competitive intel', icon: '04' },
] as const

/** Memory visual: four layer rows with retrieval indicator */
function MemoryVisual() {
  return (
    <div className='flex h-full flex-col justify-center gap-1.5 lg:gap-2'>
      {MEMORY_LAYERS.map((mem) => (
        <div key={mem.layer} className='flex items-start gap-2.5 rounded-lg border border-[#F0F0F0] bg-white px-3 py-2 lg:gap-3 lg:px-4 lg:py-3'>
          <span className='mt-0.5 font-mono text-[10px] text-[#CCC]'>{mem.icon}</span>
          <div className='flex flex-col gap-0.5'>
            <span className='font-season text-[12px] font-medium text-[#1D1D1D] lg:text-[13px]'>{mem.layer}</span>
            <span className='font-season text-[10px] text-[#999] leading-[140%] lg:text-[11px]'>{mem.description}</span>
          </div>
        </div>
      ))}
      <div className='mt-0.5 rounded-lg border border-dashed border-[#E0E0E0] bg-[#FAFAFA] px-3 py-2 lg:mt-1 lg:px-4 lg:py-2.5'>
        <div className='flex items-center gap-2'>
          <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='#BBB' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/></svg>
          <span className='font-season text-[10px] text-[#BBB] lg:text-[11px]'>Top 5 entries retrieved per turn via Sonnet</span>
        </div>
      </div>
    </div>
  )
}

const INTEGRATION_ITEMS = [
  { name: 'Slack', logo: '/landing/integrations/slack.png' },
  { name: 'Make', logo: '/landing/integrations/make.png' },
  { name: 'Figma', logo: '/landing/integrations/figma.png' },
  { name: 'Linear', logo: '/landing/integrations/linear.png' },
  { name: 'Stripe', logo: '/landing/integrations/stripe.png' },
  { name: 'Vercel', logo: '/landing/integrations/vercel.png' },
  { name: 'Supabase', logo: '/landing/integrations/supabase.png' },
  { name: 'Sentry', logo: '/landing/integrations/sentry.png' },
  { name: 'Salesforce', logo: '/landing/integrations/salesforce.png' },
  { name: 'Intercom', logo: '/landing/integrations/intercom.png' },
  { name: 'Miro', logo: '/landing/integrations/miro.png' },
  { name: 'Monday', logo: '/landing/integrations/monday.png' },
  { name: 'Asana', logo: '/landing/integrations/asana.png' },
  { name: 'PostHog', logo: '/landing/integrations/posthog.png' },
  { name: 'Cloudflare', logo: '/landing/integrations/cloudflare.png' },
  { name: 'Webflow', logo: '/landing/integrations/webflow.png' },
  { name: 'Reddit', logo: '/landing/integrations/reddit.png' },
  { name: 'Canva', logo: '/landing/integrations/canva.png' },
] as const

/** Integrations visual: logo grid */
function IntegrationsVisual() {
  return (
    <div className='flex h-full flex-col justify-center'>
      <div className='grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:gap-2'>
        {INTEGRATION_ITEMS.map((item) => (
          <div key={item.name} className='flex items-center gap-2 rounded-lg border border-[#F0F0F0] bg-white px-2.5 py-2 lg:gap-2.5 lg:px-3 lg:py-2.5'>
            <Image
              src={item.logo}
              alt={item.name}
              width={20}
              height={20}
              className='h-4 w-4 shrink-0 object-contain lg:h-5 lg:w-5'
            />
            <span className='truncate font-season text-[10px] text-[#666] lg:text-[11px]'>{item.name}</span>
          </div>
        ))}
      </div>
      <div className='mt-2.5 flex items-center gap-2 lg:mt-3'>
        <div className='h-px flex-1 bg-[#F0F0F0]' />
        <span className='font-season text-[9px] text-[#CCC] uppercase tracking-[0.05em] lg:text-[10px]'>50 MCP servers preloaded</span>
        <div className='h-px flex-1 bg-[#F0F0F0]' />
      </div>
    </div>
  )
}

const TAB_VISUALS = [CommandCenterVisual, AgentsVisual, SkillsVisual, MemoryVisual, IntegrationsVisual] as const

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [direction, setDirection] = useState(1)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.9', 'start 0.2'],
  })

  const goToTab = useCallback((index: number) => {
    setDirection(index > activeTab ? 1 : -1)
    setActiveTab(index)
  }, [activeTab])

  /** Auto-scroll removed intentionally. Users control tab navigation manually. */

  const tab = FEATURE_TABS[activeTab]
  const Visual = TAB_VISUALS[activeTab]

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

          {/* Content: left text + right visual */}
          <div className='relative mx-6 mt-10 overflow-hidden lg:mx-[120px] lg:mt-[60px]'>
            <div className='relative h-[520px] sm:h-[500px] lg:h-[340px]'>
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={activeTab}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -60 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className='absolute inset-0 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12'
                >
                  {/* Left: text */}
                  <div className='flex flex-col justify-center'>
                    <span
                      className='mb-4 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 font-season text-[11px] uppercase tracking-[0.05em]'
                      style={{
                        color: (tab as typeof tab & { badgeColor?: string }).badgeColor ?? tab.color,
                        backgroundColor: hexToRgba(
                          (tab as typeof tab & { badgeColor?: string }).badgeColor ?? tab.color,
                          0.08
                        ),
                      }}
                    >
                      <span className='h-1.5 w-1.5 rounded-full' style={{ backgroundColor: (tab as typeof tab & { badgeColor?: string }).badgeColor ?? tab.color }} />
                      {tab.label}
                    </span>

                    <h3 className='font-[430] font-season text-[22px] text-[var(--landing-text-dark)] leading-[120%] tracking-[-0.02em] lg:text-[28px]'>
                      {tab.title}
                    </h3>

                    <p className='mt-3 max-w-[440px] font-[430] font-season text-[color-mix(in_srgb,var(--landing-text-dark)_50%,transparent)] text-[15px] leading-[160%] tracking-[0.01em] lg:text-base'>
                      {tab.description}
                    </p>
                  </div>

                  {/* Right: visual */}
                  <div>
                    <Visual />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className='mt-6 flex items-center justify-center gap-2 lg:mt-10'>
              {FEATURE_TABS.map((t, i) => (
                <button
                  key={i}
                  type='button'
                  aria-label={`Go to ${t.label}`}
                  onClick={() => goToTab(i)}
                  className='relative h-1.5 overflow-hidden rounded-full transition-all duration-300'
                  style={{
                    width: i === activeTab ? 20 : 8,
                    backgroundColor: i === activeTab ? tab.color : '#D4D4D4',
                  }}
                >
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
