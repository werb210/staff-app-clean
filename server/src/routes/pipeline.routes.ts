import { Router } from "express";
import pipelineController from "../controllers/pipelineController.js";

const router = Router();

// Only these 2 methods exist
router.get("/application/:applicationId", pipelineController.getPipeline);
router.post("/application/:applicationId/update", pipelineController.updateStage);

export default router;
