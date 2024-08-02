import { IConversationRepository } from "../../infrastructure/dbRepositories/IConversationRepository";
import { Conversation } from "../../domain/entities/Conversation";

export class GetUserConversations{
  private conversationRepository: IConversationRepository;
  
  constructor(conversationRepository: IConversationRepository) {
    this.conversationRepository = conversationRepository;
  }

  async execute(agentId: string): Promise<Conversation[]> {
    if (!agentId) {
      throw new Error("AgentId is required");
    }
    return await this.conversationRepository.findByAgentId(agentId);
  }
}

 