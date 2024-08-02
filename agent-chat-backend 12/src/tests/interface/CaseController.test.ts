import { Request, Response } from "express";
import {
  getCases,
  updateCaseStatus,
  createTicket,
  getTicketId,
  createCase,
} from "../../interface/controllers/CaseController";
import { CaseDbRepository } from "../../infrastructure/dbService/MySqlCaseDbRepository";
import { CaseService } from "../../domain/services/CaseService";
import { CaseTypes } from "../../domain/common/ApplicationEnums";
import { CreateCaseCommand } from "../../application/commands/CreateCase";
import { GetCasesQuery } from "../../application/queries/GetCases";

jest.mock("../../infrastructure/dbService/MySqlCaseDbRepository");
jest.mock("../../domain/services/CaseService");
jest.mock("../../application/commands/CreateCase");
jest.mock("../../application/queries/GetCases");

const caseRepository = new CaseDbRepository() as jest.Mocked<CaseDbRepository>;
const caseService = new CaseService(caseRepository) as jest.Mocked<CaseService>;
const createCaseUseCase = new CreateCaseCommand(caseRepository) as jest.Mocked<
  CreateCaseCommand
>;
const getCasesQuery = new GetCasesQuery(caseService) as jest.Mocked<
  GetCasesQuery
>;

describe("CaseController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {};
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe("getCases", () => {
    it("should return a list of cases", async () => {
      req.query = { caseType: "Pending", agentId: "A0001" };
      const cases = [{ id: 1, name: "Case Name", status: "open" }];
      getCasesQuery.execute.mockResolvedValue(cases);

      await getCases(req as Request, res as Response);

      expect(getCasesQuery.execute).toHaveBeenCalledWith(
        CaseTypes.Pending,
        "123"
      );
      expect(jsonMock).toHaveBeenCalledWith(cases);
    });

    it("should handle invalid caseType", async () => {
      req.query = { caseType: "Invalid", agentId: "123" };

      await getCases(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Invalid caseType" });
    });

    it("should handle errors", async () => {
      req.query = { caseType: "Pending", agentId: "123" };
      getCasesQuery.execute.mockRejectedValue(new Error("Database error"));

      await getCases(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Failed to fetch cases" });
    });
  });

  describe("updateCaseStatus", () => {
    it("should update the case status", async () => {
      req.params = { uniqueCaseId: "1" };
      req.body = { agentId: "123", caseType: "Accepted" };

      await updateCaseStatus(req as Request, res as Response);

      expect(caseRepository.updateCaseStatusById).toHaveBeenCalledWith(
        "1",
        "Accepted",
        "123"
      );
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Case status updated successfully",
      });
    });

    it("should handle missing parameters", async () => {
      req.params = { uniqueCaseId: "1" };
      req.body = {};

      await updateCaseStatus(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "agentId and caseType are required",
      });
    });

    it("should handle errors", async () => {
      req.params = { uniqueCaseId: "1" };
      req.body = { agentId: "123", caseType: "Accepted" };
      caseRepository.updateCaseStatusById.mockRejectedValue(
        new Error("Database error")
      );

      await updateCaseStatus(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Failed to update case status",
      });
    });
  });

  // Add more tests for createTicket, getTicketId, and createCase following the same pattern
});
