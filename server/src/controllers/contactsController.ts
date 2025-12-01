import { Request, Response } from "express";
import contactsRepo from "../db/repositories/contacts.repo.js";
import asyncHandler from "../utils/asyncHandler.js";

export const contactsController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const rows = await contactsRepo.findMany({});
    res.json(rows);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const created = await contactsRepo.create(req.body);
    res.status(201).json(created);
  }),
};

export default contactsController;
