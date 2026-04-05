import { Template } from '../registry';

export const dealPipelineKanban: Template = {
  id: 'sales-deal-pipeline-kanban',
  name: 'Deal Pipeline Kanban',
  description:
    'Visualize your active deals across pipeline stages. Track deal health, next steps, and revenue at a glance.',
  category: 'sales',
  icon: 'columns',
  canvasType: 'kanban',
  defaultData: {
    columns: [
      {
        id: 'discovery',
        name: 'Discovery',
        cards: [
          {
            id: 'deal-001',
            title: 'Acme Corp -Enterprise Plan',
            subtitle: '$48,000 ARR',
            score: 62,
            note: 'Initial call completed. Need to identify technical champion.',
            tags: ['enterprise', 'inbound'],
          },
          {
            id: 'deal-002',
            title: 'Nova Labs -Team Plan',
            subtitle: '$12,000 ARR',
            score: 45,
            note: 'Responded to cold outreach. Booked discovery for next week.',
            tags: ['mid-market', 'outbound'],
          },
        ],
      },
      {
        id: 'demo-scheduled',
        name: 'Demo Scheduled',
        cards: [
          {
            id: 'deal-003',
            title: 'Bright Health -Pro Plan',
            subtitle: '$24,000 ARR',
            score: 71,
            note: 'Demo with VP Sales on Thursday. Prep competitive positioning vs. Gong.',
            tags: ['mid-market', 'inbound'],
          },
        ],
      },
      {
        id: 'proposal-sent',
        name: 'Proposal Sent',
        cards: [
          {
            id: 'deal-004',
            title: 'TechFlow Inc -Enterprise Plan',
            subtitle: '$72,000 ARR',
            score: 78,
            note: 'Proposal sent last Monday. Follow up scheduled. Legal reviewing MSA.',
            tags: ['enterprise', 'partner-referred'],
          },
          {
            id: 'deal-005',
            title: 'DataSync -Team Plan',
            subtitle: '$18,000 ARR',
            score: 65,
            note: 'Waiting on procurement approval. Champion is pushing internally.',
            tags: ['mid-market', 'inbound'],
          },
        ],
      },
      {
        id: 'negotiation',
        name: 'Negotiation',
        cards: [
          {
            id: 'deal-006',
            title: 'Global Retail Co -Enterprise Plan',
            subtitle: '$96,000 ARR',
            score: 85,
            note: 'Negotiating multi-year discount. Legal redlines received, 3 items remaining.',
            tags: ['enterprise', 'inbound'],
          },
        ],
      },
      {
        id: 'closed-won',
        name: 'Closed Won',
        cards: [
          {
            id: 'deal-007',
            title: 'Meridian Software -Pro Plan',
            subtitle: '$36,000 ARR',
            score: 100,
            note: 'Signed! Handoff to CS scheduled for Friday.',
            tags: ['mid-market', 'outbound'],
          },
        ],
      },
    ],
    insights: [
      'Total pipeline value: $306,000 ARR across 7 deals',
      'Average deal score in Negotiation: 85 -high close probability',
      'Consider accelerating DataSync deal with limited-time incentive',
      '2 enterprise deals in late stages represent 55% of pipeline value',
    ],
  },
};

export default dealPipelineKanban;
