import { Template } from '../registry';

export const postFrameworks: Template = {
  id: 'content-post-frameworks',
  name: 'Post Frameworks',
  description:
    'A collection of proven copywriting frameworks adapted for social media. AIDA, PAS, BAB, 4Ps, and STAR -each with structure and examples.',
  category: 'content',
  icon: 'layout',
  canvasType: 'text_cards',
  defaultData: {
    title: 'Post Frameworks -Write Better Content, Faster',
    cards: [
      {
        id: 'framework-aida',
        category: 'AIDA',
        hook: 'Attention  Interest  Desire  Action',
        example:
          'A: "90% of startups fail at marketing -not product."\n\nI: "After analyzing 200+ failed launches, one pattern emerged: they built first, marketed never."\n\nD: "Imagine having a pipeline of qualified leads before you write a single line of code."\n\nA: "Download our pre-launch marketing playbook (link in comments)."',
        platform: 'linkedin',
        color: '#6366F1',
      },
      {
        id: 'framework-pas',
        category: 'PAS',
        hook: 'Problem  Agitation  Solution',
        example:
          'P: "You spend 3 hours writing a post. It gets 12 likes. You wonder why you bother."\n\nA: "Meanwhile, others with half your expertise are going viral. The algorithm feels rigged. Your content disappears into the void."\n\nS: "The difference isn\'t talent -it\'s structure. Here are 3 frameworks that turned my engagement around in 30 days."',
        platform: 'linkedin',
        color: '#EC4899',
      },
      {
        id: 'framework-bab',
        category: 'BAB',
        hook: 'Before  After  Bridge',
        example:
          'Before: "I was posting 5x per week. Barely any engagement. Felt like shouting into the void."\n\nAfter: "Now I post 3x per week and consistently get 50K+ impressions. My DMs are full of inbound leads."\n\nBridge: "The shift? I stopped writing about what I know and started writing about what my audience struggles with. Here\'s the exact system:"',
        platform: 'linkedin',
        color: '#14B8A6',
      },
      {
        id: 'framework-4ps',
        category: '4Ps',
        hook: 'Promise  Picture  Proof  Push',
        example:
          'Promise: "You can build a $10K/mo newsletter in 12 months."\n\nPicture: "Imagine waking up on Monday knowing 50,000 people are waiting to read what you wrote. Your inbox has 3 sponsorship inquiries."\n\nProof: "I started with 47 subscribers in January 2024. Today I have 52,000 and the newsletter generates $14K/mo."\n\nPush: "Here\'s the 5-step system I used (steal it):"',
        platform: 'twitter',
        color: '#F59E0B',
      },
      {
        id: 'framework-star',
        category: 'STAR',
        hook: 'Situation  Task  Action  Result',
        example:
          'Situation: "Our startup was burning $80K/mo with 6 months of runway left."\n\nTask: "I needed to cut burn by 40% without killing growth."\n\nAction: "I audited every expense, renegotiated 3 contracts, automated our support tier-1, and shifted from paid to organic acquisition."\n\nResult: "Burn dropped to $45K/mo. Runway extended to 14 months. And somehow revenue went UP 22% because we focused on what actually worked."',
        platform: 'linkedin',
        color: '#8B5CF6',
      },
    ],
    insights: [
      'PAS is the highest-converting framework for posts that sell -lead with pain, then offer relief',
      'AIDA works best for announcing new products or features; BAB is ideal for personal stories',
      'STAR is perfect for case studies and experience-based content that builds credibility',
      'Mix frameworks throughout the week -repetitive structure becomes invisible to your audience',
      'Always write the hook first, then choose the framework that fits the message',
    ],
  },
};

export default postFrameworks;
