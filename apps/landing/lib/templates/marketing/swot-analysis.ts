import { Template } from '../registry';

export const swotAnalysis: Template = {
  id: 'marketing-swot-analysis',
  name: 'SWOT Analysis',
  description:
    'Classic Strengths, Weaknesses, Opportunities, and Threats analysis. Pre-filled with placeholder items to guide your thinking.',
  category: 'marketing',
  icon: 'layout-grid',
  canvasType: 'swot_grid',
  variables: [
    {
      key: 'company_name',
      label: 'Company Name',
      type: 'text_input',
      default: 'Your Company',
    },
  ],
  defaultData: {
    title: 'SWOT Analysis -[company_name]',
    strengths: [
      {
        text: 'Strong product-market fit with high NPS (70+)',
        detail: 'Consistent positive feedback from mid-market customers on core workflow automation.',
      },
      {
        text: 'Experienced founding team with domain expertise',
        detail: 'Founders have 15+ years combined experience in the target industry.',
      },
      {
        text: 'Capital-efficient growth with healthy unit economics',
        detail: 'LTV:CAC ratio of 4:1 with 12-month payback period.',
      },
      {
        text: 'Modern tech stack enabling rapid iteration',
        detail: 'Ship weekly releases. Average time from idea to production: 2 weeks.',
      },
    ],
    weaknesses: [
      {
        text: 'Limited brand awareness outside core market',
        detail: 'Strong in B2B SaaS vertical but unknown in adjacent markets.',
      },
      {
        text: 'Small sales team relative to pipeline demand',
        detail: 'Currently 4 AEs handling 200+ qualified opportunities per quarter.',
      },
      {
        text: 'Enterprise features still maturing',
        detail: 'SSO, audit logs, and advanced permissions on the roadmap but not yet shipped.',
      },
      {
        text: 'Reliance on a single primary acquisition channel',
        detail: '60% of new revenue comes from organic search. Need to diversify.',
      },
    ],
    opportunities: [
      {
        text: 'Adjacent market expansion into FinTech vertical',
        detail: 'Multiple inbound requests from FinTech companies. Low customization needed.',
      },
      {
        text: 'Partnership ecosystem with complementary tools',
        detail: 'Integration partnerships with CRM and data platforms could drive co-selling.',
      },
      {
        text: 'AI/ML features as a competitive moat',
        detail: 'Proprietary data from existing customers enables unique AI capabilities.',
      },
      {
        text: 'International expansion into European markets',
        detail: 'Product already supports multi-language. GDPR compliance in place.',
      },
    ],
    threats: [
      {
        text: 'Well-funded competitor entering mid-market segment',
        detail: 'Incumbent raised $100M and is launching a down-market product.',
      },
      {
        text: 'Economic headwinds reducing software budgets',
        detail: 'Prospects reporting longer deal cycles and increased CFO scrutiny.',
      },
      {
        text: 'Platform risk from key integration partners',
        detail: 'Major CRM partner could build competing functionality natively.',
      },
      {
        text: 'Talent market competition for engineering and sales roles',
        detail: 'Key roles taking 3+ months to fill. Risk of losing team members to FAANG.',
      },
    ],
    insights: [
      'Leverage strengths (PMF + unit economics) to counteract threats (funding gap vs. competitor)',
      'Address the single-channel dependency before it becomes a critical vulnerability',
      'Enterprise feature gaps are the #1 blocker for moving upmarket -prioritize SSO and audit logs',
      'AI/ML opportunity aligns with founding team expertise -double down here as a differentiator',
    ],
  },
};

export default swotAnalysis;
