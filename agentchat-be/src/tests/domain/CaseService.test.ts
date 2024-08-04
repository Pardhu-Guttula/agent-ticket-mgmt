// import { CaseService } from './CaseService'; // Adjust the import path as needed
// import { ICaseDbRepository } from '../../infrastructure/dbRepositories/ICaseDbRepository';
// import { CaseTypes } from '../common/ApplicationEnums';
import { CaseService } from "../../domain/services/CaseService";
import { ICaseDbRepository } from "../../infrastructure/dbRepositories/ICaseDbRepository";
import { CaseTypes } from "../../domain/common/ApplicationEnums";

describe("CaseService", () => {
  let caseService: CaseService;
  let caseRepositoryMock: jest.Mocked<ICaseDbRepository>;

  beforeEach(() => {
    caseRepositoryMock = {
      createCase: jest.fn(),
      getCasesByType: jest.fn(),
      getCasesByTypeAndAgent: jest.fn(),
    } as jest.Mocked<ICaseDbRepository>;

    caseService = new CaseService(caseRepositoryMock);
  });

  describe("getCasesByType", () => {
    it("should return cases by type from repository", async () => {
      // Arrange
      const caseType = CaseTypes.Escalated; // Replace with appropriate value if needed
      const cases = [
        { id: "1", type: caseType },
        { id: "2", type: caseType },
      ];
      caseRepositoryMock.getCasesByType.mockResolvedValue(cases);

      // Act
      const result = await caseService.getCasesByType(caseType);

      // Assert
      expect(result).toEqual(cases);
      expect(caseRepositoryMock.getCasesByType).toHaveBeenCalledWith(caseType);
      expect(caseRepositoryMock.getCasesByType).toHaveBeenCalledTimes(1);
    });

    it("should throw error if repository throws", async () => {
      // Arrange
      const caseType = CaseTypes.Escalated;
      const error = new Error("Database error");
      caseRepositoryMock.getCasesByType.mockRejectedValue(error);

      // Act & Assert
      await expect(caseService.getCasesByType(caseType)).rejects.toThrow(error);
    });

    it("should handle unexpected exceptions gracefully", async () => {
      // Arrange
      const caseType = CaseTypes.Escalated;
      const error = { unexpected: "Non-standard error" }; // Simulating a non-Error object
      caseRepositoryMock.getCasesByType.mockRejectedValue(error);

      // Act & Assert
      await expect(caseService.getCasesByType(caseType)).rejects.toThrow(
        "An unexpected error occurred while fetching cases by type."
      );
    });
  });

  describe("getCasesByTypeAndAgent", () => {
    it("should return cases by type and agent from repository", async () => {
      // Arrange
      const caseType = CaseTypes.Escalated;
      const agentId = "A00007";
      const cases = [
        { id: "1", type: caseType, agentId },
        { id: "2", type: caseType, agentId },
      ];
      caseRepositoryMock.getCasesByTypeAndAgent.mockResolvedValue(cases);

      // Act
      const result = await caseService.getCasesByTypeAndAgent(
        caseType,
        agentId
      );

      // Assert
      expect(result).toEqual(cases);
      expect(caseRepositoryMock.getCasesByTypeAndAgent).toHaveBeenCalledWith(
        caseType,
        agentId
      );
      expect(caseRepositoryMock.getCasesByTypeAndAgent).toHaveBeenCalledTimes(
        1
      );
    });

    it("should throw error if repository throws", async () => {
      // Arrange
      const caseType = CaseTypes.Escalated;
      const agentId = "A00007";
      const error = new Error("Database error");
      caseRepositoryMock.getCasesByTypeAndAgent.mockRejectedValue(error);

      // Act & Assert
      await expect(
        caseService.getCasesByTypeAndAgent(caseType, agentId)
      ).rejects.toThrow(error);
    });

    it("should handle unexpected exceptions gracefully", async () => {
      // Arrange
      const caseType = CaseTypes.Escalated;
      const agentId = "A00007";
      const error = { unexpected: "Non-standard error" }; // Simulating a non-Error object
      caseRepositoryMock.getCasesByTypeAndAgent.mockRejectedValue(error);

      // Act & Assert
      await expect(
        caseService.getCasesByTypeAndAgent(caseType, agentId)
      ).rejects.toThrow(
        "An unexpected error occurred while fetching cases by type and agent."
      );
    });
  });
});
