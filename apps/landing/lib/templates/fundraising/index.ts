import { registerTemplate } from '../registry';
import { pitchDeckBuilder } from './pitch-deck-builder';
import { investorOnePager } from './investor-one-pager';
import { tractionDashboard } from './traction-dashboard';
import { fundraisingPipeline } from './fundraising-pipeline';
import { dueDiligenceChecklist } from './due-diligence-checklist';
import { valuationCalculator } from './valuation-calculator';

export const fundraisingTemplates = [
  pitchDeckBuilder,
  investorOnePager,
  tractionDashboard,
  fundraisingPipeline,
  dueDiligenceChecklist,
  valuationCalculator,
];

fundraisingTemplates.forEach(registerTemplate);

export {
  pitchDeckBuilder,
  investorOnePager,
  tractionDashboard,
  fundraisingPipeline,
  dueDiligenceChecklist,
  valuationCalculator,
};
