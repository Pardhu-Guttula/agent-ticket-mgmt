import { IUserRepository } from "../dbRepositories/IUserRepository";
import { User } from "../../domain/entities/User";
import MysqlDbConnection from "../database/MysqlDbConnection";
const db = new MysqlDbConnection();

export class MySQLUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const [row]: any = await db.query(
      `SELECT * FROM dimUser WHERE userEmail = ?`,
      [email]
    );
    return row ? new User(row.uniqueUserId, row.userName, row.userEmail, row.userMobile, row.userPassword, row.profileUrl) : null;
  }

  async findByMobile(mobile: string): Promise<User | null> {
    const [row]: any = await db.query(
      `SELECT * FROM dimUser WHERE userMobile = ?`,
      [mobile]
    );
    return row ? new User(row.uniqueUserId, row.userName, row.userEmail, row.userMobile, row.userPassword, row.profileUrl) : null;
  }

  async createUser(user: User): Promise<void> {
    await db.query(
      `INSERT INTO dimUser (userName, userEmail, userMobile, userPassword, profileUrl) VALUES (?, ?, ?, ?, ?)`,
      [user.userName, user.userEmail, user.userMobile, user.userPassword, user.profileUrl]
    );
  }
} 