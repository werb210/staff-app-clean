// server/src/middlewares/auth.ts
import type { Request, Response, NextFunction } from "express";

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  // TODO: replace with real JWT verification later
  next();
}
