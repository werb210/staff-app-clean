import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import applicationsRepo from "../db/repositories/applications.repo.js";

export const applicationController = {
  startApplication: asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body ?? {};
    const created = await applicationsRepo.create({
      status: "in_progress",
      currentStep: payload.currentStep ?? "1",
      applicantEmail: payload.applicantEmail ?? null,
      formData: payload.formData ?? {},
    });
    res.status(201).json(created);
  }),

  updateStep: asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const { currentStep, formData } = req.body ?? {};

    const updated = await applicationsRepo.update(applicationId, {
      currentStep,
      formData,
    });

    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  }),

  submitApplication: asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const updated = await applicationsRepo.update(applicationId, {
      status: "submitted",
      submittedAt: new Date(),
    });

    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  }),

  getApplication: asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const row = await applicationsRepo.findById(applicationId);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  }),
};

export default applicationController;
