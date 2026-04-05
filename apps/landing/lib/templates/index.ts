export {
  type Template,
  type TemplateVariable,
  TEMPLATE_REGISTRY,
  registerTemplate,
  getTemplateById,
  getTemplatesByCategory,
} from './registry';

// Sales
export {
  coldOutreachSequence,
  leadScoringMatrix,
  dealPipelineKanban,
  competitorBattlecard,
  objectionHandler,
  proposalBuilder,
  icpWorkshop,
  salesTemplates,
  registerSalesTemplates,
} from './sales';

// Marketing
export {
  gtmChecklist,
  launchReadiness,
  positioningCanvas,
  channelStrategyMatrix,
  campaignPlanner,
  funnelOptimizer,
  swotAnalysis,
  marketingTemplates,
  registerMarketingTemplates,
} from './marketing';

// Content
export {
  carouselBuilder,
  infographicBuilder,
  contentCalendar,
  hookGenerator,
  threadBuilder,
  postFrameworks,
  contentTemplates,
} from './content';

// Financials
export {
  revenueModel,
  unitEconomics,
  burnRateTracker,
  pricingOptimizer,
  capTable,
  financialProjections,
  financialsTemplates,
} from './financials';

// Fundraising
export {
  pitchDeckBuilder,
  investorOnePager,
  tractionDashboard,
  fundraisingPipeline,
  dueDiligenceChecklist,
  valuationCalculator,
  fundraisingTemplates,
} from './fundraising';

import { registerSalesTemplates } from './sales';
import { registerMarketingTemplates } from './marketing';
// Content, financials, and fundraising register on import (side-effect)
import './content';
import './financials';
import './fundraising';

/**
 * Initialize the template registry with all built-in templates.
 * Call this once at app startup.
 */
export function initializeTemplateRegistry(): void {
  registerSalesTemplates();
  registerMarketingTemplates();
  // Content, financials, fundraising already registered via side-effect imports above
}
