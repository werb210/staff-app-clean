/**
 * Health check route
 * Responds with server status and timestamp.
 */

import { Router, Request, Response } from "express";
import { logInfo } from "../utils/logger.js";

const healthRouter: Router = Router();

// GET /api/health
healthRouter.get("/", (_req: Request, res: Response) => {
  logInfo("GET /api/health invoked");
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export default healthRouter;
