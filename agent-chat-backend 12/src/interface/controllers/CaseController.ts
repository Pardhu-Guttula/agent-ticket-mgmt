import { Request, Response } from "express";
import { CaseDbRepository } from "../../infrastructure/dbService/MySqlCaseDbRepository";
import { CaseService } from "../../domain/services/CaseService";
import { CaseTypes } from "../../domain/common/ApplicationEnums";
import { GetCasesQuery } from "../../application/queries/GetCases";
import {
  handle400Error,
  handle500Error,
} from "../../domain/common/ApplicationConstants";
import { CreateCaseEntity } from "../../domain/entities/CreateCase";
import { v4 as uuidv4 } from "uuid";
import { CreateCaseCommand } from "../../application/commands/CreateCase";

const caseRepository = new CaseDbRepository();
const caseService = new CaseService(caseRepository);
const getCasesQuery = new GetCasesQuery(caseService);
const createCaseUseCase = new CreateCaseCommand(caseRepository);

export const getCases = async (req: Request, res: Response) => {
  try {
    const caseTypeParam = req.query.caseType as keyof typeof CaseTypes;
    const agentId = req.query.agentId as string;

    if (!(caseTypeParam in CaseTypes)) {
      console.error("Invalid caseType:", caseTypeParam);
      return handle400Error(res, "Invalid caseType");
    }

    const caseType = CaseTypes[caseTypeParam];
    const cases = await getCasesQuery.execute(caseType, agentId);
    res.json(cases);
  } catch (error) {
    handle500Error(res, error);
  }
};

export const updateCaseStatus = async (req: Request, res: Response) => {
  const { uniqueCaseId } = req.params;
  const { agentId, caseType } = req.body;

  if (!agentId || !caseType) {
    return res.status(400).json({ error: "agentId and caseType are required" });
  }

  try {
    await caseRepository.updateCaseStatusById(uniqueCaseId, caseType, agentId);
    res.json({ message: "Case status updated successfully" });
  } catch (error) {
    console.error("Error updating case status:", error);
    res.status(500).json({ error: "Failed to update case status" });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  const { uniqueCaseId, agentId } = req.body;

  if (!uniqueCaseId || !agentId) {
    return res
      .status(400)
      .json({ error: "uniqueCaseId and agentId are required" });
  }

  try {
    const uniqueTicketId = uuidv4().slice(0, 10);
    const ticketUrl = `https://domainspypro.com/tickets/${uniqueTicketId}`;

    await caseRepository.createTicket({
      uniqueCaseId,
      ticketCreatedBy: agentId,
      ticketUrl,
      uniqueTicketId,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    handle500Error(res, error);
  }
};

export const getTicketId = async (req: Request, res: Response) => {
  const { uniqueCaseId } = req.params;

  try {
    const ticket = await caseRepository.getTicketByCaseId(uniqueCaseId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.json({
      ticketUrl: ticket.ticketUrl,
      uniqueTicketId: ticket.uniqueTicketId,
    });
  } catch (error) {
    console.error("Error fetching ticket URL:", error);
    res.status(500).json({ error: "Failed to fetch ticket URL" });
  }
};

export const createCase = async (req: Request, res: Response) => {
  const { uniqueUserId } = req.params;
  const caseData = req.body;

  try {
    caseData.uniqueUserId = uniqueUserId;
    await createCaseUseCase.execute(caseData);
    res.status(201).json({ message: "Case created successfully" });
  } catch (error) {
    console.error("Error creating new case:", error);
    res.status(500).json({ error: "Failed to create case" });
  }
};
