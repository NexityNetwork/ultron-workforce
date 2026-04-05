import { Template } from '../registry';

export const icpWorkshop: Template = {
  id: 'sales-icp-workshop',
  name: 'ICP Workshop',
  description:
    'Define your Ideal Customer Profile using a structured framework. Covers firmographics, user personas, buyer personas, and anti-ICP.',
  category: 'sales',
  icon: 'users',
  canvasType: 'structured_doc',
  variables: [
    {
      key: 'product_name',
      label: 'Product Name',
      type: 'text_input',
      default: 'Our Product',
    },
  ],
  defaultData: {
    title: 'Ideal Customer Profile Workshop -[product_name]',
    subtitle: 'Define who you sell to, and who you do not',
    sections: [
      {
        heading: 'Firmographics',
        content:
          'The organizational characteristics that define the best-fit companies for [product_name]:',
        items: [
          'Company Size: 50-500 employees (Series A to Series C stage)',
          'Annual Revenue: $5M-$100M ARR',
          'Industry: B2B SaaS, FinTech, HealthTech, MarketplaceTech',
          'Geography: North America and Western Europe (English-speaking markets first)',
          'Tech Stack: Uses modern CRM (Salesforce/HubSpot), has existing data infrastructure',
          'Growth Signal: Actively hiring in sales/marketing, recently raised funding',
        ],
      },
      {
        heading: 'User Persona',
        content:
          'The day-to-day users who will interact with [product_name] most frequently:',
        items: [
          'Title: Sales Development Rep, Account Executive, Revenue Operations Manager',
          'Experience: 2-7 years in B2B sales or revenue operations',
          'Pain Points: Spending too much time on manual data entry, lack of pipeline visibility, inconsistent outreach quality',
          'Goals: Hit quota faster, automate repetitive workflows, get better insights on deal health',
          'Behavior: Spends most of their day in CRM and email, values speed over customization, adopts tools that save time immediately',
        ],
      },
      {
        heading: 'Buyer Persona',
        content:
          'The economic decision-makers who approve the purchase of [product_name]:',
        items: [
          'Title: VP of Sales, CRO, Head of Revenue Operations',
          'Reports to: CEO or COO',
          'Key Metrics: Pipeline velocity, win rate, CAC payback, revenue per rep',
          'Pain Points: Cannot scale revenue without proportional headcount, poor forecasting accuracy, reps spending <30% of time selling',
          'Buying Triggers: Missed quarterly targets, new funding round, board mandate to improve efficiency',
          'Evaluation Criteria: ROI within 6 months, minimal IT involvement, proven results with similar companies',
        ],
      },
      {
        heading: 'Anti-ICP',
        content:
          'Characteristics that signal a prospect is NOT a good fit for [product_name]. Disqualify early to protect your team\'s time:',
        items: [
          'Company has fewer than 10 employees or no dedicated sales team',
          'Primarily offline or brick-and-mortar business model',
          'No existing CRM -they need to solve more fundamental problems first',
          'Extremely long sales cycles (18+ months) with heavy procurement processes',
          'Industry with heavy regulatory requirements we cannot yet support (government, defense)',
          'Budget expectation below $200/month -indicates low willingness to invest in tooling',
        ],
      },
    ],
    metadata: {
      date: 'March 2026',
      version: '1.0',
    },
  },
};

export default icpWorkshop;
