/**
 * Qualification state management for the personalized landing page.
 * Manages persona selection, focus area, and content feed ordering.
 */

export type Persona = 'founder' | 'sales_marketing' | 'enterprise' | 'investor'
export type FounderFocus = 'outbound' | 'content' | 'research' | 'automate'
export type SalesMarketingFocus = 'pipeline' | 'outreach' | 'content_marketing' | 'analytics'
export type EnterpriseFocus = 'compliance' | 'team_management' | 'workflow' | 'integrations'
export type InvestorStage = 'pre_seed' | 'seed' | 'series_a' | 'angel'
export type FocusArea = FounderFocus | SalesMarketingFocus | EnterpriseFocus | InvestorStage

export interface QualificationState {
  persona: Persona | null
  focus: FocusArea | null
  step: 'idle' | 'persona_selected' | 'focus_selected'
}

export interface PersonaOption {
  id: Persona
  label: string
  sublabel: string
  icon: string
}

export interface FocusOption {
  id: FocusArea
  label: string
}

export const PERSONA_OPTIONS: PersonaOption[] = [
  { id: 'founder', label: 'Founder', sublabel: 'Solo or early stage', icon: '🚀' },
  { id: 'sales_marketing', label: 'Sales & Marketing', sublabel: 'Scale pipeline & content', icon: '📈' },
  { id: 'enterprise', label: 'Enterprise', sublabel: 'Team compliance & ops', icon: '🏢' },
  { id: 'investor', label: 'Investor', sublabel: 'Evaluate the opportunity', icon: '💼' },
] as const

export const FOCUS_OPTIONS: Record<Persona, FocusOption[]> = {
  founder: [
    { id: 'outbound', label: 'Scale outbound' },
    { id: 'content', label: 'Produce content' },
    { id: 'research', label: 'Research markets' },
    { id: 'automate', label: 'Automate everything' },
  ],
  sales_marketing: [
    { id: 'pipeline', label: 'Build pipeline' },
    { id: 'outreach', label: 'Run outreach' },
    { id: 'content_marketing', label: 'Content at scale' },
    { id: 'analytics', label: 'Track analytics' },
  ],
  enterprise: [
    { id: 'compliance', label: 'Access & compliance' },
    { id: 'team_management', label: 'Team management' },
    { id: 'workflow', label: 'Workflow automation' },
    { id: 'integrations', label: 'Integrations' },
  ],
  investor: [
    { id: 'pre_seed', label: 'Pre-seed' },
    { id: 'seed', label: 'Seed' },
    { id: 'series_a', label: 'Series A' },
    { id: 'angel', label: 'Angel' },
  ],
} as const

/** Featured agent per persona + focus */
export const FEATURED_AGENT: Record<string, { name: string; domain: string; color: string }> = {
  'founder:outbound': { name: 'Striker', domain: 'Sales execution and outreach', color: '#FA4EDF' },
  'founder:content': { name: 'Pulse', domain: 'Content creation and distribution', color: '#FFCC02' },
  'founder:research': { name: 'Cortex', domain: 'Research and intelligence', color: '#8B5CF6' },
  'founder:automate': { name: 'Sentinel', domain: 'Infrastructure and monitoring', color: '#33C482' },
  'sales_marketing:pipeline': { name: 'Specter', domain: 'Lead generation and qualification', color: '#2ABBF8' },
  'sales_marketing:outreach': { name: 'Striker', domain: 'Sales execution and outreach', color: '#FA4EDF' },
  'sales_marketing:content_marketing': { name: 'Pulse', domain: 'Content creation and distribution', color: '#FFCC02' },
  'sales_marketing:analytics': { name: 'Cortex', domain: 'Research and intelligence', color: '#8B5CF6' },
  'enterprise:compliance': { name: 'Sentinel', domain: 'Infrastructure and monitoring', color: '#33C482' },
  'enterprise:team_management': { name: 'Cortex', domain: 'Research and intelligence', color: '#8B5CF6' },
  'enterprise:workflow': { name: 'Sentinel', domain: 'Infrastructure and monitoring', color: '#33C482' },
  'enterprise:integrations': { name: 'Sentinel', domain: 'Infrastructure and monitoring', color: '#33C482' },
  'investor:pre_seed': { name: 'Cortex', domain: 'Research and intelligence', color: '#8B5CF6' },
  'investor:seed': { name: 'Cortex', domain: 'Research and intelligence', color: '#8B5CF6' },
  'investor:series_a': { name: 'Cortex', domain: 'Research and intelligence', color: '#8B5CF6' },
  'investor:angel': { name: 'Cortex', domain: 'Research and intelligence', color: '#8B5CF6' },
}

/** Headline copy per persona */
export const PERSONA_HEADLINES: Record<Persona, { title: string; subtitle: string }> = {
  founder: {
    title: 'Your AI workforce, built for founders',
    subtitle: 'Stop wearing every hat. Deploy AI agents that handle outbound, content, research, and ops while you focus on building.',
  },
  sales_marketing: {
    title: 'Scale GTM without scaling headcount',
    subtitle: 'Five AI agents run your outbound, content, research, and analytics. Your team focuses on closing.',
  },
  enterprise: {
    title: 'Enterprise-grade AI operations',
    subtitle: 'Access control, audit trails, team collaboration. Deploy AI agents with the compliance your org requires.',
  },
  investor: {
    title: 'The autonomous company platform',
    subtitle: 'Ultron replaces 5 hires with AI agents. $50B TAM. Live product. Growing revenue.',
  },
}

/** Right-panel chat messages per persona + focus */
export const PERSONA_CHAT_MESSAGES: Record<string, string> = {
  'founder:outbound': "Here's your outbound system. Striker handles cold outreach, follow-ups, and lead scoring — all running in parallel.",
  'founder:content': "Your content engine is ready. Pulse drafts, schedules, and distributes across LinkedIn, email, and your blog.",
  'founder:research': "Cortex is scanning your market. Competitor analysis, ICP profiling, and trend reports — updated continuously.",
  'founder:automate': "Your ops layer is live. Sentinel monitors, automates workflows, and keeps your stack running while you sleep.",
  'sales_marketing:pipeline': "Pipeline built. Specter qualifies leads, enriches data, and routes prospects to your team automatically.",
  'sales_marketing:outreach': "Outreach sequences ready. Striker personalizes every email, tracks engagement, and adapts in real-time.",
  'sales_marketing:content_marketing': "Content calendar loaded. Pulse produces and distributes at the pace your funnel demands.",
  'sales_marketing:analytics': "Analytics dashboard live. Cortex tracks conversion rates, channel performance, and revenue attribution.",
  'enterprise:compliance': "Access control configured. Audit trails, role-based permissions, and compliance reporting — all built in.",
  'enterprise:team_management': "Team workspace ready. Assign agents to projects, review outputs, and manage capacity from one interface.",
  'enterprise:workflow': "Workflow automation deployed. Sentinel orchestrates multi-step processes across your entire tool stack.",
  'enterprise:integrations': "250+ integrations connected. Your CRM, inbox, analytics, and repo — all available in every session.",
  'investor:pre_seed': "Pre-seed deck loaded. Traction metrics, architecture overview, and the path to seed — all in one view.",
  'investor:seed': "Seed materials ready. Revenue velocity, unit economics, and the $50B market opportunity.",
  'investor:series_a': "Series A package. Growth metrics, retention curves, and the autonomous company thesis.",
  'investor:angel': "Angel overview. Product demo, founding team, and why this is the right time to back Ultron.",
}
