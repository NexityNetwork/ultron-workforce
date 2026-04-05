import { Template } from '../registry';

export const positioningCanvas: Template = {
  id: 'marketing-positioning-canvas',
  name: 'Positioning Canvas',
  description:
    'Map your product positioning against competitors across key market dimensions. Identify gaps and opportunities.',
  category: 'marketing',
  icon: 'compass',
  canvasType: 'positioning_map',
  variables: [
    {
      key: 'product_name',
      label: 'Your Product Name',
      type: 'text_input',
      default: 'Our Product',
    },
  ],
  defaultData: {
    title: 'Positioning Canvas -[product_name]',
    anchors: [
      {
        dimension: 'Market Maturity',
        your_product: 'Growth stage -proven product-market fit, scaling GTM',
        competitors: {
          'Incumbent A': 'Mature -large install base, slower innovation',
          'Startup B': 'Early stage -still iterating on core product',
        },
      },
      {
        dimension: 'Target Audience',
        your_product: 'Mid-market B2B SaaS (50-500 employees)',
        competitors: {
          'Incumbent A': 'Enterprise (1000+ employees)',
          'Startup B': 'SMB and prosumers (1-50 employees)',
        },
      },
      {
        dimension: 'Budget Sensitivity',
        your_product: 'Value-oriented -transparent pricing, quick ROI',
        competitors: {
          'Incumbent A': 'Premium pricing, long procurement cycles',
          'Startup B': 'Freemium-led, low willingness to pay',
        },
      },
      {
        dimension: 'Channel Alignment',
        your_product: 'Product-led growth + outbound sales hybrid',
        competitors: {
          'Incumbent A': 'Enterprise field sales, partner channel',
          'Startup B': 'Pure PLG, self-serve only',
        },
      },
      {
        dimension: 'Buying Process',
        your_product: '2-4 week evaluation, champion + VP approval',
        competitors: {
          'Incumbent A': '3-6 month procurement with legal and IT review',
          'Startup B': 'Same-day sign-up, credit card purchase',
        },
      },
      {
        dimension: 'Key Differentiator',
        your_product: 'AI-powered automation with human-in-the-loop control',
        competitors: {
          'Incumbent A': 'Breadth of features and enterprise-grade security',
          'Startup B': 'Simplicity and modern UX',
        },
      },
      {
        dimension: 'Content Strategy',
        your_product: 'Thought leadership + tactical playbooks',
        competitors: {
          'Incumbent A': 'Analyst reports, whitepapers, industry events',
          'Startup B': 'Social-first, viral content, community-driven',
        },
      },
    ],
    insights: [
      '[product_name] occupies a distinct mid-market position between enterprise and SMB',
      'The hybrid PLG + sales motion is a competitive moat -neither competitor does both well',
      'Biggest positioning risk: being perceived as "too complex for SMB, too small for enterprise"',
      'Double down on the "AI + control" narrative to differentiate from both sides',
    ],
  },
};

export default positioningCanvas;
