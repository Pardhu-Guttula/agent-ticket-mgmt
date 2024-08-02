import { UserService } from "../../domain/services/UserService";
import { User } from "../../domain/entities/User";
import jwt from 'jsonwebtoken';

export class LoginUser {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async execute(email: string, password: string): Promise<{ user: User, token: string } | null> {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ userId: user.userId, email: user.userEmail }, 'your_jwt_secret', { expiresIn: '1h' });
    return { user, token };
  }
}