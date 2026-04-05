import { Template } from '../registry';

export const burnRateTracker: Template = {
  id: 'financials-burn-rate-tracker',
  name: 'Burn Rate Tracker',
  description:
    'Monitor cash burn, runway, and monthly spend trends. Includes a 12-month cash balance projection to plan ahead.',
  category: 'financials',
  icon: 'flame',
  canvasType: 'metrics_dashboard',
  defaultData: {
    title: 'Burn Rate & Runway Tracker',
    period: 'March 2026',
    kpis: [
      {
        label: 'Monthly Burn (Gross)',
        value: '$185,000',
        change: '+3.2%',
        trend: 'up' as const,
        status: 'warning' as const,
      },
      {
        label: 'Monthly Revenue',
        value: '$125,000',
        change: '+12.5%',
        trend: 'up' as const,
        status: 'good' as const,
      },
      {
        label: 'Net Burn',
        value: '$60,000',
        change: '-18%',
        trend: 'down' as const,
        status: 'good' as const,
      },
      {
        label: 'Cash Balance',
        value: '$2,340,000',
        change: '-$60,000',
        trend: 'down' as const,
        status: 'good' as const,
      },
      {
        label: 'Runway (months)',
        value: '39 months',
        change: '+4 months',
        trend: 'up' as const,
        status: 'good' as const,
      },
    ],
    chart: {
      type: 'area' as const,
      data: [
        { name: 'Apr', value: 2280000, burn: 62000, revenue: 132000 },
        { name: 'May', value: 2225000, burn: 58000, revenue: 140000 },
        { name: 'Jun', value: 2175000, burn: 53000, revenue: 148000 },
        { name: 'Jul', value: 2132000, burn: 47000, revenue: 156000 },
        { name: 'Aug', value: 2097000, burn: 40000, revenue: 165000 },
        { name: 'Sep', value: 2070000, burn: 32000, revenue: 175000 },
        { name: 'Oct', value: 2053000, burn: 22000, revenue: 185000 },
        { name: 'Nov', value: 2048000, burn: 10000, revenue: 196000 },
        { name: 'Dec', value: 2055000, burn: -2000, revenue: 208000 },
        { name: 'Jan \'27', value: 2075000, burn: -16000, revenue: 220000 },
        { name: 'Feb \'27', value: 2108000, burn: -30000, revenue: 233000 },
        { name: 'Mar \'27', value: 2155000, burn: -45000, revenue: 247000 },
      ],
      xKey: 'name',
      yKey: 'value',
    },
    breakdown: [
      { label: 'Payroll & Benefits', value: '$112,000', percentage: 60.5 },
      { label: 'Infrastructure & Hosting', value: '$22,000', percentage: 11.9 },
      { label: 'Sales & Marketing', value: '$28,000', percentage: 15.1 },
      { label: 'Office & Operations', value: '$8,500', percentage: 4.6 },
      { label: 'Software & Tools', value: '$9,500', percentage: 5.1 },
      { label: 'Legal & Professional', value: '$5,000', percentage: 2.7 },
    ],
    insights: [
      'Net burn trending down 18% MoM -on track for cash-flow positive by December 2026',
      'Payroll is 60.5% of total spend -standard for a 22-person SaaS team at this stage',
      'At current trajectory, runway extends beyond 36 months -no urgent fundraising needed',
      'Infrastructure costs growing slower than revenue -good sign for gross margin expansion',
      'Consider locking in annual contracts for key vendors to reduce monthly cash outflow by ~$3K',
    ],
  },
};

export default burnRateTracker;
