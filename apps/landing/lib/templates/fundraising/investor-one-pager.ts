import { Template } from '../registry';

export const investorOnePager: Template = {
  id: 'fundraising-investor-one-pager',
  name: 'Investor One-Pager',
  description:
    'A concise one-page overview for investor outreach. Covers the essentials -company, problem, solution, traction, and ask -in a scannable format.',
  category: 'fundraising',
  icon: 'file-text',
  canvasType: 'structured_doc',
  variables: [
    {
      key: 'company_name',
      label: 'Company Name',
      type: 'text_input',
      default: 'Your Company',
    },
  ],
  defaultData: {
    title: '[company_name] -Investor One-Pager',
    sections: [
      {
        heading: 'Company Overview',
        content:
          '[company_name] is a [category] platform that helps [target customer] achieve [primary outcome]. Founded in [year], we are [stage] and based in [location].',
        highlights: [
          { label: 'Stage', value: 'Series A' },
          { label: 'Founded', value: '2024' },
          { label: 'Team', value: '18 people' },
          { label: 'HQ', value: 'San Francisco, CA' },
        ],
      },
      {
        heading: 'Problem & Solution',
        content:
          'Problem: [Target customers] struggle with [pain point]. This costs them [quantified impact] and existing solutions fail because [gap in market].\n\nSolution: [company_name] provides [solution description]. Unlike [competitors], we [key differentiator] which results in [measurable improvement].',
      },
      {
        heading: 'Market Opportunity',
        content:
          'We operate in a $[X]B market growing at [X]% CAGR. Our initial beachhead is [specific segment] representing $[X]M in near-term opportunity.',
        highlights: [
          { label: 'TAM', value: '$12B' },
          { label: 'SAM', value: '$3.2B' },
          { label: 'SOM (3yr)', value: '$180M' },
        ],
      },
      {
        heading: 'Traction',
        content:
          'We have demonstrated strong product-market fit with accelerating growth across key metrics.',
        highlights: [
          { label: 'ARR', value: '$1.5M' },
          { label: 'MoM Growth', value: '15%' },
          { label: 'Customers', value: '85+' },
          { label: 'NRR', value: '125%' },
          { label: 'Logo Churn', value: '<2%' },
          { label: 'ACV', value: '$18K' },
        ],
      },
      {
        heading: 'Business Model',
        content:
          'SaaS subscription with tiered pricing. Average contract value of $18K with 78% gross margins. Primary acquisition through outbound sales and content-led inbound, with a blended CAC of $4,200 and LTV:CAC of 5.2:1.',
      },
      {
        heading: 'The Ask',
        content:
          'Raising $8M Series A to scale go-to-market, expand the product platform, and reach $6M ARR within 18 months.\n\nUse of Funds:\n• 50% -Sales & Marketing (hire 6 AEs, scale demand gen)\n• 35% -Product & Engineering (new platform capabilities)\n• 15% -G&A & Operations',
        highlights: [
          { label: 'Raising', value: '$8M' },
          { label: 'Target ARR', value: '$6M (18mo)' },
          { label: 'Runway', value: '24+ months' },
        ],
      },
    ],
    insights: [
      'Send the one-pager ahead of first meetings to let investors arrive prepared',
      'Update traction metrics monthly -stale numbers undermine credibility',
      'Pair with a 2-minute Loom video walkthrough for cold outreach to boost response rates',
    ],
  },
};

export default investorOnePager;
