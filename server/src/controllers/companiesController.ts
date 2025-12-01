// server/src/controllers/companiesController.ts

import { Request, Response } from "express";
import * as companiesRepo from "../db/repositories/companies.repo";
import { asyncHandler } from "../utils/asyncHandler";
import { z } from "zod";

const companySchema = z.object({
  name: z.string(),
  website: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const listCompanies = asyncHandler(async (_req: Request, res: Response) => {
  const companies = await companiesRepo.getAllCompanies();
  res.json({ success: true, data: companies });
});

export const getCompany = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const company = await companiesRepo.getCompanyById(id);

  if (!company) {
    return res.status(404).json({ success: false, message: "Company not found" });
  }

  res.json({ success: true, data: company });
});

export const createCompany = asyncHandler(async (req: Request, res: Response) => {
  const parsed = companySchema.parse(req.body);
  const created = await companiesRepo.createCompany(parsed);

  res.status(201).json({ success: true, data: created });
});

export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const parsed = companySchema.partial().parse(req.body);

  const updated = await companiesRepo.updateCompany(id, parsed);

  if (!updated) {
    return res.status(404).json({ success: false, message: "Company not found" });
  }

  res.json({ success: true, data: updated });
});

export const deleteCompany = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const deleted = await companiesRepo.deleteCompany(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Company not found" });
  }

  res.json({ success: true, data: true });
});
