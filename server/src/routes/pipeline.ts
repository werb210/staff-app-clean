import { Router } from "express";
import { z } from "zod";
import {
  PipelineTransitionSchema,
} from "../schemas/pipeline.schema.js";

import {
  getApplicationDataHandler,
  getApplicationDocumentsHandler,
  getApplicationLendersHandler,
  getCards,
  getStages,
  moveCardHandler,
} from "../controllers/pipelineController.js";

const router = Router();

/**
 * GET /api/pipeline/stages
 * Returns the full pipeline board
 */
router.get("/stages", (req, res) => {
  return getStages(req, res);
});

/**
 * GET /api/pipeline/cards
 * Returns all application cards
 */
router.get("/cards", (req, res) => {
  return getCards(req, res);
});

/**
 * PUT /api/pipeline/cards/:id/move
 * Stage transition
 */
router.put("/cards/:id/move", (req, res) => {
  const parsed = PipelineTransitionSchema.safeParse({
    applicationId: req.params.id,
    fromStage: req.body.fromStage,
    toStage: req.body.toStage,
    assignedTo: req.body.assignedTo,
    note: req.body.note,
  });

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid stage transition",
      issues: parsed.error.errors,
    });
  }

  return moveCardHandler(req, res, parsed.data);
});

/**
 * GET /api/pipeline/cards/:id/application
 * Drawer → Application tab
 */
router.get("/cards/:id/application", (req, res) => {
  return getApplicationDataHandler(req, res);
});

/**
 * GET /api/pipeline/cards/:id/documents
 * Drawer → Documents tab
 */
router.get("/cards/:id/documents", (req, res) => {
  return getApplicationDocumentsHandler(req, res);
});

/**
 * GET /api/pipeline/cards/:id/lenders
 * Drawer → Lenders tab
 */
router.get("/cards/:id/lenders", (req, res) => {
  return getApplicationLendersHandler(req, res);
});

export default router;
