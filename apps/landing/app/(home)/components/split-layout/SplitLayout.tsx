'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SplitLayoutProps {
  isSplit: boolean
  left: React.ReactNode
  right: React.ReactNode
}

export default function SplitLayout({ isSplit, left, right }: SplitLayoutProps) {
  return (
    <div className='relative min-h-[calc(100vh-52px)] w-full'>
      <AnimatePresence mode='wait'>
        {!isSplit ? (
          /* Centered layout — chat only */
          <motion.div
            key='centered'
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='flex min-h-[calc(100vh-52px)] flex-col items-center justify-center px-4'
          >
            <div className='w-full max-w-[800px]'>
              {left}
            </div>
          </motion.div>
        ) : (
          /* Split layout — chat left, content right */
          <motion.div
            key='split'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className='flex h-[calc(100vh-52px)]'
          >
            {/* Left panel: sticky chat — true 50% */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
              className={cn(
                'hidden lg:flex w-1/2 shrink-0 flex-col',
                'border-r border-[rgba(255,255,255,0.06)]',
                'overflow-y-auto px-6 py-6'
              )}
            >
              {left}
            </motion.div>

            {/* Mobile: chat at bottom as sheet */}
            <div className='lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--landing-bg)] border-t border-[rgba(255,255,255,0.08)] px-4 py-3'>
              <div className='max-w-[600px] mx-auto'>
                {left}
              </div>
            </div>

            {/* Right panel: scrollable content feed — true 50% */}
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              className={cn(
                'w-1/2 overflow-y-auto',
                'lg:pb-0 pb-[120px]'
              )}
            >
              {right}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
