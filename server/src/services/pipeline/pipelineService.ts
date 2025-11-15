import type { Silo } from "../db.js";
import { db } from "../db.js";
import { uuid } from "../../utils/uuid.js";

/** Pipeline Stage Names (canonical) */
export type PipelineStage =
  | "new"
  | "requires_docs"
  | "in_review"
  | "docs_accepted"
  | "sent_to_lender";

/** Pipeline Card model */
export interface PipelineCard {
  id: string;              // card ID (same as applicationId)
  applicationId: string;   // same as id (kept for client backwards-compat)
  silo: Silo;
  stage: PipelineStage;
  createdAt: string;
  updatedAt: string;
}

function now() {
  return new Date().toISOString();
}

/** Ensure a card exists for an application */
export function ensureCard(appId: string, silo: Silo): PipelineCard {
  const existing = db.pipelineCards.find(
    (c) => c.applicationId === appId && c.silo === silo
  );
  if (existing) return existing;

  const card: PipelineCard = {
    id: appId,
    applicationId: appId,
    silo,
    stage: "new",
    createdAt: now(),
    updatedAt: now(),
  };

  db.pipelineCards.push(card);
  return card;
}

/** Get application pipeline card */
export function getCard(silo: Silo, cardId: string) {
  return db.pipelineCards.find((c) => c.id === cardId && c.silo === silo);
}

/** Get all cards for a silo */
export function listCards(silo: Silo) {
  return db.pipelineCards.filter((c) => c.silo === silo);
}

/** Move card to a new stage */
export function moveCard(
  silo: Silo,
  applicationId: string,
  newStage: PipelineStage
) {
  const card = db.pipelineCards.find(
    (c) => c.applicationId === applicationId && c.silo === silo
  );

  if (!card) {
    throw new Error(`Pipeline card not found for application ${applicationId}`);
  }

  card.stage = newStage;
  card.updatedAt = now();
  return card;
}

/** Delete a card (rarely used, safe-op) */
export function deleteCard(silo: Silo, applicationId: string) {
  const idx = db.pipelineCards.findIndex(
    (c) => c.applicationId === applicationId && c.silo === silo
  );
  if (idx >= 0) db.pipelineCards.splice(idx, 1);
  return true;
}

/** Rules: When documents update, update the pipeline stage */
export function updateStageForDocs(
  silo: Silo,
  applicationId: string,
  hasRejected: boolean,
  allAccepted: boolean
) {
  const card = ensureCard(applicationId, silo);

  if (hasRejected) {
    card.stage = "requires_docs";
  } else if (allAccepted) {
    card.stage = "docs_accepted";
  }

  card.updatedAt = now();
  return card;
}

/** Mark as sent to lender */
export function markSentToLender(silo: Silo, applicationId: string) {
  const card = ensureCard(applicationId, silo);
  card.stage = "sent_to_lender";
  card.updatedAt = now();
  return card;
}

export const pipelineService = {
  ensureCard,
  getCard,
  listCards,
  moveCard,
  deleteCard,
  updateStageForDocs,
  markSentToLender,
};
