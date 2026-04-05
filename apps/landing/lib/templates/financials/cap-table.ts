import { Template } from '../registry';

export const capTable: Template = {
  id: 'financials-cap-table',
  name: 'Cap Table',
  description:
    'Track equity ownership, share classes, and dilution across all stakeholders. Clean cap table with pre-money and post-money views.',
  category: 'financials',
  icon: 'pie-chart',
  canvasType: 'data_table',
  defaultData: {
    title: 'Capitalization Table -Post Series A',
    columns: [
      { key: 'shareholder', label: 'Shareholder', type: 'text' as const },
      { key: 'shareClass', label: 'Share Class', type: 'text' as const },
      { key: 'shares', label: 'Shares', type: 'number' as const },
      { key: 'ownership', label: 'Ownership %', type: 'percentage' as const },
      { key: 'invested', label: 'Invested', type: 'currency' as const },
      { key: 'valuation', label: 'Value at $25M', type: 'currency' as const },
    ],
    rows: [
      {
        shareholder: 'Sarah Chen (CEO & Co-founder)',
        shareClass: 'Common',
        shares: 3000000,
        ownership: 30.0,
        invested: '$25,000',
        valuation: '$7,500,000',
      },
      {
        shareholder: 'Marcus Rodriguez (CTO & Co-founder)',
        shareClass: 'Common',
        shares: 2500000,
        ownership: 25.0,
        invested: '$25,000',
        valuation: '$6,250,000',
      },
      {
        shareholder: 'Sequoia Capital',
        shareClass: 'Series A Preferred',
        shares: 2000000,
        ownership: 20.0,
        invested: '$5,000,000',
        valuation: '$5,000,000',
      },
      {
        shareholder: 'First Round Capital',
        shareClass: 'Seed Preferred',
        shares: 1000000,
        ownership: 10.0,
        invested: '$1,500,000',
        valuation: '$2,500,000',
      },
      {
        shareholder: 'Angel Investors (3)',
        shareClass: 'Seed Preferred',
        shares: 500000,
        ownership: 5.0,
        invested: '$500,000',
        valuation: '$1,250,000',
      },
      {
        shareholder: 'Employee Option Pool (ESOP)',
        shareClass: 'Options (Common)',
        shares: 1000000,
        ownership: 10.0,
        invested: '-',
        valuation: '$2,500,000',
      },
    ],
    totals: {
      shareholder: 'Total',
      shareClass: '-',
      shares: 10000000,
      ownership: 100.0,
      invested: '$7,050,000',
      valuation: '$25,000,000',
    },
    insights: [
      'Founders retain 55% combined ownership post-Series A -strong position for future rounds',
      'ESOP at 10% is standard; plan to expand to 15% before Series B to attract senior hires',
      'Series A at $25M post-money implies $20M pre-money valuation on ~$1.5M ARR (~13x multiple)',
      'Next round dilution estimate: Series B at $80-100M would dilute existing holders by ~20%',
    ],
  },
};

export default capTable;
