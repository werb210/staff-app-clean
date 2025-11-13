import { Router } from "express";
import {
  listApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  updateStatus,
  updateStage,
  submitApplication,
  completeApplication,
  uploadDocument,
} from "../../controllers/applications/applicationController.js";

const router = Router();

router.get("/", listApplications);
router.get("/:id", getApplication);
router.post("/", createApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

router.post("/:id/status", updateStatus);
router.post("/:id/stage", updateStage);
router.post("/:id/submit", submitApplication);
router.post("/:id/complete", completeApplication);

router.post("/upload", uploadDocument);

export default router;
