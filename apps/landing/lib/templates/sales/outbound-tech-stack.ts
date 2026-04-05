import { Template } from '../registry';

export const outboundTechStack: Template = {
  id: 'sales-outbound-tech-stack',
  name: 'Outbound Tech Stack Builder',
  description:
    'Build your outbound GTM tech stack across 10 categories in 3 phases. Get tool recommendations based on your stage, budget, and ICP.',
  category: 'sales',
  icon: 'layers',
  canvasType: 'data_table',
  variables: [
    {
      key: 'product_name',
      label: 'Your Product Name',
      type: 'text_input',
      default: 'Our Product',
    },
    {
      key: 'outbound_phase',
      label: 'Current Outbound Phase',
      type: 'single_select',
      options: ['Not started', 'Running but not working', 'Working but not scaling'],
      default: 'Not started',
    },
    {
      key: 'budget',
      label: 'Monthly Tool Budget',
      type: 'single_select',
      options: ['$0-100', '$100-500', '$500-1000', '$1000+'],
      default: '$100-500',
    },
  ],
  defaultData: {
    title: 'Outbound Tech Stack -[product_name]',
    columns: [
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'priority', label: 'Priority', type: 'text' },
      { key: 'function', label: 'Function', type: 'text' },
      { key: 'recommendation', label: 'Recommended Tool', type: 'text' },
      { key: 'cost', label: 'Est. Cost', type: 'text' },
    ],
    rows: [
      { category: 'Contact Data', priority: 'Mandatory', function: 'Find contacts matching ICP', recommendation: '[Based on budget and ICP]', cost: '[Estimate]' },
      { category: 'Outreach', priority: 'Mandatory', function: 'Deliver messaging to contacts', recommendation: '[Email + LinkedIn tool]', cost: '[Estimate]' },
      { category: 'CRM', priority: 'Mandatory', function: 'Track relationships and pipeline', recommendation: '[Based on team size]', cost: '[Estimate]' },
      { category: 'Enrichment', priority: 'Phase 2', function: 'Verify and enrich contact data', recommendation: '[If needed]', cost: '[Estimate]' },
      { category: 'Scraping', priority: 'Phase 2', function: 'Scrape context for personalization', recommendation: '[If needed]', cost: '[Estimate]' },
      { category: 'Triggers', priority: 'Phase 2', function: 'Time outreach to buying signals', recommendation: '[If needed]', cost: '[Estimate]' },
      { category: 'Infrastructure', priority: 'Phase 3', function: 'Domain rotation + warm-up', recommendation: '[If scaling]', cost: '[Estimate]' },
    ],
    insights: [
      'Start with only the 3 mandatory categories. Everything else comes later.',
      'Avoid overengineering. Simple stack you use daily beats complex stack gathering dust.',
      'Validate ICP and messaging in Phase 1 before investing in Phase 2-3 tools.',
    ],
    recommendations: [
      'Phase 1: Contact Data + Outreach + CRM. Total ~$200-400/mo.',
      'Phase 2: Add enrichment + scraping + triggers. Total ~$500-800/mo.',
      'Phase 3: Full stack with infrastructure. Total ~$1000-2000/mo.',
    ],
  },
};

export default outboundTechStack;
