import { Router } from "express";

const router = Router();

// Internal health check used by CI pipelines.
router.get("/", (_req, res) => {
  res.json({ message: "OK", internal: true });
});

export default router;
