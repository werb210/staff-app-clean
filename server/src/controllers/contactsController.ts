// FILE: server/src/controllers/contactsController.ts
import { Request, Response } from "express";
import contactsService from "../services/contactsService.js";

export const getAllContacts = async (_req: Request, res: Response) => {
  res.json(await contactsService.getAllContacts());
};

export const getContactById = async (req: Request, res: Response) => {
  const c = await contactsService.getContactById(req.params.id);
  if (!c) return res.status(404).json({ error: "Not found" });
  res.json(c);
};

export const createContact = async (req: Request, res: Response) => {
  res.status(201).json(await contactsService.createContact(req.body));
};

export default {
  getAllContacts,
  getContactById,
  createContact,
};
