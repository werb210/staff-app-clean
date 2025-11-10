import { Router } from "express";
import { documentUploadSchema } from "../../../schemas/document.schema.js";
import { applicationService } from "../../../services/applicationService.js";

const router = Router();

/**
 * POST /api/applications/upload
 * Registers an uploaded document for an application.
 */
router.post("/", async (req, res) => {
  try {
    const payload = documentUploadSchema.parse(req.body);
    const document = await applicationService.uploadSupportingDocument(payload);
    res.status(201).json({ document });
  } catch (error) {
    res.status(400).json({
      message: "Failed to upload supporting document",
      error: (error as Error).message
    });
  }
});

export default router;
