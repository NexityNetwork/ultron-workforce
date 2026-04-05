import { Template } from '../registry';

export const positioningStatementBuilder: Template = {
  id: 'marketing-positioning-statement-builder',
  name: 'Positioning Statement Builder',
  description:
    'Build your one-sentence and strategic positioning statement using the 3-step framework: Primary Anchor + Secondary Angle + Clear Articulation.',
  category: 'marketing',
  icon: 'pen-tool',
  canvasType: 'structured_doc',
  variables: [
    {
      key: 'product_name',
      label: 'Your Product Name',
      type: 'text_input',
      default: 'Our Product',
    },
    {
      key: 'primary_anchor',
      label: 'Primary Positioning Anchor',
      type: 'single_select',
      options: ['Activity', 'Use Case', 'Product Category', 'Competitive Alternative'],
      default: 'Use Case',
    },
    {
      key: 'secondary_angle',
      label: 'Secondary Angle',
      type: 'single_select',
      options: ['Niche Down', 'Low-Cost Player', 'Premium Player', 'Unique Attribute', 'Lite Version'],
      default: 'Niche Down',
    },
  ],
  defaultData: {
    title: 'Positioning Statement -[product_name]',
    subtitle: 'Primary: [primary_anchor] | Secondary: [secondary_angle]',
    sections: [
      {
        heading: 'Market Understanding',
        content: 'The foundational inputs that shape your positioning.',
        items: [
          'Target ICP: [Describe your ideal customer -role, company size, industry, stage]',
          'Job-to-be-done: [What do they want to achieve?]',
          'Core Problem: [Why is this difficult today, regardless of solution?]',
          'Status Quo: [What do they currently use to solve this?]',
        ],
        type: 'list',
      },
      {
        heading: 'Key Limitations of Status Quo',
        content: 'Why their current approach fails:',
        items: [
          'Limitation 1: [First key limitation]',
          'Limitation 2: [Second key limitation]',
          'Limitation 3: [Third key limitation]',
        ],
        type: 'list',
      },
      {
        heading: 'Your Positioning Anchors',
        content: 'Primary Anchor: [primary_anchor] -this classifies your product.\nSecondary Angle: [secondary_angle] -this differentiates you inside the anchor.',
        type: 'highlight',
      },
      {
        heading: 'Competitive Differentiator',
        content: 'Unlike [dominant current solution], we [your specific structural difference].',
        type: 'callout',
      },
      {
        heading: 'Strategic Positioning Statement (Internal)',
        content: '[ICP] face the challenge of [core problem]. Today, they [status quo]. This creates key limitations: [limitation 1], [limitation 2], [limitation 3]. We built [product_name] to [outcome]. Unlike [status quo], we [competitive differentiator].',
        type: 'highlight',
      },
      {
        heading: 'One-Sentence Positioning (Market-Facing)',
        content: '[Fill in based on your primary anchor template -see positioning templates for the right format]',
        type: 'callout',
      },
    ],
    metadata: {
      client: '[product_name]',
      date: 'Current',
      version: '1.0',
    },
    insights: [
      'Complete the market understanding section first. The inputs determine the output.',
      'Test your one-liner on 5+ ICP members. If they need explanation, it\'s too vague.',
      'Positioning is not a tagline -it\'s a strategic decision that shapes your entire GTM.',
    ],
  },
};

export default positioningStatementBuilder;
