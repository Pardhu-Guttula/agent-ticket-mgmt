import { Conversation } from "../../domain/entities/Conversation";
  
export interface IConversationRepository {
  findByAgentId(agentId: string): Promise<Conversation[]>;
}
 