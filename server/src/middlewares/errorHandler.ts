import type { Request, Response, NextFunction } from "express";

type ErrorWithStatus = Error & { status?: number };

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 ERROR:", err);

  if (res.headersSent) {
    return next(err instanceof Error ? err : new Error(String(err)));
  }

  const error: ErrorWithStatus =
    err instanceof Error
      ? (err as ErrorWithStatus)
      : ({ message: String(err ?? "Unknown error") } as ErrorWithStatus);

  const statusCode = typeof error.status === "number" ? error.status : 500;

  return res.status(statusCode).json({
    error: error.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};
