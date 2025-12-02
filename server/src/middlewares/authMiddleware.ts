import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../services/authService.js";

export async function authGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Missing auth header" });

  const token = header.replace("Bearer ", "");
  const user = await verifyJwt(token);
  if (!user) return res.status(401).json({ error: "Invalid token" });

  (req as any).user = user;
  next();
}

export function roleGuard(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
