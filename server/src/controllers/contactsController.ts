// server/src/controllers/contactsController.ts

import { Request, Response } from "express";
import contactsRepo from "../db/repositories/contacts.repo.js";
import asyncHandler from "../utils/asyncHandler.js";

export const contactsController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const contacts = await contactsRepo.findMany({});
    return res.json(contacts);
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const contact = await contactsRepo.findById(id);

    if (!contact) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(contact);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const created = await contactsRepo.create(req.body);
    return res.status(201).json(created);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await contactsRepo.update(id, req.body);

    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(updated);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await contactsRepo.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json({ success: true });
  }),
};

export default contactsController;
