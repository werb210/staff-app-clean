// server/src/controllers/dealsController.ts

import { Request, Response } from "express";
import * as dealsRepo from "../db/repositories/deals.repo";
import { asyncHandler } from "../utils/asyncHandler";
import { z } from "zod";

const dealSchema = z.object({
  contactId: z.string(),
  companyId: z.string().optional(),
  amount: z.number(),
  productType: z.string(),
  stage: z.string(),
  notes: z.string().optional(),
});

export const listDeals = asyncHandler(async (_req: Request, res: Response) => {
  const deals = await dealsRepo.getAllDeals();
  res.json({ success: true, data: deals });
});

export const getDeal = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const deal = await dealsRepo.getDealById(id);
  if (!deal) {
    return res.status(404).json({ success: false, message: "Deal not found" });
  }

  res.json({ success: true, data: deal });
});

export const createDeal = asyncHandler(async (req: Request, res: Response) => {
  const parsed = dealSchema.parse(req.body);
  const created = await dealsRepo.createDeal(parsed);
  res.status(201).json({ success: true, data: created });
});

export const updateDeal = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const parsed = dealSchema.partial().parse(req.body);

  const updated = await dealsRepo.updateDeal(id, parsed);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Deal not found" });
  }

  res.json({ success: true, data: updated });
});

export const deleteDeal = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const deleted = await dealsRepo.deleteDeal(id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: "Deal not found" });
  }

  res.json({ success: true, data: true });
});
