'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ACTOR_COLORS: Record<string, string> = {
  'Sarah K.': '#2ABBF8',
  'Sid G.': '#33C482',
  'Theo L.': '#FA4EDF',
  'Abhay K.': '#FFCC02',
  'Danny S.': '#FF6B35',
}

const ACCENT_OPACITIES = [0.75, 0.5, 0.35, 0.22, 0.12, 0.05] as const

interface LogEntry {
  id: number
  actor: string
  description: string
  resourceType: string
  insertedAt: number
}

function formatTimeAgo(insertedAt: number): string {
  const elapsed = Date.now() - insertedAt
  if (elapsed < 8_000) return 'just now'
  if (elapsed < 60_000) return `${Math.floor(elapsed / 1000)}s ago`
  return `${Math.floor(elapsed / 60_000)}m ago`
}

const ENTRY_TEMPLATES: Omit<LogEntry, 'id' | 'insertedAt'>[] = [
  { actor: 'Sarah K.', description: 'Deployed workflow "Email Triage"', resourceType: 'workflow' },
  { actor: 'Sid G.', description: 'Invited alex@acme.com to workspace as member', resourceType: 'member' },
  { actor: 'Theo L.', description: 'Added BYOK key for openai', resourceType: 'byok_key' },
  { actor: 'Sarah K.', description: 'Created workflow "Invoice Parser"', resourceType: 'workflow' },
  { actor: 'Abhay K.', description: 'Created permission group "Engineering"', resourceType: 'permission_group' },
  { actor: 'Danny S.', description: 'Created API key "Production Key"', resourceType: 'api_key' },
  { actor: 'Theo L.', description: 'Changed permissions for sam@acme.com to editor', resourceType: 'member' },
  { actor: 'Sarah K.', description: 'Uploaded file "Q3_Report.pdf"', resourceType: 'file' },
  { actor: 'Sid G.', description: 'Created credential set "Prod Keys"', resourceType: 'credential_set' },
  { actor: 'Abhay K.', description: 'Created knowledge base "Internal Docs"', resourceType: 'knowledge_base' },
  { actor: 'Danny S.', description: 'Updated environment variables', resourceType: 'environment' },
  { actor: 'Sarah K.', description: 'Added tool "search_web" to MCP server', resourceType: 'mcp_server' },
]

const INITIAL_OFFSETS_MS = [0, 20_000, 75_000, 180_000, 360_000, 600_000]

interface AuditRowProps {
  entry: LogEntry
  index: number
}

function AuditRow({ entry, index }: AuditRowProps) {
  const color = ACTOR_COLORS[entry.actor] ?? '#F6F6F6'
  const accentOpacity = ACCENT_OPACITIES[index] ?? 0.04
  const timeAgo = formatTimeAgo(entry.insertedAt)

  return (
    <div className='group relative overflow-hidden border-[var(--landing-border)] border-b bg-[var(--landing-bg)] transition-colors duration-150 last:border-b-0 hover:bg-[#212121]'>
      <div
        aria-hidden='true'
        className='absolute top-0 bottom-0 left-0 w-[2px] transition-opacity duration-150 group-hover:opacity-100'
        style={{ backgroundColor: color, opacity: accentOpacity }}
      />
      <div className='flex min-w-0 items-center gap-3 py-[10px] pr-4 pl-5'>
        <div
          className='flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full'
          style={{ backgroundColor: `${color}20` }}
        >
          <span className='font-[500] font-season text-[9px] leading-none' style={{ color }}>
            {entry.actor[0]}
          </span>
        </div>
        <span className='w-[56px] shrink-0 font-[430] font-season text-[#F6F6F6]/55 text-[11px] leading-none tracking-[0.02em]'>
          {timeAgo}
        </span>
        <span className='min-w-0 truncate font-[430] font-season text-[12px] leading-none tracking-[0.02em]'>
          <span className='text-[#F6F6F6]/80'>{entry.actor}</span>
          <span className='hidden sm:inline'>
            <span className='text-[#F6F6F6]/60'> · </span>
            <span className='text-[#F6F6F6]/55'>{entry.description}</span>
          </span>
        </span>
      </div>
    </div>
  )
}

export function AuditLogPreview() {
  const counterRef = useRef(ENTRY_TEMPLATES.length)
  const templateIndexRef = useRef(6 % ENTRY_TEMPLATES.length)

  const [entries, setEntries] = useState<LogEntry[]>(() => {
    const now = Date.now()
    return ENTRY_TEMPLATES.slice(0, 6).map((t, i) => ({
      ...t,
      id: i,
      insertedAt: now - INITIAL_OFFSETS_MS[i],
    }))
  })
  const [, tick] = useState(0)

  useEffect(() => {
    const addInterval = setInterval(() => {
      const template = ENTRY_TEMPLATES[templateIndexRef.current]
      templateIndexRef.current = (templateIndexRef.current + 1) % ENTRY_TEMPLATES.length
      setEntries((prev) => [
        { ...template, id: counterRef.current++, insertedAt: Date.now() },
        ...prev.slice(0, 5),
      ])
    }, 2600)
    const tickInterval = setInterval(() => tick((n) => n + 1), 5_000)
    return () => {
      clearInterval(addInterval)
      clearInterval(tickInterval)
    }
  }, [])

  return (
    <div className='mt-5 overflow-hidden px-6 md:mt-6 md:px-8'>
      <AnimatePresence mode='popLayout' initial={false}>
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            layout
            initial={{ y: -48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              layout: { type: 'tween', duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] },
              y: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] },
              opacity: { duration: 0.25 },
            }}
          >
            <AuditRow entry={entry} index={index} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
