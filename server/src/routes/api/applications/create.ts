import { Router } from "express";
import { createApplicationSchema } from "../../../schemas/application.schema.js";
import { applicationService } from "../../../services/applicationService.js";

const router = Router();

/**
 * POST /api/applications/create
 * Creates a draft loan application.
 */
router.post("/", async (req, res) => {
  try {
    const payload = createApplicationSchema.parse(req.body);
    const application = await applicationService.createDraftApplication(payload);
    res.status(201).json({ application });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create application",
      error: (error as Error).message
    });
  }
});

export default router;
