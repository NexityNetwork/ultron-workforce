export { gtmChecklist } from './gtm-checklist';
export { default as gtmChecklistDefault } from './gtm-checklist';

export { launchReadiness } from './launch-readiness';
export { default as launchReadinessDefault } from './launch-readiness';

export { positioningCanvas } from './positioning-canvas';
export { default as positioningCanvasDefault } from './positioning-canvas';

export { channelStrategyMatrix } from './channel-strategy-matrix';
export { default as channelStrategyMatrixDefault } from './channel-strategy-matrix';

export { campaignPlanner } from './campaign-planner';
export { default as campaignPlannerDefault } from './campaign-planner';

export { funnelOptimizer } from './funnel-optimizer';
export { default as funnelOptimizerDefault } from './funnel-optimizer';

export { swotAnalysis } from './swot-analysis';
export { default as swotAnalysisDefault } from './swot-analysis';

export { positioningAnchorAnalysis } from './positioning-anchor-analysis';
export { default as positioningAnchorAnalysisDefault } from './positioning-anchor-analysis';

export { positioningDecisionTree } from './positioning-decision-tree';
export { default as positioningDecisionTreeDefault } from './positioning-decision-tree';

export { positioningStatementBuilder } from './positioning-statement-builder';
export { default as positioningStatementBuilderDefault } from './positioning-statement-builder';

export { messagingFrameworkSimulator } from './messaging-framework-simulator';
export { default as messagingFrameworkSimulatorDefault } from './messaging-framework-simulator';

export { messagingCompetitiveAlternatives } from './messaging-competitive-alternatives';
export { default as messagingCompetitiveAlternativesDefault } from './messaging-competitive-alternatives';

export { messagingValuePropBuilder } from './messaging-value-prop-builder';
export { default as messagingValuePropBuilderDefault } from './messaging-value-prop-builder';

import { registerTemplate } from '../registry';
import { gtmChecklist } from './gtm-checklist';
import { launchReadiness } from './launch-readiness';
import { positioningCanvas } from './positioning-canvas';
import { channelStrategyMatrix } from './channel-strategy-matrix';
import { campaignPlanner } from './campaign-planner';
import { funnelOptimizer } from './funnel-optimizer';
import { swotAnalysis } from './swot-analysis';
import { positioningAnchorAnalysis } from './positioning-anchor-analysis';
import { positioningDecisionTree } from './positioning-decision-tree';
import { positioningStatementBuilder } from './positioning-statement-builder';
import { messagingFrameworkSimulator } from './messaging-framework-simulator';
import { messagingCompetitiveAlternatives } from './messaging-competitive-alternatives';
import { messagingValuePropBuilder } from './messaging-value-prop-builder';

export const marketingTemplates = [
  gtmChecklist,
  launchReadiness,
  positioningCanvas,
  channelStrategyMatrix,
  campaignPlanner,
  funnelOptimizer,
  swotAnalysis,
  positioningAnchorAnalysis,
  positioningDecisionTree,
  positioningStatementBuilder,
  messagingFrameworkSimulator,
  messagingCompetitiveAlternatives,
  messagingValuePropBuilder,
];

export function registerMarketingTemplates(): void {
  marketingTemplates.forEach(registerTemplate);
}
