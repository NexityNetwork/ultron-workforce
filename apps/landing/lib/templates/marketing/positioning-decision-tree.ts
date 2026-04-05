import { Template } from '../registry';

export const positioningDecisionTree: Template = {
  id: 'marketing-positioning-decision-tree',
  name: 'Positioning Decision Tree',
  description:
    'Step-by-step decision tree to choose the right primary positioning anchor for your product. Answer yes/no questions to find your fit.',
  category: 'marketing',
  icon: 'git-branch',
  canvasType: 'decision_tree',
  variables: [
    {
      key: 'product_name',
      label: 'Your Product Name',
      type: 'text_input',
      default: 'Our Product',
    },
  ],
  defaultData: {
    title: 'Choose Your Positioning Anchor -[product_name]',
    root: {
      id: 'q0',
      label: 'Is there a dominant, well-known market leader?',
      description: 'Almost every buyer knows them. They own most category mindshare and are the default comparison point.',
      type: 'question',
      children: [
        {
          edge_label: 'Yes -dominant leader exists + clear wedge',
          node: {
            id: 'o_competitive',
            label: 'Competitive Alternative Positioning',
            description: '"We\'re a [Leader]-alternative." Position directly against the leader with your unique wedge.',
            type: 'outcome',
          },
        },
        {
          edge_label: 'No -or no clear wedge',
          node: {
            id: 'q1',
            label: 'Do buyers Google a specific software category?',
            description: 'Do they compare vendors on G2/Capterra? Ask for demos of multiple vendors in the same category?',
            type: 'question',
            children: [
              {
                edge_label: 'Yes -buyers think in category terms',
                node: {
                  id: 'o_category',
                  label: 'Product Category Positioning',
                  description: '"We are a X." Buyers already have a mental model. Differentiate within the recognized category.',
                  type: 'outcome',
                },
              },
              {
                edge_label: 'No -buyers don\'t search by category',
                node: {
                  id: 'q2',
                  label: 'Can buyers clearly describe what they want to achieve?',
                  description: 'They describe the job but not the software. "We need to schedule interviews faster."',
                  type: 'question',
                  children: [
                    {
                      edge_label: 'Yes -they articulate the job, not the category',
                      node: {
                        id: 'o_usecase',
                        label: 'Use Case Positioning',
                        description: '"We help you do X without Y." Own the job-to-be-done and remove the friction.',
                        type: 'outcome',
                      },
                    },
                    {
                      edge_label: 'No -can\'t articulate the problem',
                      node: {
                        id: 'q3',
                        label: 'Is the dominant solution still manual?',
                        description: '"We just use spreadsheets." "We handle this in Slack/email." "We don\'t have a tool."',
                        type: 'question',
                        children: [
                          {
                            edge_label: 'Yes -mostly manual workflows',
                            node: {
                              id: 'o_activity',
                              label: 'Activity Positioning',
                              description: '"We help you do X." Name the manual activity and expose the pain.',
                              type: 'outcome',
                            },
                          },
                          {
                            edge_label: 'No',
                            node: {
                              id: 'o_reevaluate',
                              label: 'Re-evaluate your market understanding',
                              description: 'Revisit your ICP and problem definition. The market may not be ready.',
                              type: 'action',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
    insights: [
      'Answer top to bottom. No strategy debates -just yes or no.',
      'Choose based on how buyers think today, not how you want them to think.',
      'Your positioning can mature: Activity > Use Case > Category > Alternative.',
    ],
  },
};

export default positioningDecisionTree;
