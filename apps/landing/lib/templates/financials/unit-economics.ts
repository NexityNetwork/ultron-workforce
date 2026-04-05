import { Template } from '../registry';

export const unitEconomics: Template = {
  id: 'financials-unit-economics',
  name: 'Unit Economics',
  description:
    'Analyze the fundamental economics of your business at the per-customer level. CAC, LTV, payback period, and channel-level breakdown.',
  category: 'financials',
  icon: 'calculator',
  canvasType: 'metrics_dashboard',
  defaultData: {
    title: 'Unit Economics Dashboard',
    period: 'Q1 2026',
    kpis: [
      {
        label: 'CAC (Blended)',
        value: '$3,850',
        change: '-8%',
        trend: 'down' as const,
        status: 'good' as const,
      },
      {
        label: 'LTV',
        value: '$22,400',
        change: '+15%',
        trend: 'up' as const,
        status: 'good' as const,
      },
      {
        label: 'LTV:CAC Ratio',
        value: '5.8:1',
        change: '+1.2',
        trend: 'up' as const,
        status: 'good' as const,
      },
      {
        label: 'CAC Payback Period',
        value: '7.2 months',
        change: '-1.1 months',
        trend: 'down' as const,
        status: 'good' as const,
      },
      {
        label: 'Gross Margin',
        value: '78.5%',
        change: '+2.3%',
        trend: 'up' as const,
        status: 'good' as const,
      },
      {
        label: 'Net Revenue Retention',
        value: '118%',
        change: '+6%',
        trend: 'up' as const,
        status: 'good' as const,
      },
    ],
    chart: {
      type: 'bar' as const,
      data: [
        { name: 'Organic Search', cac: 1200, ltv: 19800, ltvCac: 16.5, customers: 45 },
        { name: 'Content Marketing', cac: 2100, ltv: 21000, ltvCac: 10.0, customers: 32 },
        { name: 'Paid Social', cac: 4800, ltv: 18500, ltvCac: 3.9, customers: 28 },
        { name: 'Paid Search', cac: 5200, ltv: 24000, ltvCac: 4.6, customers: 22 },
        { name: 'Outbound Sales', cac: 6500, ltv: 38000, ltvCac: 5.8, customers: 15 },
        { name: 'Partnerships', cac: 2800, ltv: 26500, ltvCac: 9.5, customers: 18 },
      ],
      xKey: 'name',
      yKey: 'ltvCac',
    },
    breakdown: [
      { label: 'Organic Search', value: '$1,200 CAC', percentage: 28.1 },
      { label: 'Content Marketing', value: '$2,100 CAC', percentage: 20.0 },
      { label: 'Partnerships', value: '$2,800 CAC', percentage: 11.3 },
      { label: 'Paid Social', value: '$4,800 CAC', percentage: 17.5 },
      { label: 'Paid Search', value: '$5,200 CAC', percentage: 13.8 },
      { label: 'Outbound Sales', value: '$6,500 CAC', percentage: 9.4 },
    ],
    insights: [
      'Organic Search delivers the best LTV:CAC at 16.5:1 -double down on SEO and content',
      'Outbound Sales has the highest CAC ($6,500) but also the highest LTV ($38K) -justified for enterprise',
      'Paid Social CAC of $4,800 with LTV:CAC of 3.9:1 is borderline -optimize or reallocate budget',
      'Net Revenue Retention of 118% means existing customers are growing faster than churning -strong expansion motion',
      'CAC Payback under 12 months across all channels indicates healthy capital efficiency',
    ],
  },
};

export default unitEconomics;
