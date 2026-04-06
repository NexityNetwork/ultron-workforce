export interface TemplateWorkflow {
  id: string
  name: string
  color: string
  seedPath?: string
  description: string
}

export const TEMPLATE_WORKFLOWS: TemplateWorkflow[] = [
  {
    id: 'canvas-revenue-dashboard',
    name: 'Revenue Dashboard',
    color: '#2ABBF8',
    description:
      'Pipeline, bookings, and growth in one structured view. Updated live as agents process data.',
  },
  {
    id: 'canvas-icp-builder',
    name: 'ICP Builder',
    color: '#00F701',
    description:
      'Define your ideal customer profile with precise segmentation by industry, size, and fit score.',
  },
  {
    id: 'canvas-cold-email',
    name: 'Cold Email Campaign',
    color: '#FFCC02',
    description:
      'Personalized sequences for every prospect. Ready to send, tracked, and optimized.',
  },
  {
    id: 'canvas-lead-pipeline',
    name: 'Lead Pipeline Tracker',
    color: '#FF6B2C',
    description:
      'Visualize every deal from first touch to close. Stages update on every new signal.',
  },
  {
    id: 'canvas-battlecard',
    name: 'Sales Battlecard',
    color: '#6366F1',
    description:
      'Sharp, structured talking points for competitive deals. Built from live data every cycle.',
  },
  {
    id: 'canvas-outreach',
    name: 'Outreach Sequence',
    color: '#F43F5E',
    description:
      'Multi-step outreach built for your target segment. Personalized, scheduled, and tracked.',
  },
  {
    id: 'canvas-market-analysis',
    name: 'Market Analysis Report',
    color: '#14B8A6',
    description:
      'Trends, opportunities, and risks across your market. Delivered as a structured report.',
  },
  {
    id: 'canvas-swot',
    name: 'SWOT Analysis',
    color: '#F59E0B',
    description:
      'Strengths, weaknesses, opportunities, and threats in seconds. Ready to present.',
  },
  {
    id: 'canvas-gtm',
    name: 'Go-to-Market Plan',
    color: '#06B6D4',
    description:
      'Launch products or markets with a clear plan. Owners, milestones, and dependencies.',
  },
]
