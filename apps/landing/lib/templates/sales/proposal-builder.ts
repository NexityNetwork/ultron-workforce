import { Template } from '../registry';

export const proposalBuilder: Template = {
  id: 'sales-proposal-builder',
  name: 'Proposal Builder',
  description:
    'Structured sales proposal template with all essential sections. Fill in the blanks to generate a professional proposal.',
  category: 'sales',
  icon: 'file-text',
  canvasType: 'structured_doc',
  variables: [
    {
      key: 'client_name',
      label: 'Client Name',
      type: 'text_input',
      default: 'Client Co',
    },
    {
      key: 'project_name',
      label: 'Project Name',
      type: 'text_input',
      default: 'Platform Implementation',
    },
  ],
  defaultData: {
    title: 'Proposal: [project_name] for [client_name]',
    subtitle: 'Prepared by Your Company',
    sections: [
      {
        heading: 'Executive Summary',
        content:
          'This proposal outlines our recommended approach to [project_name] for [client_name]. Based on our discovery conversations, we understand that [client_name] is looking to streamline operations, improve team productivity, and drive measurable revenue growth. Our solution is purpose-built to address these goals with minimal disruption to your existing workflows.',
      },
      {
        heading: 'Problem Statement',
        content:
          '[client_name] currently faces several challenges that are limiting growth and operational efficiency:',
        items: [
          'Manual processes consuming 15+ hours per week across the team',
          'Lack of visibility into pipeline health and forecasting accuracy',
          'Fragmented tool stack creating data silos between sales, marketing, and CS',
          'Inability to scale current workflows without proportional headcount increases',
        ],
      },
      {
        heading: 'Proposed Solution',
        content:
          'We recommend a phased implementation of our platform tailored to [client_name]\'s specific requirements:',
        items: [
          'Phase 1 (Weeks 1-2): Core platform setup, data migration, and CRM integration',
          'Phase 2 (Weeks 3-4): Workflow automation configuration and team onboarding',
          'Phase 3 (Weeks 5-6): Advanced analytics dashboards and custom reporting',
          'Phase 4 (Ongoing): Optimization, quarterly business reviews, and expansion',
        ],
      },
      {
        heading: 'Pricing',
        content:
          'Our pricing for [project_name] is structured to align with [client_name]\'s growth:',
        items: [
          'Platform License: $4,000/month (annual commitment)',
          'Implementation & Onboarding: $8,000 one-time fee',
          'Dedicated Customer Success Manager: Included',
          'Annual commitment total: $56,000 (saving 15% vs. monthly billing)',
        ],
      },
      {
        heading: 'Timeline',
        content:
          'We propose the following timeline to ensure a smooth rollout with minimal disruption to [client_name]\'s operations:',
        items: [
          'Week 0: Contract signed, kickoff call scheduled',
          'Weeks 1-2: Technical setup, data migration, integrations live',
          'Weeks 3-4: Team training sessions (3x 1-hour workshops)',
          'Week 5: Go-live with full platform access',
          'Week 6: First optimization review with your CSM',
        ],
      },
      {
        heading: 'Next Steps',
        content:
          'To move forward with [project_name], we recommend the following immediate actions:',
        items: [
          'Schedule a 30-minute alignment call with key stakeholders',
          'Complete the technical requirements questionnaire (attached)',
          'Review and sign the Master Services Agreement',
          'Set a target go-live date with your internal team',
        ],
      },
    ],
    metadata: {
      client: '[client_name]',
      date: 'March 2026',
      version: '1.0',
    },
  },
};

export default proposalBuilder;
