import { IAgentIdRepository } from "../dbRepositories/IAgentIdRepository";
import { AgentId } from "../../domain/entities/AgentId";
import MysqlDbConnection from "../database/MysqlDbConnection";

const db = new MysqlDbConnection();

export class MySQLAgentIdRepository implements IAgentIdRepository {
  async findByUserId(uniqueUserId: string): Promise<AgentId[]> {
    try {
      const rows = await db.query(
        `SELECT uniqueAgentId, uniqueCaseId 
         FROM factCase 
         WHERE uniqueUserId = ? AND caseStatus = 'Accepted'`,
        [uniqueUserId]
      );

      if (Array.isArray(rows)) {
        return rows.map(row => new AgentId(row.uniqueAgentId, row.uniqueCaseId));
      }

      if (rows && typeof rows === 'object' && !Array.isArray(rows)) {
        return [new AgentId(rows.uniqueAgentId, rows.uniqueCaseId)];
      }

      throw new Error('Unexpected result format');
    } catch (error) {
      throw error;
    }
  }
}