import { Router } from "express";

import {
  listApplications,
  getApplication,
  createApplication,
  updateApplication,
  updateStage,
  updateStatus,
  assignApplication,
  submitApplication,
  completeApplication,
  publishApplication,
  deleteApplication,
} from "../../controllers/applications/applicationController.js";

const router = Router();

// GET /api/applications
router.get("/", listApplications);

// GET /api/applications/:id
router.get("/:id", getApplication);

// POST /api/applications
router.post("/", createApplication);

// PUT /api/applications/:id
router.put("/:id", updateApplication);

// PATCH /api/applications/:id/stage
router.patch("/:id/stage", updateStage);

// PATCH /api/applications/:id/status
router.patch("/:id/status", updateStatus);

// POST /api/applications/:id/assign
router.post("/:id/assign", assignApplication);

// POST /api/applications/:id/submit
router.post("/:id/submit", submitApplication);

// POST /api/applications/:id/complete
router.post("/:id/complete", completeApplication);

// POST /api/applications/:id/publish
router.post("/:id/publish", publishApplication);

// DELETE /api/applications/:id
router.delete("/:id", deleteApplication);

export default router;
