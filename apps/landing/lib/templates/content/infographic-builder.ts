import { Template } from '../registry';

export const infographicBuilder: Template = {
  id: 'content-infographic-builder',
  name: 'Infographic Builder',
  description:
    'Design data-driven infographics that simplify complex information. Structured sections with stats, lists, and visual comparisons.',
  category: 'content',
  icon: 'bar-chart-2',
  canvasType: 'infographic',
  variables: [
    {
      key: 'industry',
      label: 'Industry',
      type: 'text_input',
      default: 'SaaS',
    },
  ],
  defaultData: {
    title: '[industry] Growth Metrics That Matter',
    subtitle:
      'The key numbers every [industry] founder and operator should track to drive sustainable growth.',
    sections: [
      {
        heading: 'Revenue Health',
        type: 'stat' as const,
        items: [
          {
            label: 'Net Revenue Retention',
            value: '120%+',
            detail: 'Best-in-class [industry] companies retain and expand existing revenue',
            icon: 'trending-up',
          },
          {
            label: 'Gross Margin',
            value: '70-80%',
            detail: 'Target range for healthy [industry] unit economics',
            icon: 'percent',
          },
          {
            label: 'ARR Growth Rate',
            value: '3x  3x  2x  2x  2x',
            detail: 'T2D3 growth trajectory from $2M to $100M+ ARR',
            icon: 'zap',
          },
        ],
      },
      {
        heading: 'Customer Acquisition',
        type: 'comparison' as const,
        items: [
          {
            label: 'CAC Payback Period',
            value: '< 18 months',
            detail: 'Time to recover full customer acquisition cost',
            icon: 'clock',
          },
          {
            label: 'LTV:CAC Ratio',
            value: '3:1 or higher',
            detail: 'Benchmark for efficient growth. Below 3:1 signals overspending.',
            icon: 'scale',
          },
          {
            label: 'Magic Number',
            value: '> 0.75',
            detail: 'Net new ARR / S&M spend last quarter. Above 1.0 = highly efficient.',
            icon: 'sparkles',
          },
        ],
      },
      {
        heading: 'Retention & Engagement',
        type: 'list' as const,
        items: [
          {
            label: 'Logo Churn',
            value: '< 5% annually',
            detail: 'For enterprise [industry]; SMB can tolerate up to 3-5% monthly',
          },
          {
            label: 'DAU/MAU Ratio',
            value: '> 40%',
            detail: 'Stickiness metric -measures daily engagement among monthly users',
          },
          {
            label: 'Time to Value',
            value: '< 1 day',
            detail: 'How fast new users reach their "aha moment"',
          },
          {
            label: 'NPS Score',
            value: '> 50',
            detail: 'World-class is 70+. Below 30 signals product-market fit issues.',
          },
        ],
      },
      {
        heading: 'Efficiency Benchmarks',
        type: 'flow' as const,
        items: [
          {
            label: 'Rule of 40',
            value: 'Growth % + Profit % ≥ 40',
            detail: 'Balances growth against profitability. Top quartile exceeds 60.',
            icon: 'calculator',
          },
          {
            label: 'Burn Multiple',
            value: '< 1.5x',
            detail: 'Net burn / net new ARR. Below 1x is exceptional efficiency.',
            icon: 'flame',
          },
          {
            label: 'ARR per Employee',
            value: '$150K-$300K',
            detail: 'Operational efficiency metric. Best-in-class exceeds $300K.',
            icon: 'users',
          },
        ],
      },
      {
        heading: 'What Top Operators Say',
        type: 'quote' as const,
        items: [
          {
            label: 'Jason Lemkin',
            value: '"If NRR is above 120%, almost everything else fixes itself."',
            detail: 'Founder, SaaStr',
          },
          {
            label: 'David Sacks',
            value: '"Burn multiple is the best metric for capital efficiency."',
            detail: 'GP, Craft Ventures',
          },
        ],
      },
    ],
    source: 'Compiled from OpenView, Bessemer, SaaStr, and KeyBanc benchmarks (2025)',
    insights: [
      'Focus on NRR above all else -it compounds and reduces dependency on new logos',
      'Track leading indicators (activation, engagement) not just lagging ones (churn, revenue)',
      'Benchmark against your stage, not just top-quartile public companies',
      'The Rule of 40 matters most from Series B onward; pre-Series A focus on growth rate alone',
    ],
  },
};

export default infographicBuilder;
