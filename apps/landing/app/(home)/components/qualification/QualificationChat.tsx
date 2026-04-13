'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  type Persona,
  type FocusArea,
  type QualificationState,
  PERSONA_OPTIONS,
  FOCUS_OPTIONS,
  PERSONA_CHAT_MESSAGES,
} from '@/lib/qualification-state'
import PersonaSelector from '@/app/(home)/components/qualification/PersonaSelector'
import FocusSelector from '@/app/(home)/components/qualification/FocusSelector'
import ChatInterface from '@/components/ChatInterface'

interface QualificationChatProps {
  state: QualificationState
  onPersonaSelect: (persona: Persona) => void
  onFocusSelect: (focus: FocusArea) => void
  isSplit: boolean
}

export default function QualificationChat({
  state,
  onPersonaSelect,
  onFocusSelect,
  isSplit,
}: QualificationChatProps) {
  const personaLabel = state.persona
    ? PERSONA_OPTIONS.find(p => p.id === state.persona)?.label
    : null
  const focusLabel = state.focus && state.persona
    ? FOCUS_OPTIONS[state.persona]?.find(f => f.id === state.focus)?.label
    : null
  const chatMessage = state.persona && state.focus
    ? PERSONA_CHAT_MESSAGES[`${state.persona}:${state.focus}`]
    : null

  return (
    <div className={cn(
      'flex flex-col h-full',
      isSplit ? 'justify-between' : 'justify-center'
    )}>
      {/* Show qualification context when split */}
      {isSplit && state.step !== 'idle' && (
        <div className='mb-4 flex flex-col gap-2'>
          {/* Conversation history */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='flex flex-col gap-2.5 mb-3'
          >
            {/* Persona answer bubble */}
            {personaLabel && (
              <div className='flex justify-end'>
                <div className='rounded-xl bg-[rgba(255,255,255,0.08)] px-3 py-2 text-[13px] text-white font-body'>
                  {personaLabel}
                </div>
              </div>
            )}

            {/* Focus answer bubble */}
            {focusLabel && (
              <div className='flex justify-end'>
                <div className='rounded-xl bg-[rgba(255,255,255,0.08)] px-3 py-2 text-[13px] text-white font-body'>
                  {focusLabel}
                </div>
              </div>
            )}

            {/* Ultron response */}
            {chatMessage && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className='text-[13px] text-[rgba(255,255,255,0.7)] leading-[160%] font-body max-w-[90%]'
              >
                {chatMessage}
              </motion.div>
            )}
          </motion.div>

          {/* Show focus selector if persona selected but focus not yet */}
          <AnimatePresence mode='wait'>
            {state.step === 'persona_selected' && state.persona && (
              <motion.div
                key='focus-selector'
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <FocusSelector persona={state.persona} onSelect={onFocusSelect} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* The actual ChatInterface */}
      <div>
        <ChatInterface />
      </div>
    </div>
  )
}
