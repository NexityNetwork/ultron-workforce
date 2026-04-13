'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  type Persona,
  type FocusArea,
  type QualificationState,
  PERSONA_HEADLINES,
  FEATURED_AGENT,
} from '@/lib/qualification-state'
import FounderFeed from '@/app/(home)/components/content-feed/FounderFeed'

interface ContentFeedProps {
  state: QualificationState
}

export default function ContentFeed({ state }: ContentFeedProps) {
  const persona = state.persona ?? 'founder'
  const headline = PERSONA_HEADLINES[persona]
  const agentKey = state.focus ? `${persona}:${state.focus}` : `${persona}:outbound`
  const agent = FEATURED_AGENT[agentKey] ?? FEATURED_AGENT['founder:outbound']

  return (
    <div className='h-full overflow-y-auto scrollbar-thin'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={`${persona}-${state.focus ?? 'default'}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className='flex flex-col'
        >
          {/* Personalized Hero Banner */}
          <div className='px-6 pt-8 pb-6 lg:px-10 lg:pt-12 lg:pb-8'>
            <div className='flex items-center gap-2 mb-4'>
              <div
                className='h-2 w-2 rounded-full'
                style={{ backgroundColor: agent.color }}
              />
              <span
                className='text-[11px] uppercase tracking-[0.06em] font-medium font-season'
                style={{ color: agent.color }}
              >
                {agent.name} — {agent.domain}
              </span>
            </div>
            <h2 className='text-[28px] lg:text-[36px] font-[430] font-season text-white leading-[110%] tracking-[-0.02em] mb-3'>
              {headline.title}
            </h2>
            <p className='text-[15px] text-[rgba(255,255,255,0.5)] leading-[160%] font-season max-w-[500px]'>
              {headline.subtitle}
            </p>
          </div>

          {/* Persona-specific feed content */}
          {persona === 'founder' && <FounderFeed focus={state.focus} />}
          {persona === 'sales_marketing' && <FounderFeed focus={state.focus} />}
          {persona === 'enterprise' && <FounderFeed focus={state.focus} />}
          {persona === 'investor' && <FounderFeed focus={state.focus} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
