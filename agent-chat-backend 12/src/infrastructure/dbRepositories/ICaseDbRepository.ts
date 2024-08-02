import { CaseTypes } from "../../domain/common/ApplicationEnums";
import { CreateCaseEntity } from "../../domain/entities/CreateCase";

export interface ICaseDbRepository {
  createCase(newCase: CreateCaseEntity): void | PromiseLike<void>;
  getCasesByType(caseType: CaseTypes): Promise<any[]>;
  getCasesByTypeAndAgent(caseType: CaseTypes, agentId: string): Promise<any[]>;
}
 