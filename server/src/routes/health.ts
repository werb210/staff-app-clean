import { Router } from "express";

const router = Router();

// Basic service health endpoint used by load balancers and uptime monitors.
router.get("/", (_req, res) => {
  res.json({ message: "OK", service: "health" });
});

export default router;
