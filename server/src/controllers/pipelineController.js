// controllers/pipelineController.js
// -----------------------------------------------------
// Sales Pipeline Controller (silo-aware)
// Backed by in-memory db.pipeline
// -----------------------------------------------------

import { db } from "../services/db.js";
import { v4 as uuid } from "uuid";

// -----------------------------------------------------
// Valid pipeline stages (Boreal standard)
// -----------------------------------------------------
export const PIPELINE_STAGES = [
  "new",
  "requires_docs",
  "in_review",
  "ready_for_lenders",
  "sent_to_lender",
  "funded",
  "closed",
];

// -----------------------------------------------------
// Utility — ensure silo is provided
// -----------------------------------------------------
function assertSilo(req) {
  const silo = req.params?.silo;
  if (!silo) throw new Error("Missing silo in route parameters");
  return silo;
}

// -----------------------------------------------------
// GET /api/:silo/pipeline
// -----------------------------------------------------
export async function getPipeline(req, res) {
  const silo = assertSilo(req);

  const results = db.pipeline.data.filter((c) => c.silo === silo);

  res.status(200).json({
    ok: true,
    count: results.length,
    pipeline: results,
  });
}

// -----------------------------------------------------
// POST /api/:silo/pipeline
// Create a new pipeline card
// -----------------------------------------------------
export async function createPipelineCard(req, res) {
  const silo = assertSilo(req);
  const body = req.body || {};

  const id = uuid();

  const card = {
    id,
    silo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    // basic fields
    applicationId: body.applicationId || null,
    stage: body.stage || "new",
    notes: body.notes || "",
    assignedTo: body.assignedTo || null,

    // any UI metadata
    tags: body.tags || [],
  };

  db.pipeline.data.push(card);

  res.status(201).json({
    ok: true,
    card,
  });
}

// -----------------------------------------------------
// GET /api/:silo/pipeline/:pipelineId
// -----------------------------------------------------
export async function getPipelineCard(req, res) {
  const silo = assertSilo(req);
  const pid = req.params.pipelineId;

  const card = db.pipeline.data.find(
    (c) => c.id === pid && c.silo === silo
  );

  if (!card) {
    return res.status(404).json({
      ok: false,
      error: "Pipeline card not found",
    });
  }

  res.status(200).json({
    ok: true,
    card,
  });
}

// -----------------------------------------------------
// PUT /api/:silo/pipeline/:pipelineId
// Update metadata (notes, analyst, tags, etc.)
// -----------------------------------------------------
export async function updatePipelineCard(req, res) {
  const silo = assertSilo(req);
  const pid = req.params.pipelineId;
  const updates = req.body || {};

  const index = db.pipeline.data.findIndex(
    (c) => c.id === pid && c.silo === silo
  );

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: "Pipeline card not found",
    });
  }

  const updated = {
    ...db.pipeline.data[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.pipeline.data[index] = updated;

  res.status(200).json({
    ok: true,
    card: updated,
  });
}

// -----------------------------------------------------
// POST /api/:silo/pipeline/:pipelineId/move
// Move card to another stage
// -----------------------------------------------------
export async function movePipelineCard(req, res) {
  const silo = assertSilo(req);
  const pid = req.params.pipelineId;
  const { toStage } = req.body || {};

  if (!PIPELINE_STAGES.includes(toStage)) {
    return res.status(400).json({
      ok: false,
      error: `Invalid stage '${toStage}'`,
      allowed: PIPELINE_STAGES,
    });
  }

  const index = db.pipeline.data.findIndex(
    (c) => c.id === pid && c.silo === silo
  );

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: "Pipeline card not found",
    });
  }

  const card = db.pipeline.data[index];

  const updated = {
    ...card,
    stage: toStage,
    updatedAt: new Date().toISOString(),
  };

  db.pipeline.data[index] = updated;

  res.status(200).json({
    ok: true,
    fromStage: card.stage,
    toStage: updated.stage,
    card: updated,
  });
}

// -----------------------------------------------------
// DELETE /api/:silo/pipeline/:pipelineId
// -----------------------------------------------------
export async function deletePipelineCard(req, res) {
  const silo = assertSilo(req);
  const pid = req.params.pipelineId;

  const index = db.pipeline.data.findIndex(
    (c) => c.id === pid && c.silo === silo
  );

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      error: "Pipeline card not found",
    });
  }

  const removed = db.pipeline.data.splice(index, 1)[0];

  res.status(200).json({
    ok: true,
    deleted: removed,
  });
}
