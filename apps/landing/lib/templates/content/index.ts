import { registerTemplate } from '../registry';
import { carouselBuilder } from './carousel-builder';
import { infographicBuilder } from './infographic-builder';
import { contentCalendar } from './content-calendar';
import { hookGenerator } from './hook-generator';
import { threadBuilder } from './thread-builder';
import { postFrameworks } from './post-frameworks';

export const contentTemplates = [
  carouselBuilder,
  infographicBuilder,
  contentCalendar,
  hookGenerator,
  threadBuilder,
  postFrameworks,
];

contentTemplates.forEach(registerTemplate);

export {
  carouselBuilder,
  infographicBuilder,
  contentCalendar,
  hookGenerator,
  threadBuilder,
  postFrameworks,
};
