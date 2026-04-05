import { Template } from '../registry';

export const financialProjections: Template = {
  id: 'financials-financial-projections',
  name: 'Financial Projections',
  description:
    'A 3-year P&L projection showing revenue, costs, and profitability trajectory. Built for board decks and investor conversations.',
  category: 'financials',
  icon: 'trending-up',
  canvasType: 'data_table',
  defaultData: {
    title: '3-Year Financial Projections',
    columns: [
      { key: 'metric', label: 'Metric', type: 'text' as const },
      { key: 'year1', label: 'Year 1', type: 'currency' as const },
      { key: 'year2', label: 'Year 2', type: 'currency' as const },
      { key: 'year3', label: 'Year 3', type: 'currency' as const },
    ],
    rows: [
      {
        metric: 'Revenue',
        year1: '$1,500,000',
        year2: '$4,800,000',
        year3: '$12,000,000',
      },
      {
        metric: 'COGS',
        year1: '$375,000',
        year2: '$1,056,000',
        year3: '$2,400,000',
      },
      {
        metric: 'Gross Profit',
        year1: '$1,125,000',
        year2: '$3,744,000',
        year3: '$9,600,000',
      },
      {
        metric: 'Gross Margin',
        year1: '75.0%',
        year2: '78.0%',
        year3: '80.0%',
      },
      {
        metric: '- Sales & Marketing',
        year1: '$600,000',
        year2: '$1,680,000',
        year3: '$3,600,000',
      },
      {
        metric: '- Research & Development',
        year1: '$720,000',
        year2: '$1,440,000',
        year3: '$2,640,000',
      },
      {
        metric: '- General & Administrative',
        year1: '$300,000',
        year2: '$528,000',
        year3: '$840,000',
      },
      {
        metric: 'Total Operating Expenses',
        year1: '$1,620,000',
        year2: '$3,648,000',
        year3: '$7,080,000',
      },
      {
        metric: 'EBITDA',
        year1: '-$495,000',
        year2: '$96,000',
        year3: '$2,520,000',
      },
      {
        metric: 'EBITDA Margin',
        year1: '-33.0%',
        year2: '2.0%',
        year3: '21.0%',
      },
      {
        metric: 'Depreciation & Amortization',
        year1: '$45,000',
        year2: '$72,000',
        year3: '$120,000',
      },
      {
        metric: 'Net Income',
        year1: '-$540,000',
        year2: '$24,000',
        year3: '$2,400,000',
      },
      {
        metric: 'Net Margin',
        year1: '-36.0%',
        year2: '0.5%',
        year3: '20.0%',
      },
    ],
    insights: [
      'Revenue growing at 3.2x Y1Y2 and 2.5x Y2Y3 -consistent with T2D3 trajectory',
      'Gross margin expanding from 75% to 80% as infrastructure costs scale sub-linearly',
      'EBITDA breakeven in Year 2 with 21% EBITDA margin by Year 3',
      'S&M as % of revenue decreases from 40% to 30% -improving go-to-market efficiency',
      'R&D investment stays high at 22% of revenue in Year 3 to maintain product moat',
    ],
  },
};

export default financialProjections;
