import { Template } from '../registry';

export const messagingCompetitiveAlternatives: Template = {
  id: 'marketing-messaging-competitive-alternatives',
  name: 'Competitive Alternatives Map',
  description:
    'Map your competitive landscape into clusters. Identify alternative solutions, acknowledge their pros, and surface the limitations (gaps) your product fills.',
  category: 'marketing',
  icon: 'swords',
  canvasType: 'data_table',
  variables: [
    {
      key: 'product_name',
      label: 'Your Product Name',
      type: 'text_input',
      default: 'Our Product',
    },
  ],
  defaultData: {
    title: 'Competitive Alternatives -[product_name]',
    columns: [
      { key: 'cluster', label: 'Alternative Cluster', type: 'text' },
      { key: 'description', label: 'What They Do', type: 'text' },
      { key: 'pros', label: 'Acknowledge the Pros', type: 'text' },
      { key: 'limitations', label: 'Limitations (The Gap)', type: 'text' },
    ],
    rows: [
      {
        cluster: 'Direct Competitors',
        description: '[Other products in your category that solve a similar problem]',
        pros: '[What they do well -be honest]',
        limitations: '[The specific gap your product fills]',
      },
      {
        cluster: 'Manual Processes',
        description: '[Spreadsheets, email, Slack -how they handle it without software]',
        pros: '[Free, familiar, no learning curve]',
        limitations: '[Not scalable, error-prone, no visibility]',
      },
      {
        cluster: 'Adjacent Tools / Workarounds',
        description: '[Tools not built for this but repurposed -e.g., using a PM tool as a CRM]',
        pros: '[Already in their stack, no new vendor]',
        limitations: '[Missing core features, data fragmentation]',
      },
    ],
    insights: [
      'Build CLUSTERS of alternatives, not just a list of competitors. Include manual processes and workarounds.',
      'Always acknowledge pros -buyers know alternatives have strengths. Ignoring them kills credibility.',
      'Each limitation in the Gap column maps to a capability your product should deliver.',
    ],
    recommendations: [
      'Step 1: List every alternative (including doing nothing).',
      'Step 2: Group into 3-5 clusters by type.',
      'Step 3: For each cluster, write honest pros and the specific limitation you overcome.',
    ],
  },
};

export default messagingCompetitiveAlternatives;
