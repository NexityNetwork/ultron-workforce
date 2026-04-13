'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { FocusArea } from '@/lib/qualification-state'

interface FounderFeedProps {
  focus: FocusArea | null
}

const AGENTS = [
  { name: 'Striker', domain: 'Sales execution and outreach', color: '#FA4EDF', status: 'Active' },
  { name: 'Cortex', domain: 'Research and intelligence', color: '#8B5CF6', status: 'Active' },
  { name: 'Pulse', domain: 'Content creation and distribution', color: '#FFCC02', status: 'Active' },
  { name: 'Specter', domain: 'Lead generation and qualification', color: '#2ABBF8', status: 'Active' },
  { name: 'Sentinel', domain: 'Infrastructure and monitoring', color: '#33C482', status: 'Standby' },
] as const

const OUTBOUND_SECTIONS = [
  {
    badge: 'Outreach Sequence',
    badgeColor: '#FA4EDF',
    title: 'Cold email campaigns that write themselves',
    description: 'Striker drafts personalized sequences for every prospect. Day 0 intro, Day 3 value add, Day 7 breakup — all tailored to ICP.',
    visual: 'sequence',
  },
  {
    badge: 'Lead Scoring',
    badgeColor: '#2ABBF8',
    title: 'Every lead scored before you see it',
    description: 'Specter enriches and qualifies leads via Apollo, LinkedIn, and company data. You only talk to 8+ scores.',
    visual: 'scoring',
  },
  {
    badge: 'Pipeline Tracker',
    badgeColor: '#FF6B2C',
    title: 'Visualize every deal from first touch to close',
    description: 'Kanban pipeline that updates automatically. Stages shift as signals come in — no manual entry.',
    visual: 'pipeline',
  },
] as const

const CONTENT_SECTIONS = [
  {
    badge: 'Content Engine',
    badgeColor: '#FFCC02',
    title: 'Content calendar on autopilot',
    description: 'Pulse drafts LinkedIn posts, blog articles, and email newsletters. Scheduled, optimized, distributed.',
    visual: 'content',
  },
  {
    badge: 'LinkedIn Authority',
    badgeColor: '#8B5CF6',
    title: 'Build thought leadership while you sleep',
    description: 'Daily posts, comment engagement, and DM sequences. Your personal brand grows 24/7.',
    visual: 'linkedin',
  },
  {
    badge: 'SEO & Distribution',
    badgeColor: '#33C482',
    title: 'Get found. Get shared. Get leads.',
    description: 'Keyword research, content optimization, and multi-channel distribution. All orchestrated by AI.',
    visual: 'seo',
  },
] as const

const RESEARCH_SECTIONS = [
  {
    badge: 'Market Intelligence',
    badgeColor: '#8B5CF6',
    title: 'Know your market before anyone else',
    description: 'Cortex monitors competitors, tracks trends, and surfaces insights. Updated continuously.',
    visual: 'market',
  },
  {
    badge: 'ICP Builder',
    badgeColor: '#00F701',
    title: 'Define your ideal customer with precision',
    description: 'Segmentation by industry, size, growth rate, tech stack, and buying signals.',
    visual: 'icp',
  },
  {
    badge: 'Competitor Intel',
    badgeColor: '#F43F5E',
    title: 'Battlecards that update themselves',
    description: 'Pricing changes, feature launches, hiring signals. Know what your competitors do before their customers do.',
    visual: 'competitor',
  },
] as const

const AUTOMATE_SECTIONS = [
  {
    badge: 'Workflow Automation',
    badgeColor: '#33C482',
    title: 'Ops that run without you',
    description: 'Sentinel connects your tools, automates handoffs, and monitors everything. 250+ integrations.',
    visual: 'workflow',
  },
  {
    badge: 'Agent Orchestration',
    badgeColor: '#FA4EDF',
    title: 'Five agents. Zero overlap.',
    description: 'Each agent has its own domain, tools, and memory. They coordinate so you don\'t have to.',
    visual: 'agents',
  },
  {
    badge: 'Revenue Dashboard',
    badgeColor: '#2ABBF8',
    title: 'Your business health at a glance',
    description: 'ARR, MRR, churn, pipeline, customer count. Real-time metrics from live data.',
    visual: 'revenue',
  },
] as const

