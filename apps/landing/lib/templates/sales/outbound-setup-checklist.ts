import { Template } from '../registry';

export const outboundSetupChecklist: Template = {
  id: 'sales-outbound-setup-checklist',
  name: 'Outbound Setup Checklist',
  description:
    'Step-by-step checklist for setting up your outbound tech stack across 3 phases: Foundation, Quality Enhancement, and Scale.',
  category: 'sales',
  icon: 'check-square',
  canvasType: 'checklist',
  variables: [
    {
      key: 'product_name',
      label: 'Your Product Name',
      type: 'text_input',
      default: 'Our Product',
    },
  ],
  defaultData: {
    title: 'Outbound Setup Checklist -[product_name]',
    sections: [
      {
        heading: 'Phase 1: Foundation',
        items: [
          { label: 'Define ICP and break into sub-cohorts', status: 'pending', detail: 'Segment by location, title, language, industry.' },
          { label: 'Set up CRM', status: 'pending', detail: 'Ensure integration with outreach tool.' },
          { label: 'Set up contact data source', status: 'pending', detail: 'LinkedIn Sales Navigator + export tool.' },
          { label: 'Set up multichannel outreach tool', status: 'pending', detail: 'Create campaigns per ICP segment, configure DNS.' },
          { label: 'Launch first campaigns and track metrics', status: 'pending', detail: '30% LinkedIn acceptance, 50% open, <5% bounce, 10% response.' },
        ],
      },
      {
        heading: 'Phase 2: Quality',
        items: [
          { label: 'Analyze Phase 1 winners', status: 'pending', detail: 'Which cohorts had best response and interest rates?' },
          { label: 'Add enrichment tool', status: 'pending', detail: 'Waterfall enrichment for verified emails and phone numbers.' },
          { label: 'Add scraping for personalization context', status: 'pending', detail: 'Job boards, LinkedIn activity, event attendees.' },
          { label: 'Add trigger-based outreach', status: 'pending', detail: 'New hires, funding, job postings as timing signals.' },
        ],
      },
      {
        heading: 'Phase 3: Scale',
        items: [
          { label: 'Set up outreach infrastructure', status: 'pending', detail: 'Domain rotation + email warm-up.' },
          { label: 'Separate LinkedIn and email tools', status: 'pending', detail: 'Dedicated tools per channel outperform multichannel.' },
          { label: 'Connect tools via automation', status: 'pending', detail: 'Zapier/Make for automated lead flow.' },
          { label: 'Add web visitor tracking', status: 'pending', detail: 'Identify and route high-intent visitors.' },
        ],
      },
    ],
    insights: [
      'Complete Phase 1 fully before Phase 2. Validate ICP and messaging before investing in more tools.',
      'Most outbound fails because of targeting, not tools.',
      'Be cost-conscious: validate with free tiers before annual commitments.',
    ],
  },
};

export default outboundSetupChecklist;
