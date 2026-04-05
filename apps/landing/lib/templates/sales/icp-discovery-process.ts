import { Template } from '../registry';

export const icpDiscoveryProcess: Template = {
  id: 'sales-icp-discovery-process',
  name: 'ICP Discovery Process',
  description:
    'Step-by-step 5-phase process to identify your Ideal Customer Profile from early customers. Includes timing thresholds, winning indicators, and scoring methodology.',
  category: 'sales',
  icon: 'target',
  canvasType: 'decision_tree',
  variables: [
    {
      key: 'product_name',
      label: 'Your Product Name',
      type: 'text_input',
      default: 'Our Product',
    },
    {
      key: 'acv_segment',
      label: 'ACV Segment',
      type: 'single_select',
      options: ['Enterprise (€100k+)', 'Mid-Market (€25-100k)', 'SMB (€5-25k)', 'Prosumer (<€5k)'],
      default: 'SMB (€5-25k)',
    },
    {
      key: 'customer_count',
      label: 'Current Customer Count',
      type: 'single_select',
      options: ['Under 10', '10-25', '25-50', '50-100', '100+'],
      default: '25-50',
    },
  ],
  defaultData: {
    title: 'ICP Discovery Process -[product_name]',
    root: {
      id: 'start',
      label: 'Ready to analyze customer base?',
      description: 'Enterprise: ~5 customers. Mid-Market: ~25. SMB/Prosumer: 100+.',
      type: 'question',
      children: [
        {
          edge_label: 'Yes',
          node: {
            id: 's1',
            label: 'Define Winning Indicators',
            description: 'Usage intensity, commercial health, strategic alignment, customer success.',
            type: 'action',
            children: [
              {
                edge_label: 'Next',
                node: {
                  id: 's2',
                  label: 'Collect 12+ months of customer data',
                  description: 'Firmographics, technographics, usage, sales, persona, support, payment.',
                  type: 'action',
                  children: [
                    {
                      edge_label: 'Next',
                      node: {
                        id: 's3',
                        label: 'First-pass segmentation',
                        description: 'Group by industry, company size, geography.',
                        type: 'action',
                        children: [
                          {
                            edge_label: 'Next',
                            node: {
                              id: 's4',
                              label: 'Deep-dive segmentation',
                              description: 'Vertical metrics, use cases, personas, pain points.',
                              type: 'action',
                              children: [
                                {
                                  edge_label: 'Next',
                                  node: {
                                    id: 's5',
                                    label: 'Score segments & identify ICP',
                                    description: 'Scoring matrix: 1-5 per category. Revamp GTM around winner.',
                                    type: 'outcome',
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          edge_label: 'Not enough customers yet',
          node: {
            id: 'hustle',
            label: 'Stay in hustle mode -acquire ECPs',
            description: 'Early Customer Profile ≠ ICP. Keep testing until you hit the threshold.',
            type: 'outcome',
          },
        },
      ],
    },
    insights: [
      'Blend qualitative intuition with quantitative data for best results.',
      'The fastest path to €1M ARR is going narrow and deep, not broad.',
    ],
  },
};

export default icpDiscoveryProcess;
