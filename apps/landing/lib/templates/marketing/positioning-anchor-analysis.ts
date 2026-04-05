import { Template } from '../registry';

export const positioningAnchorAnalysis: Template = {
  id: 'marketing-positioning-anchor-analysis',
  name: 'Positioning Anchor Analysis',
  description:
    'Analyze which primary positioning anchor fits your product based on market maturity, buyer awareness, and competitive landscape.',
  category: 'marketing',
  icon: 'target',
  canvasType: 'data_table',
  variables: [
    {
      key: 'product_name',
      label: 'Your Product Name',
      type: 'text_input',
      default: 'Our Product',
    },
    {
      key: 'industry',
      label: 'Industry',
      type: 'single_select',
      options: ['SaaS', 'E-commerce', 'Fintech', 'Healthcare', 'Education', 'Agency', 'Marketplace', 'Other'],
      default: 'SaaS',
    },
  ],
  defaultData: {
    title: 'Primary Positioning Anchor Analysis -[product_name]',
    columns: [
      { key: 'dimension', label: 'Dimension', type: 'text' },
      { key: 'activity', label: 'Activity Positioning', type: 'text' },
      { key: 'useCase', label: 'Use Case Positioning', type: 'text' },
      { key: 'category', label: 'Product Category', type: 'text' },
      { key: 'competitive', label: 'Competitive Alternative', type: 'text' },
    ],
    rows: [
      { dimension: 'How you describe the product', activity: '"We help you do X"', useCase: '"We help you do X without Y"', category: '"We are a X"', competitive: '"We\'re a [Leader]-alternative"' },
      { dimension: 'Buyer awareness', activity: 'Low', useCase: 'Medium', category: 'High', competitive: 'High' },
      { dimension: 'Market maturity', activity: 'Pre-market', useCase: 'Emerging', category: 'Established', competitive: 'Mature' },
      { dimension: 'Status quo you replace', activity: 'Manual workflows', useCase: 'Broken workflows & tool stacks', category: 'Direct competitors', competitive: 'Named market leader' },
      { dimension: 'How buyers evaluate you', activity: 'Doing nothing', useCase: 'Alternative workflows', category: 'Other vendors', competitive: 'Leader comparison' },
      { dimension: 'Budget ownership', activity: 'No clear budget', useCase: 'Emerging', category: 'Clear budget line item', competitive: 'Budget already allocated' },
      { dimension: 'Search demand', activity: 'None / very low', useCase: 'Problem-based', category: 'Category-based', competitive: 'Competitor-based' },
      { dimension: 'Messaging focus', activity: 'Name the pain', useCase: 'Job-to-be-done + friction', category: 'Differentiation in category', competitive: '"Why us vs X"' },
      { dimension: 'Proof type', activity: 'Before > After', useCase: 'Workflow Power + Outcomes', category: 'Comparative Proof', competitive: 'Switch & Upgrade Proof' },
      { dimension: 'Main GTM goal', activity: 'Create awareness', useCase: 'Own the use case', category: 'Win comparisons', competitive: 'Steal demand from leader' },
    ],
    insights: [
      'Analyze [product_name] against each dimension to determine where your product fits today.',
      'Choose your anchor based on how buyers think, not how you want them to think.',
      'Your positioning can evolve: Activity > Use Case > Category > Competitive Alternative as the market matures.',
    ],
    recommendations: [
      'If buyers don\'t Google a category for your solution, you are likely Activity or Use Case.',
      'If a dominant leader exists and you have a clear wedge, consider Competitive Alternative.',
      'Test your positioning with 5+ ICP members before committing.',
    ],
  },
};

export default positioningAnchorAnalysis;
