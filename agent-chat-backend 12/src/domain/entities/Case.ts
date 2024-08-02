export interface CaseEntity {
    caseId: number;
    userID: number;
    userName: string;
    caseStatus: string;
    caseCreatedAt: Date;
    caseAcceptedAt: Date | null;
    caseResolvedAt: Date | null;
    caseEscalatedAt: Date | null;
    caseDescription: string;
    completionNote: string | null;
    uniqueAgentId: string | null;
    uniqueCaseId: string;
  }