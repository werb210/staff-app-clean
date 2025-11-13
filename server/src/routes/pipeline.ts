import { Router } from "express";
import { PipelineTransitionSchema } from "../schemas/pipeline.schema.js";

import {
  getStages,
  getCards,
  moveCardHandler,
  getApplicationDataHandler,
  getApplicationDocumentsHandler,
  getApplicationLendersHandler,
} from "../controllers/pipelineController.js";

const router = Router();

/**
 * GET /api/pipeline/stages
 * Full board (columns + cards)
 */
router.get("/stages", (req, res) => {
  return getStages(req, res);
});

/**
 * GET /api/pipeline/cards
 * Returns all cards (each card = applicationId)
 */
router.get("/cards", (req, res) => {
  return getCards(req, res);
});

/**
 * PUT /api/pipeline/cards/:id/move
 * Stage transition with strict schema validation
 */
router.put("/cards/:id/move", (req, res) => {
  const parsed = PipelineTransitionSchema.safeParse({
    applicationId: req.params.id,        // canonical cardId
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

  // Pass the validated object down to the controller
  return moveCardHandler(req, res, parsed.data);
});

/**
 * Drawer → Application tab
 */
router.get("/cards/:id/application", (req, res) => {
  return getApplicationDataHandler(req, res);
});

/**
 * Drawer → Documents tab
 */
router.get("/cards/:id/documents", (req, res) => {
  return getApplicationDocumentsHandler(req, res);
});

/**
 * Drawer → Lenders tab
 */
router.get("/cards/:id/lenders", (req, res) => {
  return getApplicationLendersHandler(req, res);
});

export default router;
