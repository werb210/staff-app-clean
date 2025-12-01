// server/src/controllers/dealsController.ts

import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import dealsRepo from "../db/repositories/deals.repo.js";
import applicationsRepo from "../db/repositories/applications.repo.js";
import lendersRepo from "../db/repositories/lenders.repo.js";

export const dealsController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const deals = await dealsRepo.findMany({});
    return res.json(deals);
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deal = await dealsRepo.findById(id);

    if (!deal) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(deal);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const created = await dealsRepo.create(req.body);
    return res.status(201).json(created);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await dealsRepo.update(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(updated);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await dealsRepo.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json({ success: true });
  }),

  // Custom lender-matching endpoint
  match: asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;

    const application = await applicationsRepo.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: "Not found" });
    }

    const lenders = await lendersRepo.findMany({});
    return res.json({ application, lenders });
  }),
};

export default dealsController;
