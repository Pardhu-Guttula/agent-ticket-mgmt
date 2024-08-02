import { IChatRepository } from "../dbRepositories/IChatRepository";
import { ChatMessage } from "../../domain/entities/ChatMessage";
import MysqlDbConnection from "../database/MysqlDbConnection";

const db = new MysqlDbConnection

export class MySQLChatRepository implements IChatRepository {
  async findByCaseId(caseId: string): Promise<ChatMessage[]> {
    const rows: any = await db.query(
      `SELECT message, senderType, chatStarted FROM dimChatMessages WHERE uniqueCaseId = ?`,
      [caseId]
    );
    return rows.map((row: any) => new ChatMessage(row.message, row.senderType, new Date(row.chatStarted)));
  }
  async createMessage(uniqueCaseId: string, senderType: string, message: string): Promise<void> {
    await db.query(
      `INSERT INTO dimChatMessages (uniqueCaseId, senderType, message) VALUES (?, ?, ?)`,
      [uniqueCaseId, senderType, message]
    );
  }

  async updateClosedCaseStatusById(
    uniqueCaseId: string,
    newStatus: string,
    completionNote: string
  ): Promise<void> {
    try {
      const query = `UPDATE factCase SET caseStatus = ?, caseResolvedAt = NOW(), completionNote = ? WHERE uniqueCaseId = ?`;
      await db.query(query, [newStatus, completionNote, uniqueCaseId]);
    } catch (error) {
      console.error("Error updating case status in repository:", error);
      throw error;
    }
  }

  async updateEscaltedCaseStatusById(
    uniqueCaseId: string,
    newStatus: string
  ): Promise<void> {
    try {
      const query = `UPDATE factCase SET caseStatus = ?, caseEscalatedAt = NOW() WHERE uniqueCaseId = ?`;
      await db.query(query, [newStatus, uniqueCaseId]);
    } catch (error) {
      console.error("Error updating case status in repository:", error);
      throw error;
    }
  }
}


