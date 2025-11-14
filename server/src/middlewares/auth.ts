import type { RequestHandler } from "express";

import {
  requireAuth,
  requireRole,
  requireSilo,
} from "../auth/authMiddleware.js";

export const authMiddleware: RequestHandler = requireAuth;
export { requireRole, requireSilo };
