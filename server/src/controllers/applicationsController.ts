// server/src/controllers/applicationsController.ts
import type { Request, Response } from "express";
import { applicationService } from "../services/applicationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const applicationsController = {
  all: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ ok: true, data: await applicationService.all() });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const row = await applicationService.get(req.params.id);
    if (!row) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, data: row });
  }),
};
