// server/src/controllers/applicationsController.ts

import { Request, Response } from "express";
import * as applicationsRepo from "../db/repositories/applications.repo";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";

const createApplicationSchema = z.object({
  businessName: z.string(),
  contactEmail: z.string().email(),
  status: z.string(),
  productId: z.string().optional(),
  amountRequested: z.number().optional(),
});

export const listApplications = asyncHandler(async (_req: Request, res: Response) => {
  const apps = await applicationsRepo.getAllApplications();
  res.json({ success: true, data: apps });
});

export const getApplication = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const app = await applicationsRepo.getApplicationById(id);
  if (!app) return res.status(404).json({ success: false, message: "Application not found" });
  res.json({ success: true, data: app });
});

export const createApplication = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createApplicationSchema.parse(req.body);
  const created = await applicationsRepo.createApplication(parsed);
  res.status(201).json({ success: true, data: created });
});

export const updateApplication = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const parsed = createApplicationSchema.partial().parse(req.body);
  const updated = await applicationsRepo.updateApplication(id, parsed);

  if (!updated) return res.status(404).json({ success: false, message: "Application not found" });

  res.json({ success: true, data: updated });
});

export const deleteApplication = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const deleted = await applicationsRepo.deleteApplication(id);

  if (!deleted) return res.status(404).json({ success: false, message: "Application not found" });

  res.json({ success: true, data: true });
});
