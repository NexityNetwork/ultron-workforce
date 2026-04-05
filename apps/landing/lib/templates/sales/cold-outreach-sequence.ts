import { Template } from '../registry';

export const coldOutreachSequence: Template = {
  id: 'sales-cold-outreach-sequence',
  name: 'Cold Outreach Sequence',
  description:
    'A 3-step cold email sequence designed to book meetings with prospects. Includes proven subject lines, personalized openers, and clear CTAs.',
  category: 'sales',
  icon: 'mail',
  canvasType: 'sequence',
  variables: [
    {
      key: 'company',
      label: 'Target Company',
      type: 'text_input',
      default: 'Acme Corp',
    },
    {
      key: 'first_name',
      label: 'Prospect First Name',
      type: 'text_input',
      default: 'Jordan',
    },
    {
      key: 'product',
      label: 'Your Product Name',
      type: 'text_input',
      default: 'Our platform',
    },
  ],
  defaultData: {
    sequence_name: 'Cold Outreach -[company]',
    steps: [
      {
        step: 1,
        subject: '[first_name], quick question about [company]\'s pipeline',
        preview:
          'Hi [first_name], I noticed [company] recently expanded into new markets. Teams in similar positions have used [product] to accelerate pipeline generation by 40%. Would a 15-minute call this week make sense to explore if we could help?',
        send_day: 0,
        status: 'active',
      },
      {
        step: 2,
        subject: 'Re: [company]\'s pipeline',
        preview:
          'Hi [first_name], wanted to follow up on my last note. I put together a short case study showing how a company similar to [company] used [product] to cut their sales cycle by 3 weeks. Happy to share it -just reply "send it" and I\'ll drop it over.',
        send_day: 3,
        status: 'active',
      },
      {
        step: 3,
        subject: 'Closing the loop, [first_name]',
        preview:
          'Hi [first_name], I don\'t want to be a pest so this will be my last reach out. If improving pipeline velocity at [company] is ever a priority, [product] might be worth a look. Here\'s a 2-min demo: [link]. Either way, wishing you and the team all the best.',
        send_day: 7,
        status: 'active',
      },
    ],
    insights: [
      'Best send times: Tuesday-Thursday, 8-10am recipient local time',
      'Personalize the first line with a recent trigger event for 2x reply rates',
      'Keep emails under 120 words for optimal engagement',
    ],
  },
};

export default coldOutreachSequence;
