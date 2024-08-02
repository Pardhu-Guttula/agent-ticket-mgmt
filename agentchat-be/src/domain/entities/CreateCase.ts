export class CreateCaseEntity {
    constructor(
      public uniqueCaseId: string,
      public caseDescription: string,
      public caseStatus: string,
      public caseCreatedAt: Date
    ) {}
  }