import { Template } from '../registry';

export const icpScoringMatrix: Template = {
  id: 'sales-icp-scoring-matrix',
  name: 'ICP Scoring Matrix',
  description:
    'Score customer segments against 4 winning indicator categories (Usage, Commercial, Strategic, Success) to identify your best-fit ICP.',
  category: 'sales',
  icon: 'grid',
  canvasType: 'data_table',
  variables: [
    {
      key: 'product_name',
      label: 'Your Product Name',
      type: 'text_input',
      default: 'Our Product',
    },
  ],
  defaultData: {
    title: 'ICP Scoring Matrix -[product_name]',
    columns: [
      { key: 'segment', label: 'Segment', type: 'text' },
      { key: 'usage', label: 'Usage (1-5)', type: 'text' },
      { key: 'commercial', label: 'Commercial (1-5)', type: 'text' },
      { key: 'strategic', label: 'Strategic (1-5)', type: 'text' },
      { key: 'success', label: 'Success (1-5)', type: 'text' },
      { key: 'total', label: 'Total (/20)', type: 'text' },
      { key: 'verdict', label: 'Verdict', type: 'text' },
    ],
    rows: [
      { segment: '[Segment 1]', usage: '-', commercial: '-', strategic: '-', success: '-', total: '-', verdict: '-' },
      { segment: '[Segment 2]', usage: '-', commercial: '-', strategic: '-', success: '-', total: '-', verdict: '-' },
      { segment: '[Segment 3]', usage: '-', commercial: '-', strategic: '-', success: '-', total: '-', verdict: '-' },
    ],
    insights: [
      'Score each segment 1-5 per category based on your actual customer data.',
      'Best-fit customers: high engagement, strong commercial metrics, low support, strategic alignment.',
      'If no segment clearly stands out, collect more data or try different segmentation variables.',
    ],
  },
};

export default icpScoringMatrix;
