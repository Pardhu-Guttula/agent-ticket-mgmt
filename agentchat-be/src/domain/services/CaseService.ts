import { CaseTypes } from "../common/ApplicationEnums";
import { ICaseDbRepository } from "../../infrastructure/dbRepositories/ICaseDbRepository";

export class CaseService {
  private caseRepository: ICaseDbRepository;

  constructor(caseRepository: ICaseDbRepository) {
    this.caseRepository = caseRepository;
  }

  async getCasesByType(caseType: CaseTypes): Promise<any[]> {
    try {
      return await this.caseRepository.getCasesByType(caseType);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "An unexpected error occurred while fetching cases by type."
        );
      }
    }
  }

  async getCasesByTypeAndAgent(
    caseType: CaseTypes,
    agentId: string
  ): Promise<any[]> {
    try {
      return await this.caseRepository.getCasesByTypeAndAgent(
        caseType,
        agentId
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "An unexpected error occurred while fetching cases by type and agent."
        );
      }
    }
  }
}
