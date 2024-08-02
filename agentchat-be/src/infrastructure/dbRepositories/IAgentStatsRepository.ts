export interface IAgentStatsRepository {
    getSolvedCases(agentId: string): Promise<number>;
    getEscalatedCases(agentId: string): Promise<number>;
    getAvgResponseTime(agentId: string): Promise<string>;
    getAcceptedCases(agentId: string): Promise<number>;
  }
 