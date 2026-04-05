import { Template } from '../registry';

export const launchReadiness: Template = {
  id: 'marketing-launch-readiness',
  name: 'Launch Readiness',
  description:
    'Pre-launch checklist to ensure product, marketing, sales, infrastructure, and legal are all ready for launch day.',
  category: 'marketing',
  icon: 'check-circle',
  canvasType: 'checklist',
  defaultData: {
    title: 'Launch Readiness Checklist',
    sections: [
      {
        name: 'Product Ready',
        items: [
          {
            label: 'All launch features QA tested and signed off',
            status: 'pass',
            detail: 'QA completed full regression suite. Zero P0/P1 bugs remaining.',
          },
          {
            label: 'Performance benchmarks meet SLA requirements',
            status: 'pass',
            detail: 'P95 latency under 200ms. Load tested to 10x expected traffic.',
          },
          {
            label: 'Feature flags configured for staged rollout',
            status: 'warning',
            detail: 'Flags set up but rollout schedule needs final approval.',
          },
          {
            label: 'Rollback plan documented and tested',
            status: 'pass',
          },
        ],
      },
      {
        name: 'Marketing Assets',
        items: [
          {
            label: 'Product landing page published and tested across browsers',
            status: 'pass',
          },
          {
            label: 'Press release drafted and approved by comms',
            status: 'warning',
            detail: 'Legal review pending. Expected sign-off by EOD tomorrow.',
          },
          {
            label: 'Launch video/demo asset finalized',
            status: 'fail',
            detail: 'Final cut in editing. Expected delivery in 48 hours.',
          },
        ],
      },
      {
        name: 'Sales Enablement',
        items: [
          {
            label: 'Sales team completed product training',
            status: 'pass',
            detail: 'All AEs and SDRs completed 2-hour training session.',
          },
          {
            label: 'Updated pitch deck distributed',
            status: 'pass',
          },
          {
            label: 'FAQ and objection handling docs in knowledge base',
            status: 'warning',
            detail: 'FAQ complete. Objection handling guide needs 2 more scenarios.',
          },
        ],
      },
      {
        name: 'Technical Infrastructure',
        items: [
          {
            label: 'CDN and caching configured for traffic spike',
            status: 'pass',
          },
          {
            label: 'Monitoring and alerting set up for launch metrics',
            status: 'pass',
            detail: 'PagerDuty alerts configured. War room channel created in Slack.',
          },
          {
            label: 'Database scaled and backup verified',
            status: 'pass',
          },
        ],
      },
      {
        name: 'Legal & Compliance',
        items: [
          {
            label: 'Terms of service updated for new features',
            status: 'pass',
          },
          {
            label: 'Privacy policy reviewed for data handling changes',
            status: 'pass',
          },
          {
            label: 'Compliance sign-off from legal team',
            status: 'warning',
            detail: 'Verbal approval received. Awaiting written confirmation.',
          },
        ],
      },
    ],
    insights: [
      '13 of 16 items are green or yellow. 1 critical blocker: launch video.',
      'All technical infrastructure items are green -engineering is ready.',
      'Marketing assets are the biggest risk area -monitor closely.',
      'Recommend a launch day war room from 8am-12pm with all team leads.',
    ],
  },
};

export default launchReadiness;
