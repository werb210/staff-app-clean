import { randomUUID } from "crypto";
import {
  getDocumentsForApplication,
} from "./documentService.js";
import { getAll as getAllLenders } from "./lendersService.js";

export type PipelineStage =
  | "New"
  | "In Review"
  | "Requires Docs"
  | "Sent to Lender"
  | "Accepted";

interface PipelineCard {
  id: string;
  applicationId: string;
  applicantName: string;
  stage: PipelineStage;
  amount: number;
  updatedAt: string;
  assignedTo?: string;
}

interface TimelineEvent {
  id: string;
  cardId: string;
  fromStage: PipelineStage;
  toStage: PipelineStage;
  createdAt: string;
}

interface ApplicationDetails {
  id: string;
  businessName: string;
  applicantName: string;
  amount: number;
  stage: PipelineStage;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  bankAnalysis: {
    coverageRatio: number;
    liquidity: number;
    comments: string;
  };
  financialData: {
    revenue: number;
    ebitda: number;
    debt: number;
  };
}

const STAGES: PipelineStage[] = [
  "New",
  "In Review",
  "Requires Docs",
  "Sent to Lender",
  "Accepted",
];

const cards = new Map<string, PipelineCard>();
const timeline = new Map<string, TimelineEvent[]>();
const applications = new Map<string, ApplicationDetails>();

const init = () => {
  if (cards.size > 0) {
    return;
  }
  const now = new Date();
  const seeds: Array<{
    id: string;
    applicantName: string;
    businessName: string;
    amount: number;
    stage: PipelineStage;
    assignedTo?: string;
  }> = [
    {
      id: "c27e0c87-3bd5-47cc-8d14-5c569ea2cc15",
      applicantName: "Jane Doe",
      businessName: "Harbor Coffee",
      amount: 250000,
      stage: "In Review",
      assignedTo: "alex.martin",
    },
    {
      id: "8c0ca80e-efb6-4b8f-92dd-18de78274b3d",
      applicantName: "Michael Smith",
      businessName: "Summit Logistics",
      amount: 750000,
      stage: "Requires Docs",
    },
    {
      id: "9cf47b18-e789-4c58-9d22-b79c15b0c52e",
      applicantName: "Ava Patel",
      businessName: "Brightline Studios",
      amount: 120000,
      stage: "Sent to Lender",
      assignedTo: "kai.wilson",
    },
  ];
  seeds.forEach((seed, index) => {
    const createdAt = new Date(now.getTime() - index * 3600 * 1000).toISOString();
    const card: PipelineCard = {
      id: randomUUID(),
      applicationId: seed.id,
      applicantName: seed.applicantName,
      stage: seed.stage,
      amount: seed.amount,
      updatedAt: createdAt,
      assignedTo: seed.assignedTo,
    };
    cards.set(card.id, card);
    applications.set(seed.id, {
      id: seed.id,
      businessName: seed.businessName,
      applicantName: seed.applicantName,
      amount: seed.amount,
      stage: seed.stage,
      createdAt,
      updatedAt: createdAt,
      assignedTo: seed.assignedTo,
      bankAnalysis: {
        coverageRatio: 1.32,
        liquidity: 4.1,
        comments: "Healthy cash flow with consistent deposits",
      },
      financialData: {
        revenue: 1800000,
        ebitda: 320000,
        debt: 450000,
      },
    });
  });
};

init();

const ensureCard = (cardId: string): PipelineCard => {
  const card = cards.get(cardId);
  if (!card) {
    throw new Error("Pipeline card not found");
  }
  return card;
};

const ensureApplication = (applicationId: string): ApplicationDetails => {
  const application = applications.get(applicationId);
  if (!application) {
    throw new Error("Application not found");
  }
  return application;
};

export const getAllStages = () =>
  STAGES.map((stage) => ({
    id: stage,
    name: stage,
    cards: Array.from(cards.values()).filter((card) => card.stage === stage).map(
      (card) => ({
        id: card.id,
        applicationId: card.applicationId,
        applicantName: card.applicantName,
        amount: card.amount,
        updatedAt: card.updatedAt,
        assignedTo: card.assignedTo,
      }),
    ),
  }));

export const getAllCards = (): PipelineCard[] => Array.from(cards.values());

export const moveCard = (cardId: string, newStage: PipelineStage) => {
  if (!STAGES.includes(newStage)) {
    throw new Error("Invalid stage");
  }
  const card = ensureCard(cardId);
  const previousStage = card.stage;
  const now = new Date().toISOString();
  const updated: PipelineCard = {
    ...card,
    stage: newStage,
    updatedAt: now,
  };
  cards.set(cardId, updated);
  const application = ensureApplication(card.applicationId);
  applications.set(application.id, {
    ...application,
    stage: newStage,
    updatedAt: now,
  });
  const entry: TimelineEvent = {
    id: randomUUID(),
    cardId,
    fromStage: previousStage,
    toStage: newStage,
    createdAt: now,
  };
  const history = timeline.get(cardId) ?? [];
  timeline.set(cardId, [...history, entry]);
  return updated;
};

export const getApplicationData = (cardId: string) => {
  const card = ensureCard(cardId);
  const application = ensureApplication(card.applicationId);
  const documents = getDocumentsForApplication(application.id);
  const lenders = getAllLenders().slice(0, 3);
  return {
    application,
    bankAnalysis: application.bankAnalysis,
    financialData: application.financialData,
    documents,
    lenderMatches: lenders,
    timeline: timeline.get(cardId) ?? [],
  };
};

export const getApplicationDocuments = (cardId: string) => {
  const card = ensureCard(cardId);
  return getDocumentsForApplication(card.applicationId);
};

export const getApplicationLenders = (cardId: string) => {
  ensureCard(cardId);
  return getAllLenders();
};

// Legacy class API retained for compatibility with existing placeholder tooling.
export class PipelineService {
  public getBoard() {
    return { stages: getAllStages(), cards: getAllCards() };
  }

  public listAssignments() {
    return [];
  }

  public transitionApplication(payload: { cardId: string; toStage: PipelineStage }) {
    const card = moveCard(payload.cardId, payload.toStage);
    return { card };
  }

  public assignApplication() {
    return {};
  }
}

export const createPipelineService = (_options: unknown = {}) => new PipelineService();

export type PipelineServiceType = PipelineService;

export const pipelineService = new PipelineService();
