// server/src/middlewares/siloGuard.ts
import type { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    silo?: string;
  }
}

export default function siloGuard(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const silo = req.params.silo;

  req.silo = silo;

  next();
}
