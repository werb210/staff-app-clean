import { Router } from "express";
import { submitApplicationSchema } from "../../../schemas/application.schema.js";
import { applicationService } from "../../../services/applicationService.js";

const router = Router();

/**
 * POST /api/applications/submit
 * Submits a draft application for review.
 */
router.post("/", async (req, res) => {
  try {
    const payload = submitApplicationSchema.parse(req.body);
    const application = await applicationService.submitApplication(payload);
    res.json({ application });
  } catch (error) {
    res.status(400).json({
      message: "Failed to submit application",
      error: (error as Error).message
    });
  }
});

export default router;
