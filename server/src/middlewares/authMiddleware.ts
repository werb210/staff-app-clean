// server/src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

export async function authGuard(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = verifyToken(token);
    (req as any).user = decoded;

    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
