// FILE: server/src/controllers/applicationsController.ts
import { Request, Response } from "express";
import applicationsService from "../services/applicationsService.js";

export const getAllApplications = async (_req: Request, res: Response) => {
  const apps = await applicationsService.getAllApplications();
  res.json(apps);
};

export const getApplicationById = async (req: Request, res: Response) => {
  const app = await applicationsService.getApplicationById(req.params.id);
  if (!app) return res.status(404).json({ error: "Not found" });
  res.json(app);
};

export const createApplication = async (req: Request, res: Response) => {
  const created = await applicationsService.createApplication(req.body);
  res.status(201).json(created);
};

export const updateApplication = async (req: Request, res: Response) => {
  const updated = await applicationsService.updateApplication(req.params.id, req.body);
  res.json(updated);
};

export const deleteApplication = async (req: Request, res: Response) => {
  await applicationsService.deleteApplication(req.params.id);
  res.status(204).end();
};

export default {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
};
