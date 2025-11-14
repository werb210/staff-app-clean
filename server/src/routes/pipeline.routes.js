// routes/pipeline.routes.js
// -----------------------------------------------------
// Sales Pipeline routes (silo-aware)
// Mounted at: /api/:silo/pipeline
// -----------------------------------------------------

import { Router } from "express";
import {
  getPipeline,
  getPipelineCard,
  createPipelineCard,
  updatePipelineCard,
  movePipelineCard,
  deletePipelineCard,
} from "../controllers/pipelineController.js";

const router = Router({ mergeParams: true });

// -----------------------------------------------------
// Async wrapper (Express 5-safe)
// -----------------------------------------------------
const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// -----------------------------------------------------
// Param validator
// -----------------------------------------------------
router.param("pipelineId", (req, res, next, value) => {
  if (!value || typeof value !== "string" || value.length < 6) {
    return res.status(400).json({
      ok: false,
      error: "Invalid pipeline card ID",
      received: value,
    });
  }
  next();
});

// -----------------------------------------------------
// ROUTES
// -----------------------------------------------------

// GET full pipeline for a silo
router.get("/", wrap(getPipeline));

// CREATE new pipeline card (application enters pipeline)
router.post("/", wrap(createPipelineCard));

// GET a specific pipeline card
router.get("/:pipelineId", wrap(getPipelineCard));

// UPDATE pipeline card details (notes, analyst, tags, etc.)
router.put("/:pipelineId", wrap(updatePipelineCard));

// MOVE card across stages
router.post("/:pipelineId/move", wrap(movePipelineCard));

// DELETE a card (rarely used)
router.delete("/:pipelineId", wrap(deletePipelineCard));

export default router;
