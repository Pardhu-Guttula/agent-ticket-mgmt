import { IConversationRepository } from "../../infrastructure/dbRepositories/IConversationRepository";
import { Conversation } from "../entities/Conversation";
export class ConversationService implements IConversationRepository {
  private conversationRepository: IConversationRepository;

  constructor(conversationRepository: IConversationRepository) {
    this.conversationRepository = conversationRepository;
  }

  async findByAgentId(agentId: string): Promise<Conversation[]> {
    try {
      return await this.conversationRepository.findByAgentId(agentId);
    } catch (error) {
      throw error;
    }
  }
}
 
