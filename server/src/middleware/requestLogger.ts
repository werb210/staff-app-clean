import { Request, Response, NextFunction } from "express";
import auditService from "../services/auditService.js";

export default async function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    await auditService.log("REQUEST", {
      method: req.method,
      url: req.originalUrl,
    });
  } catch {}

  next();
}
