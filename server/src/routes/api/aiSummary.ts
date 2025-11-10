import { Router } from "express";
import { z } from "zod";
import { aiService } from "../../services/aiService.js";
import { applicationSummarySchema } from "../../schemas/application.schema.js";

const payloadSchema = z.object({
  application: applicationSummarySchema,
  context: z.string().min(1, "context is required")
});

const router = Router();

/**
 * POST /api/ai-summary
 * Generates an AI-driven summary for an application.
 */
router.post("/", async (req, res) => {
  try {
    const payload = payloadSchema.parse(req.body);
    const summary = await aiService.generateApplicationSummary(payload.application, payload.context);
    res.json({ summary });
  } catch (error) {
    res.status(400).json({
      message: "Failed to generate AI summary",
      error: (error as Error).message
    });
  }
});

export default router;
