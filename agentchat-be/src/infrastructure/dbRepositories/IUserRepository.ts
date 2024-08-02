import { User } from "../../domain/entities/User";
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<void>;
  findByMobile(mobile: string): Promise<User | null>; 
}