import { IAgentStatsRepository } from "../../infrastructure/dbRepositories/IAgentStatsRepository";

export class AgentStatsService {
  private agentStatsRepository: IAgentStatsRepository;

  constructor(agentStatsRepository: IAgentStatsRepository) {
    this.agentStatsRepository = agentStatsRepository;
  }

  async getSolvedCases(agentId: string): Promise<number> {
    return await this.agentStatsRepository.getSolvedCases(agentId);
  }

  async getEscalatedCases(agentId: string): Promise<number> {
    return await this.agentStatsRepository.getEscalatedCases(agentId);
  }

  async getAvgResponseTime(agentId: string): Promise<string> {
    return await this.agentStatsRepository.getAvgResponseTime(agentId);
  }

  async getAcceptedCases(agentId: string): Promise<number> {
    return await this.agentStatsRepository.getAcceptedCases(agentId);
  }
}
 