import { Request, Response } from "express";
import companiesRepo from "../db/repositories/companies.repo.js";
import asyncHandler from "../utils/asyncHandler.js";

export const companiesController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const rows = await companiesRepo.findMany({});
    res.json(rows);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const created = await companiesRepo.create(req.body);
    res.status(201).json(created);
  }),
};

export default companiesController;
