import MysqlDbConnection from "../database/MysqlDbConnection";
import { CaseTypes } from "../../domain/common/ApplicationEnums";
import { ICaseDbRepository } from "../dbRepositories/ICaseDbRepository";
import { CreateCaseEntity } from "../../domain/entities/CreateCase";

const db = new MysqlDbConnection();

export class CaseDbRepository implements ICaseDbRepository {
  async getCasesByType(caseType: CaseTypes): Promise<any[]> {
    try {
      const query = `
        SELECT fc.uniqueCaseId, fc.caseDescription, du.userName, fc.caseCreatedAt, fc.completionNote
        FROM factCase fc
        JOIN dimUser du ON fc.uniqueUserId = du.uniqueUserId
        WHERE fc.caseStatus = ?`;
      const rows = await db.query(query, [caseType]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async getCasesByTypeAndAgent(caseType: CaseTypes, agentId: string): Promise<any[]> {
    try {
      const query = `
        SELECT fc.uniqueCaseId, fc.caseDescription, du.userName, fc.caseCreatedAt, fc.completionNote, fc.caseAcceptedAt
        FROM factCase fc
        JOIN dimUser du ON fc.uniqueUserId = du.uniqueUserId
        WHERE fc.caseStatus = ? AND fc.uniqueAgentId = ?
        ORDER BY fc.caseAcceptedAt ASC`;
      const rows = await db.query(query, [caseType, agentId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async updateCaseStatusById(uniqueCaseId: string, newStatus: string, agentId: string): Promise<void> {
    try {
      const query = `
        UPDATE factCase
        SET caseStatus = ?, caseAcceptedAt = NOW(), uniqueAgentId = ?
        WHERE uniqueCaseId = ?
      `;
      await db.query(query, [newStatus, agentId, uniqueCaseId]);
    } catch (error) {
      console.error("Error updating case status in repository:", error);
      throw error;
    }
  }

  async getTicketByCaseId(uniqueCaseId: string): Promise<any> {
    try {
      const query = `SELECT * FROM dimTicket WHERE uniqueCaseId = ?`;
      const rows = await db.query(query, [uniqueCaseId]);
      return rows[0];
    } catch (error) {
      console.error("Error fetching ticket by case ID:", error);
      throw error;
    }
  }

  async createTicket(ticketData: {
    uniqueCaseId: string;
    ticketCreatedBy: string;
    ticketUrl: string;
    uniqueTicketId: string;
  }): Promise<void> {
    try {
      const {
        uniqueCaseId,
        ticketCreatedBy,
        ticketUrl,
        uniqueTicketId,
      } = ticketData;
      const query = `
          INSERT INTO dimTicket (uniqueCaseId, ticketCreatedBy, ticketUrl, uniqueTicketId)
          VALUES (?, ?, ?, ?)
        `;
      await db.query(query, [
        uniqueCaseId,
        ticketCreatedBy,
        ticketUrl,
        uniqueTicketId,
      ]);
    } catch (error) {
      console.error("Error in createTicket:", error);
      throw error;
    }
  }

  async createCase(caseData: any): Promise<void> {
  try {
    const { caseDescription, caseStatus, caseCreatedAt, uniqueUserId } = caseData;
    const query = `
      INSERT INTO factCase ( caseDescription, caseStatus, caseCreatedAt, uniqueUserId, uniqueAgentId)
      VALUES ( ?, ?, ?, ?, 'A00001')
    `;
    await db.query(query, [caseDescription, caseStatus, caseCreatedAt, uniqueUserId]);
  } catch (error) {
    console.error("Error in createCase:", error);
    throw error;
  }
}
}
 