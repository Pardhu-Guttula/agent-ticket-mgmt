import { IAgentIdRepository } from "../../infrastructure/dbRepositories/IAgentIdRepository";
import { AgentId } from "../../domain/entities/AgentId";

export class GetAgentId {
  private agentIdRepository: IAgentIdRepository;
  
  constructor(agentIdRepository: IAgentIdRepository) {
    this.agentIdRepository = agentIdRepository;
  }

  async execute(uniqueUserId: string): Promise<AgentId[]> {
    if (!uniqueUserId) {
      throw new Error("UniqueUserId is required");
    }
    return await this.agentIdRepository.findByUserId(uniqueUserId);
  }
}
