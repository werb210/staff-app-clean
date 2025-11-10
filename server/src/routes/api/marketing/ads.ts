import { Router } from "express";
import { z } from "zod";
import { analyticsService } from "../../../services/analyticsService.js";
import { mapObjectKeys } from "../../../utils/objectMapper.js";

const createAdSchema = z.object({
  name: z.string().min(1, "name is required"),
  channel: z.enum(["facebook", "google", "linkedin", "email"]),
  budget: z.number().positive("budget must be positive")
});

const router = Router();

/**
 * GET /api/marketing/ads
 * Provides analytics metrics relevant for marketing campaigns.
 */
router.get("/", async (_req, res) => {
  const metrics = await analyticsService.getApplicationMetrics();
  res.json({ metrics });
});

/**
 * POST /api/marketing/ads
 * Registers a marketing ad concept.
 */
router.post("/", (req, res) => {
  try {
    const payload = createAdSchema.parse(req.body);
    const normalized = mapObjectKeys(payload, { name: "adName" });
    res.status(201).json({ ad: normalized });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create ad",
      error: (error as Error).message
    });
  }
});

export default router;
