import { IAgentIdRepository } from "../../infrastructure/dbRepositories/IAgentIdRepository";
import { AgentId } from "../entities/AgentId";

export class AgentIdService implements IAgentIdRepository {
  private agentIdRepository: IAgentIdRepository;

  constructor(agentIdRepository: IAgentIdRepository) {
    this.agentIdRepository = agentIdRepository;
  }

  async findByUserId(uniqueUserId: string): Promise<AgentId[]> {
    try {
      return await this.agentIdRepository.findByUserId(uniqueUserId);
    } catch (error) {
      throw error;
    }
  }
}
