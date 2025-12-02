import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import applicationsRepo from "../db/repositories/applications.repo.js";

export const applicationsController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const rows = await applicationsRepo.findMany({});
    res.json(rows);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const created = await applicationsRepo.create(req.body ?? {});
    res.status(201).json(created);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await applicationsRepo.update(id, req.body ?? {});
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const removed = await applicationsRepo.delete(id);
    if (!removed) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const row = await applicationsRepo.findById(id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  }),
};

export default applicationsController;
