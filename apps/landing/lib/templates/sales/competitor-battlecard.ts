import { Template } from '../registry';

export const competitorBattlecard: Template = {
  id: 'sales-competitor-battlecard',
  name: 'Competitor Battlecard',
  description:
    'Side-by-side competitive analysis across key buying dimensions. Arm your sales team with positioning ammunition.',
  category: 'sales',
  icon: 'swords',
  canvasType: 'comparison_table',
  variables: [
    {
      key: 'competitor_a',
      label: 'Competitor A',
      type: 'text_input',
      default: 'Competitor A',
    },
    {
      key: 'competitor_b',
      label: 'Competitor B',
      type: 'text_input',
      default: 'Competitor B',
    },
  ],
  defaultData: {
    entities: [
      {
        name: 'Our Product',
        dimensions: {
          pricing: {
            value: 'Transparent, usage-based pricing starting at $49/mo. Annual discount available.',
            score: 8,
          },
          features: {
            value: 'Full-stack platform with AI-powered automation, native integrations, and advanced analytics.',
            score: 9,
          },
          integrations: {
            value: '150+ native integrations including Salesforce, HubSpot, Slack, and all major CRMs.',
            score: 9,
          },
          ease_of_use: {
            value: 'No-code setup, intuitive UI, average onboarding time of 2 days.',
            score: 9,
          },
          support: {
            value: 'Dedicated CSM for all plans. 24/7 chat support. 99.9% uptime SLA.',
            score: 8,
          },
          market_position: {
            value: 'Fast-growing challenger with strong NPS (72) and G2 Leader ranking.',
            score: 7,
          },
        },
      },
      {
        name: '[competitor_a]',
        dimensions: {
          pricing: {
            value: 'Per-seat pricing, expensive at scale. Hidden costs for premium features.',
            score: 5,
          },
          features: {
            value: 'Broad feature set but aging UI. Limited AI capabilities. Strong in legacy workflows.',
            score: 7,
          },
          integrations: {
            value: '200+ integrations but many require middleware. API rate limits on lower tiers.',
            score: 7,
          },
          ease_of_use: {
            value: 'Steep learning curve. Average onboarding time of 3-4 weeks. Requires admin training.',
            score: 5,
          },
          support: {
            value: 'Tiered support -enterprise only gets dedicated CSM. Long ticket resolution times.',
            score: 5,
          },
          market_position: {
            value: 'Established incumbent with large install base. Slower innovation cycle.',
            score: 8,
          },
        },
      },
      {
        name: '[competitor_b]',
        dimensions: {
          pricing: {
            value: 'Freemium model with aggressive upsells. Enterprise pricing is opaque and negotiable.',
            score: 6,
          },
          features: {
            value: 'Modern UI with strong collaboration features. Limited depth in analytics and reporting.',
            score: 7,
          },
          integrations: {
            value: '80+ integrations. Strong in modern SaaS stack, weak in legacy/on-prem systems.',
            score: 6,
          },
          ease_of_use: {
            value: 'Slick onboarding for SMB. Enterprise config can be complex. Good docs.',
            score: 7,
          },
          support: {
            value: 'Community-driven support. Paid support tiers start at $500/mo. Slow email response.',
            score: 4,
          },
          market_position: {
            value: 'Well-funded startup, strong brand in SMB. Limited enterprise traction so far.',
            score: 6,
          },
        },
      },
    ],
    insights: [
      'Lead with ease of use and time-to-value when competing against [competitor_a]',
      'Emphasize integrations depth and support quality against [competitor_b]',
      'Our pricing transparency is a differentiator -push for early pricing discussions',
      'Request a bake-off or pilot when prospect is evaluating all three',
    ],
  },
};

export default competitorBattlecard;
