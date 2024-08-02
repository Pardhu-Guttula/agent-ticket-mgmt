import { IChatRepository } from "../../infrastructure/dbRepositories/IChatRepository";

export class CreateChatMessage {
  private chatRepository: IChatRepository;

  constructor(chatRepository: IChatRepository) {
    this.chatRepository = chatRepository;
  }

  async execute(uniqueCaseId: string, senderType: string, message: string): Promise<void> {
    if (!uniqueCaseId || !senderType || !message) {
      throw new Error("All fields are required");
    }
    await this.chatRepository.createMessage(uniqueCaseId, senderType, message);
  }
}
