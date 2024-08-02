import { Request, Response } from "express";
import { GetUserConversations } from "../../application/queries/GetUserConversations";
import { MySQLConversationRepository } from "../../infrastructure/dbService/MySqlConversationRepository";
import { errorMessages } from "../../domain/common/ApplicationConstants";
import { ConversationService } from "../../domain/services/ConversationService";

const conversationRepository = new MySQLConversationRepository();
const conversationService = new ConversationService(conversationRepository)
const getUserConversationsUseCase = new GetUserConversations(conversationService);

export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const conversations = await getUserConversationsUseCase.execute(agentId);
    res.json(conversations);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: errorMessages.errorCode400 });
    }
  }
};
 