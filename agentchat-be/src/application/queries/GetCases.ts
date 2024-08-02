import { CaseTypes } from "../../domain/common/ApplicationEnums";
import { CaseService } from "../../domain/services/CaseService";

export class GetCasesQuery {
  private caseService: CaseService;

  constructor(caseService: CaseService) {
    this.caseService = caseService;
  }

  async execute(caseType: CaseTypes, agentId?: string): Promise<any[]> {
    try {
      if (agentId) {
        return await this.caseService.getCasesByTypeAndAgent(caseType, agentId);
      } else {
        return await this.caseService.getCasesByType(caseType);
      }
    } catch (error) {
      throw error;
    }
  }
}
