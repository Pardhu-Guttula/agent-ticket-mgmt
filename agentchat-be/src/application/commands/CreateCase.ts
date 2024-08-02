import { CaseDbRepository } from "../../infrastructure/dbService/MySqlCaseDbRepository"

export class CreateCaseCommand {
  private caseRepository: CaseDbRepository;

  constructor(caseRepository: CaseDbRepository) {
    this.caseRepository = caseRepository;
  }

  async execute(caseData: any): Promise<void> {
    await this.caseRepository.createCase(caseData);
  }
}
 