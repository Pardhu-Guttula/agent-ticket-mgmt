
import { Agent } from "../entities/Agent";
import { IAgentDbRepository } from "../../infrastructure/dbRepositories/IAgentDbRepository";
import { AgentProfile } from "../entities/AgentProfile";

export class AgentService {
  private agentDbRepository: IAgentDbRepository;

  constructor(agentDbRepository: IAgentDbRepository) {
    this.agentDbRepository = agentDbRepository;
  }

  async registerAgent(agent: Agent): Promise<void> {
    try {
      await this.agentDbRepository.addAgent(agent);
    } catch (error) {
      console.error("Error in AgentService registerAgent:", error);
      throw error;
    }
  }

  async checkMobileExists(mobile: string): Promise<boolean> { // Added this method
    try {
      return await this.agentDbRepository.mobileExists(mobile);
    } catch (error) {
      console.error("Error in AgentService checkMobileExists:", error);
      throw error;
    }
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      return await this.agentDbRepository.emailExists(email);
    } catch (error) {
      console.error("Error in AgentService checkEmailExists:", error);
      throw error;
    }
  }

  async getAgentByEmail(email: string): Promise<{ agent: Agent | null; uniqueAgentId?: string } | null> {
    try {
      return await this.agentDbRepository.getAgentByEmail(email);
    } catch (error) {
      console.error("Error in AgentService getAgentByEmail:", error);
      throw error;
    }
  }
  async getAgentProfile(agentId: string): Promise<AgentProfile | null> {
    try {
      return await this.agentDbRepository.getAgentById(agentId);
    } catch (error) {
      console.error("Error in AgentService:", error);
      throw new Error("Unable to fetch agent profile");
    }
  }
}
 