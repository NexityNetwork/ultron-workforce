import { Template } from '../registry';

export const messagingValuePropBuilder: Template = {
  id: 'marketing-messaging-value-prop-builder',
  name: 'Value Proposition Builder',
  description:
    'Build your complete value proposition: functional benefits, social & emotional benefits, ROI, social proof, unique differentiator, cost of inaction, and objection handling.',
  category: 'marketing',
  icon: 'zap',
  canvasType: 'infographic',
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
  ],
  defaultData: {
    title: 'Value Proposition -[product_name]',
    subtitle: 'Connecting product capabilities to customer outcomes for [target_persona].',
    sections: [
      {
        heading: 'Functional Benefits',
        type: 'comparison',
        items: [
          { label: 'Capability 1', value: '[1st order benefit -direct & most believable]', detail: '[2nd order: what this enables] > [3rd order: business impact]' },
          { label: 'Capability 2', value: '[1st order benefit]', detail: '[2nd order benefit] > [3rd order benefit]' },
          { label: 'Capability 3', value: '[1st order benefit]', detail: '[2nd order benefit] > [3rd order benefit]' },
        ],
      },
      {
        heading: 'Social & Emotional Benefits',
        type: 'stat',
        items: [
          { label: 'Social Benefit', value: '[How it makes them look to their team/org]', detail: 'Social benefits drive sharing and word-of-mouth', highlight: true },
          { label: 'Emotional Benefit', value: '[How it makes them feel -relief, confidence, control]', detail: 'Emotional benefits reduce churn and increase advocacy' },
        ],
      },
      {
        heading: 'Enabled Value / ROI',
        type: 'stat',
        items: [
          { label: '[Metric 1]', value: '[X% increase/decrease]', detail: '[Specific measurement]', icon: 'trending-up' },
          { label: '[Metric 2]', value: '[X% increase/decrease]', detail: '[Specific measurement]', icon: 'zap' },
          { label: '[Metric 3]', value: '[X% increase/decrease]', detail: '[Specific measurement]', icon: 'zap' },
        ],
      },
      {
        heading: 'Social Proof',
        type: 'quote',
        items: [
          { label: 'Scale', value: '[X users/companies use product_name]', detail: 'Mass adoption = trust' },
          { label: 'Logos', value: '[Named companies in ICP vertical]', detail: 'Same-segment proof is most convincing' },
        ],
      },
      {
        heading: 'Unique Differentiator (Why You)',
        type: 'list',
        items: [
          { label: 'The Wedge', value: 'Unlike [alternatives], [product_name] [structural difference]', detail: 'This must be something competitors cannot easily replicate', highlight: true },
        ],
      },
      {
        heading: 'Cost of Inaction (Why Now)',
        type: 'comparison',
        items: [
          { label: 'Time Cost', value: '[What they lose in time by not switching]', detail: '[Business impact of time waste]' },
          { label: 'Opportunity Cost', value: '[What they miss out on]', detail: '[Competitive disadvantage of inaction]' },
        ],
      },
    ],
    source: 'Generated for [product_name]',
    insights: [
      'Benefits are the OPPOSITE of the problems identified in your ICP analysis.',
      'Separate functional (what improves), social (how they look), and emotional (how they feel) benefits.',
      'Cost of Inaction creates urgency -it\'s the pain of NOT switching, not the benefit of switching.',
    ],
  },
};

export default messagingValuePropBuilder;
