import { Router } from "express";

const router = Router();

/**
 * GET /api/_int/health
 * Lightweight internal health check used for load balancers.
 */
router.get("/", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
