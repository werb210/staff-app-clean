import type { Request, Response, NextFunction } from "express";

// Add TS support for req.silo
declare module "express-serve-static-core" {
  interface Request {
    silo?: string;
  }
}

export const siloGuard = (req: Request, _res: Response, next: NextFunction) => {
  const silo = req.params.silo;

  if (!silo) {
    return next(new Error("Silo missing from route."));
  }

  req.silo = silo;
  next();
};

export default siloGuard;
