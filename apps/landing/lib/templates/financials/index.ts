import { registerTemplate } from '../registry';
import { revenueModel } from './revenue-model';
import { unitEconomics } from './unit-economics';
import { burnRateTracker } from './burn-rate-tracker';
import { pricingOptimizer } from './pricing-optimizer';
import { capTable } from './cap-table';
import { financialProjections } from './financial-projections';

export const financialsTemplates = [
  revenueModel,
  unitEconomics,
  burnRateTracker,
  pricingOptimizer,
  capTable,
  financialProjections,
];

financialsTemplates.forEach(registerTemplate);

export {
  revenueModel,
  unitEconomics,
  burnRateTracker,
  pricingOptimizer,
  capTable,
  financialProjections,
};
