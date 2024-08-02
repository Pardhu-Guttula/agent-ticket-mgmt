import { Request, Response } from "express";
import { GetAgentId } from "../../application/queries/GetAgentId";
import { MySQLAgentIdRepository } from "../../infrastructure/dbService/MySqlAgentIdRepository";
import { errorMessages } from "../../domain/common/ApplicationConstants";
import { AgentIdService } from "../../domain/services/AgentIdService";

const agentIdRepository = new MySQLAgentIdRepository();
const agentIdService = new AgentIdService(agentIdRepository);
const getAgentIdUseCase = new GetAgentId(agentIdService);

export const getAgentId = async (req: Request, res: Response) => {
  try {
    const { uniqueUserId } = req.params;
    const agentIds = await getAgentIdUseCase.execute(uniqueUserId);
    
    if (agentIds.length === 0) {
      return res.status(404).json({ error: "Agent not found" });
    }
    
    const agentId = agentIds[0];
    res.json(agentId);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: errorMessages.errorCode400 });
    }
  }
};
