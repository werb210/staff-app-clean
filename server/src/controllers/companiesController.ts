// server/src/controllers/companiesController.ts
import type { Request, Response } from "express";
import { companiesService } from "../services/companiesService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const companiesController = {
  all: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ ok: true, data: await companiesService.all() });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const row = await companiesService.get(req.params.id);
    if (!row) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, data: row });
  }),
};
