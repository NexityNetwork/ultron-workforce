import { Template } from '../registry';

export const messagingFrameworkSimulator: Template = {
  id: 'marketing-messaging-framework-simulator',
  name: 'Messaging Framework Simulator',
  description:
    'Build your complete 5-part SaaS messaging framework: Market Context, ICP, Competitive Alternatives, Product, and Value Proposition. The foundation for all sales & marketing assets.',
  category: 'marketing',
  icon: 'megaphone',
  canvasType: 'carousel',
  variables: [
    {
      key: 'product_name',
      label: 'Your Product Name',
      type: 'text_input',
      default: 'Our Product',
    },
    {
      key: 'target_persona',
      label: 'Target Persona',
      type: 'text_input',
      default: 'Head of Growth',
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
    title: 'Messaging Framework -[product_name]',
    slides: [
      {
        id: 'mf1',
        heading: 'Messaging Framework -[product_name]',
        body: 'The complete messaging foundation for [product_name] targeting [target_persona] in [industry].\n\nThis framework is the single source of truth for all sales & marketing assets: homepage, sales deck, email sequences, demos, and onboarding.',
        layout: 'title',
        footnote: 'Swipe through each section >',
      },
      {
        id: 'mf2',
        heading: 'The Market Context',
        body: '[Describe the market shift or insight creating the problem]\n\nThe Problem: [What specific problem does this create for your ICP?]\n\nNegative Consequence: [How does this cascade into business impact?]',
        layout: 'text',
      },
      {
        id: 'mf3',
        heading: 'Your ICP -[target_persona]',
        layout: 'list',
        items: [
          { label: 'Persona: [target_persona] in [industry] companies' },
          { label: 'Company Type: [Size, stage, characteristics]' },
          { label: 'Context: [What they are trying to accomplish]' },
          { label: 'Jobs to be Done: [Their daily activities related to the problem]' },
          { label: 'Status Quo: [How they currently solve it]' },
          { label: 'Dream State: [What they wish they could have]' },
        ],
      },
      {
        id: 'mf4',
        heading: 'Competitive Alternatives',
        layout: 'list',
        items: [
          { label: 'Cluster 1: [Direct competitors] -Pros: [acknowledge] -Gap: [limitation]' },
          { label: 'Cluster 2: [Manual processes] -Pros: [acknowledge] -Gap: [limitation]' },
          { label: 'Cluster 3: [Workarounds/tools] -Pros: [acknowledge] -Gap: [limitation]' },
        ],
      },
      {
        id: 'mf5',
        heading: 'Your Product -[product_name]',
        body: 'Category: [What type of product are you?]\n\nCapability 1: [What they can now DO] > Powered by [features]\nCapability 2: [What they can now DO] > Powered by [features]\nCapability 3: [What they can now DO] > Powered by [features]',
        layout: 'text',
      },
      {
        id: 'mf6',
        heading: 'Value Proposition',
        layout: 'list',
        items: [
          { label: 'Functional Benefit: [What increases or decreases]' },
          { label: 'Social Benefit: [How it makes them look]' },
          { label: 'Emotional Benefit: [How it makes them feel]' },
          { label: 'ROI: [Measurable business impact]' },
          { label: 'Social Proof: [Logos, numbers, case studies]' },
          { label: 'Differentiator: Unlike [alternatives], we [unique thing]' },
          { label: 'Cost of Inaction: [What happens if they don\'t switch]' },
        ],
      },
      {
        id: 'mf7',
        heading: 'Your Sales Story -[product_name]',
        body: '[Market shift] is causing [problem] for [target_persona]. Today they [status quo] but it has [limitations]. [product_name] enables [capabilities] so they can [dream state]. Unlike [alternatives], we [differentiator]. Companies like [proof] see [results].',
        layout: 'quote',
      },
      {
        id: 'mf8',
        heading: 'Use This Framework Everywhere',
        body: 'Homepage messaging\nSales deck narrative\nEmail sequence hooks\nProduct demo script\nOnboarding flow copy\n\nOne framework. Consistent messaging. Across every channel.',
        layout: 'cta',
      },
    ],
    style: 'dark',
    branding: { name: '[product_name]', handle: '' },
    insights: [
      'This framework follows a customer-centric order: you only talk about your product in steps 4-5.',
      'Messaging is NOT copy. This defines WHAT to say. Copy (the exact words) changes by channel and audience.',
      'Build once, use everywhere. Without this, every asset starts from zero.',
    ],
  },
};

export default messagingFrameworkSimulator;
