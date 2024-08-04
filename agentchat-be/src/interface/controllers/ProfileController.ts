import { Request, Response } from "express";
import { ProfileHandler } from "../../application/handlers/ProfileHandler";
import { ProfileQuery } from "../../application/queries/ProfileQuery";
import { ApplicationError } from "../../domain/common/ApplicationConstants";
import { AgentService } from "../../domain/services/AgentService";
import { AgentDbService } from "../../infrastructure/dbService/MySqlAgentDbRepository";

export const getProfile = async (req: Request, res: Response) => {
  const agentId = req.params.agentId as string;

  if (!agentId) {
    console.log("Invalid agent ID provided.");
    return res
      .status(400)
      .json({ error: ApplicationError.ERROR_INVALID_AGENT_ID });
  }

  try {
    const agentDbService = new AgentDbService();
    const agentService = new AgentService(agentDbService);
    const handler = new ProfileHandler(agentService);

    const query = new ProfileQuery(agentId);

    const profile = await handler.handle(query);

    res.json(profile);
  } catch (error) {
    if (
      error instanceof ApplicationError &&
      error.message === ApplicationError.ERROR_AGENT_NOT_FOUND
    ) {
      return res
        .status(404)
        .json({ error: ApplicationError.ERROR_AGENT_NOT_FOUND });
    }

    if (!res.headersSent) {
      res.status(500).json({ error: ApplicationError.ERROR_INTERNAL_SERVER });
    }
  }
};
