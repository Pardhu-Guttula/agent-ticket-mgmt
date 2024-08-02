import { Request, Response } from "express";
import { MySQLUserRepository } from "../../infrastructure/dbService/MySqlUserRepository";
import { UserService } from "../../domain/services/UserService";
import { LoginUser } from "../../application/commands/UserLogin";
import { RegisterUser } from "../../application/commands/UserRegister";

const userRepository = new MySQLUserRepository();
const userService = new UserService(userRepository);
const loginUserUseCase = new LoginUser(userService);
const registerUserUseCase = new RegisterUser(userService);

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserUseCase.execute(email, password);
    if (!result) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unexpected error occurred' });
    }
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, password } = req.body;
     
     const existingUserByEmail = await userRepository.findByEmail(email);
     if (existingUserByEmail) {
       return res.status(400).json({ error: 'Email already exists' });
     }
 
     
     const existingUserByMobile = await userRepository.findByMobile(mobile);
     if (existingUserByMobile) {
       return res.status(400).json({ error: 'Mobile number already exists' });
     }
    await registerUserUseCase.execute(name, email, mobile, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unexpected error occurred' });
    }
  }
}; 