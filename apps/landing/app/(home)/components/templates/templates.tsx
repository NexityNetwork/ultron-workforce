'use client'

import { useRef, useState } from 'react'
import { Badge } from '@/components/emcn'
import { TEMPLATE_WORKFLOWS } from '@/app/(home)/components/templates/template-workflows'

function hexToRgba(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

/** First 8 templates shown in the grid */
const VISIBLE_TEMPLATES = TEMPLATE_WORKFLOWS.slice(0, 8)

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

/**
 * Abstract miniature previews for each canvas type.
 * These are purely decorative shapes that communicate the type of canvas.
 */

function MetricsDashboardPreview({ color }: { color: string }) {
  return (
    <div className='flex h-full flex-col gap-2 p-3'>
      <div className='flex gap-1.5'>
        {[0.9, 0.6, 0.4].map((w, i) => (
          <div key={i} className='flex-1 rounded-[4px] bg-white/[0.04] p-2'>
            <div className='mb-1.5 h-1 w-8 rounded-full bg-white/10' />
            <div className='h-2.5 w-12 rounded-sm bg-white/20' />
          </div>
        ))}
      </div>
      <div className='flex-1 rounded-[4px] bg-white/[0.04] p-2 pt-3'>
        <svg viewBox='0 0 200 60' className='h-full w-full' preserveAspectRatio='none'>
          <defs>
            <linearGradient id='areaFill' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor={color} stopOpacity='0.15' />
              <stop offset='100%' stopColor={color} stopOpacity='0' />
            </linearGradient>
          </defs>
          <path d='M0,50 Q30,45 60,38 T120,20 T200,8' fill='none' stroke={color} strokeWidth='1.5' opacity='0.6' />
          <path d='M0,50 Q30,45 60,38 T120,20 T200,8 V60 H0 Z' fill='url(#areaFill)' />
        </svg>
      </div>
    </div>
  )
}

function RadarChartPreview({ color }: { color: string }) {
  return (
    <div className='flex h-full items-center justify-center p-3'>
      <svg viewBox='0 0 100 100' className='h-[80%] w-[80%]'>
        {/* Radar rings */}
        {[40, 30, 20].map((r) => (
          <polygon
            key={r}
            points={Array.from({ length: 6 }, (_, i) => {
              const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
              return `${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`
            }).join(' ')}
            fill='none'
            stroke='rgba(255,255,255,0.06)'
            strokeWidth='0.5'
          />
        ))}
        {/* Data shape */}
        <polygon
          points='50,15 82,32 78,68 50,82 22,65 25,30'
          fill={hexToRgba(color, 0.1)}
          stroke={color}
          strokeWidth='1'
          opacity='0.6'
        />
        {/* Dots */}
        {['50,15', '82,32', '78,68', '50,82', '22,65', '25,30'].map((p, i) => (
          <circle key={i} cx={p.split(',')[0]} cy={p.split(',')[1]} r='2' fill={color} opacity='0.7' />
        ))}
      </svg>
    </div>
  )
}

function SequencePreview({ color }: { color: string }) {
  return (
    <div className='flex h-full flex-col gap-1.5 p-3'>
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className='flex items-center gap-2 rounded-[4px] bg-white/[0.04] px-2.5 py-2'>
          <div
            className='flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold'
            style={{ backgroundColor: hexToRgba(color, 0.15), color }}
          >
            {step}
          </div>
          <div className='flex-1'>
            <div className='h-1 rounded-full bg-white/15' style={{ width: `${60 + step * 8}%` }} />
          </div>
          <div className='h-1 w-6 rounded-full bg-white/8' />
        </div>
      ))}
    </div>
  )
}

