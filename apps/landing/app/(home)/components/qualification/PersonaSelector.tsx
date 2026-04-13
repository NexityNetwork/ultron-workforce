'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type Persona, PERSONA_OPTIONS } from '@/lib/qualification-state'

interface PersonaSelectorProps {
  onSelect: (persona: Persona) => void
}

export default function PersonaSelector({ onSelect }: PersonaSelectorProps) {
  return (
    <div className='flex flex-col gap-3'>
      <p className='text-[14px] text-white leading-relaxed font-body'>
        What brings you to Ultron?
      </p>
      <div className='grid grid-cols-2 gap-2'>
        {PERSONA_OPTIONS.map((option, i) => (
          <motion.button
            key={option.id}
            type='button'
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => onSelect(option.id)}
            className={cn(
              'group flex flex-col items-start gap-1 rounded-xl border border-[rgba(255,255,255,0.1)] px-3.5 py-3',
              'bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.2)]',
              'transition-all duration-200 text-left cursor-pointer'
            )}
          >
            <span className='text-[14px] font-medium text-white leading-none font-body'>
              {option.label}
            </span>
            <span className='text-[11px] text-[rgba(255,255,255,0.4)] leading-none font-body'>
              {option.sublabel}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
