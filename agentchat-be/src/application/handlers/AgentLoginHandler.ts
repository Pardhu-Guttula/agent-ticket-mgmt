import { AgentLoginCommand } from "../commands/AgentLogin";
import { AgentService } from "../../domain/services/AgentService";
import { comparePassword } from "../../utils/PasswordUtils";
import { generateToken } from "../../utils/JwtUtils";
import { ErrorCode } from "../../domain/common/ApplicationConstants";

export class AgentLoginHandler {
  private agentService: AgentService;

  constructor(agentService: AgentService) {
    this.agentService = agentService;
  }

  async handle(command: AgentLoginCommand): Promise<{ token: string; uniqueAgentId?: string }> {
    const { email, password } = command;

    const result = await this.agentService.getAgentByEmail(email);
    if (!result || result.agent === null) {
      throw new Error(ErrorCode.UserNotFound);
    }

    const agent = result.agent;
    const uniqueAgentId = result.uniqueAgentId;

    const isPasswordValid = await comparePassword(password, agent.password);
    if (!isPasswordValid) {
      throw new Error(ErrorCode.InvalidCredentials);
    }

    const id = String(agent.id);

    const token = generateToken({ id, email: agent.email });

    return { token, uniqueAgentId };
  }
}
 