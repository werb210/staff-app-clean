import type { Request, Response } from "express";
import {
  getAllCards,
  getAllStages,
  getApplicationData,
  getApplicationDocuments,
  getApplicationLenders,
  moveCard,
  type PipelineStage,
} from "../services/pipelineService.js";

export const getStages = (_req: Request, res: Response) => {
  const stages = getAllStages();
  res.json({ data: stages });
};

export const getCards = (_req: Request, res: Response) => {
  const cards = getAllCards();
  res.json({ data: cards });
};

export const moveCardHandler = (req: Request, res: Response) => {
  const stage = req.body.stage as PipelineStage | undefined;
  if (!stage) {
    return res.status(400).json({ message: "stage is required" });
  }
  try {
    const card = moveCard(req.params.id, stage);
    return res.json({ data: card });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const getApplicationDataHandler = (req: Request, res: Response) => {
  try {
    const data = getApplicationData(req.params.id);
    return res.json({ data });
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
};

export const getApplicationDocumentsHandler = (req: Request, res: Response) => {
  try {
    const documents = getApplicationDocuments(req.params.id);
    return res.json({ data: documents });
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
};

export const getApplicationLendersHandler = (req: Request, res: Response) => {
  try {
    const lenders = getApplicationLenders(req.params.id);
    return res.json({ data: lenders });
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
};
