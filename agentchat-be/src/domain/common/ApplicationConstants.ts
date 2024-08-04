import { Response } from "express";

export const errorMessages: { [key: string]: string } = {
  400: "Bad Request",
  401: "Unauthorized",
  404: "Resource Not Found",
  500: "Internal Server Error",
  emailExists: "Email already exists", // Add this line
  mobileExists: "Mobile number already exists",
};
export class ApplicationError extends Error {
  public static readonly ERROR_AGENT_NOT_FOUND = "Agent not found";
  public static readonly ERROR_INTERNAL_SERVER = "Internal server error";
  public static readonly ERROR_INVALID_AGENT_ID = "Invalid agent ID";

  constructor(public code: ErrorCode, message: string) {
    super(message);
  }
}

export enum ErrorCode {
  InvalidCredentials = "InvalidCredentials",
  UserNotFound = "UserNotFound",
  AgentNotFound = "AgentNotFound",
}

export const handleHttpError = (
  res: Response,
  statusCode: number,
  message?: string
): void => {
  res.status(statusCode).json({ error: message || errorMessages[statusCode] });
};

export const handle400Error = (res: Response, message?: string): void => {
  handleHttpError(res, 400, message);
};

export const handle401Error = (res: Response, message?: string): void => {
  handleHttpError(res, 401, message);
};

export const handle404Error = (res: Response, message?: string): void => {
  handleHttpError(res, 404, message);
};

export const handle500Error = (res: Response, error?: unknown): void => {
  console.error("Unhandled error:", error);
  const errorMessage =
    error instanceof Error ? error.message : errorMessages[500];
  handleHttpError(res, 500, errorMessage);
};
