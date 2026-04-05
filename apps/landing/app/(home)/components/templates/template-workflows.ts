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
      'See pipeline, bookings, and growth in one structured view. Updated live as your agents pull and process data.',
  },
  {
    id: 'canvas-icp-builder',
    name: 'ICP Builder',
    color: '#00F701',
    description:
      'Define your ideal customer profile with precise segmentation. Filter by industry, company size, behavior, and fit score.',
  },
  {
    id: 'canvas-cold-email',
    name: 'Cold Email Campaign',
    color: '#FFCC02',
    description:
      'Generate personalized sequences for every prospect in minutes. Ready to send, tracked, and optimized from one place.',
  },
  {
    id: 'canvas-lead-pipeline',
    name: 'Lead Pipeline Tracker',
    color: '#FF6B2C',
    description:
      'Visualize every deal from first touch to close. Agents update stages automatically on every new signal.',
  },
  {
    id: 'canvas-battlecard',
    name: 'Sales Battlecard',
    color: '#6366F1',
    description:
      'Win competitive deals with sharp, structured talking points. Built from live data and updated every cycle.',
  },
  {
    id: 'canvas-outreach',
    name: 'Outreach Sequence',
    color: '#F43F5E',
    description:
      'Multi-step outreach built for your exact target segment. Personalized, scheduled, and tracked from one canvas.',
  },
  {
    id: 'canvas-market-analysis',
    name: 'Market Analysis Report',
    color: '#14B8A6',
    description:
      'Surface trends, opportunities, and risks across your market. Delivered as a structured report ready to share.',
  },
  {
    id: 'canvas-swot',
    name: 'SWOT Analysis',
    color: '#F59E0B',
    description:
      'Assess strengths, weaknesses, opportunities, and threats in seconds. Built from your current context and ready to present.',
  },
  {
    id: 'canvas-gtm',
    name: 'Go-to-Market Plan',
    color: '#06B6D4',
    description:
      'Launch new products or markets with a clear, structured plan. Assign owners, set milestones, and track every dependency.',
  },
]
