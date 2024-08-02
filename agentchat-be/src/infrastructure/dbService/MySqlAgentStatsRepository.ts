import { IAgentStatsRepository } from "../dbRepositories/IAgentStatsRepository";
import MysqlDbConnection from "../database/MysqlDbConnection";

const db = new MysqlDbConnection()

export class MySQLAgentStatsRepository implements IAgentStatsRepository {
  async getSolvedCases(agentId: string): Promise<number> {
    const rows: any = await db.query(
      `SELECT COUNT(*) AS solvedCases FROM factCase WHERE caseStatus = 'Closed' AND uniqueAgentId = ?`,
      [agentId]
    );
    return rows[0].solvedCases;
  }

  async getEscalatedCases(agentId: string): Promise<number> {
    const rows: any = await db.query(
      `SELECT COUNT(*) AS escalatedCases FROM factCase WHERE caseStatus = 'Escalated' AND uniqueAgentId = ?`,
      [agentId]
    );
    return rows[0].escalatedCases;
  }

  async getAvgResponseTime(agentId: string): Promise<string> {
    const rows: any = await db.query(
      `SELECT AVG(TIMESTAMPDIFF(SECOND, caseCreatedAt, caseAcceptedAt)) AS avgResponseTime FROM factCase WHERE caseAcceptedAt IS NOT NULL AND uniqueAgentId = ?`,
      [agentId]
    );

    const avgResponseTimeInSeconds = rows[0].avgResponseTime;

    if (avgResponseTimeInSeconds === null) {
      return "No data available";
    }

    const days = Math.floor(avgResponseTimeInSeconds / (24 * 3600));
    const hours = Math.floor((avgResponseTimeInSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((avgResponseTimeInSeconds % 3600) / 60);
    const seconds = Math.floor(avgResponseTimeInSeconds % 60);

    let responseTime = "";

    if (days > 0) {
      responseTime = `${days} d ${hours} h`;
    } else if (hours > 0) {
      responseTime = `${hours} h ${minutes} m`;
    } else if (minutes > 0) {
      responseTime = `${minutes} m ${seconds} s`;
    } else {
      responseTime = `${seconds} s`;
    }

    return responseTime.trim();
  }

  async getAcceptedCases(agentId: string): Promise<number> {
    const rows: any = await db.query(
      `SELECT COUNT(*) AS acceptedCases FROM factCase WHERE uniqueAgentId = ?`,
      [agentId]
    );
    return rows[0].acceptedCases;
  }
}
 