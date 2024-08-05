import MysqlDbConnection from "../database/MysqlDbConnection";
import { CaseTypes } from "../../domain/common/ApplicationEnums";
import { ICaseDbRepository } from "../dbRepositories/ICaseDbRepository";

const db = new MysqlDbConnection();

export class CaseDbRepository implements ICaseDbRepository {
  static getTicketByCaseId(uniqueCaseId: string) {
    throw new Error("Method not implemented.");
  }

  private db: MysqlDbConnection; // Define a private instance variable                  //------>1

  constructor(dbConnection?: MysqlDbConnection) {
    // Accept the dbConnection as a parameter, defaulting to a new connection if none is provided
    this.db = dbConnection || new MysqlDbConnection(); //------->1
  }
  async getCasesByType(caseType: CaseTypes): Promise<any[]> {
    try {
      const query = `
        SELECT fc.uniqueCaseId, fc.caseDescription, du.userName, fc.caseCreatedAt, fc.completionNote
        FROM factCase fc
        JOIN dimUser du ON fc.uniqueUserId = du.uniqueUserId
        WHERE fc.caseStatus = ?`;
      const rows = await this.db.query(query, [caseType]);
      return rows;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database query failed: ${error.message}`);
      } else {
        throw new Error("Unexpected error occurred");
      }
    }
  }

  async getCasesByTypeAndAgent(
    caseType: CaseTypes,
    agentId: string
  ): Promise<any[]> {
    try {
      const query = `
        SELECT fc.uniqueCaseId, fc.caseDescription, du.userName, fc.caseCreatedAt, fc.completionNote, fc.caseAcceptedAt
        FROM factCase fc
        JOIN dimUser du ON fc.uniqueUserId = du.uniqueUserId
        WHERE fc.caseStatus = ? AND fc.uniqueAgentId = ?
        ORDER BY fc.caseAcceptedAt ASC`;
      const rows = await this.db.query(query, [caseType, agentId]); //--------->2
      return rows;
    } catch (error) {
      //--> for exception test case
      const err = error as Error;
      console.error("Error in getCasesByTypeAndAgent:", err.message);
      if (err.message === "Database query failed") {
        throw new Error("Database query failed");
      }
      throw new Error("Unexpected error occurred");
    } //--> for exception test case
  }

  async updateCaseStatusById(
    uniqueCaseId: string,
    newStatus: string,
    agentId: string
  ): Promise<void> {
    try {
      const query = `
        UPDATE factCase
        SET caseStatus = ?, caseAcceptedAt = NOW(), uniqueAgentId = ?
        WHERE uniqueCaseId = ?
      `;

      await this.db.query(query, [newStatus, agentId, uniqueCaseId]); //------->3
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database query failed: ${error.message}`);
      } else {
        throw new Error("Unexpected error occurred");
      }
    }
  }

  async getTicketByCaseId(uniqueCaseId: string): Promise<any> {
    try {
      const query = `SELECT * FROM dimTicket WHERE uniqueCaseId = ?`;
      //await db.query(query, [uniqueCaseId])                                      //------->4
      const rows = await this.db.query(query, [uniqueCaseId]);
      return rows[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database query failed: ${error.message}`);
      } else {
        throw new Error("Unexpected error occurred");
      }
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
      await this.db.query(query, [
        uniqueCaseId,
        ticketCreatedBy,
        ticketUrl,
        uniqueTicketId,
      ]);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Database query failed:", error.message);
        throw new Error(`Database query failed: ${error.message}`);
      } else {
        console.error("Unexpected error occurred");
        throw new Error("Unexpected error occurred");
      }
    }
  }

  async createCase(caseData: any): Promise<void> {
    try {
      const {
        caseDescription,
        caseStatus,
        caseCreatedAt,
        uniqueUserId,
      } = caseData;
      const query = `
        INSERT INTO factCase (caseDescription, caseStatus, caseCreatedAt, uniqueUserId, uniqueAgentId)
        VALUES (?, ?, ?, ?, 'A00001')
      `;
      await this.db.query(query, [
        caseDescription,
        caseStatus,
        caseCreatedAt,
        uniqueUserId,
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database query failed: ${error.message}`);
      } else {
        throw new Error("Unexpected error occurred");
      }
    }
  }
}
