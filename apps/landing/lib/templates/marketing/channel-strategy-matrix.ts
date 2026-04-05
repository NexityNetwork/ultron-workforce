import { Template } from '../registry';

export const channelStrategyMatrix: Template = {
  id: 'marketing-channel-strategy-matrix',
  name: 'Channel Strategy Matrix',
  description:
    'Prioritize marketing channels by mapping effort vs. impact. Identify quick wins, strategic bets, and channels to deprioritize.',
  category: 'marketing',
  icon: 'grid-3x3',
  canvasType: 'matrix',
  defaultData: {
    title: 'Channel Strategy Matrix',
    x_axis: ['Low Effort', 'High Effort'],
    y_axis: ['Low Impact', 'High Impact'],
    quadrants: ['Quick Wins', 'Strategic Bets', 'Deprioritize', 'Optimize'],
    items: {
      tl: [
        'Email newsletter to existing subscribers',
        'LinkedIn organic posts from founders',
        'Customer referral program',
        'G2/Capterra review campaigns',
      ],
      tr: [
        'SEO content engine (pillar + cluster strategy)',
        'Account-based marketing program',
        'Webinar/event series with partners',
        'Paid search (Google Ads) at scale',
      ],
      bl: [
        'Print advertising',
        'Generic display ads',
        'Sponsoring unrelated podcasts',
      ],
      br: [
        'Social media ads (retargeting only)',
        'Community Slack/Discord management',
        'Cold outbound email at volume',
      ],
    },
    insights: [
      'Start with Quick Wins to build momentum and prove ROI to leadership',
      'SEO is the highest-impact Strategic Bet -invest early, it compounds',
      'Deprioritize print and generic display -low ROI for B2B SaaS',
      'Optimize retargeting ads -good efficiency but requires ongoing management',
    ],
  },
};

export default channelStrategyMatrix;
