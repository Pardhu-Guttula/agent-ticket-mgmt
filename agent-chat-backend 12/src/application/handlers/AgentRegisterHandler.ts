import { AgentRegisterCommand } from "../commands/AgentRegister";
import { AgentService } from "../../domain/services/AgentService";
import { Agent } from "../../domain/entities/Agent";

export class AgentRegisterHandler {
  private agentService: AgentService;

  constructor(agentService: AgentService) {
    this.agentService = agentService;
  }

  async handle(command: AgentRegisterCommand): Promise<void> {
    const { name, email, password, mobile, agentCreatedOn } = command;

    
    const agent = new Agent(undefined, name, email, password, mobile, agentCreatedOn);

    
    await this.agentService.registerAgent(agent);
  }
}