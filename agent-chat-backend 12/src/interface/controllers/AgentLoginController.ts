import { Request, Response } from "express";
import { AgentLoginCommand } from "../../application/commands/AgentLogin";
import { AgentService } from "../../domain/services/AgentService";
import { ErrorCode, handle400Error, handle500Error } from "../../domain/common/ApplicationConstants";
import { AgentDbService } from "../../infrastructure/dbService/MySqlAgentDbRepository";
import { AgentLoginHandler } from "../../application/handlers/AgentLoginHandler";

const agentDbService = new AgentDbService();
const agentService = new AgentService(agentDbService);
const agentLoginHandler = new AgentLoginHandler(agentService);

export const loginAgent = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const command = new AgentLoginCommand(email, password);


    const { token, uniqueAgentId } = await agentLoginHandler.handle(command);

    res.status(200).json({ token, uniqueAgentId });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === ErrorCode.UserNotFound) {
      return handle400Error(res, "User not found");
    }
    if (error instanceof Error && error.message === ErrorCode.InvalidCredentials) {
      return handle400Error(res, "Invalid credentials");
    }
    handle500Error(res, error);
  }
};
 