import { Router, Request, Response } from "express";
import { logInfo } from "../utils/logger.js";

/**
 * Health check router for the API.
 * Responds with a JSON object confirming the service is running.
 */
const healthRouter = Router();

/**
 * GET /api/health
 * Returns basic server health information
 */
healthRouter.get("/", (_req: Request, res: Response) => {
  logInfo("GET /api/health invoked");
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default healthRouter;
