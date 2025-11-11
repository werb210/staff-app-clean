import { Router } from "express";

const router = Router();

// Simple endpoint allowing deployment systems to verify build metadata.
router.get("/", (_req, res) => {
  res.json({ message: "OK", build: process.env.BUILD_ID ?? "local" });
});

export default router;