function getSections(focus: FocusArea | null) {
  switch (focus) {
    case 'content': return CONTENT_SECTIONS
    case 'research': return RESEARCH_SECTIONS
    case 'automate': return AUTOMATE_SECTIONS
    default: return OUTBOUND_SECTIONS
  }
}

function SequenceVisual() {
  const steps = [
    { day: 'Day 0', label: 'Cold intro', words: '87 words', color: '#FA4EDF' },
    { day: 'Day 3', label: 'Value add', words: '124 words', color: '#FA4EDF' },
    { day: 'Day 7', label: 'Case study', words: '95 words', color: '#FA4EDF' },
    { day: 'Day 14', label: 'Breakup', words: '62 words', color: '#FA4EDF' },
  ]
  return (
    <div className='flex flex-col gap-2'>
      {steps.map((step, i) => (
        <div key={step.day} className='flex items-center gap-3'>
          <div className='flex items-center gap-2 w-[60px]'>
            <div className='h-2 w-2 rounded-full' style={{ backgroundColor: step.color, opacity: 1 - i * 0.15 }} />
            <span className='text-[11px] text-[rgba(255,255,255,0.5)] font-mono'>{step.day}</span>
          </div>
          <div className='flex-1 h-[32px] rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center px-3 justify-between'>
            <span className='text-[12px] text-white font-season'>{step.label}</span>
            <span className='text-[10px] text-[rgba(255,255,255,0.3)] font-mono'>{step.words}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function ScoringVisual() {
  const scores = [
    { label: 'ICP Match', value: 84, color: '#2ABBF8' },
    { label: 'Intent Score', value: 72, color: '#FA4EDF' },
    { label: 'Engagement', value: 91, color: '#33C482' },
    { label: 'Timing', value: 68, color: '#FFCC02' },
  ]
  return (
    <div className='flex flex-col gap-3'>
      {scores.map((score) => (
        <div key={score.label} className='flex items-center gap-3'>
          <span className='text-[11px] text-[rgba(255,255,255,0.5)] w-[80px] font-season'>{score.label}</span>
          <div className='flex-1 h-[6px] rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden'>
            <div className='h-full rounded-full transition-all duration-700' style={{ width: `${score.value}%`, backgroundColor: score.color }} />
          </div>
          <span className='text-[11px] text-white font-mono w-[28px] text-right'>{score.value}%</span>
        </div>
      ))}
      <div className='mt-1 flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)]'>
        <span className='text-[11px] text-[rgba(255,255,255,0.4)] font-season'>Overall Lead Score</span>
        <span className='text-[16px] text-white font-mono font-medium'>8.4 / 10</span>
      </div>
    </div>
  )
}

function PipelineVisual() {
  const stages = [
    { name: 'New', count: 24, color: '#2ABBF8' },
    { name: 'Contacted', count: 18, color: '#FA4EDF' },
    { name: 'Qualified', count: 12, color: '#FFCC02' },
    { name: 'Won', count: 6, color: '#33C482' },
  ]
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex gap-2'>
        {stages.map((stage) => (
          <div key={stage.name} className='flex-1 flex flex-col gap-1.5'>
            <div className='flex items-center gap-1.5'>
              <div className='h-1.5 w-1.5 rounded-full' style={{ backgroundColor: stage.color }} />
              <span className='text-[10px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.05em] font-season'>{stage.name}</span>
            </div>
            <div className='text-[18px] text-white font-mono font-medium'>{stage.count}</div>
            <div className='h-[4px] rounded-full' style={{ backgroundColor: stage.color, opacity: 0.3 }}>
              <div className='h-full rounded-full' style={{ backgroundColor: stage.color, width: `${(stage.count / 24) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContentCalendarVisual() {
  const items = [
    { platform: 'LinkedIn', type: 'Post', status: 'Published', color: '#0A66C2' },
    { platform: 'Blog', type: 'Article', status: 'Drafting', color: '#FFCC02' },
    { platform: 'Email', type: 'Newsletter', status: 'Scheduled', color: '#33C482' },
    { platform: 'Twitter', type: 'Thread', status: 'Queued', color: '#1DA1F2' },
  ]
  return (
    <div className='flex flex-col gap-2'>
      {items.map((item) => (
        <div key={item.platform} className='flex items-center gap-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] px-3 py-2.5'>
          <div className='h-2 w-2 rounded-full' style={{ backgroundColor: item.color }} />
          <span className='text-[12px] text-white font-season flex-1'>{item.platform}</span>
          <span className='text-[10px] text-[rgba(255,255,255,0.4)] font-season'>{item.type}</span>
          <span className='text-[10px] rounded-full px-2 py-0.5 font-season' style={{
            color: item.color,
            backgroundColor: `${item.color}15`,
          }}>
            {item.status}
          </span>
        </div>
      ))}
    </div>
  )
}

function MetricsVisual() {
  const metrics = [
    { label: 'ARR', value: '$320K', trend: '+12%', color: '#33C482' },
    { label: 'MRR', value: '$26.7K', trend: '+8%', color: '#33C482' },
    { label: 'Customers', value: '38', trend: '+3', color: '#2ABBF8' },
  ]
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex gap-3'>
        {metrics.map((m) => (
          <div key={m.label} className='flex-1 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] px-3 py-2.5'>
            <div className='text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-[0.05em] font-season'>{m.label}</div>
            <div className='text-[18px] text-white font-mono font-medium mt-1'>{m.value}</div>
            <div className='text-[10px] font-mono mt-0.5' style={{ color: m.color }}>{m.trend}</div>
          </div>
        ))}
      </div>
      <div className='h-[60px] rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] p-3 flex items-end gap-1'>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className='flex-1 rounded-sm bg-[#2ABBF8]' style={{ height: `${20 + Math.random() * 80}%`, opacity: 0.3 + (i / 12) * 0.7 }} />
        ))}
      </div>
    </div>
  )
}

function RadarVisual() {
  return (
    <div className='flex items-center justify-center py-4'>
      <svg viewBox='0 0 200 200' className='w-[160px] h-[160px]'>
        {[80, 60, 40, 20].map((r) => (
          <polygon key={r} points={getHexPoints(100, 100, r)} fill='none' stroke='rgba(255,255,255,0.08)' strokeWidth='1' />
        ))}
        <polygon points={getDataPoints(100, 100, [72, 85, 60, 90, 55, 78])} fill='rgba(0,247,1,0.12)' stroke='#00F701' strokeWidth='1.5' />
        {[72, 85, 60, 90, 55, 78].map((v, i) => {
          const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
          const x = 100 + (v / 100) * 80 * Math.cos(angle)
          const y = 100 + (v / 100) * 80 * Math.sin(angle)
          return <circle key={i} cx={x} cy={y} r='3' fill='#00F701' />
        })}
      </svg>
    </div>
  )
}

function getHexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
  }).join(' ')
}

function getDataPoints(cx: number, cy: number, values: number[]): string {
  return values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2
    return `${cx + (v / 100) * 80 * Math.cos(angle)},${cy + (v / 100) * 80 * Math.sin(angle)}`
  }).join(' ')
}

function getVisualForType(type: string) {
  switch (type) {
    case 'sequence': return <SequenceVisual />
    case 'scoring': return <ScoringVisual />
    case 'pipeline': return <PipelineVisual />
    case 'content': return <ContentCalendarVisual />
    case 'linkedin': return <ScoringVisual />
    case 'seo': return <MetricsVisual />
    case 'market': return <RadarVisual />
    case 'icp': return <RadarVisual />
    case 'competitor': return <ScoringVisual />
    case 'workflow': return <PipelineVisual />
    case 'agents': return null
    case 'revenue': return <MetricsVisual />
    default: return <SequenceVisual />
  }
}

const CANVAS_THUMBNAILS = [
  { name: 'Revenue Dashboard', color: '#2ABBF8' },
  { name: 'ICP Builder', color: '#00F701' },
  { name: 'Cold Email Campaign', color: '#FFCC02' },
  { name: 'Lead Pipeline Tracker', color: '#FF6B2C' },
  { name: 'Sales Battlecard', color: '#6366F1' },
  { name: 'Outreach Sequence', color: '#F43F5E' },
  { name: 'Market Analysis Report', color: '#14B8A6' },
  { name: 'SWOT Analysis', color: '#F59E0B' },
  { name: 'Go-to-Market Plan', color: '#06B6D4' },
] as const

const INTEGRATION_LOGOS = [
  'Apollo', 'HubSpot', 'Slack', 'LinkedIn', 'GitHub',
  'Stripe', 'Google Workspace', 'Salesforce', 'Mailchimp',
  'n8n', 'Notion', 'Figma', 'Vercel', 'Sentry',
  'Intercom', 'PostHog',
] as const

const PROOF_STATS = [
  { label: 'Founders', value: '4,513' },
  { label: 'Tasks completed', value: '367K' },
  { label: 'Saved in labor', value: '$1.9M' },
] as const

export default function FounderFeed({ focus }: FounderFeedProps) {
  const sections = getSections(focus)

  return (
    <div className='flex flex-col'>
      {/* Proof bar */}
      <div className='flex items-center justify-center gap-6 py-5 px-6 border-t border-b border-[rgba(255,255,255,0.06)]'>
        {PROOF_STATS.map((stat, i) => (
          <div key={stat.label} className='flex items-center gap-2'>
            {i > 0 && <div className='h-3 w-px bg-[rgba(255,255,255,0.1)] -ml-3 mr-[-4px]' />}
            <span className='text-[14px] text-white font-mono font-medium'>{stat.value}</span>
            <span className='text-[11px] text-[rgba(255,255,255,0.4)] font-season'>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Feature sections — dynamic based on focus */}
      {sections.map((section, i) => (
        <motion.div
          key={section.badge}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className='px-6 py-8 lg:px-10 border-b border-[rgba(255,255,255,0.06)]'
        >
          <div className='flex items-center gap-2 mb-3'>
            <div className='h-1.5 w-1.5 rounded-full' style={{ backgroundColor: section.badgeColor }} />
            <span
              className='text-[10px] uppercase tracking-[0.06em] font-medium font-season'
              style={{ color: section.badgeColor }}
            >
              {section.badge}
            </span>
          </div>
          <h3 className='text-[20px] lg:text-[24px] font-[430] font-season text-white leading-[120%] tracking-[-0.01em] mb-2'>
            {section.title}
          </h3>
          <p className='text-[13px] text-[rgba(255,255,255,0.5)] leading-[160%] font-season mb-5 max-w-[440px]'>
            {section.description}
          </p>
          <div className='rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4'>
            {getVisualForType(section.visual)}
          </div>
        </motion.div>
      ))}

      {/* The 5 Agents */}
      <div className='px-6 py-8 lg:px-10 border-b border-[rgba(255,255,255,0.06)]'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='h-1.5 w-1.5 rounded-full bg-[#FA4EDF]' />
          <span className='text-[10px] uppercase tracking-[0.06em] font-medium font-season text-[#FA4EDF]'>Agents</span>
        </div>
        <h3 className='text-[20px] lg:text-[24px] font-[430] font-season text-white leading-[120%] tracking-[-0.01em] mb-4'>
          Five domains. Zero overlap.
        </h3>
        <div className='flex flex-col gap-2'>
          {AGENTS.map((agent) => (
            <div key={agent.name} className='flex items-center gap-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 py-3'>
              <div className='h-2 w-2 rounded-full' style={{ backgroundColor: agent.color }} />
              <div className='flex flex-col gap-0.5 flex-1'>
                <span className='text-[13px] font-medium text-white font-season'>{agent.name}</span>
                <span className='text-[11px] text-[rgba(255,255,255,0.4)] font-season'>{agent.domain}</span>
              </div>
              <span className='text-[9px] text-[rgba(255,255,255,0.25)] uppercase tracking-[0.05em] font-season'>{agent.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas Gallery (thumbnails with names) */}
      <div className='px-6 py-8 lg:px-10 border-b border-[rgba(255,255,255,0.06)]'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='h-1.5 w-1.5 rounded-full bg-[#2ABBF8]' />
          <span className='text-[10px] uppercase tracking-[0.06em] font-medium font-season text-[#2ABBF8]'>Canvas</span>
        </div>
        <h3 className='text-[20px] lg:text-[24px] font-[430] font-season text-white leading-[120%] tracking-[-0.01em] mb-2'>
          30+ business canvases
        </h3>
        <p className='text-[13px] text-[rgba(255,255,255,0.5)] leading-[160%] font-season mb-5'>
          Rendered inline. Ready in seconds.
        </p>
        <div className='grid grid-cols-3 gap-2'>
          {CANVAS_THUMBNAILS.map((canvas) => (
            <div
              key={canvas.name}
              className='rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-3 flex flex-col gap-2'
            >
              <div className='h-[50px] rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.04)]' />
              <span className='text-[10px] text-[rgba(255,255,255,0.6)] font-season leading-tight'>{canvas.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className='px-6 py-8 lg:px-10 border-b border-[rgba(255,255,255,0.06)]'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='h-1.5 w-1.5 rounded-full bg-[#FF6B35]' />
          <span className='text-[10px] uppercase tracking-[0.06em] font-medium font-season text-[#FF6B35]'>Integrations</span>
        </div>
        <h3 className='text-[20px] lg:text-[24px] font-[430] font-season text-white leading-[120%] tracking-[-0.01em] mb-2'>
          250+ tools connected
        </h3>
        <p className='text-[13px] text-[rgba(255,255,255,0.5)] leading-[160%] font-season mb-5'>
          50 MCP servers preloaded. OAuth or API key setup.
        </p>
        <div className='flex flex-wrap gap-2'>
          {INTEGRATION_LOGOS.map((name) => (
            <div key={name} className='rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-3 py-2'>
              <span className='text-[11px] text-[rgba(255,255,255,0.5)] font-season'>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing teaser */}
      <div className='px-6 py-8 lg:px-10 border-b border-[rgba(255,255,255,0.06)]'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='h-1.5 w-1.5 rounded-full bg-[#DA4E24]' />
          <span className='text-[10px] uppercase tracking-[0.06em] font-medium font-season text-[#DA4E24]'>Pricing</span>
        </div>
        <h3 className='text-[20px] lg:text-[24px] font-[430] font-season text-white leading-[120%] tracking-[-0.01em] mb-4'>
          Start at $19/month
        </h3>
        <div className='flex gap-3'>
          {[
            { name: 'Max', price: '$19', desc: 'For teams ready to put AI to work' },
            { name: 'Ultra', price: '$100', desc: 'GTM at full scale' },
            { name: 'Enterprise', price: 'Custom', desc: 'Complete control' },
          ].map((tier) => (
            <div key={tier.name} className='flex-1 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4'>
              <div className='text-[13px] text-white font-medium font-season'>{tier.name}</div>
              <div className='text-[22px] text-white font-mono font-medium mt-1'>{tier.price}</div>
              <div className='text-[10px] text-[rgba(255,255,255,0.4)] font-season mt-1'>{tier.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className='px-6 py-10 lg:px-10 text-center'>
        <h3 className='text-[24px] font-[430] font-season text-white leading-[120%] tracking-[-0.01em] mb-3'>
          Ready to hire your AI workforce?
        </h3>
        <p className='text-[14px] text-[rgba(255,255,255,0.5)] font-season mb-6'>
          Start free. Deploy your first agent in under 47 minutes.
        </p>
        <a
          href='https://app.51ultron.com/signup'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center justify-center h-[44px] px-8 rounded-xl bg-white text-black text-[14px] font-medium font-season hover:bg-[#E0E0E0] transition-colors'
        >
          Try Ultron free
        </a>
      </div>
    </div>
  )
}
