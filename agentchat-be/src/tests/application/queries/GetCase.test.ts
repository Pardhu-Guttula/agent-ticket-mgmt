import { GetCasesQuery } from "../../../application/queries/GetCases";
import { CaseService } from "../../../domain/services/CaseService";
import { CaseTypes } from "../../../domain/common/ApplicationEnums";
import { ICaseDbRepository } from "../../../infrastructure/dbRepositories/ICaseDbRepository";

jest.mock("../../../domain/services/CaseService");

describe("GetCasesQuery", () => {
  let caseService: jest.Mocked<CaseService>;
  let getCasesQuery: GetCasesQuery;

  beforeEach(() => {
    const caseDbRepository: jest.Mocked<ICaseDbRepository> = {} as jest.Mocked<
      ICaseDbRepository
    >;
    caseService = new CaseService(caseDbRepository) as jest.Mocked<CaseService>;
    getCasesQuery = new GetCasesQuery(caseService);
  });

  describe("execute with caseType and agentId", () => {
    it("should retrieve cases based on type and agent ID successfully", async () => {
      const caseType = CaseTypes.Pending;
      const agentId = "A00001";
      const cases = [{ caseId: "C00001", caseType, agentId }];

      caseService.getCasesByTypeAndAgent.mockResolvedValueOnce(cases);

      const result = await getCasesQuery.execute(caseType, agentId);

      expect(result).toEqual(cases);
      expect(caseService.getCasesByTypeAndAgent).toHaveBeenCalledWith(
        caseType,
        agentId
      );
      expect(caseService.getCasesByTypeAndAgent).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array if no cases match the type and agent ID", async () => {
      const caseType = CaseTypes.Pending;
      const agentId = "A00001";
      const cases: any[] = [];

      caseService.getCasesByTypeAndAgent.mockResolvedValueOnce(cases);

      const result = await getCasesQuery.execute(caseType, agentId);

      expect(result).toEqual(cases);
      expect(caseService.getCasesByTypeAndAgent).toHaveBeenCalledWith(
        caseType,
        agentId
      );
      expect(caseService.getCasesByTypeAndAgent).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when the service method fails", async () => {
      const caseType = CaseTypes.Pending;
      const agentId = "A00001";
      const errorMessage = "Failed to retrieve cases";

      caseService.getCasesByTypeAndAgent.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await expect(getCasesQuery.execute(caseType, agentId)).rejects.toThrow(
        errorMessage
      );

      expect(caseService.getCasesByTypeAndAgent).toHaveBeenCalledWith(
        caseType,
        agentId
      );
      expect(caseService.getCasesByTypeAndAgent).toHaveBeenCalledTimes(1);
    });
  });

  describe("execute with caseType only", () => {
    it("should retrieve cases based on type only successfully", async () => {
      const caseType = CaseTypes.Pending;
      const cases = [{ caseId: "C00001", caseType }];

      caseService.getCasesByType.mockResolvedValueOnce(cases);

      const result = await getCasesQuery.execute(caseType);

      expect(result).toEqual(cases);
      expect(caseService.getCasesByType).toHaveBeenCalledWith(caseType);
      expect(caseService.getCasesByType).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array if no cases match the type", async () => {
      const caseType = CaseTypes.Pending;
      const cases: any[] = [];

      caseService.getCasesByType.mockResolvedValueOnce(cases);

      const result = await getCasesQuery.execute(caseType);

      expect(result).toEqual(cases);
      expect(caseService.getCasesByType).toHaveBeenCalledWith(caseType);
      expect(caseService.getCasesByType).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when the service method fails", async () => {
      const caseType = CaseTypes.Pending;
      const errorMessage = "Failed to retrieve cases";

      caseService.getCasesByType.mockRejectedValueOnce(new Error(errorMessage));

      await expect(getCasesQuery.execute(caseType)).rejects.toThrow(
        errorMessage
      );

      expect(caseService.getCasesByType).toHaveBeenCalledWith(caseType);
      expect(caseService.getCasesByType).toHaveBeenCalledTimes(1);
    });
  });
});
