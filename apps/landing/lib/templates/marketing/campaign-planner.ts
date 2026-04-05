import { Template } from '../registry';

export const campaignPlanner: Template = {
  id: 'marketing-campaign-planner',
  name: 'Campaign Planner',
  description:
    'Plan a multi-channel marketing campaign with a week-by-week content calendar. Includes social, email, blog, and paid channels.',
  category: 'marketing',
  icon: 'calendar',
  canvasType: 'content_calendar',
  defaultData: {
    week_start: '2026-03-23',
    days: [
      {
        date: '2026-03-23',
        posts: [
          {
            platform: 'LinkedIn',
            title: 'Campaign Teaser Post',
            status: 'scheduled',
            time: '09:00',
            hook: 'Something big is coming this week...',
            preview:
              'We have been working on something that will change how you think about [topic]. Stay tuned.',
            cta: 'Follow us for the reveal',
            hashtags: ['#ComingSoon', '#B2BSaaS'],
          },
          {
            platform: 'Email',
            title: 'Pre-launch Warm-up Email',
            status: 'scheduled',
            time: '10:00',
            hook: 'You are on the early access list',
            preview:
              'As a valued subscriber, you will get first access to our new [feature/product] launching this week.',
            cta: 'Mark your calendar for Wednesday',
          },
        ],
      },
      {
        date: '2026-03-24',
        posts: [
          {
            platform: 'Blog',
            title: 'Thought Leadership Article',
            status: 'draft',
            time: '08:00',
            hook: 'Why the old way of doing [topic] is broken',
            preview:
              'A deep-dive article setting up the problem narrative that the campaign addresses. Positions our POV.',
            cta: 'Read the full article',
            notes: 'SEO target: "how to [topic]" -aim for 1500+ words',
          },
          {
            platform: 'Twitter/X',
            title: 'Thread: Problem Narrative',
            status: 'draft',
            time: '12:00',
            hook: 'Hot take: Most teams are wasting 10+ hours/week on [task].',
            preview:
              '5-tweet thread breaking down the problem and hinting at our solution.',
            hashtags: ['#SalesOps', '#RevOps', '#Productivity'],
          },
        ],
      },
      {
        date: '2026-03-25',
        posts: [
          {
            platform: 'LinkedIn',
            title: 'Launch Announcement',
            status: 'draft',
            time: '09:00',
            hook: 'It is here. Introducing [product/feature].',
            preview:
              'Main launch post with hero image/video. Tags key people and companies.',
            cta: 'Try it free today',
            hashtags: ['#ProductLaunch', '#B2BSaaS', '#Innovation'],
          },
          {
            platform: 'Email',
            title: 'Launch Email to Full List',
            status: 'draft',
            time: '09:30',
            hook: 'Introducing [product/feature] -built for teams like yours',
            preview:
              'Full launch email with benefits, social proof, and CTA to sign up or book a demo.',
            cta: 'Get started free / Book a demo',
          },
          {
            platform: 'Product Hunt',
            title: 'Product Hunt Launch',
            status: 'planned',
            time: '00:01',
            hook: 'We are live on Product Hunt!',
            preview:
              'Coordinate upvotes, comments, and maker responses throughout the day.',
            cta: 'Support us on Product Hunt',
            notes: 'Prep maker comment, first comment, and response templates in advance.',
          },
        ],
      },
      {
        date: '2026-03-26',
        posts: [
          {
            platform: 'LinkedIn',
            title: 'Customer Testimonial Post',
            status: 'planned',
            time: '10:00',
            hook: '"This tool saved our team 12 hours per week" -Sarah, VP Sales',
            preview:
              'Social proof post featuring an early customer quote and results.',
            cta: 'See how they did it',
          },
          {
            platform: 'Twitter/X',
            title: 'Launch Day Recap Thread',
            status: 'planned',
            time: '14:00',
            hook: 'Yesterday we launched [product]. Here is what happened:',
            preview:
              'Recap thread with metrics, reactions, and key takeaways from launch day.',
          },
        ],
      },
      {
        date: '2026-03-27',
        posts: [
          {
            platform: 'Blog',
            title: 'How-To Guide',
            status: 'planned',
            time: '08:00',
            hook: 'Getting started with [product] in 10 minutes',
            preview:
              'Step-by-step tutorial showing the product in action. Captures long-tail SEO traffic.',
            cta: 'Start your free trial',
            notes: 'Include screenshots and embedded video walkthrough.',
          },
          {
            platform: 'Email',
            title: 'Follow-up to Non-Openers',
            status: 'planned',
            time: '11:00',
            hook: 'In case you missed it: [product] is live',
            preview:
              'Resend launch email with different subject line to subscribers who did not open.',
            cta: 'Check it out',
          },
          {
            platform: 'LinkedIn',
            title: 'Behind-the-Scenes Post',
            status: 'planned',
            time: '15:00',
            hook: 'What it actually took to build and launch this in 8 weeks',
            preview:
              'Authentic founder/team post about the journey. Humanizes the brand.',
            cta: 'What would you ship in 8 weeks?',
          },
        ],
      },
    ],
    insights: [
      'Heaviest content load is on launch day (Wednesday) -ensure all assets are final by Monday EOD',
      'Repurpose the blog article into the Twitter thread and LinkedIn post to maximize reach',
      'Product Hunt launch timing is critical -coordinate team upvotes for the first 2 hours',
      'Track UTM-tagged links per channel to attribute sign-ups back to specific posts',
    ],
  },
};

export default campaignPlanner;
