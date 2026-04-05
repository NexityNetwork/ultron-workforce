/**
 * Static mock data for the 11 canvas template previews.
 * Sourced from ultron canvas-demo — hardcoded, zero backend.
 */

export interface CanvasTemplate {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
}

// 1. Revenue Dashboard → metrics_dashboard
const revenueDashboard: CanvasTemplate = {
  type: 'metrics_dashboard',
  data: {
    title: '3 Stages to €1M ARR — Traction Dashboard',
    period: 'Q1 2026',
    kpis: [
      { label: 'ARR', value: '€320,000', change: '+42% QoQ', trend: 'up', status: 'good' },
      { label: 'MRR', value: '€26,700', change: '+18% MoM', trend: 'up', status: 'good' },
      { label: 'Paying Customers', value: '38', change: '+8 this quarter', trend: 'up', status: 'good' },
    ],
    stages: [
      {
        name: 'Stage 1: Hustle Mode',
        range: '€0 – €100K ARR',
        status: 'completed',
        description: 'Run tests, validate hypotheses, and experiment with GTM.',
        milestones: ['Problem-Solution Fit validated', 'First 10 paying customers'],
      },
      {
        name: 'Stage 2: Focus Mode',
        range: '€100K – €1M ARR',
        status: 'active',
        description: '1 ICP, 1 use case, 1-2 channels. Build GTM Playbook V1.',
        milestones: ['Narrowed to 1 ICP', 'Primary channel producing pipeline'],
      },
      {
        name: 'Stage 3: Expansion Mode',
        range: '€1M+ ARR',
        status: 'upcoming',
        description: 'New ICPs, new use cases, new channels. Scale the GTM machine.',
        milestones: ['Expand to 2-3 ICPs', 'Build SDR/BDR team'],
      },
    ],
    chart: {
      type: 'area',
      data: [
        { name: "Jan '25", value: 15000 },
        { name: "May '25", value: 48000 },
        { name: "Sep '25", value: 100000 },
        { name: "Jan '26", value: 210000 },
        { name: "Mar '26", value: 320000 },
      ],
    },
    breakdown: [
      { label: 'Problem-Solution Fit', value: 'Achieved', percentage: 100 },
      { label: 'Product-Market Fit', value: 'In Progress', percentage: 65 },
      { label: 'GTM Fit', value: 'Upcoming', percentage: 15 },
    ],
  },
}

// 2. ICP Builder → radar_chart
const icpBuilder: CanvasTemplate = {
  type: 'radar_chart',
  data: {
    title: 'GTM Readiness Assessment',
    axes: [
      { label: 'Positioning', value: 78 },
      { label: 'Sales Process', value: 82 },
      { label: 'Content', value: 55 },
      { label: 'Demand Gen', value: 64 },
      { label: 'Product', value: 91 },
      { label: 'Team', value: 72 },
      { label: 'Analytics', value: 68 },
      { label: 'Partnerships', value: 35 },
    ],
    comparison: {
      label: 'Industry Avg',
      values: [65, 60, 70, 58, 72, 65, 55, 50],
    },
    insights: [
      'Product (91) and Sales Process (82) are standout strengths — well above industry average.',
      'Partnerships (35) is the biggest gap and below industry average (50).',
    ],
  },
}

// 3. Cold Email Campaign → sequence
const coldEmailCampaign: CanvasTemplate = {
  type: 'sequence',
  data: {
    sequence_name: 'Cold Outreach — SaaS Decision Makers',
    steps: [
      {
        step: 1,
        subject: 'Quick question about {{company}} growth',
        preview:
          'Hi {{first_name}}, I noticed {{company}} just raised Series A — congrats! I work with similar-stage companies to automate their outbound pipeline using AI agents.',
        send_day: 1,
        status: 'sent',
      },
      {
        step: 2,
        subject: 'Re: {{company}} — case study inside',
        preview:
          'Following up — we helped DataPrime go from 20 to 85 qualified leads/month using autonomous AI agents. Here\'s the full breakdown...',
        send_day: 4,
        status: 'active',
      },
      {
        step: 3,
        subject: 'Last one — free audit for {{company}}',
        preview:
          "I know you're busy so I'll keep this short. We're offering a free pipeline audit for high-growth SaaS companies this month. No strings attached.",
        send_day: 7,
        status: 'draft',
      },
    ],
    insights: [
      'Step 1 has a 34% open rate — the personalized Series A mention is driving opens.',
      '3-day gap between Step 1 and 2 is optimal. Reply rates drop 40% with gaps over 5 days.',
    ],
  },
}

