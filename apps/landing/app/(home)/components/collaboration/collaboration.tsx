'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Badge, ChevronDown } from '@/components/emcn'

interface DotGridProps {
  className?: string
  cols: number
  rows: number
  gap?: number
}

function DotGrid({ className, cols, rows, gap = 0 }: DotGridProps) {
  return (
    <div
      aria-hidden='true'
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap,
        placeItems: 'center',
      }}
    >
      {Array.from({ length: cols * rows }, (_, i) => (
        <div key={i} className='h-[1.5px] w-[1.5px] rounded-full bg-[var(--landing-bg-elevated)]' />
      ))}
    </div>
  )
}

const CURSOR_KEYFRAMES = `
  @keyframes cursorMarcus {
    0% { transform: translate(0, 0); }
    12% { transform: translate(60px, 8px); }
    24% { transform: translate(40px, 50px); }
    36% { transform: translate(-5px, 35px); }
    48% { transform: translate(-8px, -12px); }
    60% { transform: translate(50px, -20px); }
    72% { transform: translate(80px, 18px); }
    84% { transform: translate(25px, 30px); }
    100% { transform: translate(0, 0); }
  }
  @keyframes cursorAlexa {
    0% { transform: translate(0, 0); }
    14% { transform: translate(25px, -20px); }
    28% { transform: translate(-40px, 12px); }
    42% { transform: translate(15px, -28px); }
    57% { transform: translate(-35px, 10px); }
    71% { transform: translate(20px, -16px); }
    85% { transform: translate(-15px, -6px); }
    100% { transform: translate(0, 0); }
  }
  @media (prefers-reduced-motion: reduce) {
    @keyframes cursorMarcus { 0%, 100% { transform: none; } }
    @keyframes cursorAlexa { 0%, 100% { transform: none; } }
  }
`

const CURSOR_ARROW_PATH =
  'M17.135 2.198L12.978 14.821C12.478 16.339 10.275 16.16 10.028 14.581L9.106 8.703C9.01 8.092 8.554 7.599 7.952 7.457L1.591 5.953C0 5.577 0.039 3.299 1.642 2.978L15.39 0.229C16.534 0 17.499 1.09 17.135 2.198Z'

const CURSOR_ARROW_MIRRORED_PATH =
  'M0.365 2.198L4.522 14.821C5.022 16.339 7.225 16.16 7.472 14.58L8.394 8.702C8.49 8.091 8.946 7.599 9.548 7.456L15.909 5.953C17.5 5.577 17.461 3.299 15.857 2.978L2.11 0.228C0.966 0 0.001 1.09 0.365 2.198Z'

function CursorArrow({ fill }: { fill: string }) {
  return (
    <svg width='23.15' height='21.1' viewBox='0 0 17.5 16.4' fill='none'>
      <path d={fill === '#2ABBF8' ? CURSOR_ARROW_PATH : CURSOR_ARROW_MIRRORED_PATH} fill={fill} />
    </svg>
  )
}

function MarcusCursor() {
  return (
    <div
      aria-hidden='true'
      className='pointer-events-none absolute scale-75 md:scale-100'
      style={{
        top: '20%',
        left: '30%',
        animation: 'cursorMarcus 16s ease-in-out infinite',
        willChange: 'transform',
      }}
    >
      <div className='relative h-[37.14px] w-[79.18px]'>
        <div className='absolute top-0 left-[56.02px]'>
          <CursorArrow fill='#2ABBF8' />
        </div>
        <div className='-left-[4px] absolute top-[18px] flex items-center rounded bg-[#2ABBF8] px-[5px] py-[3px] font-[420] font-season text-[var(--landing-text-dark)] text-sm leading-[100%] tracking-[-0.02em]'>
          Marcus
        </div>
      </div>
    </div>
  )
}

function AlexaCursor() {
  return (
    <div
      aria-hidden='true'
      className='pointer-events-none absolute scale-75 md:scale-100'
      style={{
        top: '60%',
        left: '50%',
        animation: 'cursorAlexa 13s ease-in-out infinite',
        willChange: 'transform',
      }}
    >
      <div className='relative h-[35.09px] w-[62.16px]'>
        <div className='absolute top-0 left-0'>
          <CursorArrow fill='#FFCC02' />
        </div>
        <div className='absolute top-4 left-[23px] flex items-center rounded bg-[#FFCC02] px-[5px] py-[3px] font-[420] font-season text-[var(--landing-text-dark)] text-sm leading-[100%] tracking-[-0.02em]'>
          Alexa
        </div>
      </div>
    </div>
  )
}

