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
      throw error;
    }
  }

  async getCasesByTypeAndAgent(caseType: CaseTypes, agentId: string): Promise<any[]> {
    try {
      return await this.caseRepository.getCasesByTypeAndAgent(caseType, agentId);
    } catch (error) {
      throw error;
    }
  }
}
