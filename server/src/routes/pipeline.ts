import { Router } from "express";
import { applicationService } from "../services/applicationService.js";
import { PipelineStageSchema } from "../schemas/pipeline.schema.js";

const router = Router();

// Lists a synthetic pipeline built from the in-memory applications.
router.get("/", (_req, res) => {
  const stages = applicationService.buildPipeline();
  res.json({ message: "OK", data: stages });
});

// Accepts a new pipeline stage definition for testing integrations.
router.post("/stage", (req, res) => {
  const stage = PipelineStageSchema.parse(req.body);
  res.status(201).json({ message: "OK", data: stage });
});

export default router;
