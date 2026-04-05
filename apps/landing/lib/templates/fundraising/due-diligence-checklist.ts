import { Template } from '../registry';

export const dueDiligenceChecklist: Template = {
  id: 'fundraising-due-diligence-checklist',
  name: 'Due Diligence Checklist',
  description:
    'Comprehensive checklist covering every document and item investors review during due diligence. Organized by category with status tracking.',
  category: 'fundraising',
  icon: 'check-square',
  canvasType: 'checklist',
  defaultData: {
    title: 'Series A Due Diligence Checklist',
    sections: [
      {
        heading: 'Corporate & Legal',
        items: [
          {
            label: 'Certificate of Incorporation & all amendments',
            checked: false,
            priority: 'high',
          },
          {
            label: 'Board meeting minutes (last 12 months)',
            checked: false,
            priority: 'high',
          },
          {
            label: 'Shareholder agreements & voting agreements',
            checked: false,
            priority: 'high',
          },
          {
            label: 'Cap table (fully diluted, including all option grants)',
            checked: false,
            priority: 'high',
          },
          {
            label: 'IP assignment agreements for all founders & employees',
            checked: false,
            priority: 'medium',
          },
        ],
      },
      {
        heading: 'Financial',
        items: [
          {
            label: 'Monthly P&L and balance sheet (last 24 months)',
            checked: false,
            priority: 'high',
          },
          {
            label: 'Bank statements (last 6 months)',
            checked: false,
            priority: 'high',
          },
          {
            label: 'Revenue breakdown by customer and cohort',
            checked: false,
            priority: 'high',
          },
          {
            label: 'Accounts receivable and payable aging report',
            checked: false,
            priority: 'medium',
          },
          {
            label: '3-year financial projections with assumptions',
            checked: false,
            priority: 'high',
          },
        ],
      },
      {
        heading: 'Technical',
        items: [
          {
            label: 'Architecture overview and tech stack documentation',
            checked: false,
            priority: 'medium',
          },
          {
            label: 'Security audit report or SOC 2 compliance status',
            checked: false,
            priority: 'high',
          },
          {
            label: 'Uptime and incident history (last 12 months)',
            checked: false,
            priority: 'medium',
          },
          {
            label: 'Data privacy compliance (GDPR, CCPA) documentation',
            checked: false,
            priority: 'high',
          },
          {
            label: 'Third-party dependency audit and license review',
            checked: false,
            priority: 'low',
          },
        ],
      },
      {
        heading: 'Commercial',
        items: [
          {
            label: 'Customer list with ARR, contract dates, and renewal status',
            checked: false,
            priority: 'high',
          },
          {
            label: 'Top 10 customer contracts (redacted if needed)',
            checked: false,
            priority: 'high',
          },
          {
            label: 'Churn analysis by cohort with reasons for churn',
            checked: false,
            priority: 'high',
          },
          {
            label: 'Sales pipeline report and conversion metrics',
            checked: false,
            priority: 'medium',
          },
          {
            label: 'Partnership and channel agreements',
            checked: false,
            priority: 'low',
          },
        ],
      },
      {
        heading: 'Team & HR',
        items: [
          {
            label: 'Org chart with roles, tenure, and reporting structure',
            checked: false,
            priority: 'medium',
          },
          {
            label: 'Employee stock option plan (ESOP) and grant schedule',
            checked: false,
            priority: 'high',
          },
          {
            label: 'Key employee contracts and non-compete agreements',
            checked: false,
            priority: 'medium',
          },
          {
            label: 'Founder vesting schedules and acceleration provisions',
            checked: false,
            priority: 'high',
          },
          {
            label: 'Hiring plan for next 12 months with budget',
            checked: false,
            priority: 'medium',
          },
        ],
      },
    ],
    insights: [
      'Start preparing the data room 4-6 weeks before fundraising -last-minute scrambles signal operational weakness',
      'Organize all documents in a shared data room (Notion, Google Drive, or Docsend) with clear folder structure',
      'Flag any missing items early and disclose known issues proactively -surprises kill deals',
      'Assign an internal owner for each section to ensure completeness and timely updates',
    ],
  },
};

export default dueDiligenceChecklist;
