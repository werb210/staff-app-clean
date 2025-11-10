import { Router } from "express";
import { getAllFeatureFlags } from "../../../utils/featureFlags.js";

const router = Router();

/**
 * GET /api/_int/build-guard
 * Provides build metadata and enabled feature flags for smoke tests.
 */
router.get("/", (_req, res) => {
  res.json({
    build: process.env.BUILD_VERSION ?? "development",
    featureFlags: getAllFeatureFlags()
  });
});

export default router;
