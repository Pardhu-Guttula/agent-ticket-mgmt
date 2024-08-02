import { Request, Response } from "express";
import { AgentService } from "../../domain/services/AgentService";
import { AgentDbService } from "../../infrastructure/dbService/MySqlAgentDbRepository";
import { handle400Error, handle500Error, errorMessages } from "../../domain/common/ApplicationConstants";
import { validateEmail, validatePassword, validateMobile, validateRequiredFields } from "../../utils/ValidationUtils";
import { hashPassword } from "../../utils/PasswordUtils";
import { AgentRegisterCommand } from "../../application/commands/AgentRegister";
import { AgentRegisterHandler } from "../../application/handlers/AgentRegisterHandler";

const agentDbService = new AgentDbService();
const agentService = new AgentService(agentDbService);
const agentRegisterHandler = new AgentRegisterHandler(agentService);

export const registerAgent = async (req: Request, res: Response) => {
  try {
    const { name, email, password, mobile } = req.body;


    const requiredFieldsError = validateRequiredFields({ name, email, password, mobile });
    if (requiredFieldsError) {
      return handle400Error(res, requiredFieldsError);
    }

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      return handle400Error(res, emailValidationError);
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      return handle400Error(res, passwordValidationError);
    }

    const mobileValidationError = validateMobile(mobile);
    if (mobileValidationError) {
      return handle400Error(res, mobileValidationError);
    }


    const emailExists = await agentService.checkEmailExists(email);
    if (emailExists) {
      return handle400Error(res, errorMessages.emailExists);
    }

    const mobileExists = await agentService.checkMobileExists(mobile); // Use the service method
    if (mobileExists) {
      return handle400Error(res, errorMessages.mobileExists);
    }


    const hashedPassword = await hashPassword(password);
    const command = new AgentRegisterCommand(name, email, hashedPassword, mobile, new Date());


    await agentRegisterHandler.handle(command);

    res.status(201).json({
      success: true,
      message: errorMessages.agentRegistered,
      data: {
        name,
        email,
        mobile
      }
    });
  } catch (error: unknown) {
    handle500Error(res, error);
  }
};
 