// 4. Competitor Intelligence Map → comparison_table
const competitorMap: CanvasTemplate = {
  type: 'comparison_table',
  data: {
    entities: [
      {
        name: 'Lindy.ai',
        dimensions: {
          pricing: { value: '$49-499/mo', score: 7 },
          features: { value: 'AI agents, automations, 80+ integrations', score: 8 },
          integrations: { value: 'Slack, Gmail, HubSpot, Salesforce', score: 7 },
          ease_of_use: { value: 'No-code builder, quick setup', score: 9 },
          customer_support: { value: 'Email + chat, knowledge base', score: 6 },
        },
      },
      {
        name: 'Relevance AI',
        dimensions: {
          pricing: { value: '$19-599/mo', score: 8 },
          features: { value: 'AI workforce, tool builder, multi-step chains', score: 9 },
          integrations: { value: 'Zapier, webhooks, APIs, Snowflake', score: 8 },
          ease_of_use: { value: 'Low-code, steeper learning curve', score: 6 },
          customer_support: { value: 'Priority support on paid plans', score: 7 },
        },
      },
      {
        name: 'Zapier',
        dimensions: {
          pricing: { value: '$0-599/mo', score: 6 },
          features: { value: 'Zaps, tables, interfaces, AI actions', score: 7 },
          integrations: { value: '7000+ app integrations', score: 10 },
          ease_of_use: { value: 'Very intuitive, drag-and-drop', score: 10 },
          customer_support: { value: 'Community, docs, email support', score: 5 },
        },
      },
    ],
    insights: [
      'Relevance AI scores highest on features (9/10) with its multi-step chain builder.',
      'Zapier dominates integrations (10/10) with 7,000+ apps but scores lowest on customer support.',
    ],
  },
}

// 5. Lead Pipeline Tracker → kanban
const leadPipeline: CanvasTemplate = {
  type: 'kanban',
  data: {
    columns: [
      {
        id: 'new',
        name: 'New',
        cards: [
          { id: '1', title: 'Acme Corp', subtitle: 'Enterprise SaaS', score: 35, tags: ['enterprise', 'inbound'] },
          { id: '2', title: 'TechFlow Inc', subtitle: 'AI startup, Series A', score: 42, tags: ['startup'] },
        ],
      },
      {
        id: 'contacted',
        name: 'Contacted',
        cards: [
          { id: '4', title: 'DataPrime', subtitle: 'Analytics platform', score: 65, tags: ['analytics'] },
          { id: '5', title: 'CloudBase', subtitle: 'Infrastructure', score: 55 },
        ],
      },
      {
        id: 'qualified',
        name: 'Qualified',
        cards: [
          { id: '6', title: 'FinServe Solutions', subtitle: 'Fintech, $2M ARR', score: 82, tags: ['high-value'] },
        ],
      },
      {
        id: 'won',
        name: 'Won',
        cards: [
          { id: '8', title: 'StartupOS', subtitle: 'Dev tools', score: 95, tags: ['closed'] },
        ],
      },
    ],
    insights: [
      'Pipeline is top-heavy — 2 leads in New vs. 1 in Qualified. Focus on moving forward.',
      'Won deals average 95 score — any lead above 80 should be fast-tracked.',
    ],
  },
}

