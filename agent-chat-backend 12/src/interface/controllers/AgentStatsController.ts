import { Request, Response } from "express";
import { GetSolvedCases, GetEscalatedCases, GetAvgResponseTime, GetAcceptedCases } from "../../application/queries/AgentStats";
import { MySQLAgentStatsRepository } from "../../infrastructure/dbService/MySqlAgentStatsRepository";
const agentStatsRepository = new MySQLAgentStatsRepository();

const getSolvedCasesUseCase = new GetSolvedCases(agentStatsRepository);
const getEscalatedCasesUseCase = new GetEscalatedCases(agentStatsRepository);
const getAvgResponseTimeUseCase = new GetAvgResponseTime(agentStatsRepository);
const getAcceptedCasesUseCase = new GetAcceptedCases(agentStatsRepository);

export const getSolvedCases = async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const solvedCases = await getSolvedCasesUseCase.execute(agentId);
    res.json({ solvedCases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve solved cases count" });
  }
};

export const getEscalatedCases = async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const escalatedCases = await getEscalatedCasesUseCase.execute(agentId);
    res.json({ escalatedCases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve escalated cases count" });
  }
};

export const getAvgResponseTime = async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const avgResponseTime = await getAvgResponseTimeUseCase.execute(agentId);
    res.json({ avgResponseTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve average response time" });
  }
};

export const getAcceptedCases = async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const acceptedCases = await getAcceptedCasesUseCase.execute(agentId);
    res.json({ acceptedCases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve accepted cases count" });
  }
};
 