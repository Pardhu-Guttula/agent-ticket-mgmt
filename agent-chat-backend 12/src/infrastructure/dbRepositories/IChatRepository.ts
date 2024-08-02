import { ChatMessage } from "../../domain/entities/ChatMessage";

export interface IChatRepository {
  findByCaseId(caseId: string): Promise<ChatMessage[]>;
  createMessage(uniqueCaseId: string, senderType: string, message: string): Promise<void>;
}
