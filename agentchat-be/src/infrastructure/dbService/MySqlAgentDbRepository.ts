import { IAgentDbRepository } from "../dbRepositories/IAgentDbRepository";
import { Agent } from "../../domain/entities/Agent";
import MysqlDbConnection from "../database/MysqlDbConnection";
import { AgentProfile } from "../../domain/entities/AgentProfile";

const db = new MysqlDbConnection();

export class AgentDbService implements IAgentDbRepository {
  async addAgent(agent: Agent): Promise<void> {
    try {
      const createdOn = agent.createdOn ? agent.createdOn : new Date();
      const query = `INSERT INTO dimAgent (name, email, password, mobile, createdOn) VALUES (?, ?, ?, ?, ?)`;
      await db.query(query, [agent.name, agent.email, agent.password, agent.mobile, createdOn]);
    } catch (error) {
      console.error("Error in addAgent:", error);
      throw error;
    }
  }
  async emailExists(email: string): Promise<boolean> {
    try {
      const query = `SELECT COUNT(*) AS count FROM dimAgent WHERE email = ?`;
      const result: any = await db.query(query, [email]);
      return result[0].count > 0;
    } catch (error) {
      console.error("Error in emailExists:", error);
      throw error;
    }
  }
  async mobileExists(mobile: string): Promise<boolean> {
    try {
      const query = `SELECT COUNT(*) AS count FROM dimAgent WHERE mobile = ?`;
      const result: any = await db.query(query, [mobile]);
      return result[0].count > 0;
    } catch (error) {
      console.error("Error in mobileExists:", error);
      throw error;
    }
  }
  async getAgentByEmail(email: string): Promise<{ agent: Agent | null; uniqueAgentId?: string }> {
    try {
      const query = `SELECT * FROM dimAgent WHERE email = ?`;
      const result: any = await db.query(query, [email]);

      if (result.length === 0) return { agent: null }; 

      const agentData = result[0];
      const uniqueAgentId = agentData.uniqueAgentId; 

      const agent = new Agent(
        agentData.id,
        agentData.name,
        agentData.email,
        agentData.password,
        agentData.mobile,
        agentData.createdOn
      );

      return { agent, uniqueAgentId }; 
    } catch (error) {
      console.error("Error in getAgentByEmail:", error);
      throw error;
    }
  }
  
  async getAgentById(agentId: string): Promise<AgentProfile | null> {
    const query = "SELECT uniqueAgentId AS id, name, email, mobile FROM dimAgent WHERE uniqueAgentId = ?";


    try {
      const rows: any = await db.query(query, [agentId]);


      if (Array.isArray(rows) && rows.length > 0) {
        const row = rows[0];
        return new AgentProfile(row.id, row.name, row.email, row.mobile);
      }

      return null;
    } catch (error) {
      console.error("Error in AgentDbService:", error);
      throw new Error("Database query failed");
    }
  }
}
 