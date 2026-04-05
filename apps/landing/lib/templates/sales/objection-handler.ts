import { Template } from '../registry';

export const objectionHandler: Template = {
  id: 'sales-objection-handler',
  name: 'Objection Handler',
  description:
    'Decision tree for handling the most common sales objections. Navigate from objection to rebuttal to next steps.',
  category: 'sales',
  icon: 'shield-question',
  canvasType: 'decision_tree',
  defaultData: {
    title: 'Sales Objection Handler',
    root: {
      id: 'root',
      label: "What's the prospect's objection?",
      description: 'Identify the primary objection before responding.',
      type: 'question',
      children: [
        {
          edge_label: 'Price / Budget',
          node: {
            id: 'price',
            label: 'Is there a stated budget?',
            type: 'question',
            children: [
              {
                edge_label: 'Yes, but we exceed it',
                node: {
                  id: 'price-over-budget',
                  label: 'Reframe around ROI and cost of inaction',
                  description:
                    'Show the prospect what they lose by NOT buying. Use the ROI calculator to demonstrate payback within 3 months. Offer a phased rollout to reduce initial spend.',
                  type: 'action',
                  children: [
                    {
                      edge_label: 'Still resistant',
                      node: {
                        id: 'price-discount',
                        label: 'Propose annual commitment for discount',
                        description:
                          'Offer 15-20% annual discount. Never discount without getting something in return (longer term, case study, referral).',
                        type: 'outcome',
                      },
                    },
                  ],
                },
              },
              {
                edge_label: 'No defined budget',
                node: {
                  id: 'price-no-budget',
                  label: 'Help them build the business case',
                  description:
                    'Provide an ROI template they can take to finance. Offer to join an internal pitch call. Quantify current pain in dollars.',
                  type: 'action',
                },
              },
            ],
          },
        },
        {
          edge_label: 'Timing / Not Now',
          node: {
            id: 'timing',
            label: 'Is there a specific trigger event?',
            type: 'question',
            children: [
              {
                edge_label: 'Yes, future initiative',
                node: {
                  id: 'timing-future',
                  label: 'Anchor to their timeline',
                  description:
                    'Agree on a start date and work backwards. "If you need this live by Q3, we should kick off implementation by May." Set a calendar reminder to re-engage.',
                  type: 'action',
                },
              },
              {
                edge_label: 'No, just stalling',
                node: {
                  id: 'timing-stall',
                  label: 'Create urgency with cost of delay',
                  description:
                    'Calculate what each month of delay costs them. Share a competitor story: "Company X waited 6 months and lost $200K in pipeline." Propose a low-commitment pilot.',
                  type: 'action',
                },
              },
            ],
          },
        },
        {
          edge_label: 'Competition',
          node: {
            id: 'competition',
            label: 'Which competitor are they evaluating?',
            type: 'question',
            children: [
              {
                edge_label: 'Incumbent / Status quo',
                node: {
                  id: 'comp-incumbent',
                  label: 'Highlight hidden costs of staying',
                  description:
                    'Map out the total cost of ownership including time, missed opportunities, and technical debt. Propose a side-by-side pilot comparing outcomes.',
                  type: 'action',
                },
              },
              {
                edge_label: 'Direct competitor',
                node: {
                  id: 'comp-direct',
                  label: 'Deploy the battlecard',
                  description:
                    'Pull up the competitor battlecard. Lead with your unique differentiators. Never trash-talk -focus on what makes you different, not what makes them bad.',
                  type: 'action',
                },
              },
            ],
          },
        },
        {
          edge_label: "Don't See the Need",
          node: {
            id: 'need',
            label: 'Revisit discovery',
            description:
              'You may have missed a pain point, or the prospect does not feel the pain strongly enough yet.',
            type: 'action',
            children: [
              {
                edge_label: 'Pain identified',
                node: {
                  id: 'need-pain',
                  label: 'Quantify the impact of the pain',
                  description:
                    'Use specific numbers: "You mentioned your team spends 10 hours/week on manual reporting. That is $52K/year in lost productivity." Tie back to their stated goals.',
                  type: 'outcome',
                },
              },
              {
                edge_label: 'No real pain',
                node: {
                  id: 'need-no-pain',
                  label: 'Gracefully exit and nurture',
                  description:
                    'Not every prospect is a buyer today. Add them to a nurture sequence. Set a 90-day check-in. Stay top of mind with valuable content.',
                  type: 'outcome',
                },
              },
            ],
          },
        },
        {
          edge_label: 'No Authority / Need Approval',
          node: {
            id: 'authority',
            label: 'Enable your champion',
            description:
              'Your contact wants to buy but cannot approve it alone.',
            type: 'action',
            children: [
              {
                edge_label: 'Champion is engaged',
                node: {
                  id: 'authority-champion',
                  label: 'Arm them with internal selling tools',
                  description:
                    'Provide a one-pager, ROI summary, and executive brief they can forward. Offer to join the internal meeting or do an exec-to-exec call.',
                  type: 'outcome',
                },
              },
              {
                edge_label: 'Champion is weak',
                node: {
                  id: 'authority-weak',
                  label: 'Go multi-threaded',
                  description:
                    'Identify other stakeholders via LinkedIn or org chart. Run a targeted outreach to the economic buyer. Leverage any executive sponsors on your side.',
                  type: 'outcome',
                },
              },
            ],
          },
        },
      ],
    },
    insights: [
      'The most common objection (price) is rarely about the actual number -dig deeper',
      'Always validate the objection before responding: "I hear you -can you tell me more?"',
      'If you encounter 3+ objections in one call, revisit whether this is a qualified opportunity',
    ],
  },
};

export default objectionHandler;
