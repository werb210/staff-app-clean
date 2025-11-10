import { Router } from "express";
import { z } from "zod";
import { aiService } from "../../services/aiService.js";
import { extractTextFromDocument } from "../../services/ocrService.js";

const payloadSchema = z.object({
  filePath: z.string().min(1, "filePath is required")
});

const router = Router();

/**
 * POST /api/ocr-insights
 * Runs OCR against a document and extracts structured insights.
 */
router.post("/", async (req, res) => {
  try {
    const payload = payloadSchema.parse(req.body);
    const text = await extractTextFromDocument(payload.filePath);
    const insights = await aiService.extractInsightsFromOcr(text);
    res.json({ insights });
  } catch (error) {
    res.status(400).json({
      message: "Failed to extract OCR insights",
      error: (error as Error).message
    });
  }
});

export default router;
