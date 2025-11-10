import { Router } from "express";
import { applicationService } from "../../services/applicationService.js";

const router = Router();

/**
 * GET /api/public-applications
 * Returns the set of applications exposed to public marketing pages.
 */
router.get("/", async (_req, res) => {
  const applications = await applicationService.listPublicApplications();
  res.json({ applications });
});

export default router;
