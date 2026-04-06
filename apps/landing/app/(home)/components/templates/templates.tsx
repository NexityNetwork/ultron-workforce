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
 * Rich detail with layered elements for professional depth.
 */

function MetricsDashboardPreview({ color }: { color: string }) {
  return (
    <div className='flex h-full flex-col gap-2 p-3.5'>
      {/* KPI row */}
      <div className='flex gap-2'>
        {[
          { val: '320K', label: 'ARR' },
          { val: '26.7K', label: 'MRR' },
          { val: '38', label: 'Customers' },
        ].map((kpi, i) => (
          <div key={i} className='flex-1 rounded-md border border-white/[0.06] bg-white/[0.03] p-2'>
            <div className='text-[7px] font-medium text-white/30 tracking-wide'>{kpi.label}</div>
            <div className='mt-1 text-[11px] font-semibold text-white/70 tabular-nums'>{kpi.val}</div>
            <div className='mt-1 flex items-center gap-1'>
              <div className='h-[3px] w-[3px] rounded-full bg-emerald-400/60' />
              <div className='h-[3px] w-6 rounded-full bg-emerald-400/20' />
            </div>
          </div>
        ))}
      </div>
      {/* Chart area */}
      <div className='flex-1 rounded-md border border-white/[0.06] bg-white/[0.03] p-2 pt-3'>
        <svg viewBox='0 0 200 55' className='h-full w-full' preserveAspectRatio='none'>
          <defs>
            <linearGradient id='mAreaFill' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor={color} stopOpacity='0.2' />
              <stop offset='100%' stopColor={color} stopOpacity='0' />
            </linearGradient>
          </defs>
          {[18, 32, 46].map((y) => (
            <line key={y} x1='0' y1={y} x2='200' y2={y} stroke='rgba(255,255,255,0.03)' strokeWidth='0.5' />
          ))}
          <path d='M0,48 C20,46 40,42 60,38 C80,34 100,28 120,22 C140,16 160,12 180,9 L200,6' fill='none' stroke={color} strokeWidth='1.5' opacity='0.7' />
          <path d='M0,48 C20,46 40,42 60,38 C80,34 100,28 120,22 C140,16 160,12 180,9 L200,6 V55 H0 Z' fill='url(#mAreaFill)' />
          {[
            [0, 48], [40, 42], [80, 34], [120, 22], [160, 12], [200, 6],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r='1.5' fill={color} opacity='0.5' />
          ))}
        </svg>
      </div>
    </div>
  )
}

function RadarChartPreview({ color }: { color: string }) {
  return (
    <div className='flex h-full items-center justify-center p-3.5'>
      <div className='relative flex h-full w-full items-center justify-center'>
        {/* Axis labels */}
        {['Industry', 'Size', 'Revenue', 'Growth', 'Tech', 'Region'].map((label, i) => {
          const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
          const x = 50 + 48 * Math.cos(angle)
          const y = 50 + 48 * Math.sin(angle)
          return (
            <div
              key={i}
              className='absolute text-[6px] font-medium text-white/25'
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {label}
            </div>
          )
        })}
        <svg viewBox='0 0 100 100' className='h-[75%] w-[75%]'>
          {/* Radar rings */}
          {[40, 30, 20, 10].map((r) => (
            <polygon
              key={r}
              points={Array.from({ length: 6 }, (_, i) => {
                const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
                return `${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`
              }).join(' ')}
              fill='none'
              stroke='rgba(255,255,255,0.05)'
              strokeWidth='0.5'
            />
          ))}
          {/* Axis lines */}
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
            return (
              <line
                key={i}
                x1='50'
                y1='50'
                x2={50 + 40 * Math.cos(angle)}
                y2={50 + 40 * Math.sin(angle)}
                stroke='rgba(255,255,255,0.04)'
                strokeWidth='0.5'
              />
            )
          })}
          {/* Data shape */}
          <polygon
            points='50,14 83,30 80,70 50,84 20,67 23,28'
            fill={hexToRgba(color, 0.12)}
            stroke={color}
            strokeWidth='1'
            opacity='0.7'
          />
          {/* Dots */}
          {[
            [50, 14], [83, 30], [80, 70], [50, 84], [20, 67], [23, 28],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r='2' fill={color} opacity='0.8' />
          ))}
          {/* Center score */}
          <text x='50' y='52' textAnchor='middle' fill='white' opacity='0.5' fontSize='8' fontWeight='600'>92</text>
        </svg>
      </div>
    </div>
  )
}

