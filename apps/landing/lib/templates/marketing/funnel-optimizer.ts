import { Template } from '../registry';

export const funnelOptimizer: Template = {
  id: 'marketing-funnel-optimizer',
  name: 'Funnel Optimizer',
  description:
    'Visualize your marketing and sales funnel with conversion rates at each stage. Identify drop-off points and optimization opportunities.',
  category: 'marketing',
  icon: 'filter',
  canvasType: 'funnel',
  defaultData: {
    stages: [
      {
        name: 'Awareness',
        count: 50000,
        percentage: 100,
      },
      {
        name: 'Interest',
        count: 12500,
        percentage: 25,
      },
      {
        name: 'Consideration',
        count: 3750,
        percentage: 30,
      },
      {
        name: 'Intent',
        count: 1500,
        percentage: 40,
      },
      {
        name: 'Evaluation',
        count: 600,
        percentage: 40,
      },
      {
        name: 'Purchase',
        count: 180,
        percentage: 30,
      },
    ],
    insights: [
      'Biggest drop-off: Awareness to Interest (75% loss) -improve ad targeting and landing page relevance',
      'Interest to Consideration conversion (30%) is healthy -content nurture is working',
      'Intent to Evaluation (40%) suggests qualified leads are engaging with sales -keep it up',
      'Overall funnel conversion: 0.36% -benchmark for B2B SaaS is 0.5-1.0%, room to improve',
      'Focus optimization on top-of-funnel: a 5% improvement in Awareness-to-Interest adds 2,500 leads',
    ],
  },
};

export default funnelOptimizer;
