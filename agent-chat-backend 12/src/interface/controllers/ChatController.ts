import { Request, Response } from "express";
import { GetChatMessagesByCaseId } from "../../application/queries/GetChatMessages";
import { MySQLChatRepository } from "../../infrastructure/dbService/MySqlChatRepository";
import { errorMessages } from "../../domain/common/ApplicationConstants";
import { ChatService } from "../../domain/services/ChatService";
import { CreateChatMessage } from "../../application/commands/CreateChatMessage";

const chatRepository = new MySQLChatRepository();
const chatService = new ChatService(chatRepository);
const getChatMessagesByCaseIdUseCase = new GetChatMessagesByCaseId(chatService);
const createChatMessageUseCase = new CreateChatMessage(chatService);

export const getChatMessagesByCaseId = async (req: Request, res: Response) => {
  try {
    const { caseId } = req.params;
    const chatMessages = await getChatMessagesByCaseIdUseCase.execute(caseId);
    res.json(chatMessages);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: errorMessages.errorCode400 });
    }
  }
};


export const postChatMessage = async (req: Request, res: Response) => {
  try {
    const { uniqueCaseId, senderType, message } = req.body;
    await createChatMessageUseCase.execute(uniqueCaseId, senderType, message);
    res.status(201).json({ message: "Chat message created successfully" });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: errorMessages.errorCode400 });
    }
  }
};

export const updateClosedCaseStatus = async (req: Request, res: Response) => {
  const { uniqueCaseId } = req.params;
  const { completionNote } = req.body;

  try {
    await chatRepository.updateClosedCaseStatusById(
      uniqueCaseId,
      "Closed",
      completionNote
    );
    res.json({ message: "Case status updated successfully" });
  } catch (error) {
    console.error("Error updating case status:", error);
    res.status(500).json({ error: "Failed to update case status" });
  }
};


export const updateEscalatedCaseStatus = async (req: Request, res: Response) => {
  const { uniqueCaseId } = req.params;

  try {
    await chatRepository.updateEscaltedCaseStatusById(uniqueCaseId, "Escalated");
    res.json({ message: "Case status updated successfully" });
  } catch (error) {
    console.error("Error updating case status:", error);
    res.status(500).json({ error: "Failed to update case status" });
  }
};


