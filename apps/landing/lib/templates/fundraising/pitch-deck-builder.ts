import { Template } from '../registry';

export const pitchDeckBuilder: Template = {
  id: 'fundraising-pitch-deck-builder',
  name: 'Pitch Deck Builder',
  description:
    'A 10-slide pitch deck structure covering every slide investors expect. From problem to ask, with guidance on what to include in each.',
  category: 'fundraising',
  icon: 'presentation',
  canvasType: 'carousel',
  variables: [
    {
      key: 'company_name',
      label: 'Company Name',
      type: 'text_input',
      default: 'Your Company',
    },
  ],
  defaultData: {
    title: '[company_name] -Series A Pitch Deck',
    slides: [
      {
        id: 'slide-problem',
        heading: 'The Problem',
        body: 'Describe the pain point in 2-3 sentences. Make it specific, quantifiable, and emotionally resonant.\n\nExample: "Sales teams waste 4 hours per day on manual data entry instead of selling. This costs the average company $125K per rep per year in lost productivity."',
        layout: 'text' as const,
        footnote: 'Tip: Start with a story or surprising statistic',
      },
      {
        id: 'slide-solution',
        heading: 'Our Solution',
        body: '[company_name] solves this by [one-sentence value proposition].\n\nShow, don\'t tell -include a product screenshot or demo GIF. Explain the core mechanism in plain language.',
        layout: 'text' as const,
        footnote: 'Keep it to one core value prop -save the features for later',
      },
      {
        id: 'slide-market',
        heading: 'Market Opportunity',
        body: 'TAM: $XX billion -[broad market definition]\nSAM: $XX billion -[serviceable segment]\nSOM: $XX million -[realistic 3-year target]',
        layout: 'list' as const,
        items: [
          { label: 'Bottom-up calculation based on [number] target companies × [ARPA]' },
          { label: 'Market growing at XX% CAGR driven by [trend 1] and [trend 2]' },
          { label: 'Timing: [Why now? What changed to make this possible?]' },
        ],
        footnote: 'Investors care most about SAM and your path to capturing it',
      },
      {
        id: 'slide-product',
        heading: 'Product',
        body: 'Walk through the key features and how they map to the problem.\n\n• Feature 1  Solves [specific pain]\n• Feature 2  Enables [specific outcome]\n• Feature 3  Differentiates through [unique approach]',
        layout: 'text' as const,
        footnote: 'Include a product screenshot or architecture diagram',
      },
      {
        id: 'slide-traction',
        heading: 'Traction',
        body: 'Show momentum with real numbers.',
        layout: 'list' as const,
        items: [
          { label: '$XXK MRR (XX% MoM growth)' },
          { label: 'XX paying customers' },
          { label: 'XX% Net Revenue Retention' },
          { label: 'Notable logos: [Customer A], [Customer B], [Customer C]' },
          { label: 'Key milestone: [recent win or partnership]' },
        ],
        footnote: 'This is your most important slide -lead with your strongest metric',
      },
      {
        id: 'slide-business-model',
        heading: 'Business Model',
        body: 'How [company_name] makes money.\n\nPricing: [Pricing model -per seat, usage-based, tiered]\nACVs: $XX,000 average contract value\nUnit Economics: LTV $XXK / CAC $XXK = X:1 ratio\nExpansion: XX% of revenue from upsell/cross-sell',
        layout: 'text' as const,
        footnote: 'Show a clear path to improving unit economics over time',
      },
      {
        id: 'slide-competition',
        heading: 'Competitive Landscape',
        body: 'Position [company_name] in the market and explain your differentiation.',
        layout: 'do_dont' as const,
        items: [
          { label: '[company_name]: [Key differentiator 1 -what you do better]', type: 'do' as const },
          { label: 'Incumbent A: [Their weakness or limitation]', type: 'dont' as const },
          { label: '[company_name]: [Key differentiator 2 -unfair advantage]', type: 'do' as const },
          { label: 'Startup B: [Their weakness or trade-off]', type: 'dont' as const },
        ],
        footnote: 'Acknowledge competition honestly -investors will do their own research',
      },
      {
        id: 'slide-team',
        heading: 'Team',
        body: 'Highlight 3-4 key team members with relevant experience.\n\n[Name] -CEO: [Relevant background, e.g., "Previously VP Sales at Datadog"]\n[Name] -CTO: [Relevant background, e.g., "Built ML infrastructure at Stripe"]\n[Name] -VP Sales: [Relevant background]\n\nAdvisors: [Notable names with relevant expertise]',
        layout: 'text' as const,
        footnote: 'Show why THIS team is uniquely positioned to win this market',
      },
      {
        id: 'slide-financials',
        heading: 'Financial Plan',
        body: 'Show trajectory and capital efficiency.',
        layout: 'list' as const,
        items: [
          { label: 'Current ARR: $XXK  Target: $X.XM in 18 months' },
          { label: 'Current burn: $XXK/mo  Runway: XX months' },
          { label: 'Path to profitability: [Timeline and milestones]' },
          { label: 'Key assumptions: [Growth rate, conversion, expansion]' },
        ],
        footnote: 'Be realistic -over-promising kills trust in due diligence',
      },
      {
        id: 'slide-ask',
        heading: 'The Ask',
        body: 'Raising $X.XM Series A to:\n\n1. Scale GTM team from X to X reps\n2. Expand product into [new capability]\n3. Hit $X.XM ARR by [date]\n\nUse of funds:\n• XX% -Sales & Marketing\n• XX% -Product & Engineering\n• XX% -Operations & G&A',
        layout: 'text' as const,
        footnote: 'Be specific about milestones this capital unlocks',
      },
    ],
    style: 'dark',
    branding: { name: '[company_name]' },
    insights: [
      'The best pitch decks tell a story: Problem  Solution  Proof  Vision  Ask',
      'Spend 60% of your time on the Traction and Market slides -these drive investor conviction',
      'Keep the deck to 10-12 slides max; save detail for the appendix and data room',
      'Practice delivering in under 20 minutes to leave time for Q&A',
    ],
  },
};

export default pitchDeckBuilder;
