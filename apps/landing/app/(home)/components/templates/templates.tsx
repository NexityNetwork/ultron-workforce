'use client'

import { useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import { Badge, ChevronDown } from '@/components/emcn'
import { TEMPLATE_WORKFLOWS } from '@/app/(home)/components/templates/template-workflows'
import { CANVAS_TEMPLATES } from '@/app/(home)/components/templates/canvas-mock-data'

const CanvasBlock = dynamic(() => import('@/components/canvas/CanvasBlock'), {
  ssr: false,
  loading: () => <div className='flex min-h-[400px] items-center justify-center'><div className='h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-white/40' /></div>,
})

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
                  color: activeWorkflow.color,
                  backgroundColor: hexToRgba(activeWorkflow.color, 0.1),
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
                className='relative hidden min-h-[400px] flex-1 overflow-hidden lg:block'
              >
                <div className='h-[600px] overflow-y-auto overflow-x-hidden p-4 scrollbar-none'>
                  <CanvasBlock
                    key={activeIndex}
                    type={CANVAS_TEMPLATES[activeIndex].type}
                    data={CANVAS_TEMPLATES[activeIndex].data}
                    className='pointer-events-none'
                  />
                </div>
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
