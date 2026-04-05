export { coldOutreachSequence } from './cold-outreach-sequence';
export { default as coldOutreachSequenceDefault } from './cold-outreach-sequence';

export { leadScoringMatrix } from './lead-scoring-matrix';
export { default as leadScoringMatrixDefault } from './lead-scoring-matrix';

export { dealPipelineKanban } from './deal-pipeline-kanban';
export { default as dealPipelineKanbanDefault } from './deal-pipeline-kanban';

export { competitorBattlecard } from './competitor-battlecard';
export { default as competitorBattlecardDefault } from './competitor-battlecard';

export { objectionHandler } from './objection-handler';
export { default as objectionHandlerDefault } from './objection-handler';

export { proposalBuilder } from './proposal-builder';
export { default as proposalBuilderDefault } from './proposal-builder';

export { icpWorkshop } from './icp-workshop';
export { default as icpWorkshopDefault } from './icp-workshop';

export { outboundTechStack } from './outbound-tech-stack';
export { default as outboundTechStackDefault } from './outbound-tech-stack';

export { outboundSetupChecklist } from './outbound-setup-checklist';
export { default as outboundSetupChecklistDefault } from './outbound-setup-checklist';

export { icpDiscoveryProcess } from './icp-discovery-process';
export { default as icpDiscoveryProcessDefault } from './icp-discovery-process';

export { icpScoringMatrix } from './icp-scoring-matrix';
export { default as icpScoringMatrixDefault } from './icp-scoring-matrix';

export { icpDataCollection } from './icp-data-collection';
export { default as icpDataCollectionDefault } from './icp-data-collection';

import { registerTemplate } from '../registry';
import { coldOutreachSequence } from './cold-outreach-sequence';
import { leadScoringMatrix } from './lead-scoring-matrix';
import { dealPipelineKanban } from './deal-pipeline-kanban';
import { competitorBattlecard } from './competitor-battlecard';
import { objectionHandler } from './objection-handler';
import { proposalBuilder } from './proposal-builder';
import { icpWorkshop } from './icp-workshop';
import { outboundTechStack } from './outbound-tech-stack';
import { outboundSetupChecklist } from './outbound-setup-checklist';
import { icpDiscoveryProcess } from './icp-discovery-process';
import { icpScoringMatrix } from './icp-scoring-matrix';
import { icpDataCollection } from './icp-data-collection';

export const salesTemplates = [
  coldOutreachSequence,
  leadScoringMatrix,
  dealPipelineKanban,
  competitorBattlecard,
  objectionHandler,
  proposalBuilder,
  icpWorkshop,
  outboundTechStack,
  outboundSetupChecklist,
  icpDiscoveryProcess,
  icpScoringMatrix,
  icpDataCollection,
];

export function registerSalesTemplates(): void {
  salesTemplates.forEach(registerTemplate);
}