function SequencePreview({ color }: { color: string }) {
  const steps = [
    { label: 'Introduction email', tag: 'Day 1', sent: true },
    { label: 'Follow-up with value prop', tag: 'Day 3', sent: true },
    { label: 'Case study share', tag: 'Day 5', sent: false },
    { label: 'Final check-in', tag: 'Day 8', sent: false },
  ]
  return (
    <div className='flex h-full flex-col gap-1.5 p-3.5'>
      {/* Header bar */}
      <div className='mb-0.5 flex items-center justify-between'>
        <div className='flex items-center gap-1.5'>
          <div className='h-1.5 w-1.5 rounded-full' style={{ backgroundColor: color }} />
          <div className='text-[7px] font-semibold text-white/35 uppercase tracking-wider'>Sequence</div>
        </div>
        <div className='text-[7px] text-white/20'>4 steps</div>
      </div>
      {steps.map((step, i) => (
        <div key={i} className='flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-[7px]'>
          <div
            className='flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[7px] font-bold'
            style={{
              backgroundColor: step.sent ? hexToRgba(color, 0.2) : 'rgba(255,255,255,0.05)',
              color: step.sent ? color : 'rgba(255,255,255,0.3)',
            }}
          >
            {i + 1}
          </div>
          <div className='flex-1 min-w-0'>
            <div className='h-[3px] rounded-full' style={{
              width: `${65 + i * 8}%`,
              backgroundColor: step.sent ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
            }} />
          </div>
          <div
            className='shrink-0 rounded-sm px-1 py-[1px] text-[6px] font-medium'
            style={{
              backgroundColor: step.sent ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)',
              color: step.sent ? '#34d399' : 'rgba(255,255,255,0.25)',
            }}
          >
            {step.tag}
          </div>
        </div>
      ))}
    </div>
  )
}

