'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Persona, FocusArea, QualificationState } from '@/lib/qualification-state'
import SplitLayout from '@/app/(home)/components/split-layout/SplitLayout'
import ContentFeed from '@/app/(home)/components/content-feed/ContentFeed'
import { PERSONA_OPTIONS, FOCUS_OPTIONS, PERSONA_CHAT_MESSAGES } from '@/lib/qualification-state'

const ChatInterface = dynamic(
  () => import('@/components/ChatInterface'),
  {
    ssr: false,
    loading: () => <div className='h-[200px] w-full rounded-2xl bg-[rgba(255,255,255,0.03)]' />,
  }
)

export default function PersonalizedHero() {
  const [state, setState] = useState<QualificationState>({
    persona: null,
    focus: null,
    step: 'idle',
  })

  const isSplit = state.step !== 'idle'

  const handlePersonaSelect = useCallback((persona: Persona) => {
    setState({ persona, focus: null, step: 'persona_selected' })
  }, [])

  const handleFocusSelect = useCallback((focus: FocusArea) => {
    setState(prev => ({ ...prev, focus, step: 'focus_selected' }))
  }, [])

  const personaLabel = state.persona
    ? PERSONA_OPTIONS.find(p => p.id === state.persona)?.label
    : null
  const focusLabel = state.focus && state.persona
    ? FOCUS_OPTIONS[state.persona]?.find(f => f.id === state.focus)?.label
    : null
  const chatMessage = state.persona && state.focus
    ? PERSONA_CHAT_MESSAGES[`${state.persona}:${state.focus}`]
    : null

  const leftPanel = (
    <div className={cn('flex flex-col', isSplit ? 'h-full justify-between' : '')}>
      {/* Hero text — only visible before split */}
      {!isSplit && (
        <div className='relative z-10 flex flex-col items-center gap-3 mb-8'>
          <h1 className='text-balance text-center font-[430] font-season text-[36px] text-white leading-[105%] tracking-[-0.02em] sm:text-[48px] lg:text-[64px]'>
            Hire AI Employees.
            <br />
            Scale GTM without scaling headcount.
          </h1>
          <p className='max-w-[560px] text-balance text-center font-[430] font-season text-[rgba(255,255,255,0.55)] text-base leading-[145%] tracking-[0.02em] lg:text-lg'>
            Your team is buried in tasks humans should not be doing anymore.
            <span className='hidden lg:inline'>
              {' '}Delegate 50% of GTM work to AI Agents within 6 months.
            </span>
          </p>
        </div>
      )}

      {/* Conversation context — visible after split */}
      {isSplit && (
        <div className='mb-4 flex flex-col gap-2.5'>
          {personaLabel && (
            <div className='flex justify-end'>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='rounded-xl bg-[rgba(255,255,255,0.08)] px-3 py-2 text-[13px] text-white font-body'
              >
                {personaLabel}
              </motion.div>
            </div>
          )}
          {focusLabel && (
            <div className='flex justify-end'>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='rounded-xl bg-[rgba(255,255,255,0.08)] px-3 py-2 text-[13px] text-white font-body'
              >
                {focusLabel}
              </motion.div>
            </div>
          )}
          {chatMessage && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className='text-[13px] text-[rgba(255,255,255,0.6)] leading-[165%] font-body'
            >
              {chatMessage}
            </motion.p>
          )}
          {state.step === 'persona_selected' && state.persona && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className='mt-2'
            >
              <p className='text-[14px] text-white leading-relaxed font-body mb-3'>
                What do you need most right now?
              </p>
              <div className='flex flex-wrap gap-2'>
                {FOCUS_OPTIONS[state.persona].map((option, i) => (
                  <motion.button
                    key={option.id}
                    type='button'
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.2 }}
                    onClick={() => handleFocusSelect(option.id)}
                    className={cn(
                      'rounded-lg border border-[rgba(255,255,255,0.1)] px-3.5 py-2',
                      'bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.2)]',
                      'text-[13px] text-white font-body font-medium transition-all duration-200 cursor-pointer'
                    )}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Video frame — sits directly above the chatbox, same width */}
      {!isSplit && (
        <div className='relative mb-4 w-full overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)]' style={{ aspectRatio: '16/9' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className='absolute inset-0 h-full w-full object-cover'
            src='/hero-bg.mp4'
          />
        </div>
      )}

      {/* ChatInterface — always present */}
      <div>
        <ChatInterface onPersonaSelect={handlePersonaSelect} showPersonaPills={state.step === 'idle'} />
      </div>
    </div>
  )

  const rightPanel = <ContentFeed state={state} />

  return (
    <section
      id='hero'
      aria-labelledby='hero-heading'
      className='relative overflow-hidden bg-[var(--landing-bg)]'
    >
      <h1 id='hero-heading' className='sr-only'>
        Ultron — Hire AI Employees. Scale GTM without scaling headcount.
      </h1>
      <SplitLayout isSplit={isSplit} left={leftPanel} right={rightPanel} />
    </section>
  )
}
