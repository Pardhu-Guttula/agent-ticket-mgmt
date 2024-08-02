import { IAgentStatsRepository } from "../../infrastructure/dbRepositories/IAgentStatsRepository";

export class GetSolvedCases {
  private agentStatsRepository: IAgentStatsRepository;

  constructor(agentStatsRepository: IAgentStatsRepository) {
    this.agentStatsRepository = agentStatsRepository;
  }

  async execute(agentId: string): Promise<number> {
    return await this.agentStatsRepository.getSolvedCases(agentId);
  }
}

export class GetEscalatedCases {
  private agentStatsRepository: IAgentStatsRepository;

  constructor(agentStatsRepository: IAgentStatsRepository) {
    this.agentStatsRepository = agentStatsRepository;
  }

  async execute(agentId: string): Promise<number> {
    return await this.agentStatsRepository.getEscalatedCases(agentId);
  }
}

export class GetAvgResponseTime {
  private agentStatsRepository: IAgentStatsRepository;

  constructor(agentStatsRepository: IAgentStatsRepository) {
    this.agentStatsRepository = agentStatsRepository;
  }

  async execute(agentId: string): Promise<string> {
    return await this.agentStatsRepository.getAvgResponseTime(agentId);
  }
}

export class GetAcceptedCases {
  private agentStatsRepository: IAgentStatsRepository;

  constructor(agentStatsRepository: IAgentStatsRepository) {
    this.agentStatsRepository = agentStatsRepository;
  }

  async execute(agentId: string): Promise<number> {
    return await this.agentStatsRepository.getAcceptedCases(agentId);
  }
}
 