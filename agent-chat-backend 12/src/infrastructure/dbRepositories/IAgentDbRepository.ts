import { Agent } from "../../domain/entities/Agent";
import { AgentProfile } from "../../domain/entities/AgentProfile";

export interface IAgentDbRepository {
  addAgent(agent: Agent): Promise<void>;
  emailExists(email: string): Promise<boolean>;
  mobileExists(mobile: string): Promise<boolean>;
  getAgentByEmail(email: string): Promise<{ agent: Agent | null, uniqueAgentId?: string } | null>;
  getAgentById(agentId: string): Promise<AgentProfile | null>;
}

 