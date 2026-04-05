import { Template } from '../registry';

export const revenueModel: Template = {
  id: 'financials-revenue-model',
  name: 'Revenue Model',
  description:
    'Track SaaS revenue health with MRR, ARR, churn, LTV, CAC, and growth metrics. Includes a 12-month MRR projection chart.',
  category: 'financials',
  icon: 'dollar-sign',
  canvasType: 'metrics_dashboard',
  defaultData: {
    title: 'SaaS Revenue Model',
    period: 'Q1 2026',
    kpis: [
      {
        label: 'MRR',
        value: '$125,000',
        change: '+12.5%',
        trend: 'up' as const,
        status: 'good' as const,
      },
      {
        label: 'ARR',
        value: '$1,500,000',
        change: '+58%',
        trend: 'up' as const,
        status: 'good' as const,
      },
      {
        label: 'Gross Churn Rate',
        value: '2.1%',
        change: '-0.4%',
        trend: 'down' as const,
        status: 'good' as const,
      },
      {
        label: 'LTV',
        value: '$18,750',
        change: '+8%',
        trend: 'up' as const,
        status: 'good' as const,
      },
      {
        label: 'CAC',
        value: '$4,200',
        change: '-5%',
        trend: 'down' as const,
        status: 'good' as const,
      },
      {
        label: 'LTV:CAC Ratio',
        value: '4.5:1',
        change: '+0.6',
        trend: 'up' as const,
        status: 'good' as const,
      },
    ],
    chart: {
      type: 'area' as const,
      data: [
        { name: 'Jan', value: 68000, newMrr: 12000, churnedMrr: 3200 },
        { name: 'Feb', value: 74000, newMrr: 10500, churnedMrr: 2800 },
        { name: 'Mar', value: 82000, newMrr: 13000, churnedMrr: 3100 },
        { name: 'Apr', value: 88000, newMrr: 11000, churnedMrr: 2900 },
        { name: 'May', value: 95000, newMrr: 12500, churnedMrr: 3000 },
        { name: 'Jun', value: 101000, newMrr: 11500, churnedMrr: 2700 },
        { name: 'Jul', value: 108000, newMrr: 13500, churnedMrr: 3200 },
        { name: 'Aug', value: 112000, newMrr: 10000, churnedMrr: 2500 },
        { name: 'Sep', value: 118000, newMrr: 12000, churnedMrr: 2800 },
        { name: 'Oct', value: 125000, newMrr: 14000, churnedMrr: 3100 },
        { name: 'Nov', value: 133000, newMrr: 15000, churnedMrr: 3300 },
        { name: 'Dec', value: 142000, newMrr: 16000, churnedMrr: 3500 },
      ],
      xKey: 'name',
      yKey: 'value',
    },
    breakdown: [
      { label: 'New Business MRR', value: '$48,500', percentage: 38.8 },
      { label: 'Expansion MRR', value: '$32,200', percentage: 25.8 },
      { label: 'Reactivation MRR', value: '$4,300', percentage: 3.4 },
      { label: 'Contraction MRR', value: '-$6,800', percentage: -5.4 },
      { label: 'Churned MRR', value: '-$12,200', percentage: -9.8 },
      { label: 'Net New MRR', value: '$66,000', percentage: 52.8 },
    ],
    insights: [
      'MRR growing at 12.5% MoM -on track to hit $2M ARR by Q3 if growth holds',
      'LTV:CAC of 4.5:1 indicates healthy unit economics with room to increase acquisition spend',
      'Gross churn trending down -product improvements are reducing involuntary churn',
      'Expansion revenue (25.8% of new MRR) should be a priority to push above 30%',
    ],
  },
};

export default revenueModel;
