import { IUserRepository } from "../../infrastructure/dbRepositories/IUserRepository";
import { User } from "../entities/User";
import bcrypt from 'bcrypt';

export class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (user && await bcrypt.compare(password, user.userPassword)) {
      return user;
    }
    return null;
  }

  async createUser(user: User): Promise<void> {
    user.userPassword = await bcrypt.hash(user.userPassword, 10);
    await this.userRepository.createUser(user);
  }
}
 