interface YouCursorProps {
  x: number
  y: number
  visible: boolean
}

function YouCursor({ x, y, visible }: YouCursorProps) {
  if (!visible) return null

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none fixed z-50'
      style={{
        left: x,
        top: y,
        transform: 'translate(-2px, -2px)',
      }}
    >
      <svg width='23.15' height='21.1' viewBox='0 0 17.5 16.4' fill='none'>
        <path d={CURSOR_ARROW_MIRRORED_PATH} fill='#33C482' />
      </svg>
      <div className='absolute top-4 left-[23px] flex items-center rounded bg-[var(--brand-accent)] px-[5px] py-[3px] font-[420] font-season text-[var(--landing-text-dark)] text-sm leading-[100%] tracking-[-0.02em]'>
        You
      </div>
    </div>
  )
}

const CURSOR_LERP_FACTOR = 0.3

export default function Collaboration() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const targetPos = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const animate = () => {
      setCursorPos((prev) => ({
        x: prev.x + (targetPos.current.x - prev.x) * CURSOR_LERP_FACTOR,
        y: prev.y + (targetPos.current.y - prev.y) * CURSOR_LERP_FACTOR,
      }))
      animationRef.current = requestAnimationFrame(animate)
    }

    if (isHovering) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovering])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    targetPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    targetPos.current = { x: e.clientX, y: e.clientY }
    setCursorPos({ x: e.clientX, y: e.clientY })
    setIsHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
  }, [])

  return (
    <section
      ref={sectionRef}
      id='collaboration'
      aria-labelledby='collaboration-heading'
      className='bg-[var(--landing-bg)]'
      style={{ cursor: isHovering ? 'none' : 'auto' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <YouCursor x={cursorPos.x} y={cursorPos.y} visible={isHovering} />
      <style dangerouslySetInnerHTML={{ __html: CURSOR_KEYFRAMES }} />

      <DotGrid
        className='overflow-hidden border-[var(--landing-bg-elevated)] border-y bg-[var(--landing-bg)] p-1.5'
        cols={120}
        rows={1}
        gap={6}
      />

      <div className='relative overflow-hidden'>
        <div className='grid grid-cols-1 md:grid-cols-[auto_1fr]'>
          <div className='flex flex-col items-start gap-3 px-4 pt-[60px] pb-8 sm:gap-4 sm:px-8 md:gap-5 md:px-20 md:pt-[100px]'>
            <Badge
              variant='blue'
              size='md'
              dot
              className='bg-[color-mix(in_srgb,var(--brand-accent)_10%,transparent)] font-season text-[var(--brand-accent)] uppercase tracking-[0.02em]'
            >
              Teams
            </Badge>

            <h2
              id='collaboration-heading'
              className='text-balance font-[430] font-season text-[32px] text-white leading-[100%] tracking-[-0.02em] sm:text-[36px] md:text-[40px]'
            >
              Realtime
              <br />
              collaboration
            </h2>

            <p className='font-[430] font-season text-[#F6F6F0]/50 text-base leading-[150%] tracking-[0.02em] md:text-lg'>
              Grab your team. Build agents together <br className='hidden md:block' />
              in real-time inside your workspace.
            </p>

            <a
              href='https://app.51ultron.com/login'
              target='_blank'
              rel='noopener noreferrer'
              className='group/cta mt-3 inline-flex h-[32px] cursor-none items-center gap-1.5 rounded-[5px] border border-white bg-white px-2.5 font-[430] font-season text-black text-sm transition-colors hover:border-[#E0E0E0] hover:bg-[#E0E0E0]'
            >
              Build together
              <span className='relative h-[10px] w-[10px] shrink-0'>
                <ChevronDown className='-rotate-90 absolute inset-0 h-[10px] w-[10px] transition-opacity duration-150 group-hover/cta:opacity-0' />
                <svg
                  className='absolute inset-0 h-[10px] w-[10px] opacity-0 transition-opacity duration-150 group-hover/cta:opacity-100'
                  viewBox='0 0 10 10'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M1 5H8M5.5 2L8.5 5L5.5 8'
                    stroke='currentColor'
                    strokeWidth='1.33'
                    strokeLinecap='square'
                    strokeLinejoin='miter'
                    fill='none'
                  />
                </svg>
              </span>
            </a>
          </div>

          <figure className='pointer-events-none relative h-[280px] w-full sm:h-[350px] md:h-[600px]'>
            <div className='absolute inset-0 flex items-center justify-center p-3 sm:p-4 md:p-8'>
              <div className='relative flex h-full w-full max-w-[900px] gap-2 sm:gap-3 md:gap-4'>
                {/* Left panel — mock chat */}
                <div className='flex w-[48%] flex-col rounded-lg border border-white/[0.08] bg-white/[0.03] md:w-[45%]'>
                  <div className='flex items-center gap-1.5 border-b border-white/[0.06] px-2.5 py-1.5 sm:gap-2 sm:px-3 sm:py-2 md:px-4 md:py-2.5'>
                    <div className='h-1.5 w-1.5 rounded-full bg-[#33C482] sm:h-2 sm:w-2' />
                    <span className='font-season text-[10px] text-white/60 sm:text-[11px] md:text-xs'>Team Chat</span>
                  </div>
                  <div className='flex flex-1 flex-col gap-2.5 overflow-hidden p-2.5 sm:gap-3 sm:p-3'>
                    <div className='flex items-start gap-1.5 sm:gap-2'>
                      <div className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2ABBF8]/20 font-season text-[7px] text-[#2ABBF8] sm:text-[8px] md:h-6 md:w-6'>M</div>
                      <div className='flex min-w-0 flex-col gap-0.5'>
                        <span className='font-season text-[10px] font-medium text-[#2ABBF8] sm:text-[11px]'>Marcus</span>
                        <div className='rounded-md bg-white/[0.05] px-2 py-1.5 font-season text-[10px] text-white/70 leading-[150%] sm:text-[11px]'>
                          Automate outreach for Q2?
                        </div>
                      </div>
                    </div>
                    <div className='flex items-start gap-1.5 sm:gap-2'>
                      <div className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFCC02]/20 font-season text-[7px] text-[#FFCC02] sm:text-[8px] md:h-6 md:w-6'>A</div>
                      <div className='flex min-w-0 flex-col gap-0.5'>
                        <span className='font-season text-[10px] font-medium text-[#FFCC02] sm:text-[11px]'>Alexa</span>
                        <div className='rounded-md bg-white/[0.05] px-2 py-1.5 font-season text-[10px] text-white/70 leading-[150%] sm:text-[11px]'>
                          On it. Striker is drafting 3 variants.
                        </div>
                      </div>
                    </div>
                    <div className='flex items-start gap-1.5 sm:gap-2'>
                      <div className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#33C482]/20 font-season text-[7px] text-[#33C482] sm:text-[8px] md:h-6 md:w-6'>Y</div>
                      <div className='flex min-w-0 flex-col gap-0.5'>
                        <span className='font-season text-[10px] font-medium text-[#33C482] sm:text-[11px]'>You</span>
                        <div className='rounded-md bg-white/[0.05] px-2 py-1.5 font-season text-[10px] text-white/70 leading-[150%] sm:text-[11px]'>
                          Let&apos;s review before EOD.
                        </div>
                      </div>
                    </div>
                    <div className='mt-auto hidden border-t border-white/[0.06] pt-2 md:block'>
                      <div className='flex items-center rounded-md bg-white/[0.03] px-2 py-1.5'>
                        <span className='font-season text-[11px] text-white/30'>Type a message...</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right panel — agent workflow */}
                <div className='flex w-[52%] flex-col rounded-lg border border-white/[0.08] bg-white/[0.03] md:w-[55%]'>
                  <div className='flex items-center gap-1.5 border-b border-white/[0.06] px-2.5 py-1.5 sm:gap-2 sm:px-3 sm:py-2 md:px-4 md:py-2.5'>
                    <div className='h-1.5 w-1.5 rounded-full bg-[#FA4EDF] sm:h-2 sm:w-2' />
                    <span className='font-season text-[10px] text-white/60 sm:text-[11px] md:text-xs'>Agent Workspace</span>
                  </div>
                  <div className='flex flex-1 flex-col gap-2 overflow-hidden p-2.5 sm:gap-2.5 sm:p-3 md:gap-3'>
                    {/* Active agent card */}
                    <div className='rounded-md border border-[#FA4EDF]/20 bg-[#FA4EDF]/[0.04] p-2 sm:p-2.5 md:p-3'>
                      <div className='flex items-center gap-1.5'>
                        <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-[#FA4EDF]' />
                        <span className='font-season text-[10px] font-medium text-white/80 sm:text-[11px]'>Striker — Outreach</span>
                      </div>
                      <p className='mt-1 font-season text-[9px] text-white/40 leading-[140%] sm:text-[10px]'>Drafting 3 email variants...</p>
                      <div className='mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06] sm:mt-2'>
                        <div className='h-full w-[65%] rounded-full bg-[#FA4EDF]/60' />
                      </div>
                    </div>
                    {/* Completed task */}
                    <div className='rounded-md border border-white/[0.06] bg-white/[0.02] p-2 sm:p-2.5 md:p-3'>
                      <div className='flex items-center gap-1.5'>
                        <svg width='10' height='10' viewBox='0 0 10 10' className='shrink-0 text-[#33C482]'><circle cx='5' cy='5' r='4' fill='none' stroke='currentColor' strokeWidth='1' /><path d='M3 5L4.5 6.5L7 3.5' stroke='currentColor' strokeWidth='1' strokeLinecap='round' strokeLinejoin='round' fill='none' /></svg>
                        <span className='font-season text-[10px] text-white/60 sm:text-[11px]'>Cortex — Research</span>
                      </div>
                      <p className='mt-1 font-season text-[9px] text-white/30 leading-[140%] sm:text-[10px]'>12 insights found.</p>
                    </div>
                    {/* Queued task */}
                    <div className='rounded-md border border-white/[0.06] bg-white/[0.02] p-2 sm:p-2.5 md:p-3'>
                      <div className='flex items-center gap-1.5'>
                        <div className='h-2.5 w-2.5 shrink-0 rounded-full border border-white/20' />
                        <span className='font-season text-[10px] text-white/40 sm:text-[11px]'>Pulse — LinkedIn</span>
                      </div>
                      <p className='mt-1 font-season text-[9px] text-white/25 leading-[140%] sm:text-[10px]'>Queued — waiting on draft</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <MarcusCursor />
            <AlexaCursor />
            <figcaption className='sr-only'>
              Collaboration interface with real-time cursors, shared workspace, and team
              presence indicators
            </figcaption>
          </figure>
        </div>

        <a
          href='https://docs.51ultron.com/'
          target='_blank'
          rel='noopener noreferrer'
          className='relative mx-4 mb-6 flex cursor-none items-center gap-3.5 rounded-[5px] border border-[var(--landing-bg-elevated)] bg-[var(--landing-bg)] px-3 py-2.5 transition-colors hover:border-[var(--landing-border-strong)] hover:bg-[var(--landing-bg-card)] sm:mx-8 md:absolute md:bottom-10 md:left-20 md:z-20 md:mx-0 md:mb-0'
        >
          <div className='flex h-7 w-7 shrink-0 items-center justify-center'>
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' className='text-[#F6F6F0]/50'>
              <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
              <polyline points='14 2 14 8 20 8' />
              <line x1='16' y1='13' x2='8' y2='13' />
              <line x1='16' y1='17' x2='8' y2='17' />
              <line x1='10' y1='9' x2='8' y2='9' />
            </svg>
          </div>
          <div className='flex flex-col gap-0.5'>
            <span className='font-[430] font-season text-[#F6F6F0]/50 text-[12px] uppercase leading-[100%] tracking-[0.08em]'>
              Docs
            </span>
            <span className='font-[430] font-season text-[#F6F6F0] text-sm leading-[125%] tracking-[0.02em]'>
              The five-layer architecture that powers Ultron.
            </span>
          </div>
        </a>
      </div>

      <DotGrid
        className='overflow-hidden border-[var(--landing-bg-elevated)] border-y bg-[var(--landing-bg)] p-1.5'
        cols={120}
        rows={1}
        gap={6}
      />
    </section>
  )
}
