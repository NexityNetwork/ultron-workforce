import { Template } from '../registry';

export const carouselBuilder: Template = {
  id: 'content-carousel-builder',
  name: 'Carousel Builder',
  description:
    'Create scroll-stopping carousel posts for LinkedIn and Instagram. Structured slides with consistent branding and a clear narrative arc.',
  category: 'content',
  icon: 'layers',
  canvasType: 'carousel',
  variables: [
    {
      key: 'topic',
      label: 'Carousel Topic',
      type: 'text_input',
      default: 'Clean Design',
    },
  ],
  defaultData: {
    title: '5 Rules of [topic]',
    slides: [
      {
        id: 'slide-1',
        heading: '5 Rules of [topic]',
        body: 'A visual guide to creating designs that breathe, communicate, and convert.',
        layout: 'title' as const,
        footnote: 'Swipe to learn ',
      },
      {
        id: 'slide-2',
        heading: '1. Whitespace Is Not Wasted Space',
        body: 'Give your elements room to breathe. Generous margins and padding guide the eye and create visual hierarchy without adding more elements.',
        layout: 'text' as const,
        items: [
          { label: 'Use at least 40px padding between sections', type: 'do' as const },
          { label: 'Cram every pixel with content', type: 'dont' as const },
        ],
      },
      {
        id: 'slide-3',
        heading: '2. Limit Your Typefaces',
        body: 'Stick to 2 fonts maximum -one for headings, one for body. Consistency builds trust and recognition.',
        layout: 'do_dont' as const,
        items: [
          { label: 'Pair a bold sans-serif heading with a clean body font', type: 'do' as const },
          { label: 'Use 5 different fonts to "add variety"', type: 'dont' as const },
          { label: 'Set a type scale and stick to it', type: 'do' as const },
          { label: 'Resize text arbitrarily on every element', type: 'dont' as const },
        ],
      },
      {
        id: 'slide-4',
        heading: '3. Align Everything to a Grid',
        body: 'Invisible structure creates visible order. A consistent grid makes your layouts feel intentional and professional.',
        layout: 'text' as const,
        items: [
          { label: 'Use an 8px base grid for spacing', type: 'do' as const },
          { label: 'Eyeball element placement', type: 'dont' as const },
        ],
      },
      {
        id: 'slide-5',
        heading: '4. Use Color with Purpose',
        body: 'Every color should have a job. Primary for actions, secondary for accents, neutrals for structure. If a color doesn\'t serve a role, remove it.',
        layout: 'list' as const,
        items: [
          { label: '1 primary color for CTAs and key actions' },
          { label: '1-2 secondary colors for accents' },
          { label: 'Neutral palette for text and backgrounds' },
          { label: 'Semantic colors for feedback (success, error, warning)' },
        ],
      },
      {
        id: 'slide-6',
        heading: 'Start Applying These Rules Today',
        body: 'Pick one rule, apply it to your next project, and see the difference. Clean design isn\'t about doing less -it\'s about doing the right things.\n\nFollow for more [topic] tips.',
        layout: 'cta' as const,
        footnote: 'Save this post for later ',
      },
    ],
    style: 'light',
    branding: { name: 'Your Brand', handle: '@yourbrand' },
    insights: [
      'Carousels get 3x more engagement than static posts on LinkedIn',
      'Keep each slide to one core idea for maximum retention',
      'Use the first slide as a hook -it determines swipe-through rate',
      'End with a clear CTA: follow, save, comment, or share',
    ],
  },
};

export default carouselBuilder;
