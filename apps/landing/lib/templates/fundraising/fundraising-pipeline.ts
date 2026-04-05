import { Template } from '../registry';

export const fundraisingPipeline: Template = {
  id: 'fundraising-fundraising-pipeline',
  name: 'Fundraising Pipeline',
  description:
    'Track investor conversations across pipeline stages. Kanban board from target list to closed, with investor scores and next steps.',
  category: 'fundraising',
  icon: 'git-merge',
  canvasType: 'kanban',
  defaultData: {
    columns: [
      {
        id: 'target-list',
        name: 'Target List',
        cards: [
          {
            id: 'inv-001',
            title: 'Accel -Series A',
            subtitle: 'Partner: Sarah Kim',
            score: 72,
            note: 'Strong fit for B2B SaaS. Recent investments in our space. Request warm intro via portfolio company CEO.',
            tags: ['tier-1', 'b2b-focus'],
          },
          {
            id: 'inv-002',
            title: 'Index Ventures -Series A',
            subtitle: 'Partner: Martin Weber',
            score: 68,
            note: 'Active in European SaaS. Published thesis aligns with our GTM. Get intro from founder network.',
            tags: ['tier-1', 'europe'],
          },
          {
            id: 'inv-003',
            title: 'Point Nine Capital -Series A',
            subtitle: 'Partner: Ricardo Sequerra',
            score: 78,
            note: 'B2B SaaS specialists. Published "SaaS Funding Napkin" -know our metrics well. Direct outreach via LinkedIn.',
            tags: ['tier-1', 'saas-specialist'],
          },
        ],
      },
      {
        id: 'reached-out',
        name: 'Reached Out',
        cards: [
          {
            id: 'inv-004',
            title: 'Balderton Capital',
            subtitle: 'Partner: James Wise',
            score: 65,
            note: 'Sent intro email via portfolio founder. Awaiting response. Follow up Friday if no reply.',
            tags: ['tier-1', 'europe'],
          },
          {
            id: 'inv-005',
            title: 'Creandum',
            subtitle: 'Partner: Johan Brenner',
            score: 60,
            note: 'Connected at SaaStr Europa. Sent one-pager. They requested deck -sending tomorrow.',
            tags: ['tier-2', 'nordics'],
          },
        ],
      },
      {
        id: 'first-meeting',
        name: 'First Meeting',
        cards: [
          {
            id: 'inv-006',
            title: 'Bessemer Venture Partners',
            subtitle: 'Partner: Alex Ferrara',
            score: 80,
            note: 'Introductory call went well. Strong interest in NRR numbers. Scheduling deep-dive for next week.',
            tags: ['tier-1', 'cloud-focus'],
          },
          {
            id: 'inv-007',
            title: 'Notion Capital',
            subtitle: 'Partner: Chris Sherwood',
            score: 70,
            note: 'Partner meeting completed. Asked detailed questions about competitive moat. Sending customer references.',
            tags: ['tier-2', 'b2b-focus'],
          },
        ],
      },
      {
        id: 'due-diligence',
        name: 'Due Diligence',
        cards: [
          {
            id: 'inv-008',
            title: 'Insight Partners',
            subtitle: 'Partner: Lonne Jaffe',
            score: 88,
            note: 'Completed 3 partner meetings. Customer reference calls scheduled. Reviewing data room. Strong verbal interest.',
            tags: ['tier-1', 'growth-stage'],
          },
        ],
      },
      {
        id: 'term-sheet',
        name: 'Term Sheet',
        cards: [
          {
            id: 'inv-009',
            title: 'Sequoia Capital',
            subtitle: 'Partner: Luciana Lixandru',
            score: 95,
            note: 'Term sheet received: $8M at $32M pre-money. 1x non-participating preferred. Standard terms. Reviewing with counsel.',
            tags: ['tier-1', 'lead-candidate'],
          },
        ],
      },
      {
        id: 'closed',
        name: 'Closed',
        cards: [],
      },
    ],
    insights: [
      'Run a tight process: 2-3 weeks from first meeting to term sheet is ideal',
      'Aim for 2+ term sheets to create competitive tension and improve terms',
      'Sequoia term sheet sets a strong benchmark -use it to accelerate other conversations',
      'Prioritize Insight Partners DD -having two tier-1 options maximizes leverage',
      'Keep target list warm: even declined investors today may lead your next round',
    ],
  },
};

export default fundraisingPipeline;