// 6. Sales Battlecard → text_cards
const salesBattlecard: CanvasTemplate = {
  type: 'text_cards',
  data: {
    title: 'Sales Battlecard — Competitive Talking Points',
    cards: [
      {
        id: 'h1',
        category: 'Pricing Advantage',
        hook: 'We offer 30-50% more value per dollar than any competitor.',
        body: 'At $79/mo, Ultron includes features that cost $199+ elsewhere: unlimited agents, API access, and priority support.',
        color: '#DA4E24',
      },
      {
        id: 'h2',
        category: 'Speed to Value',
        hook: 'Deploy your first AI agent in under 47 minutes.',
        body: 'Average competitor onboarding takes 2-4 weeks. Our guided setup gets teams productive on day one.',
        color: '#22c55e',
      },
      {
        id: 'h3',
        category: 'Integration Depth',
        hook: '250+ native integrations with zero-code connectors.',
        body: 'Unlike Zapier (breadth over depth) or Relevance AI (API-only), we offer deep native integrations.',
        color: '#3b82f6',
      },
      {
        id: 'h4',
        category: 'AI Quality',
        hook: 'Scored 92/100 on AI Quality — the highest in our category.',
        body: 'Our multi-model architecture picks the best model for each task. Competitors use a single model for everything.',
        color: '#a855f7',
      },
    ],
    layout: 'grid',
    insights: [
      'Lead with pricing advantage in mid-market deals — it resonates most with budget-conscious buyers.',
      'Use speed-to-value in competitive bake-offs to create urgency.',
    ],
  },
}

// 7. Outreach Sequence → checklist
const outreachSequence: CanvasTemplate = {
  type: 'checklist',
  data: {
    title: 'GTM Readiness Audit',
    sections: [
      {
        name: 'Positioning & Messaging',
        items: [
          { label: 'ICP clearly defined with firmographic + behavioral criteria', status: 'pass', detail: '3 ICP segments documented with scoring model' },
          { label: 'Value proposition tested with 10+ prospects', status: 'pass', detail: 'Win rate improved 18% after positioning refresh' },
          { label: 'Competitive battle cards up to date', status: 'warning', detail: 'Last updated 45 days ago' },
          { label: 'Pricing page reflects current packaging', status: 'fail', detail: 'Enterprise tier still shows old feature set' },
        ],
      },
      {
        name: 'Sales Infrastructure',
        items: [
          { label: 'CRM pipeline stages match buyer journey', status: 'pass' },
          { label: 'Lead scoring model active and calibrated', status: 'pass', detail: 'MQL threshold set at 65' },
          { label: 'Sales playbook documented for each ICP', status: 'warning', detail: 'Only 2 of 3 ICPs have playbooks' },
          { label: 'Demo environment stable and up to date', status: 'pass' },
        ],
      },
      {
        name: 'Content & Demand Gen',
        items: [
          { label: 'Blog publishing cadence ≥ 2x/week', status: 'fail', detail: 'Currently averaging 0.8 posts/week' },
          { label: 'Email sequences for each funnel stage', status: 'pass' },
          { label: 'Case studies for top 2 verticals', status: 'warning', detail: 'Have SaaS case study, missing fintech' },
          { label: 'SEO keyword strategy documented', status: 'pass' },
        ],
      },
    ],
    insights: [
      'Overall readiness is 67% — the pricing page and blog cadence are the two critical blockers.',
      'Sales infrastructure is the strongest area (75%).',
    ],
  },
}

// 8. Market Analysis Report → chart (line)
const marketAnalysis: CanvasTemplate = {
  type: 'chart',
  data: {
    type: 'line',
    title: 'Monthly Revenue Trend',
    data: [
      { name: 'Jan', value: 12000 },
      { name: 'Feb', value: 15000 },
      { name: 'Mar', value: 18500 },
      { name: 'Apr', value: 17200 },
      { name: 'May', value: 22000 },
      { name: 'Jun', value: 28000 },
      { name: 'Jul', value: 32000 },
      { name: 'Aug', value: 35500 },
    ],
    insights: [
      'Revenue grew 196% from Jan ($12K) to Aug ($35.5K) — strong month-over-month acceleration.',
      'April dip to $17.2K correlates with the Q1 churn spike.',
    ],
  },
}

