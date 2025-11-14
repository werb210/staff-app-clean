import type { NextFunction, Request, Response } from "express";
import type { Silo } from "@prisma/client";

import { verifyToken, type AuthTokenPayload } from "./authService.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: "Missing token" });
    }

    const token = header.replace("Bearer ", "");
    const decoded = verifyToken(token);

    req.user = decoded as AuthTokenPayload;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireSilo(...allowedSilos: (Silo | string)[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as AuthTokenPayload | undefined;
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const allowed = allowedSilos.length
      ? allowedSilos
      : (user.silos as (Silo | string)[]);
    const hasAccess = user.silos.some((silo) => allowed.includes(silo));

    if (!hasAccess) {
      return res.status(403).json({ error: "Silo access denied" });
    }

    next();
  };
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as AuthTokenPayload | undefined;
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const ok = user.roles.some((role) => roles.includes(role));
    if (!ok) {
      return res.status(403).json({ error: "Insufficient role" });
    }

    next();
  };
}
