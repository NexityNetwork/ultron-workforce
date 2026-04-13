'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import type { FocusArea } from '@/lib/qualification-state'

interface FounderFeedProps {
  focus: FocusArea | null
}

// ── Partner components imported directly from their repos ──────────────────
const MiddayFeaturesGrid = dynamic(
() => import('../../../../partners/midday/src/components/sections/features-grid-section').then((m: any) => ({ default: m.FeaturesGridSection })),
  { ssr: false, loading: () => <PartnerSkeleton /> }
)

const MiddayFAQ = dynamic(
() => import('../../../../partners/midday/src/components/sections/faq-section').then((m: any) => ({ default: m.FAQSection })),
  { ssr: false, loading: () => <PartnerSkeleton /> }
)

function PartnerSkeleton() {
  return (
    <div className='animate-pulse px-6 py-8'>
      <div className='h-6 w-48 rounded bg-[rgba(255,255,255,0.06)] mb-4' />
      <div className='h-4 w-72 rounded bg-[rgba(255,255,255,0.04)] mb-2' />
      <div className='h-4 w-60 rounded bg-[rgba(255,255,255,0.04)]' />
    </div>
  )
}

function PartnerBadge({ name, url }: { name: string; url: string }) {
  return (
    <div className='flex items-center gap-2 px-6 pt-6 lg:px-10'>
      <div className='h-1.5 w-1.5 rounded-full bg-[rgba(255,255,255,0.3)]' />
      <span className='text-[10px] uppercase tracking-[0.06em] text-[rgba(255,255,255,0.3)] font-season'>
        Powered by{' '}
        <a href={url} target='_blank' rel='noopener noreferrer' className='underline underline-offset-2 hover:text-[rgba(255,255,255,0.5)] transition-colors'>
          {name}
        </a>
      </span>
    </div>
  )
}

const PROOF_STATS = [
  { label: 'Founders', value: '4,513' },
  { label: 'Tasks completed', value: '367K' },
  { label: 'Saved in labor', value: '$1.9M' },
] as const

const AGENTS = [
  { name: 'Striker', domain: 'Sales execution and outreach', color: '#FA4EDF', status: 'Active' },
  { name: 'Cortex', domain: 'Research and intelligence', color: '#8B5CF6', status: 'Active' },
  { name: 'Pulse', domain: 'Content creation and distribution', color: '#FFCC02', status: 'Active' },
  { name: 'Specter', domain: 'Lead generation and qualification', color: '#2ABBF8', status: 'Active' },
  { name: 'Sentinel', domain: 'Infrastructure and monitoring', color: '#33C482', status: 'Standby' },
] as const

export default function FounderFeed({ focus }: FounderFeedProps) {
  return (
    <div className='flex flex-col'>
      {/* Proof bar */}
      <div className='flex items-center justify-center gap-6 py-5 px-6 border-t border-b border-[rgba(255,255,255,0.06)]'>
        {PROOF_STATS.map((stat, i) => (
          <div key={stat.label} className='flex items-center gap-2'>
            {i > 0 && <div className='h-3 w-px bg-[rgba(255,255,255,0.1)] -ml-3 mr-[-4px]' />}
            <span className='text-[14px] text-white font-mono font-medium'>{stat.value}</span>
            <span className='text-[11px] text-[rgba(255,255,255,0.4)] font-season'>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* The 5 Agents */}
      <div className='px-6 py-8 lg:px-10 border-b border-[rgba(255,255,255,0.06)]'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='h-1.5 w-1.5 rounded-full bg-[#FA4EDF]' />
          <span className='text-[10px] uppercase tracking-[0.06em] font-medium font-season text-[#FA4EDF]'>Your AI Workforce</span>
        </div>
        <h3 className='text-[20px] lg:text-[24px] font-[430] font-season text-white leading-[120%] tracking-[-0.01em] mb-4'>
          Five agents. Zero overlap.
        </h3>
        <div className='flex flex-col gap-2'>
          {AGENTS.map((agent) => (
            <div key={agent.name} className='flex items-center gap-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 py-3'>
              <div className='h-2 w-2 rounded-full' style={{ backgroundColor: agent.color }} />
              <div className='flex flex-col gap-0.5 flex-1'>
                <span className='text-[13px] font-medium text-white font-season'>{agent.name}</span>
                <span className='text-[11px] text-[rgba(255,255,255,0.4)] font-season'>{agent.domain}</span>
              </div>
              <span className='text-[9px] text-[rgba(255,255,255,0.25)] uppercase tracking-[0.05em] font-season'>{agent.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Partner sections: real components from partner repos ── */}

      {/* Midday — Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className='border-b border-[rgba(255,255,255,0.06)]'
      >
        <PartnerBadge name='Midday' url='https://midday.ai' />
        <div className='partner-section-light rounded-xl mx-4 my-4 lg:mx-6 overflow-hidden'>
          <MiddayFeaturesGrid />
        </div>
      </motion.div>

      {/* Midday — FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className='border-b border-[rgba(255,255,255,0.06)]'
      >
        <PartnerBadge name='Midday' url='https://midday.ai' />
        <div className='partner-section-light rounded-xl mx-4 my-4 lg:mx-6 overflow-hidden'>
          <MiddayFAQ />
        </div>
      </motion.div>

      {/* CTA */}
      <div className='px-6 py-10 lg:px-10 text-center'>
        <h3 className='text-[24px] font-[430] font-season text-white leading-[120%] tracking-[-0.01em] mb-3'>
          Ready to hire your AI workforce?
        </h3>
        <p className='text-[14px] text-[rgba(255,255,255,0.5)] font-season mb-6'>
          Start free. Deploy your first agent in under 47 minutes.
        </p>
        <a
          href='https://app.51ultron.com/signup'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center justify-center h-[44px] px-8 rounded-xl bg-white text-black text-[14px] font-medium font-season hover:bg-[#E0E0E0] transition-colors'
        >
          Try Ultron free
        </a>
      </div>
    </div>
  )
}
