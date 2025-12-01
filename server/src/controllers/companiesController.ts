// server/src/controllers/companiesController.ts

import { Request, Response } from "express";
import companiesRepo from "../db/repositories/companies.repo.js";
import asyncHandler from "../utils/asyncHandler.js";

export const companiesController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const companies = await companiesRepo.findMany({});
    return res.json(companies);
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const company = await companiesRepo.findById(id);

    if (!company) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(company);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const created = await companiesRepo.create(req.body);
    return res.status(201).json(created);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await companiesRepo.update(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(updated);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await companiesRepo.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json({ success: true });
  }),
};

export default companiesController;
