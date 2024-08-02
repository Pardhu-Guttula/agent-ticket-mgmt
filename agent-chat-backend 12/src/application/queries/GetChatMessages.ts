import { IChatRepository } from "../../infrastructure/dbRepositories/IChatRepository";
import { ChatMessage } from "../../domain/entities/ChatMessage";

export class GetChatMessagesByCaseId {
  private chatRepository: IChatRepository;
  
  constructor(chatRepository: IChatRepository) {
    this.chatRepository = chatRepository;
  }

  async execute(caseId: string): Promise<ChatMessage[]> {
    if (!caseId) {
      throw new Error("CaseId is required");
    }
    return await this.chatRepository.findByCaseId(caseId);
  }
}