function KanbanPreview({ color }: { color: string }) {
  const cols = [
    { label: 'New', count: 2, cards: [{ w: '90%', tag: true }, { w: '75%', tag: false }] },
    { label: 'Contacted', count: 2, cards: [{ w: '85%', tag: false }, { w: '70%', tag: true }] },
    { label: 'Qualified', count: 1, cards: [{ w: '80%', tag: true }] },
    { label: 'Won', count: 1, cards: [{ w: '65%', tag: false }] },
  ]
  return (
    <div className='flex h-full gap-1.5 p-3.5'>
      {cols.map((col, ci) => (
        <div key={ci} className='flex flex-1 flex-col gap-1'>
          <div className='mb-1 flex items-center justify-between px-0.5'>
            <div className='text-[7px] font-semibold text-white/35 uppercase tracking-wider'>{col.label}</div>
            <div className='flex h-3 w-3 items-center justify-center rounded-full bg-white/[0.06] text-[6px] text-white/25'>{col.count}</div>
          </div>
          {col.cards.map((card, i) => (
            <div key={i} className='rounded-md border border-white/[0.06] bg-white/[0.04] p-1.5'>
              <div className='mb-1 h-[3px] rounded-full bg-white/15' style={{ width: card.w }} />
              <div className='mb-1 h-[3px] w-2/3 rounded-full bg-white/7' />
              <div className='flex items-center gap-1'>
                {card.tag && (
                  <div className='h-[3px] w-5 rounded-full' style={{ backgroundColor: hexToRgba(color, 0.35) }} />
                )}
                <div className='h-[3px] w-3 rounded-full bg-white/5' />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function TextCardsPreview({ color }: { color: string }) {
  return (
    <div className='flex h-full flex-col gap-1.5 p-3.5'>
      {/* Header */}
      <div className='mb-0.5 flex items-center gap-1.5'>
        <div className='h-1.5 w-1.5 rounded-full' style={{ backgroundColor: color }} />
        <div className='text-[7px] font-semibold text-white/35 uppercase tracking-wider'>Battlecard</div>
      </div>
      {/* Two columns */}
      <div className='flex gap-1.5 flex-1'>
        <div className='flex-1 rounded-md border border-white/[0.06] bg-white/[0.03] p-2'>
          <div className='mb-2 flex items-center gap-1'>
            <div className='h-[3px] w-2 rounded-full' style={{ backgroundColor: hexToRgba(color, 0.4) }} />
            <div className='h-[3px] w-10 rounded-full bg-white/15' />
          </div>
          <div className='space-y-[3px]'>
            <div className='h-[3px] w-full rounded-full bg-white/10' />
            <div className='h-[3px] w-[90%] rounded-full bg-white/8' />
            <div className='h-[3px] w-[75%] rounded-full bg-white/6' />
          </div>
          <div className='mt-2.5 h-px bg-white/[0.05]' />
          <div className='mt-2 space-y-[3px]'>
            <div className='h-[3px] w-full rounded-full bg-white/8' />
            <div className='h-[3px] w-[85%] rounded-full bg-white/6' />
          </div>
        </div>
        <div className='flex-1 rounded-md border border-white/[0.06] bg-white/[0.03] p-2'>
          <div className='mb-2 flex items-center gap-1'>
            <div className='h-[3px] w-2 rounded-full bg-emerald-400/30' />
            <div className='h-[3px] w-8 rounded-full bg-white/15' />
          </div>
          <div className='space-y-[3px]'>
            <div className='h-[3px] w-[95%] rounded-full bg-white/10' />
            <div className='h-[3px] w-full rounded-full bg-white/8' />
            <div className='h-[3px] w-[80%] rounded-full bg-white/6' />
          </div>
          <div className='mt-2.5 h-px bg-white/[0.05]' />
          <div className='mt-2 space-y-[3px]'>
            <div className='h-[3px] w-[90%] rounded-full bg-white/8' />
            <div className='h-[3px] w-[70%] rounded-full bg-white/6' />
          </div>
        </div>
      </div>
      {/* Bottom row */}
      <div className='rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1.5'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1.5'>
            <div className='h-[3px] w-2 rounded-full bg-amber-400/30' />
            <div className='h-[3px] w-14 rounded-full bg-white/12' />
          </div>
          <div className='flex gap-0.5'>
            {[0.3, 0.5, 0.8].map((o, i) => (
              <div key={i} className='h-1.5 w-1.5 rounded-full' style={{ backgroundColor: hexToRgba(color, o) }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ChecklistPreview({ color }: { color: string }) {
  const items = [
    { done: true, width: '80%' },
    { done: true, width: '65%' },
    { done: false, width: '90%' },
    { done: false, width: '72%' },
    { done: false, width: '85%' },
  ]
  return (
    <div className='flex h-full flex-col gap-1 p-3.5'>
      {/* Header */}
      <div className='mb-1 flex items-center justify-between'>
        <div className='flex items-center gap-1.5'>
          <div className='h-1.5 w-1.5 rounded-full' style={{ backgroundColor: color }} />
          <div className='text-[7px] font-semibold text-white/35 uppercase tracking-wider'>Outreach</div>
        </div>
        <div className='text-[7px] text-white/20'>2/5</div>
      </div>
      {/* Progress bar */}
      <div className='mb-1 h-1 w-full rounded-full bg-white/[0.05] overflow-hidden'>
        <div className='h-full rounded-full' style={{ width: '40%', backgroundColor: hexToRgba(color, 0.5) }} />
      </div>
      {items.map((item, i) => (
        <div key={i} className='flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-[6px]'>
          <div
            className='h-2.5 w-2.5 shrink-0 rounded-[3px] border'
            style={{
              borderColor: item.done ? color : 'rgba(255,255,255,0.12)',
              backgroundColor: item.done ? hexToRgba(color, 0.25) : 'transparent',
            }}
          >
            {item.done && (
              <svg viewBox='0 0 10 10' className='h-full w-full'>
                <path d='M2.5,5.5 L4.5,7.5 L7.5,3' fill='none' stroke={color} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            )}
          </div>
          <div className='h-[3px] flex-1 rounded-full' style={{
            backgroundColor: item.done ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)',
            width: item.width,
            textDecoration: item.done ? 'line-through' : 'none',
          }} />
          {item.done && <div className='h-[3px] w-4 rounded-full bg-emerald-400/25' />}
          {!item.done && <div className='h-[3px] w-3 rounded-full bg-white/[0.04]' />}
        </div>
      ))}
    </div>
  )
}

function LineChartPreview({ color }: { color: string }) {
  return (
    <div className='flex h-full flex-col gap-2 p-3.5'>
      {/* Header with legend */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1.5'>
          <div className='h-1.5 w-1.5 rounded-full' style={{ backgroundColor: color }} />
          <div className='text-[7px] font-semibold text-white/35 uppercase tracking-wider'>Market Trend</div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1'>
            <div className='h-[3px] w-3 rounded-full' style={{ backgroundColor: color }} />
            <div className='text-[6px] text-white/20'>TAM</div>
          </div>
          <div className='flex items-center gap-1'>
            <div className='h-[3px] w-3 rounded-full bg-emerald-400/50' />
            <div className='text-[6px] text-white/20'>SAM</div>
          </div>
        </div>
      </div>
      {/* Chart */}
      <div className='flex-1 rounded-md border border-white/[0.06] bg-white/[0.03] p-2'>
        <svg viewBox='0 0 200 70' className='h-full w-full' preserveAspectRatio='none'>
          <defs>
            <linearGradient id='lAreaFill' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor={color} stopOpacity='0.12' />
              <stop offset='100%' stopColor={color} stopOpacity='0' />
            </linearGradient>
          </defs>
          {/* Y-axis labels */}
          {[15, 35, 55].map((y) => (
            <g key={y}>
              <line x1='0' y1={y} x2='200' y2={y} stroke='rgba(255,255,255,0.035)' strokeWidth='0.5' />
            </g>
          ))}
          {/* Primary line with area */}
          <path d='M0,60 C25,56 50,50 75,42 C100,34 125,26 150,18 C170,12 190,8 200,5' fill='none' stroke={color} strokeWidth='1.5' opacity='0.7' />
          <path d='M0,60 C25,56 50,50 75,42 C100,34 125,26 150,18 C170,12 190,8 200,5 V70 H0 Z' fill='url(#lAreaFill)' />
          {/* Secondary line */}
          <path d='M0,62 C25,60 50,56 75,52 C100,46 125,42 150,38 C170,35 190,33 200,30' fill='none' stroke='#34d399' strokeWidth='1' opacity='0.35' strokeDasharray='3 2' />
          {/* Dots on primary */}
          {[
            [0, 60], [50, 50], [100, 34], [150, 18], [200, 5],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r='1.5' fill={color} opacity='0.6' />
          ))}
        </svg>
      </div>
      {/* Bottom stats */}
      <div className='flex gap-2'>
        {[
          { label: 'Size', value: '$4.2B' },
          { label: 'CAGR', value: '18.3%' },
        ].map((stat, i) => (
          <div key={i} className='flex-1 rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1'>
            <div className='text-[6px] text-white/25'>{stat.label}</div>
            <div className='text-[8px] font-semibold text-white/50 tabular-nums'>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SwotGridPreview({ color }: { color: string }) {
  const quadrants = [
    { label: 'Strengths', short: 'S', bg: 'rgba(52,211,153,0.06)', accent: '#34d399', items: 3 },
    { label: 'Weaknesses', short: 'W', bg: 'rgba(251,191,36,0.06)', accent: '#fbbf24', items: 2 },
    { label: 'Opportunities', short: 'O', bg: hexToRgba(color, 0.06), accent: color, items: 3 },
    { label: 'Threats', short: 'T', bg: 'rgba(248,113,113,0.06)', accent: '#f87171', items: 2 },
  ]
  return (
    <div className='flex h-full flex-col gap-1.5 p-3.5'>
      {/* Header */}
      <div className='mb-0.5 flex items-center gap-1.5'>
        <div className='h-1.5 w-1.5 rounded-full' style={{ backgroundColor: color }} />
        <div className='text-[7px] font-semibold text-white/35 uppercase tracking-wider'>SWOT</div>
      </div>
      <div className='grid flex-1 grid-cols-2 gap-1.5'>
        {quadrants.map((q, i) => (
          <div key={i} className='rounded-md border border-white/[0.05] p-2' style={{ backgroundColor: q.bg }}>
            <div className='mb-1.5 flex items-center gap-1'>
              <div className='text-[8px] font-bold' style={{ color: q.accent }}>{q.short}</div>
              <div className='text-[6px] font-medium text-white/20'>{q.label}</div>
            </div>
            <div className='space-y-[3px]'>
              {Array.from({ length: q.items }, (_, j) => (
                <div key={j} className='flex items-center gap-1'>
                  <div className='h-[3px] w-[3px] rounded-full' style={{ backgroundColor: hexToRgba(q.accent, 0.4) }} />
                  <div
                    className='h-[3px] rounded-full'
                    style={{
                      width: `${55 + j * 15}%`,
                      backgroundColor: hexToRgba(q.accent, 0.12),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TimelinePreview({ color }: { color: string }) {
  const phases = [
    { label: 'Research', status: 'done' },
    { label: 'Strategy', status: 'done' },
    { label: 'Launch', status: 'active' },
    { label: 'Scale', status: 'upcoming' },
  ]
  return (
    <div className='flex h-full flex-col gap-1.5 p-3.5'>
      {/* Header */}
      <div className='mb-0.5 flex items-center justify-between'>
        <div className='flex items-center gap-1.5'>
          <div className='h-1.5 w-1.5 rounded-full' style={{ backgroundColor: color }} />
          <div className='text-[7px] font-semibold text-white/35 uppercase tracking-wider'>GTM Plan</div>
        </div>
        <div className='text-[7px] text-white/20'>Q2 2026</div>
      </div>
      {/* Timeline items */}
      {phases.map((phase, i) => {
        const isDone = phase.status === 'done'
        const isActive = phase.status === 'active'
        return (
          <div key={i} className='flex items-stretch gap-2.5'>
            <div className='flex w-3 flex-col items-center'>
              <div
                className='h-2.5 w-2.5 shrink-0 rounded-full border'
                style={{
                  borderColor: isDone ? '#34d399' : isActive ? color : 'rgba(255,255,255,0.12)',
                  backgroundColor: isDone ? 'rgba(52,211,153,0.3)' : isActive ? hexToRgba(color, 0.3) : 'transparent',
                }}
              >
                {isDone && (
                  <svg viewBox='0 0 10 10' className='h-full w-full'>
                    <path d='M2.5,5.5 L4.5,7 L7.5,3.5' fill='none' stroke='#34d399' strokeWidth='1.2' strokeLinecap='round' />
                  </svg>
                )}
              </div>
              {i < phases.length - 1 && (
                <div className='mt-0.5 w-[1px] flex-1' style={{
                  backgroundColor: isDone ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)',
                }} />
              )}
            </div>
            <div className='flex-1 rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-[6px] mb-0.5'>
              <div className='flex items-center justify-between'>
                <div className='h-[3px] rounded-full' style={{
                  width: `${50 + i * 12}%`,
                  backgroundColor: isDone ? 'rgba(255,255,255,0.15)' : isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
                }} />
                {isActive && (
                  <div className='h-[3px] w-3 rounded-full' style={{ backgroundColor: hexToRgba(color, 0.4) }} />
                )}
              </div>
              <div className='mt-1 h-[3px] w-8 rounded-full bg-white/[0.05]' />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ScoreCardPreview({ color }: { color: string }) {
  return (
    <div className='flex h-full flex-col gap-1.5 p-3.5'>
      <div className='rounded-md border border-white/[0.06] bg-white/[0.03] p-2 text-center'>
        <div className='text-[6px] font-medium text-white/25 uppercase tracking-wider'>Overall Score</div>
        <div className='mt-0.5 text-[16px] font-bold tabular-nums' style={{ color }}>87</div>
        <div className='mx-auto mt-0.5 h-1 w-12 rounded-full bg-white/8' />
      </div>
      <div className='flex-1 space-y-1'>
        {[
          { label: 'Readiness', score: 85 },
          { label: 'Market Fit', score: 72 },
          { label: 'Traction', score: 90 },
          { label: 'Team', score: 60 },
        ].map((item, i) => (
          <div key={i} className='flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1'>
            <div className='h-[3px] w-8 rounded-full bg-white/8' />
            <div className='h-1 flex-1 rounded-full bg-white/[0.04] overflow-hidden'>
              <div className='h-full rounded-full' style={{ width: `${item.score}%`, backgroundColor: hexToRgba(color, 0.4) }} />
            </div>
            <div className='text-[6px] font-semibold text-white/30 tabular-nums'>{item.score}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Maps canvas type index to preview component */
const PREVIEW_COMPONENTS: Record<number, React.FC<{ color: string }>> = {
  0: MetricsDashboardPreview,
  1: RadarChartPreview,
  2: SequencePreview,
  3: KanbanPreview,
  4: TextCardsPreview,
  5: ChecklistPreview,
  6: LineChartPreview,
  7: SwotGridPreview,
  8: TimelinePreview,
}

function TemplateCard({ workflow, index }: { workflow: typeof TEMPLATE_WORKFLOWS[0]; index: number }) {
  const PreviewComponent = PREVIEW_COMPONENTS[index] ?? ScoreCardPreview

  return (
    <div className='group flex flex-col'>
      <div
        className='relative h-[180px] overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.025] transition-all duration-300 group-hover:border-white/[0.14] group-hover:bg-white/[0.04]'
      >
        <PreviewComponent color={workflow.color} />
        {/* Top accent line */}
        <div
          className='absolute inset-x-0 top-0 h-[1px] opacity-30 transition-opacity duration-300 group-hover:opacity-60'
          style={{ backgroundColor: workflow.color }}
        />
        {/* Inner shadow for depth */}
        <div className='pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]' />
      </div>
      <div className='mt-3 px-0.5'>
        <p className='font-[430] font-season text-[14px] text-white leading-tight'>
          {workflow.name}
        </p>
        <p className='mt-1 font-[430] font-season text-[12px] text-[#F6F6F0]/55 leading-[150%] tracking-[0.02em]'>
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

          <MobileCarousel />
          <DesktopGrid />
        </div>
      </div>
    </section>
  )
}
