import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/JwtUtils";

interface CustomRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: "Invalid token." });
    }

    (req as CustomRequest).user = payload; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};
 