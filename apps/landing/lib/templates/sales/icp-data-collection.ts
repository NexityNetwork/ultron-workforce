import { Template } from '../registry';

export const icpDataCollection: Template = {
  id: 'sales-icp-data-collection',
  name: 'ICP Data Collection Checklist',
  description:
    'Comprehensive checklist for collecting customer data, running segmentation analysis, and revamping your GTM strategy around your identified ICP.',
  category: 'sales',
  icon: 'clipboard',
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
    title: 'ICP Data Collection -[product_name]',
    sections: [
      {
        heading: 'Customer Data Sources',
        items: [
          { label: 'Firmographics (industry, size, revenue, location)', status: 'pending', detail: 'Export from CRM. Cover 12+ months.' },
          { label: 'Technographics (tech stack, previous solution)', status: 'pending', detail: 'What tools they use alongside yours.' },
          { label: 'Product usage data (logins, feature adoption)', status: 'pending', detail: 'From product analytics.' },
          { label: 'Sales data (cycle, source, deal value)', status: 'pending', detail: 'Include won and lost deals.' },
          { label: 'Persona data (champion, decision-maker)', status: 'pending', detail: 'Titles, departments, seniority.' },
          { label: 'Support data (tickets, NPS, health score)', status: 'pending', detail: 'From help desk system.' },
          { label: 'Payment data (revenue, billing, churn)', status: 'pending', detail: 'From Stripe or accounting.' },
        ],
      },
      {
        heading: 'Segmentation & Scoring',
        items: [
          { label: 'First-pass segmentation by obvious criteria', status: 'pending', detail: 'Industry, company size, geography.' },
          { label: 'Deep-dive with advanced filters', status: 'pending', detail: 'Vertical metrics, use cases, personas.' },
          { label: 'Score segments against winning indicators', status: 'pending', detail: '1-5 per category in scoring matrix.' },
          { label: 'Identify winning patterns', status: 'pending', detail: 'Which segments score highest overall?' },
        ],
      },
      {
        heading: 'GTM Revamp',
        items: [
          { label: 'Recalibrate positioning and messaging', status: 'pending', detail: 'Adapt for your winning segment.' },
          { label: 'Revamp assets (website, deck, LinkedIn)', status: 'pending', detail: 'Every touchpoint speaks to ICP.' },
          { label: 'Focus channels on where ICP hangs out', status: 'pending', detail: 'Cut everything else.' },
        ],
      },
    ],
    insights: [
      'Run the same exercise for lost deals to understand ICP anti-patterns.',
      'Focus mode > hustle mode for reaching Product-Market Fit.',
    ],
  },
};

export default icpDataCollection;
