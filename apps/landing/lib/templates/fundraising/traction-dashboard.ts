import { Template } from '../registry';

export const tractionDashboard: Template = {
  id: 'fundraising-traction-dashboard',
  name: 'Traction Dashboard -3 Stages to €1M ARR',
  description:
    'Track your startup\'s journey to €1M ARR across three stages: Hustle Mode, Focus Mode, and Expansion Mode. Built on a proven three-stage framework for early-stage SaaS growth.',
  category: 'fundraising',
  icon: 'rocket',
  canvasType: 'metrics_dashboard',
  defaultData: {
    title: '3 Stages to €1M ARR -Traction Dashboard',
    period: 'Q1 2026',
    kpis: [
      {
        label: 'ARR',
        value: '€320,000',
        change: '+42% QoQ',
        trend: 'up' as const,
        status: 'good' as const,
      },
      {
        label: 'MRR',
        value: '€26,700',
        change: '+18% MoM',
        trend: 'up' as const,
        status: 'good' as const,
      },
      {
        label: 'Paying Customers',
        value: '38',
        change: '+8 this quarter',
        trend: 'up' as const,
        status: 'good' as const,
      },
      {
        label: 'MoM Growth Rate',
        value: '18%',
        change: '+3pp',
        trend: 'up' as const,
        status: 'good' as const,
      },
      {
        label: 'Current Stage',
        value: 'Stage 2: Focus Mode',
        change: 'Entered at €100K ARR',
        trend: 'up' as const,
        status: 'good' as const,
      },
    ],
    stages: [
      {
        name: 'Stage 1: Hustle Mode',
        range: '€0 – €100K ARR',
        status: 'completed' as const,
        description:
          'Run tests, validate hypotheses, and experiment with go-to-market. Everything is manual. The goal is learning, not scaling.',
        milestones: [
          'Problem-Solution Fit validated with 10+ customer interviews',
          'First 10 paying customers acquired through founder-led sales',
          'Identified 2-3 promising acquisition channels',
          'Core product loop validated with >40% weekly retention',
          'Reached €8K+ MRR with positive unit economics signal',
        ],
      },
      {
        name: 'Stage 2: Focus Mode',
        range: '€100K – €1M ARR',
        status: 'active' as const,
        description:
          '1 ICP, 1 use case, 1-2 channels. Build GTM Playbook V1. Stop experimenting and double down on what works. Repeatability over novelty.',
        milestones: [
          'Narrowed to 1 clear ICP with documented buying triggers',
          'Standardized sales process with <45 day sales cycle',
          'Primary channel producing consistent, predictable pipeline',
          'Net Revenue Retention above 110%',
          'Hired first 2-3 salespeople beyond founders',
        ],
      },
      {
        name: 'Stage 3: Expansion Mode',
        range: '€1M+ ARR',
        status: 'upcoming' as const,
        description:
          'New ICPs, new use cases, new channels. Scale what\'s working and expand into adjacent segments. Build the GTM machine.',
        milestones: [
          'Expand to 2-3 ICPs with tailored messaging per segment',
          'Launch 2+ new acquisition channels (partnerships, PLG, events)',
          'Build out SDR/BDR team for outbound at scale',
          'Achieve >120% Net Revenue Retention through expansion plays',
          'Establish repeatable GTM playbook that works without founders',
        ],
      },
    ],
    chart: {
      type: 'area' as const,
      data: [
        { name: 'Jan \'25', value: 15000, stage: 1 },
        { name: 'Mar \'25', value: 28000, stage: 1 },
        { name: 'May \'25', value: 48000, stage: 1 },
        { name: 'Jul \'25', value: 72000, stage: 1 },
        { name: 'Sep \'25', value: 100000, stage: 1 },
        { name: 'Nov \'25', value: 145000, stage: 2 },
        { name: 'Jan \'26', value: 210000, stage: 2 },
        { name: 'Mar \'26', value: 320000, stage: 2 },
        { name: 'May \'26', value: 460000, stage: 2 },
        { name: 'Jul \'26', value: 620000, stage: 2 },
        { name: 'Sep \'26', value: 810000, stage: 2 },
        { name: 'Nov \'26', value: 1050000, stage: 3 },
      ],
      xKey: 'name',
      yKey: 'value',
    },
    breakdown: [
      {
        label: 'Problem-Solution Fit',
        value: 'Achieved',
        percentage: 100,
      },
      {
        label: 'Product-Market Fit',
        value: 'In Progress',
        percentage: 65,
      },
      {
        label: 'GTM Fit',
        value: 'Upcoming',
        percentage: 15,
      },
    ],
    insights: [
      'Currently in Stage 2 (Focus Mode) at €320K ARR -on track to reach €1M ARR by Q4 2026',
      'Focus on 1 ICP and 1-2 channels until GTM Playbook V1 is repeatable and predictable',
      'Stage transition from Hustle  Focus happened at €100K ARR after validating founder-led sales',
      'Key risk: premature expansion into new ICPs before the core playbook is proven -stay disciplined',
      'At 18% MoM growth, the math works: €320K  €1M ARR in ~7 months if growth holds steady',
    ],
  },
};

export default tractionDashboard;
