import { Template } from '../registry';

export const threadBuilder: Template = {
  id: 'content-thread-builder',
  name: 'Thread Builder',
  description:
    'Structure a compelling Twitter/X thread with a hook, body, and CTA. Pre-built 7-tweet template with numbered flow and engagement tactics.',
  category: 'content',
  icon: 'message-square',
  canvasType: 'text_cards',
  variables: [
    {
      key: 'topic',
      label: 'Thread Topic',
      type: 'text_input',
      default: 'building in public',
    },
  ],
  defaultData: {
    title: '[topic] Breakdown Thread',
    cards: [
      {
        id: 'tweet-1',
        category: '1/7 -Hook',
        hook: 'I spent 6 months studying [topic].\n\nHere are 5 lessons that changed everything I thought I knew:\n\n',
        example:
          'Open with a bold claim or specific result. The hook must stop the scroll. Use a number, a timeframe, or a surprising outcome. Always end with the thread emoji .',
        platform: 'twitter',
        color: '#1D9BF0',
      },
      {
        id: 'tweet-2',
        category: '2/7 -Context',
        hook: 'First, some context:\n\n[Briefly explain the problem or situation]\n\nMost people approach [topic] by [common approach].\n\nBut that misses the bigger picture.',
        example:
          'Set the stage before diving into lessons. Give readers enough context to understand why this matters. Keep it to 3-4 lines max.',
        platform: 'twitter',
        color: '#1D9BF0',
      },
      {
        id: 'tweet-3',
        category: '3/7 -Lesson 1',
        hook: 'Lesson 1: [Core insight]\n\n[2-3 sentences explaining the lesson]\n\nThe key takeaway:\n [Actionable point]',
        example:
          'Lead with your strongest insight. Use a clear structure: state the lesson, explain it, give a concrete takeaway. Use  arrows for scannability.',
        platform: 'twitter',
        color: '#1D9BF0',
      },
      {
        id: 'tweet-4',
        category: '4/7 -Lesson 2',
        hook: 'Lesson 2: [Second insight]\n\nHere\'s what surprised me:\n\n[Data point or story that illustrates the lesson]\n\nThis means:\n [Practical implication]',
        example:
          'Include a data point, screenshot, or mini-story to make this tweet stand alone. Each tweet in a thread should be independently valuable.',
        platform: 'twitter',
        color: '#1D9BF0',
      },
      {
        id: 'tweet-5',
        category: '5/7 -Lesson 3',
        hook: 'Lesson 3: [Third insight]\n\nBefore: [old approach]\nAfter: [new approach]\n\nThe difference? [Key factor].\n\nResult: [Specific outcome]',
        example:
          'Use a before/after format to show transformation. Concrete examples always outperform abstract advice. Include a measurable result when possible.',
        platform: 'twitter',
        color: '#1D9BF0',
      },
      {
        id: 'tweet-6',
        category: '6/7 -Key Takeaway',
        hook: 'The biggest lesson from all of this:\n\n[topic] isn\'t about [common misconception].\n\nIt\'s about [real insight].\n\nOnce you understand that, everything changes.',
        example:
          'Synthesize the thread into one overarching principle. This tweet should work as a standalone post. It often gets the most retweets.',
        platform: 'twitter',
        color: '#1D9BF0',
      },
      {
        id: 'tweet-7',
        category: '7/7 -CTA',
        hook: 'TL;DR:\n\n1. [Lesson 1 in 5 words]\n2. [Lesson 2 in 5 words]\n3. [Lesson 3 in 5 words]\n\nIf this was valuable:\n• Retweet the first tweet to help others\n• Follow @[handle] for more [topic] insights',
        example:
          'Summarize the entire thread in a scannable format. Always include a clear CTA -retweet, follow, or reply. Make it easy to share.',
        platform: 'twitter',
        color: '#1D9BF0',
      },
    ],
    insights: [
      'Threads with 5-10 tweets get the highest engagement; beyond 15 tweets, completion drops sharply',
      'Post your thread between 8-10am EST for maximum visibility; Tuesday-Thursday perform best',
      'Add a self-reply with a relevant link 30 minutes after posting to avoid algorithm suppression',
      'Quote-tweet your own hook 4-6 hours later to catch a second wave of impressions',
    ],
  },
};

export default threadBuilder;
