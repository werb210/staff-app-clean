import { randomUUID } from "crypto";
import { applicationService } from "./applicationService.js";
import { getDocumentsForApplication } from "./documentService.js";
import { getAll as getAllLenders } from "./lendersService.js";
import { type PipelineStage, PIPELINE_STAGES } from "../schemas/pipeline.schema.js";

/**
 * Canonical PipelineCard stored in memory
 */
interface PipelineCard {
  id: string;              // cardId = applicationId
  applicationId: string;
  applicantName: string;
  amount: number;
  stage: PipelineStage;
  updatedAt: string;
  assignedTo?: string;
}

/**
 * Card timeline
 */
interface TimelineEvent {
  id: string;
  applicationId: string;
  fromStage: PipelineStage;
  toStage: PipelineStage;
  createdAt: string;
}

/**
 * Internal stores
 */
const cards = new Map<string, PipelineCard>();
const timeline = new Map<string, TimelineEvent[]>();

/**
 * Build a card from a real application (for initialization only)
 */
const buildInitialCard = (app: any): PipelineCard => {
  const now = new Date().toISOString();
  let stage: PipelineStage = "New";

  const docs = getDocumentsForApplication(app.id);

  // Rule #1 – no docs → Requires Docs
  if (docs.length === 0) {
    stage = "Requires Docs";
  }

  // Rule #2 – rejected docs → Requires Docs
  if (docs.some((d) => d.status === "rejected")) {
    stage = "Requires Docs";
  }

  // Map application status → pipeline stage
  switch (app.status) {
    case "review":
      stage = "In Review";
      break;
    case "approved":
      stage = "Sent to Lender";
      break;
    case "completed":
      stage = "Accepted";
      break;
  }

  return {
    id: app.id,
    applicationId: app.id,
    applicantName: app.applicantName,
    amount: app.loanAmount ?? 0,
    updatedAt: app.updatedAt ?? now,
    assignedTo: app.assignedTo,
    stage,
  };
};

/**
 * Build or sync cards without overwriting user transitions
 */
const syncCards = (): void => {
  const apps = applicationService.listApplications();

  apps.forEach((app) => {
    const existing = cards.get(app.id);

    if (!existing) {
      // First time seeing this application → build a new card
      const card = buildInitialCard(app);
      cards.set(app.id, card);
      return;
    }

    // Card already exists → sync metadata only
    existing.applicantName = app.applicantName;
    existing.amount = app.loanAmount ?? existing.amount;
    existing.updatedAt = app.updatedAt ?? existing.updatedAt;
    existing.assignedTo = app.assignedTo;

    // DO NOT overwrite stage — user action overrides rules
    cards.set(app.id, existing);
  });
};

/**
 * Helper: require card
 */
const requireCard = (id: string): PipelineCard => {
  const card = cards.get(id);
  if (!card) {
    throw new Error(`Card ${id} not found`);
  }
  return card;
};

/**
 * PUBLIC: return all stages with cards
 */
export const getAllStages = () => {
  syncCards();

  return PIPELINE_STAGES.map((stage) => {
    const stageCards = Array.from(cards.values()).filter((c) => c.stage === stage);

    return {
      id: stage,
      name: stage,
      cards: stageCards,
    };
  });
};

/**
 * PUBLIC: return all cards
 */
export const getAllCards = () => {
  syncCards();
  return Array.from(cards.values());
};

/**
 * PUBLIC: Move card
 * Big Fix rule: moveCard(cardId, newStage)
 */
export const moveCard = (cardId: string, newStage: PipelineStage) => {
  syncCards();

  const card = requireCard(cardId);

  if (!PIPELINE_STAGES.includes(newStage)) {
    throw new Error(`Invalid stage: ${newStage}`);
  }

  const now = new Date().toISOString();
  const previousStage = card.stage;

  const updated: PipelineCard = {
    ...card,
    stage: newStage,
    updatedAt: now,
  };

  cards.set(cardId, updated);

  const event: TimelineEvent = {
    id: randomUUID(),
    applicationId: card.applicationId,
    fromStage: previousStage,
    toStage: newStage,
    createdAt: now,
  };

  const events = timeline.get(cardId) ?? [];
  timeline.set(cardId, [...events, event]);

  return updated;
};

/**
 * Drawer → Application tab
 */
export const getApplicationData = (applicationId: string) => {
  const apps = applicationService.listApplications();
  const app = apps.find((a) => a.id === applicationId);
  if (!app) {
    throw new Error("Application not found");
  }

  const docs = getDocumentsForApplication(applicationId);
  const lenders = getAllLenders().slice(0, 5);

  return {
    application: app,
    documents: docs,
    lenderMatches: lenders,
    timeline: timeline.get(applicationId) ?? [],
  };
};

/**
 * Drawer → Documents tab
 */
export const getApplicationDocuments = (applicationId: string) => {
  return getDocumentsForApplication(applicationId);
};

/**
 * Drawer → Lenders tab
 */
export const getApplicationLenders = (_applicationId: string) => {
  return getAllLenders();
};

/**
 * Legacy compatibility
 */
export class PipelineService {
  public getBoard() {
    return {
      stages: getAllStages(),
      cards: getAllCards(),
    };
  }

  public transitionApplication(cardId: string, toStage: PipelineStage) {
    return { card: moveCard(cardId, toStage) };
  }
}

export const createPipelineService = () => new PipelineService();
export const pipelineService = new PipelineService();
