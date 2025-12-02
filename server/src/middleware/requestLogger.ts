// server/src/middleware/requestLogger.ts
import { Request, Response, NextFunction } from "express";
import auditService from "../services/auditService.js";

export async function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  await auditService.log({
    event: "REQUEST",
    payload: { method: req.method, url: req.url },
    userId: (req as any).user?.id ?? null,
  });
  next();
}
