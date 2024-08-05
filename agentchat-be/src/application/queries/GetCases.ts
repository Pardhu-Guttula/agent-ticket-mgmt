import { CaseTypes } from "../../domain/common/ApplicationEnums";
import { CaseService } from "../../domain/services/CaseService";

export class GetCasesQuery {
  private caseService: CaseService;

  constructor(caseService: CaseService) {
    this.caseService = caseService;
  }

  async execute(caseType: CaseTypes, agentId?: string) {
    try {
      if (agentId) {
        return await this.caseService.getCasesByTypeAndAgent(caseType, agentId);
      } else {
        return await this.caseService.getCasesByType(caseType);
      }
    } catch (error) {
      const errorMessage = agentId
        ? "An unexpected error occurred while fetching cases by type and agent."
        : "An unexpected error occurred while fetching cases by type.";

      console.error(errorMessage, JSON.stringify(error));
      throw new Error(errorMessage);
    }
  }
}
