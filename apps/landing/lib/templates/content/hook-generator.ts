import { Template } from '../registry';

export const hookGenerator: Template = {
  id: 'content-hook-generator',
  name: 'Hook Generator',
  description:
    'A collection of proven hook formulas to grab attention in the first line. Battle-tested openers for posts, threads, and videos.',
  category: 'content',
  icon: 'anchor',
  canvasType: 'text_cards',
  variables: [
    {
      key: 'topic',
      label: 'Topic',
      type: 'text_input',
      default: 'productivity',
    },
  ],
  defaultData: {
    title: 'Hook Formulas for [topic]',
    cards: [
      {
        id: 'hook-1',
        category: 'Curiosity Gap',
        hook: 'I discovered something about [topic] that nobody talks about.',
        example:
          'I discovered something about hiring that nobody talks about. The best candidates never apply -here\'s how we find them.',
        platform: 'linkedin',
        color: '#6366F1',
      },
      {
        id: 'hook-2',
        category: 'Contrarian Take',
        hook: 'Unpopular opinion: Everything you know about [topic] is wrong.',
        example:
          'Unpopular opinion: Multitasking isn\'t killing your productivity -context-switching without systems is. Here\'s the difference.',
        platform: 'twitter',
        color: '#EC4899',
      },
      {
        id: 'hook-3',
        category: 'Stat Opener',
        hook: '[Surprising number]% of [group] fail at [topic]. Here\'s what the other [remaining]% do differently.',
        example:
          '92% of New Year\'s resolutions fail by February. Here\'s what the other 8% do differently (backed by research).',
        platform: 'linkedin',
        color: '#14B8A6',
      },
      {
        id: 'hook-4',
        category: 'Story Hook',
        hook: '[Time] ago, I [starting point]. Today, I [impressive result]. Here\'s the full story:',
        example:
          '18 months ago, I was burning out working 80-hour weeks. Today, I work 35 hours and earn 3x more. Here\'s the full story:',
        platform: 'linkedin',
        color: '#F59E0B',
      },
      {
        id: 'hook-5',
        category: 'Question Hook',
        hook: 'What would change if you could [desirable outcome] in half the time?',
        example:
          'What would change if you could close deals in half the time? I tested 4 frameworks on 200+ sales calls. Here are the results.',
        platform: 'twitter',
        color: '#8B5CF6',
      },
      {
        id: 'hook-6',
        category: 'Listicle',
        hook: '[Number] [topic] lessons I learned the hard way (so you don\'t have to):',
        example:
          '7 pricing lessons I learned the hard way (so you don\'t have to). Number 4 doubled our conversion rate overnight.',
        platform: 'twitter',
        color: '#06B6D4',
      },
      {
        id: 'hook-7',
        category: 'How-To',
        hook: 'How to [achieve outcome] (even if [common objection]):',
        example:
          'How to build a personal brand on LinkedIn (even if you have zero followers and nothing to say). A step-by-step playbook:',
        platform: 'linkedin',
        color: '#22C55E',
      },
      {
        id: 'hook-8',
        category: 'Bold Claim',
        hook: '[Topic] is a solved problem. Most people just overcomplicate it.',
        example:
          'Content creation is a solved problem. Most people just overcomplicate it. Here\'s the 30-minute system I use to create a week of content:',
        platform: 'twitter',
        color: '#EF4444',
      },
    ],
    insights: [
      'The first line determines 80% of your engagement -spend 50% of your writing time on the hook',
      'Curiosity Gap and Story Hooks perform best on LinkedIn; Bold Claims and Listicles win on Twitter',
      'Always deliver on the promise your hook makes -clickbait destroys long-term trust',
      'Test 2-3 hook styles per week and track which formats get the most saves and shares',
    ],
  },
};

export default hookGenerator;
