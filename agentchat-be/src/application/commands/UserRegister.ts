
import { UserService } from "../../domain/services/UserService";
import { User } from "../../domain/entities/User";

export class RegisterUser {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async execute(userName: string, userEmail: string, userMobile: string, userPassword: string): Promise<void> {
    const user = new User(
      '',
      userName,
      userEmail,
      userMobile,
      userPassword,
      ''
    );
    await this.userService.createUser(user);
  }
}
 