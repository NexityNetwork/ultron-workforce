import { Template } from '../registry';

export const gtmChecklist: Template = {
  id: 'marketing-gtm-checklist',
  name: 'GTM Checklist',
  description:
    'Comprehensive go-to-market readiness checklist covering positioning, sales infrastructure, content, and analytics.',
  category: 'marketing',
  icon: 'rocket',
  canvasType: 'checklist',
  defaultData: {
    title: 'Go-To-Market Readiness Checklist',
    sections: [
      {
        name: 'Positioning & Messaging',
        items: [
          {
            label: 'Core positioning statement finalized and approved',
            status: 'pass',
            detail: 'Reviewed by marketing, sales, and product leadership.',
          },
          {
            label: 'Competitive differentiation documented',
            status: 'pass',
            detail: 'Battlecards created for top 3 competitors.',
          },
          {
            label: 'Value propositions mapped to each persona',
            status: 'warning',
            detail: 'Buyer persona messaging complete. User persona still in draft.',
          },
          {
            label: 'Elevator pitch tested with 5+ prospects',
            status: 'fail',
            detail: 'Only tested internally. Need external validation.',
          },
          {
            label: 'Messaging framework shared with all customer-facing teams',
            status: 'warning',
            detail: 'Sales team briefed. CS and support teams pending.',
          },
        ],
      },
      {
        name: 'Sales Infrastructure',
        items: [
          {
            label: 'CRM configured with new product fields and pipeline stages',
            status: 'pass',
          },
          {
            label: 'Lead scoring model updated for new ICP',
            status: 'pass',
          },
          {
            label: 'Sales playbook and objection handling guide created',
            status: 'warning',
            detail: 'Playbook drafted. Needs review from top-performing AEs.',
          },
          {
            label: 'Demo environment set up with sample data',
            status: 'fail',
            detail: 'Engineering ticket created but not yet prioritized.',
          },
          {
            label: 'Pricing calculator and proposal templates ready',
            status: 'pass',
          },
        ],
      },
      {
        name: 'Content & Demand Gen',
        items: [
          {
            label: 'Landing page live with conversion tracking',
            status: 'pass',
          },
          {
            label: 'Launch blog post drafted and reviewed',
            status: 'warning',
            detail: 'First draft complete. Awaiting final edits.',
          },
          {
            label: 'Email sequences configured for launch list',
            status: 'pass',
            detail: '3-email launch sequence + 5-email nurture sequence ready.',
          },
          {
            label: 'Social media launch posts scheduled',
            status: 'fail',
            detail: 'Content created but not yet loaded into scheduling tool.',
          },
        ],
      },
      {
        name: 'Analytics & Tracking',
        items: [
          {
            label: 'UTM parameters defined for all launch channels',
            status: 'pass',
          },
          {
            label: 'Conversion events configured in analytics platform',
            status: 'pass',
          },
          {
            label: 'Launch dashboard created with key metrics',
            status: 'warning',
            detail: 'Dashboard built. Need to add pipeline attribution metrics.',
          },
          {
            label: 'Weekly reporting cadence established with stakeholders',
            status: 'fail',
            detail: 'Need to schedule recurring sync with leadership.',
          },
        ],
      },
    ],
    insights: [
      '12 of 18 items complete (67%). Focus on the 4 failing items before launch.',
      'Critical blocker: Demo environment is not ready -escalate with engineering.',
      'Sales enablement items are mostly green -team is well-prepared.',
      'Consider delaying launch by 1 week to close remaining gaps.',
    ],
  },
};

export default gtmChecklist;
