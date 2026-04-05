import { Template } from '../registry';

export const valuationCalculator: Template = {
  id: 'fundraising-valuation-calculator',
  name: 'Valuation Calculator',
  description:
    'Compare startup valuation using multiple methods: Revenue Multiple, ARR Multiple, DCF, and Comparable Transactions. Triangulate a defensible range.',
  category: 'fundraising',
  icon: 'calculator',
  canvasType: 'data_table',
  defaultData: {
    title: 'Valuation Analysis -Multi-Method Comparison',
    columns: [
      { key: 'method', label: 'Method', type: 'text' as const },
      { key: 'input', label: 'Input', type: 'text' as const },
      { key: 'multiple', label: 'Multiple / Rate', type: 'text' as const },
      { key: 'valuation', label: 'Valuation', type: 'currency' as const },
    ],
    rows: [
      {
        method: 'Revenue Multiple (TTM)',
        input: '$1.5M TTM Revenue',
        multiple: '15x (median B2B SaaS)',
        valuation: '$22,500,000',
      },
      {
        method: 'ARR Multiple',
        input: '$1.8M ARR (current run-rate)',
        multiple: '18x (high-growth premium)',
        valuation: '$32,400,000',
      },
      {
        method: 'Forward Revenue Multiple',
        input: '$4.8M projected Year 2 revenue',
        multiple: '8x (forward discount)',
        valuation: '$38,400,000',
      },
      {
        method: 'DCF (5-Year)',
        input: 'FCF projections, 30% terminal growth',
        multiple: '25% discount rate',
        valuation: '$28,200,000',
      },
      {
        method: 'Comparable Transactions',
        input: 'Median of 5 recent Series A deals in vertical',
        multiple: '20x ARR (median comp)',
        valuation: '$36,000,000',
      },
      {
        method: 'Scorecard Method',
        input: 'Weighted score vs. benchmark startups',
        multiple: '1.15x adjustment to $25M avg',
        valuation: '$28,750,000',
      },
    ],
    totals: {
      method: 'Implied Range',
      input: '-',
      multiple: '-',
      valuation: '$28M – $36M',
    },
    insights: [
      'ARR Multiple and Comparable Transactions converge around $32-36M -strongest signal for negotiation',
      'Revenue Multiple gives a floor of $22.5M; use this as your walk-away minimum',
      'Forward Revenue Multiple of $38.4M is your stretch target -justify with growth trajectory and NRR',
      'DCF is less relevant at this stage but validates the range -investors will discount heavily',
      'Recommendation: Target $30-32M pre-money valuation with data to support up to $36M if competitive',
    ],
  },
};

export default valuationCalculator;
