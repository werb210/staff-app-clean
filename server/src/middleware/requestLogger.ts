import { Request, Response, NextFunction } from "express";
import auditService from "../services/auditService.js";

export default async function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    await auditService.logEvent({
      eventType: "REQUEST",
      details: {
        method: req.method,
        url: req.originalUrl,
      },
    });
  } catch {}

  next();
}
