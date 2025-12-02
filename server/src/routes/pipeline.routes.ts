import { Router } from "express";
import pipelineController from "../controllers/pipelineController.js";

const router = Router();

// Only these 2 methods exist
router.get("/application/:applicationId", pipelineController.get);
router.post("/application/:applicationId/update", pipelineController.update);

export default router;