function KanbanPreview({ color }: { color: string }) {
  const cols = [
    { cards: 2, label: 'New' },
    { cards: 2, label: 'Active' },
    { cards: 1, label: 'Done' },
    { cards: 1, label: 'Won' },
  ]
  return (
    <div className='flex h-full gap-1.5 p-3'>
      {cols.map((col, ci) => (
        <div key={ci} className='flex flex-1 flex-col gap-1'>
          <div className='mb-0.5 h-1 w-8 rounded-full bg-white/10' />
          {Array.from({ length: col.cards }, (_, i) => (
            <div key={i} className='rounded-[3px] bg-white/[0.05] p-1.5'>
              <div className='mb-1 h-1 w-full rounded-full bg-white/12' />
              <div className='h-1 w-2/3 rounded-full bg-white/6' />
              {ci === 0 && i === 0 && (
                <div className='mt-1 h-1 w-4 rounded-full' style={{ backgroundColor: hexToRgba(color, 0.4) }} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function TextCardsPreview({ color }: { color: string }) {
  return (
    <div className='flex h-full flex-col gap-1.5 p-3'>
      <div className='flex gap-1.5'>
        <div className='flex-1 rounded-[4px] bg-white/[0.04] p-2'>
          <div className='mb-1.5 h-1 w-10 rounded-full' style={{ backgroundColor: hexToRgba(color, 0.3) }} />
          <div className='space-y-1'>
            <div className='h-1 w-full rounded-full bg-white/10' />
            <div className='h-1 w-4/5 rounded-full bg-white/8' />
          </div>
        </div>
        <div className='flex-1 rounded-[4px] bg-white/[0.04] p-2'>
          <div className='mb-1.5 h-1 w-8 rounded-full bg-white/15' />
          <div className='space-y-1'>
            <div className='h-1 w-full rounded-full bg-white/10' />
            <div className='h-1 w-3/5 rounded-full bg-white/8' />
          </div>
        </div>
      </div>
      <div className='flex-1 rounded-[4px] bg-white/[0.04] p-2'>
        <div className='mb-1.5 flex items-center gap-1.5'>
          <div className='h-1 w-6 rounded-full' style={{ backgroundColor: hexToRgba(color, 0.3) }} />
          <div className='h-1 w-6 rounded-full bg-white/10' />
        </div>
        <div className='space-y-1'>
          <div className='h-1 w-full rounded-full bg-white/10' />
          <div className='h-1 w-4/5 rounded-full bg-white/8' />
          <div className='h-1 w-3/4 rounded-full bg-white/6' />
        </div>
      </div>
    </div>
  )
}

function ChecklistPreview({ color }: { color: string }) {
  const items = [true, true, false, false, false]
  return (
    <div className='flex h-full flex-col gap-1 p-3'>
      {items.map((checked, i) => (
        <div key={i} className='flex items-center gap-2 rounded-[4px] bg-white/[0.04] px-2.5 py-1.5'>
          <div
            className='h-2.5 w-2.5 shrink-0 rounded-[3px] border'
            style={{
              borderColor: checked ? color : 'rgba(255,255,255,0.15)',
              backgroundColor: checked ? hexToRgba(color, 0.3) : 'transparent',
            }}
          />
          <div className='h-1 flex-1 rounded-full' style={{ backgroundColor: checked ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)', width: `${50 + i * 10}%` }} />
          {checked && <div className='h-1 w-5 rounded-full bg-emerald-400/30' />}
        </div>
      ))}
    </div>
  )
}

function LineChartPreview({ color }: { color: string }) {
  return (
    <div className='flex h-full flex-col gap-2 p-3'>
      <div className='flex items-center gap-1.5'>
        <div className='h-1 w-10 rounded-full bg-white/15' />
        <div className='h-1 w-6 rounded-full bg-white/8' />
      </div>
      <div className='flex-1 rounded-[4px] bg-white/[0.04] p-2'>
        <svg viewBox='0 0 200 80' className='h-full w-full' preserveAspectRatio='none'>
          {[20, 40, 60].map((y) => (
            <line key={y} x1='0' y1={y} x2='200' y2={y} stroke='rgba(255,255,255,0.04)' strokeWidth='0.5' />
          ))}
          <polyline
            points='0,65 30,58 60,52 90,40 120,35 150,25 180,18 200,10'
            fill='none'
            stroke={color}
            strokeWidth='1.5'
            opacity='0.6'
          />
          {[
            [0, 65], [30, 58], [60, 52], [90, 40], [120, 35], [150, 25], [180, 18], [200, 10],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r='1.5' fill={color} opacity='0.5' />
          ))}
        </svg>
      </div>
    </div>
  )
}

function SwotGridPreview({ color }: { color: string }) {
  const quadrants = [
    { label: 'S', bg: 'rgba(52,211,153,0.08)', accent: '#34d399' },
    { label: 'W', bg: 'rgba(251,191,36,0.08)', accent: '#fbbf24' },
    { label: 'O', bg: hexToRgba(color, 0.08), accent: color },
    { label: 'T', bg: 'rgba(248,113,113,0.08)', accent: '#f87171' },
  ]
  return (
    <div className='grid h-full grid-cols-2 gap-1.5 p-3'>
      {quadrants.map((q, i) => (
        <div key={i} className='rounded-[4px] p-2' style={{ backgroundColor: q.bg }}>
          <div className='mb-1.5 text-[8px] font-bold' style={{ color: q.accent }}>{q.label}</div>
          <div className='space-y-1'>
            <div className='h-1 w-full rounded-full' style={{ backgroundColor: hexToRgba(q.accent, 0.15) }} />
            <div className='h-1 w-3/4 rounded-full' style={{ backgroundColor: hexToRgba(q.accent, 0.1) }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function TimelinePreview({ color }: { color: string }) {
  return (
    <div className='flex h-full flex-col gap-1.5 p-3 pt-4'>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className='flex items-start gap-2'>
          <div className='flex flex-col items-center'>
            <div
              className='h-2 w-2 shrink-0 rounded-full'
              style={{
                backgroundColor: i === 0 ? color : i === 1 ? color : 'rgba(255,255,255,0.15)',
                opacity: i <= 1 ? 1 : 0.4,
              }}
            />
            {i < 3 && (
              <div className='mt-0.5 h-4 w-[1px]' style={{ backgroundColor: i < 1 ? hexToRgba(color, 0.3) : 'rgba(255,255,255,0.06)' }} />
            )}
          </div>
          <div className='flex-1 pb-1'>
            <div className='h-1 rounded-full bg-white/12' style={{ width: `${50 + i * 12}%` }} />
            <div className='mt-1 h-1 w-8 rounded-full bg-white/6' />
          </div>
        </div>
      ))}
    </div>
  )
}

function ScoreCardPreview({ color }: { color: string }) {
  return (
    <div className='flex h-full flex-col gap-1.5 p-3'>
      <div className='rounded-[4px] bg-white/[0.04] p-2 text-center'>
        <div className='mx-auto mb-1 h-1 w-8 rounded-full bg-white/10' />
        <div className='text-[14px] font-bold' style={{ color }}>87</div>
        <div className='mx-auto mt-0.5 h-1 w-10 rounded-full bg-white/8' />
      </div>
      <div className='flex-1 space-y-1'>
        {[85, 72, 90, 60].map((score, i) => (
          <div key={i} className='flex items-center gap-1.5'>
            <div className='h-1 w-10 rounded-full bg-white/8' />
            <div className='h-1 flex-1 rounded-full bg-white/[0.04] overflow-hidden'>
              <div className='h-full rounded-full' style={{ width: `${score}%`, backgroundColor: hexToRgba(color, 0.4) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Maps canvas type index to preview component */
const PREVIEW_COMPONENTS: Record<number, React.FC<{ color: string }>> = {
  0: MetricsDashboardPreview,  // Revenue Dashboard - metrics_dashboard
  1: RadarChartPreview,        // ICP Builder - radar_chart
  2: SequencePreview,          // Cold Email Campaign - sequence
  3: KanbanPreview,            // Lead Pipeline Tracker - kanban
  4: TextCardsPreview,         // Sales Battlecard - text_cards
  5: ChecklistPreview,         // Outreach Sequence - checklist
  6: LineChartPreview,         // Market Analysis Report - chart (line)
  7: SwotGridPreview,          // SWOT Analysis - swot_grid
  8: TimelinePreview,          // Go-to-Market Plan - timeline
}

function TemplateCard({ workflow, index }: { workflow: typeof TEMPLATE_WORKFLOWS[0]; index: number }) {
  const PreviewComponent = PREVIEW_COMPONENTS[index] ?? ScoreCardPreview

  return (
    <div className='group flex flex-col'>
      <div
        className='relative h-[160px] overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.025] transition-all duration-300 group-hover:border-white/[0.14] group-hover:bg-white/[0.04]'
      >
        <PreviewComponent color={workflow.color} />
        {/* Subtle top accent line */}
        <div
          className='absolute inset-x-0 top-0 h-[1px] opacity-30 transition-opacity duration-300 group-hover:opacity-60'
          style={{ backgroundColor: workflow.color }}
        />
      </div>
      <div className='mt-3 px-0.5'>
        <p className='font-[430] font-season text-[14px] text-white leading-tight'>
          {workflow.name}
        </p>
        <p className='mt-1 font-[430] font-season text-[12px] text-[#F6F6F0]/40 leading-[140%] tracking-[0.02em] line-clamp-2'>
          {workflow.description}
        </p>
      </div>
    </div>
  )
}

function MobileCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = () => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const cardWidth = el.scrollWidth / VISIBLE_TEMPLATES.length
    const idx = Math.round(el.scrollLeft / cardWidth)
    setActiveIndex(Math.min(idx, VISIBLE_TEMPLATES.length - 1))
  }

  return (
    <div className='lg:hidden mt-10'>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className='flex snap-x snap-mandatory overflow-x-auto scrollbar-none'
      >
        {VISIBLE_TEMPLATES.map((workflow, index) => (
          <div
            key={workflow.id}
            className='w-[85%] flex-shrink-0 snap-center px-3 first:pl-5 last:pr-5'
          >
            <TemplateCard workflow={workflow} index={index} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className='flex items-center justify-center gap-1.5 pt-6 pb-4'>
        {VISIBLE_TEMPLATES.map((_, i) => (
          <div
            key={i}
            className='h-1.5 rounded-full transition-all duration-300'
            style={{
              width: i === activeIndex ? 20 : 6,
              backgroundColor: i === activeIndex ? VISIBLE_TEMPLATES[activeIndex].color : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function DesktopGrid() {
  return (
    <div className='mt-14 hidden lg:block px-20'>
      <div className='grid grid-cols-4 gap-5'>
        {VISIBLE_TEMPLATES.map((workflow, index) => (
          <TemplateCard key={workflow.id} workflow={workflow} index={index} />
        ))}
      </div>
    </div>
  )
}

export default function Templates() {
  const activeColor = TEMPLATE_WORKFLOWS[0].color

  return (
    <section id='templates' aria-labelledby='templates-heading' className='mt-10 mb-20'>
      <p className='sr-only'>
        Ultron includes {TEMPLATE_WORKFLOWS.length} business canvases covering revenue tracking,
        customer profiling, outreach, competitive intelligence, pipeline management, sales,
        market analysis, and investor communications. Rendered inline inside your chat interface.
      </p>

      <div className='bg-[var(--landing-bg)]'>
        <DotGrid
          className='overflow-hidden border-[var(--landing-bg-elevated)] border-y bg-[var(--landing-bg)] p-1.5'
          cols={160}
          rows={1}
          gap={6}
        />

        <div className='relative overflow-hidden'>
          <div className='px-5 pt-[60px] lg:px-20 lg:pt-[100px]'>
            <div className='flex flex-col items-start gap-5'>
              <Badge
                variant='blue'
                size='md'
                dot
                className='font-season uppercase tracking-[0.02em] transition-colors duration-200'
                style={{
                  color: activeColor,
                  backgroundColor: hexToRgba(activeColor, 0.1),
                }}
              >
                Canvas
              </Badge>

              <h2
                id='templates-heading'
                className='text-balance font-[430] font-season text-[28px] text-white leading-[100%] tracking-[-0.02em] lg:text-[40px]'
              >
                30 business canvases. Rendered inline.{' '}
                <br className='hidden lg:inline' />
                Ready in seconds.
              </h2>

              <p className='font-[430] font-season text-[#F6F6F0]/50 text-base leading-[150%] tracking-[0.02em] lg:text-lg'>
                Tell Ultron what you need. Get a structured, actionable{' '}
                <br className='hidden lg:inline' />
                canvas inside your chat in seconds.
              </p>
            </div>
          </div>

          {/* Mobile: swipeable carousel, one card at a time */}
          <MobileCarousel />

          {/* Desktop: 4x2 grid */}
          <DesktopGrid />
        </div>
      </div>
    </section>
  )
}
