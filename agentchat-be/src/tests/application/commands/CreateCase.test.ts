import { CaseTypes } from "../../../domain/common/ApplicationEnums";
import { CaseService } from "../../../domain/services/CaseService";
import { ICaseDbRepository } from "../../../infrastructure/dbRepositories/ICaseDbRepository";
import { GetCasesQuery } from "../../../application/queries/GetCases";

// Mocking ICaseDbRepository
const mockICaseDbRepository = (): jest.Mocked<ICaseDbRepository> => ({
  createCase: jest.fn(),
  getCasesByType: jest.fn(),
  getCasesByTypeAndAgent: jest.fn(),
});

describe("GetCasesQuery", () => {
  let caseServiceMock: jest.Mocked<CaseService>;
  let getCasesQuery: GetCasesQuery;
  let caseRepositoryMock: jest.Mocked<ICaseDbRepository>;

  beforeEach(() => {
    caseRepositoryMock = mockICaseDbRepository();
    caseServiceMock = new CaseService(caseRepositoryMock) as jest.Mocked<
      CaseService
    >;
    getCasesQuery = new GetCasesQuery(caseServiceMock);
  });

  describe("execute", () => {
    it("should return cases by type when no agentId is provided", async () => {
      // Arrange
      const caseType = CaseTypes.Escalated;
      const cases = [
        { id: "1", type: caseType },
        { id: "2", type: caseType },
      ];
      caseRepositoryMock.getCasesByType.mockResolvedValue(cases);

      // Act
      const result = await getCasesQuery.execute(caseType);

      // Assert
      expect(result).toEqual(cases);
      expect(caseRepositoryMock.getCasesByType).toHaveBeenCalledWith(caseType);
      expect(caseRepositoryMock.getCasesByType).toHaveBeenCalledTimes(1);
      expect(caseRepositoryMock.getCasesByTypeAndAgent).not.toHaveBeenCalled();
    });

    it("should return cases by type and agentId when agentId is provided", async () => {
      // Arrange
      const caseType = CaseTypes.Escalated;
      const agentId = "A00007";
      const cases = [
        { id: "1", type: caseType, agentId },
        { id: "2", type: caseType, agentId },
      ];
      caseRepositoryMock.getCasesByTypeAndAgent.mockResolvedValue(cases);

      // Act
      const result = await getCasesQuery.execute(caseType, agentId);

      // Assert
      expect(result).toEqual(cases);
      expect(caseRepositoryMock.getCasesByTypeAndAgent).toHaveBeenCalledWith(
        caseType,
        agentId
      );
      expect(caseRepositoryMock.getCasesByTypeAndAgent).toHaveBeenCalledTimes(
        1
      );
      expect(caseRepositoryMock.getCasesByType).not.toHaveBeenCalled();
    });

    it("should return an empty array if no cases are found for the given type", async () => {
      // Arrange
      const caseType = CaseTypes.Closed; // Assuming this type might have no cases
      caseRepositoryMock.getCasesByType.mockResolvedValue([]);

      // Act
      const result = await getCasesQuery.execute(caseType);

      // Assert
      expect(result).toEqual([]);
      expect(caseRepositoryMock.getCasesByType).toHaveBeenCalledWith(caseType);
      expect(caseRepositoryMock.getCasesByType).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if CaseService.getCasesByType throws an error", async () => {
      // Arrange
      const caseType = CaseTypes.Escalated;
      const error = new Error("Service Error");
      caseRepositoryMock.getCasesByType.mockRejectedValue(error);

      // Act & Assert
      await expect(getCasesQuery.execute(caseType)).rejects.toThrow(
        "An unexpected error occurred while fetching cases by type."
      );
    });

    it("should throw an error if CaseService.getCasesByTypeAndAgent throws an error", async () => {
      // Arrange
      const caseType = CaseTypes.Escalated;
      const agentId = "A00007";
      const error = new Error("Service Error");
      caseRepositoryMock.getCasesByTypeAndAgent.mockRejectedValue(error);

      // Act & Assert
      await expect(getCasesQuery.execute(caseType, agentId)).rejects.toThrow(
        "An unexpected error occurred while fetching cases by type and agent."
      );
    });

    it("should handle unexpected exceptions gracefully when no agentId is provided", async () => {
      // Arrange
      const caseType = CaseTypes.Escalated;
      const error = { unexpected: "Non-standard error" }; // Simulating a non-Error object
      caseRepositoryMock.getCasesByType.mockRejectedValue(error);

      // Act & Assert
      await expect(getCasesQuery.execute(caseType)).rejects.toThrow(
        "An unexpected error occurred while fetching cases by type."
      );
    });

    it("should handle unexpected exceptions gracefully when agentId is provided", async () => {
      // Arrange
      const caseType = CaseTypes.Escalated;
      const agentId = "A00007";
      const error = { unexpected: "Non-standard error" }; // Simulating a non-Error object
      caseRepositoryMock.getCasesByTypeAndAgent.mockRejectedValue(error);

      // Act & Assert
      await expect(getCasesQuery.execute(caseType, agentId)).rejects.toThrow(
        "An unexpected error occurred while fetching cases by type and agent."
      );
    });

    it("should create an instance of GetCasesQuery", () => {
      expect(getCasesQuery).toBeDefined();
    });
  });
});
