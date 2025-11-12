import type { Request, Response } from "express";
import { z } from "zod";
import {
  ContactCreateSchema,
  ContactUpdateSchema,
} from "../schemas/contact.schema.js";
import {
  ContactConflictError,
  ContactNotFoundError,
} from "../services/contactsService.js";
import { isPlaceholderSilo, respondWithPlaceholder } from "../utils/placeholder.js";

const idSchema = z.string().uuid();

const sendValidationError = (res: Response, message: string) =>
  res.status(400).json({ message });

const sendNotFound = (res: Response) =>
  res.status(404).json({ message: "Contact not found" });

const sendConflict = (res: Response, message: string) =>
  res.status(409).json({ message });

export const getContacts = (req: Request, res: Response) => {
  if (isPlaceholderSilo(req)) {
    return respondWithPlaceholder(res);
  }

  const contacts = req.silo!.services.contacts.getAllContacts();
  return res.json({ message: "OK", data: contacts });
};

export const createContact = (req: Request, res: Response) => {
  if (isPlaceholderSilo(req)) {
    return respondWithPlaceholder(res);
  }

  const parsed = ContactCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, "Invalid contact payload");
  }

  try {
    const contact = req.silo!.services.contacts.createContact(parsed.data);
    return res.status(201).json({ message: "OK", data: contact });
  } catch (error) {
    if (error instanceof ContactConflictError) {
      return sendConflict(res, error.message);
    }
    throw error;
  }
};

export const getContactById = (req: Request, res: Response) => {
  if (isPlaceholderSilo(req)) {
    return respondWithPlaceholder(res);
  }

  const id = idSchema.safeParse(req.params.id);
  if (!id.success) {
    return sendValidationError(res, "Invalid contact id");
  }

  try {
    const contact = req.silo!.services.contacts.getContact(id.data);
    return res.json({ message: "OK", data: contact });
  } catch (error) {
    if (error instanceof ContactNotFoundError) {
      return sendNotFound(res);
    }
    throw error;
  }
};

export const updateContact = (req: Request, res: Response) => {
  if (isPlaceholderSilo(req)) {
    return respondWithPlaceholder(res);
  }

  const id = idSchema.safeParse(req.params.id);
  if (!id.success) {
    return sendValidationError(res, "Invalid contact id");
  }

  const parsed = ContactUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendValidationError(res, "Invalid contact payload");
  }

  try {
    const contact = req.silo!.services.contacts.updateContact(id.data, parsed.data);
    return res.json({ message: "OK", data: contact });
  } catch (error) {
    if (error instanceof ContactNotFoundError) {
      return sendNotFound(res);
    }
    if (error instanceof ContactConflictError) {
      return sendConflict(res, error.message);
    }
    throw error;
  }
};

export const deleteContact = (req: Request, res: Response) => {
  if (isPlaceholderSilo(req)) {
    return respondWithPlaceholder(res);
  }

  const id = idSchema.safeParse(req.params.id);
  if (!id.success) {
    return sendValidationError(res, "Invalid contact id");
  }

  try {
    req.silo!.services.contacts.deleteContact(id.data);
    return res.status(204).send();
  } catch (error) {
    if (error instanceof ContactNotFoundError) {
      return sendNotFound(res);
    }
    throw error;
  }
};

export const getTimelineForContact = (req: Request, res: Response) => {
  if (isPlaceholderSilo(req)) {
    return respondWithPlaceholder(res);
  }

  const id = idSchema.safeParse(req.params.id);
  if (!id.success) {
    return sendValidationError(res, "Invalid contact id");
  }

  try {
    const events = req.silo!.services.contacts.getTimeline(id.data);
    return res.json({ message: "OK", data: events });
  } catch (error) {
    if (error instanceof ContactNotFoundError) {
      return sendNotFound(res);
    }
    throw error;
  }
};
