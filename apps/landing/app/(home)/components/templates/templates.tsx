'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { Badge, ChevronDown } from '@/components/emcn'
import { TEMPLATE_WORKFLOWS } from '@/app/(home)/components/templates/template-workflows'

function hexToRgba(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

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

/** Simple static preview for a template workflow */
function TemplatePreview({ color, name }: { color: string; name: string }) {
  return (
    <div
      className='flex h-full w-full flex-col items-center justify-center gap-4 p-8'
      style={{ background: `radial-gradient(ellipse at center, ${hexToRgba(color, 0.08)} 0%, transparent 70%)` }}
    >
      <div
        className='flex h-14 w-14 items-center justify-center rounded-xl'
        style={{ backgroundColor: hexToRgba(color, 0.15), border: `1px solid ${hexToRgba(color, 0.3)}` }}
      >
        <div className='h-3 w-3 rounded-full' style={{ backgroundColor: color }} />
      </div>
      <p
        className='text-center font-[430] font-season text-base leading-tight tracking-[-0.01em]'
        style={{ color: hexToRgba(color, 0.9) }}
      >
        {name}
      </p>
      <div className='flex items-center gap-2 opacity-50'>
        <div className='h-px w-8' style={{ backgroundColor: color }} />
        <div className='h-2 w-2 rounded-full' style={{ backgroundColor: color }} />
        <div className='h-px w-8' style={{ backgroundColor: color }} />
        <div className='h-2 w-2 rounded-full' style={{ backgroundColor: color }} />
        <div className='h-px w-8' style={{ backgroundColor: color }} />
      </div>
      <p className='text-center font-[430] font-season text-[#F6F6F0]/40 text-xs leading-[150%] tracking-[0.02em]'>
        Open Sim to preview this template
      </p>
    </div>
  )
}

const TEMPLATES_PANEL_ID = 'templates-panel'

export default function Templates() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPreparingTemplate, setIsPreparingTemplate] = useState(false)

  const activeWorkflow = TEMPLATE_WORKFLOWS[activeIndex]

  const handleUseTemplate = useCallback(async () => {
    if (isPreparingTemplate) return
    setIsPreparingTemplate(true)
    try {
      if (activeWorkflow.seedPath) {
        const response = await fetch(activeWorkflow.seedPath)
        if (response.ok) {
          const workflowJson = await response.text()
          try {
            sessionStorage.setItem(
              'landing-workflow-seed',
              JSON.stringify({
                templateId: activeWorkflow.id,
                workflowName: activeWorkflow.name,
                color: activeWorkflow.color,
                workflowJson,
              })
            )
          } catch {
            // sessionStorage may be unavailable
          }
        }
      }
    } finally {
      setIsPreparingTemplate(false)
      window.location.href = '/signup'
    }
  }, [activeWorkflow, isPreparingTemplate])

  return (
    <section id='templates' aria-labelledby='templates-heading' className='mt-10 mb-20'>
      <p className='sr-only'>
        Sim includes {TEMPLATE_WORKFLOWS.length} pre-built workflow templates covering OCR
        processing, release management, meeting follow-ups, resume scanning, email triage,
        competitor monitoring, social listening, data enrichment, feedback analysis, code review,
        and knowledge base Q&amp;A.
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
                  color: activeWorkflow.color,
                  backgroundColor: hexToRgba(activeWorkflow.color, 0.1),
                }}
              >
                Templates
              </Badge>

              <h2
                id='templates-heading'
                className='text-balance font-[430] font-season text-[28px] text-white leading-[100%] tracking-[-0.02em] lg:text-[40px]'
              >
                Ship your agent in minutes
              </h2>

              <p className='font-[430] font-season text-[#F6F6F0]/50 text-base leading-[150%] tracking-[0.02em] lg:text-lg'>
                Pre-built templates for every use case—pick one, swap{' '}
                <br className='hidden lg:inline' />
                models and tools to fit your stack, and deploy.
              </p>
            </div>
          </div>

          <div className='mt-10 flex border-[var(--landing-bg-elevated)] border-y lg:mt-[73px]'>
            <div className='shrink-0'>
              <DotGrid
                className='h-full w-[24px] overflow-hidden border-[var(--landing-bg-elevated)] border-r p-1 lg:hidden'
                cols={2}
                rows={55}
                gap={4}
              />
              <DotGrid
                className='hidden h-full w-[80px] overflow-hidden border-[var(--landing-bg-elevated)] border-r p-1.5 lg:block'
                cols={8}
                rows={55}
                gap={6}
              />
            </div>

            <div className='flex min-w-0 flex-1 flex-col lg:flex-row'>
              <div
                role='tablist'
                aria-label='Workflow templates'
                className='flex w-full shrink-0 flex-col border-[var(--landing-bg-elevated)] lg:w-[300px] lg:border-r'
              >
                {TEMPLATE_WORKFLOWS.map((workflow, index) => {
                  const isActive = index === activeIndex
                  return (
                    <button
                      key={workflow.id}
                      id={`template-tab-${index}`}
                      type='button'
                      role='tab'
                      aria-selected={isActive}
                      aria-controls={TEMPLATES_PANEL_ID}
                      onClick={() => setActiveIndex(index)}
                      className={`relative w-full px-3 py-2.5 text-left transition-colors ${
                        isActive
                          ? 'bg-[var(--landing-bg-card)]'
                          : 'hover:bg-[color-mix(in_srgb,var(--landing-bg-card)_50%,transparent)]'
                      } ${index < TEMPLATE_WORKFLOWS.length - 1 ? 'border-[var(--landing-bg-elevated)] border-b' : ''}`}
                    >
                      <div className='flex items-center gap-2'>
                        {isActive && (
                          <div
                            className='h-1.5 w-1.5 shrink-0 rounded-full'
                            style={{ backgroundColor: workflow.color }}
                          />
                        )}
                        <span
                          className='font-[430] font-season text-base'
                          style={{ color: isActive ? '#F6F6F0' : '#F6F6F0' + '80' }}
                        >
                          {workflow.name}
                        </span>
                        {isActive && (
                          <ChevronDown
                            className='-rotate-90 ml-auto h-[11px] w-[11px] shrink-0'
                            style={{ color: workflow.color }}
                          />
                        )}
                      </div>
                      {isActive && (
                        <p className='mt-1 font-[430] font-season text-[#F6F6F0]/40 text-xs leading-[140%] tracking-[0.02em]'>
                          {workflow.description}
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>

              <div
                id={TEMPLATES_PANEL_ID}
                role='tabpanel'
                aria-labelledby={`template-tab-${activeIndex}`}
                className='relative hidden min-h-[400px] flex-1 lg:block'
              >
                <TemplatePreview color={activeWorkflow.color} name={activeWorkflow.name} />
                <button
                  type='button'
                  onClick={handleUseTemplate}
                  disabled={isPreparingTemplate}
                  className='group/cta absolute top-4 right-[16px] z-10 inline-flex h-[32px] cursor-pointer items-center gap-1.5 rounded-[5px] border border-white bg-white px-2.5 font-[430] font-season text-black text-sm transition-colors hover:border-[#E0E0E0] hover:bg-[#E0E0E0] disabled:opacity-60'
                >
                  {isPreparingTemplate ? 'Preparing...' : 'Use template'}
                  <span className='relative h-[10px] w-[10px] shrink-0'>
                    <ChevronDown className='-rotate-90 absolute inset-0 h-[10px] w-[10px] transition-opacity duration-150 group-hover/cta:opacity-0' />
                    <svg
                      className='absolute inset-0 h-[10px] w-[10px] opacity-0 transition-opacity duration-150 group-hover/cta:opacity-100'
                      viewBox='0 0 10 10'
                      fill='none'
                    >
                      <path d='M1 5H8M5.5 2L8.5 5L5.5 8' stroke='currentColor' strokeWidth='1.33' strokeLinecap='square' strokeLinejoin='miter' fill='none' />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            <div className='shrink-0'>
              <DotGrid
                className='h-full w-[24px] overflow-hidden border-[var(--landing-bg-elevated)] border-l p-1 lg:hidden'
                cols={2}
                rows={55}
                gap={4}
              />
              <DotGrid
                className='hidden h-full w-[80px] overflow-hidden border-[var(--landing-bg-elevated)] border-l p-1.5 lg:block'
                cols={8}
                rows={55}
                gap={6}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
