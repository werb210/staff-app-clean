import { Router } from "express";

import {
  PipelineBoardSchema,
  PipelineTransitionSchema,
  PipelineAssignmentSchema,
} from "../schemas/pipeline.schema.js";

import {
  isPlaceholderSilo,
  respondWithPlaceholder,
} from "../utils/placeholder.js";

const router = Router();

/* ---------------------------------------------------------
   GET: Full Pipeline Board
--------------------------------------------------------- */
router.get("/board", (req, res) => {
  if (isPlaceholderSilo(req)) return respondWithPlaceholder(res);

  try {
    const stages = req.silo!.services.applications.buildPipeline();

    const board = PipelineBoardSchema.parse({
      stages,
      assignments: [],
    });

    res.json({ message: "OK", data: board });
  } catch (err) {
    console.error("Pipeline board error:", err);
    res.status(500).json({ error: "Failed to load pipeline board" });
  }
});

/* ---------------------------------------------------------
   POST: Transition Application Stage
--------------------------------------------------------- */
router.post("/transition", (req, res) => {
  if (isPlaceholderSilo(req)) return respondWithPlaceholder(res);

  try {
    const input = PipelineTransitionSchema.parse(req.body);

    const updated = req.silo!.services.applications.updateStage(
      input.applicationId,
      input.toStage
    );

    res.json({ message: "OK", data: updated });
  } catch (err) {
    console.error("Pipeline transition error:", err);
    res.status(400).json({ error: "Invalid pipeline transition" });
  }
});

/* ---------------------------------------------------------
   POST: Assign Application to Staff
--------------------------------------------------------- */
router.post("/assign", (req, res) => {
  if (isPlaceholderSilo(req)) return respondWithPlaceholder(res);

  try {
    const input = PipelineAssignmentSchema.parse(req.body);

    const updated = req.silo!.services.applications.assignApplication(
      input.id,
      input.assignedTo,
      input.stage
    );

    res.json({ message: "OK", data: updated });
  } catch (err) {
    console.error("Pipeline assignment error:", err);
    res.status(400).json({ error: "Invalid application assignment" });
  }
});

export default router;