// 9. SWOT Analysis → swot_grid
const swotAnalysis: CanvasTemplate = {
  type: 'swot_grid',
  data: {
    title: 'Ultron GTM SWOT Analysis',
    strengths: [
      { text: 'AI-native product architecture', detail: 'Built from ground up for autonomous agents' },
      { text: 'Fast time-to-value', detail: 'Average customer deploys first agent in 47 minutes' },
      { text: 'Strong founder-market fit', detail: '40+ years combined B2B SaaS experience' },
      { text: 'Pricing advantage', detail: '30-50% cheaper than competitors at feature parity' },
    ],
    weaknesses: [
      { text: 'Small brand awareness', detail: 'DR 28, only 47 referring domains' },
      { text: 'Limited case studies', detail: 'Only 3 published, need 10+ for enterprise credibility' },
      { text: 'No SOC2 Type II yet', detail: 'Type I complete, Type II audit in progress' },
    ],
    opportunities: [
      { text: 'AI agent market growing 340% YoY', detail: 'Gartner predicts $12B market by 2028' },
      { text: 'Competitor gaps in mid-market', detail: 'Zapier too simple, Relevance too complex' },
      { text: 'Platform ecosystem play', detail: 'Agent marketplace could create network effects' },
    ],
    threats: [
      { text: 'Big tech entering space', detail: 'Microsoft Copilot, Google Duet expanding' },
      { text: 'Funding environment tightening', detail: 'Series B valuations compressed 30%' },
      { text: 'Customer AI fatigue', detail: 'Buyers overwhelmed by AI tool proliferation' },
    ],
    insights: [
      'The mid-market gap is the #1 opportunity.',
      'SOC2 Type II is the most urgent weakness — blocking 4 enterprise deals.',
    ],
  },
}

// 10. Go-to-Market Plan → timeline
const gtmPlan: CanvasTemplate = {
  type: 'timeline',
  data: {
    events: [
      { date: 'Mar 2025', title: 'Seed Round', description: 'Raised $2.5M seed led by Gradient Ventures. Core AI agent infrastructure.', color: '#22c55e' },
      { date: 'Jul 2025', title: 'Product Launch', description: 'Launched v1.0 with 5 AI agents. Onboarded first 50 beta customers.', color: '#3b82f6' },
      { date: 'Nov 2025', title: 'Series A', description: 'Closed $12M Series A at $60M valuation. Expanding to 25 people.', color: '#a855f7' },
      { date: 'Feb 2026', title: 'Enterprise Launch', description: 'Deployed for 3 Fortune 500 companies. SOC2 compliance, SSO, analytics.', color: '#f59e0b' },
      { date: 'Jun 2026', title: 'Platform v3.0', description: 'Canvas components, client portal, composable agent architecture. 500+ active teams.', color: '#DA4E24' },
    ],
    insights: [
      '11 months from seed to enterprise deployment — faster than industry average of 24 months.',
      'Revenue milestone: $0 to $500K ARR in first 4 months post-launch.',
    ],
  },
}

// 11. Investor Brief → score_card
const investorBrief: CanvasTemplate = {
  type: 'score_card',
  data: {
    title: 'SEO Health Check',
    overallScore: 72,
    metrics: [
      { name: 'Page Speed', score: 85, detail: 'Desktop 92ms, Mobile 1.8s — above average', status: 'good' },
      { name: 'Mobile Usability', score: 91, detail: 'All pages mobile-friendly, responsive design verified', status: 'good' },
      { name: 'SSL Certificate', score: 100, detail: 'Valid TLS 1.3, HSTS enabled, no mixed content', status: 'good' },
      { name: 'Indexing', score: 45, detail: '23 pages indexed of 48 total — sitemap needs update', status: 'warning' },
      { name: 'Backlinks', score: 32, detail: '47 referring domains, DR 28 — need link building', status: 'critical' },
      { name: 'Core Web Vitals', score: 68, detail: 'LCP 2.4s (needs work), FID 95ms (good)', status: 'warning' },
    ],
    insights: [
      'Backlinks are the biggest weakness (32/100). Link-building could boost DR from 28 to 40+ in 90 days.',
      '25 pages are not indexed — check for noindex tags and thin content.',
    ],
  },
}

/** Ordered to match TEMPLATE_WORKFLOWS in template-workflows.ts */
export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  revenueDashboard,
  icpBuilder,
  coldEmailCampaign,
  competitorMap,
  leadPipeline,
  salesBattlecard,
  outreachSequence,
  marketAnalysis,
  swotAnalysis,
  gtmPlan,
  investorBrief,
]
