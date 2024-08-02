import { IConversationRepository } from "../dbRepositories/IConversationRepository";
import { Conversation } from "../../domain/entities/Conversation";
import MysqlDbConnection from "../database/MysqlDbConnection";

const db = new MysqlDbConnection();

export class MySQLConversationRepository implements IConversationRepository {
  async findByAgentId(agentId: string): Promise<Conversation[]> {
    try {
      const rows = await db.query(
        `SELECT u.uniqueUserId, u.userName, u.profileUrl, fc.uniqueCaseId 
         FROM factCase fc 
         JOIN dimUser u ON fc.uniqueUserId = u.uniqueUserId 
         WHERE fc.uniqueAgentId = ? AND fc.caseStatus = 'Accepted'`,
        [agentId]
      );

      if (Array.isArray(rows)) {
        return rows.map(row => new Conversation(row.uniqueUserId, row.userName, row.profileUrl, row.uniqueCaseId));
      }

      if (rows && typeof rows === 'object' && !Array.isArray(rows)) {
        return [new Conversation(rows.uniqueUserId, rows.userName, rows.profileUrl, rows.uniqueCaseId)];
      }

      throw new Error('Unexpected result format');
    } catch (error) {
      throw error;
    }
  }
}
 