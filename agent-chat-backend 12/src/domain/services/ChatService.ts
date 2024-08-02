import { IChatRepository } from "../../infrastructure/dbRepositories/IChatRepository";
import { ChatMessage } from "../entities/ChatMessage";

export class ChatService implements IChatRepository {
  private chatRepository: IChatRepository;

  constructor(chatRepository: IChatRepository) {
    this.chatRepository = chatRepository;
  }

  async findByCaseId(caseId: string): Promise<ChatMessage[]> {
    try {
      return await this.chatRepository.findByCaseId(caseId);
    } catch (error) {
      throw error;
    }
  }
  async createMessage(
    uniqueCaseId: string,
    senderType: string,
    message: string
  ): Promise<void> {
    try {
      await this.chatRepository.createMessage(
        uniqueCaseId,
        senderType,
        message
      );
    } catch (error) {
      throw error;
    }
  }
}
