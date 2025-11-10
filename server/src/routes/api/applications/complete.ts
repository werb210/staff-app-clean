import { Router } from "express";
import { completeApplicationSchema } from "../../../schemas/application.schema.js";
import { applicationService } from "../../../services/applicationService.js";

const router = Router();

/**
 * POST /api/applications/complete
 * Marks an application as completed.
 */
router.post("/", async (req, res) => {
  try {
    const payload = completeApplicationSchema.parse(req.body);
    const application = await applicationService.markApplicationComplete(payload);
    res.json({ application });
  } catch (error) {
    res.status(400).json({
      message: "Failed to complete application",
      error: (error as Error).message
    });
  }
});

export default router;
