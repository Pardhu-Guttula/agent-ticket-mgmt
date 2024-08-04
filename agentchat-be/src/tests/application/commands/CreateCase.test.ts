import { CreateCaseCommand } from "../../../application/commands/CreateCase";
import { CaseDbRepository } from "../../../infrastructure/dbService/MySqlCaseDbRepository";

jest.mock("../../../infrastructure/dbService/MySqlCaseDbRepository");

describe("CreateCaseCommand", () => {
  let caseRepository: jest.Mocked<CaseDbRepository>;
  let createCaseCommand: CreateCaseCommand;

  beforeEach(() => {
    caseRepository = new CaseDbRepository() as jest.Mocked<CaseDbRepository>;
    createCaseCommand = new CreateCaseCommand(caseRepository);
  });

  describe("execute", () => {
    it("should successfully create a case", async () => {
      const caseData = {
        caseDescription: "Issue with login",
        caseStatus: "Pending",
        caseCreatedAt: new Date().toISOString(),
      };

      caseRepository.createCase.mockResolvedValueOnce(undefined);

      await createCaseCommand.execute(caseData);

      expect(caseRepository.createCase).toHaveBeenCalledWith(caseData);
      expect(caseRepository.createCase).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when createCase fails", async () => {
      const caseData = {
        caseDescription: "Issue with login",
        caseStatus: "Pending",
        caseCreatedAt: new Date().toISOString(),
      };

      const errorMessage = "Failed to create case";
      caseRepository.createCase.mockRejectedValueOnce(new Error(errorMessage));

      await expect(createCaseCommand.execute(caseData)).rejects.toThrow(
        errorMessage
      );

      expect(caseRepository.createCase).toHaveBeenCalledWith(caseData);
      expect(caseRepository.createCase).toHaveBeenCalledTimes(1);
    });

    it("should handle invalid case data", async () => {
      const invalidCaseData = {
        caseDescription: "",
        caseStatus: "",
        caseCreatedAt: new Date().toISOString(),
      };

      const errorMessage = "Invalid case data";
      caseRepository.createCase.mockRejectedValueOnce(new Error(errorMessage));

      await expect(createCaseCommand.execute(invalidCaseData)).rejects.toThrow(
        errorMessage
      );

      expect(caseRepository.createCase).toHaveBeenCalledWith(invalidCaseData);
      expect(caseRepository.createCase).toHaveBeenCalledTimes(1);
    });
  });
});
