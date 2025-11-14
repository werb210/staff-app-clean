import type { Request, Response, NextFunction } from "express";

/**
 * Enforces silo restriction for all routes.
 *
 * Supports:
 *   /silo/BF
 *   /silo/BI
 *   /silo/SLF
 *
 * If a user is NOT allowed into that silo => 403
 */
export const siloGuard = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthenticated" });

  const siloParam = req.params.silo as "BF" | "BI" | "SLF" | undefined;

  // If the route has no :silo param, allow by default (Handled by app layer)
  if (!siloParam) return next();

  if (!user.silos.includes(siloParam)) {
    return res.status(403).json({
      error: `Access denied: user does not belong to silo ${siloParam}`,
      allowed: user.silos,
    });
  }

  return next();
};
