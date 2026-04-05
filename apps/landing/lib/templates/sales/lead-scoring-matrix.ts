import { Template } from '../registry';

export const leadScoringMatrix: Template = {
  id: 'sales-lead-scoring-matrix',
  name: 'Lead Scoring Matrix',
  description:
    'Prioritize leads by mapping fit vs. intent. Quickly identify which prospects deserve immediate attention and which need nurturing.',
  category: 'sales',
  icon: 'target',
  canvasType: 'matrix',
  defaultData: {
    title: 'Lead Scoring Matrix',
    x_axis: ['Low Fit', 'High Fit'],
    y_axis: ['Low Intent', 'High Intent'],
    quadrants: ['Monitor', 'Priority Leads', 'Deprioritize', 'Nurture'],
    items: {
      tl: [
        'Visited pricing page 3x but wrong industry',
        'Downloaded whitepaper, company too small',
      ],
      tr: [
        'Requested demo, ICP match, budget confirmed',
        'Attended webinar, enterprise account, active eval',
        'Inbound from target account, decision maker',
      ],
      bl: [
        'Cold list import, no engagement',
        'Blog subscriber only, non-target segment',
      ],
      br: [
        'ICP match but no recent activity',
        'Referred by partner, awaiting first engagement',
        'Right company size, signed up for free tier',
      ],
    },
    insights: [
      'Priority Leads (High Fit + High Intent): Route to AEs within 1 hour',
      'Nurture (High Fit + Low Intent): Add to targeted drip campaigns',
      'Monitor (Low Fit + High Intent): Watch for expansion into ICP criteria',
      'Deprioritize (Low Fit + Low Intent): Remove from active sequences',
    ],
  },
};

export default leadScoringMatrix;
