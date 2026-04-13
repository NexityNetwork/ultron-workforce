'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type Persona, type FocusArea, FOCUS_OPTIONS, PERSONA_OPTIONS } from '@/lib/qualification-state'

interface FocusSelectorProps {
  persona: Persona
  onSelect: (focus: FocusArea) => void
}

export default function FocusSelector({ persona, onSelect }: FocusSelectorProps) {
  const options = FOCUS_OPTIONS[persona]
  const personaLabel = PERSONA_OPTIONS.find(p => p.id === persona)?.label ?? persona

  return (
    <div className='flex flex-col gap-3'>
      {/* Show previous answer */}
      <div className='flex justify-end'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className='rounded-xl bg-[rgba(255,255,255,0.08)] px-3 py-2 text-[13px] text-white font-body'
        >
          {personaLabel}
        </motion.div>
      </div>

      {/* Follow-up question */}
      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className='text-[14px] text-white leading-relaxed font-body'
      >
        What do you need most right now?
      </motion.p>

      <div className='flex flex-wrap gap-2'>
        {options.map((option, i) => (
          <motion.button
            key={option.id}
            type='button'
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.06, duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => onSelect(option.id)}
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
    </div>
  )
}
