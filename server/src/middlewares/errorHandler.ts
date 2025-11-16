// server/src/middlewares/errorHandler.ts

import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("❌ ERROR:", err);

  res.status(500).json({
    ok: false,
    error: typeof err === "string" ? err : err.message || "Internal Error",
  });
}
