// server/src/middlewares/errorHandler.ts

import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("❌ ERROR:", err);

  res.status(err.status || 500).json({
    ok: false,
    error: err.message || "Internal Server Error",
  });
}

export default errorHandler;
