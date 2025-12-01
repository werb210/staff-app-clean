import { Router } from "express";
import applicationController from "../controllers/applicationController.js";

const router = Router();

// These three routes actually exist in your controller:
router.post("/start", applicationController.start);
router.post("/:applicationId/update-step", applicationController.updateStep);
router.post("/:applicationId/submit", applicationController.submit);

// Get one application
router.get("/:applicationId", applicationController.getOne);

export default router;
