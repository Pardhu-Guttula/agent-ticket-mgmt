import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export class MysqlDbConnection {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async query(sql: string, params: any[]): Promise<any> {
    try {
      const [results] = await this.pool.query(sql, params);
      return results;
    } catch (error) {
      throw error;
    }
  }
}

export default MysqlDbConnection;
