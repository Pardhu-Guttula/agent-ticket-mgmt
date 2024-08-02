import { AgentId } from "../../domain/entities/AgentId";

export interface IAgentIdRepository {
  findByUserId(uniqueUserId: string): Promise<AgentId[]>;
}
