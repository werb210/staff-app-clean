import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import messagesRepo from "../db/repositories/messages.repo.js";

export const communicationController = {
  sms: asyncHandler(async (_req: Request, res: Response) => {
    const smsRows = await messagesRepo.findMany({ type: "sms" }).catch(() => []);
    res.json(smsRows);
  }),

  email: asyncHandler(async (_req: Request, res: Response) => {
    const emailRows = await messagesRepo.findMany({ type: "email" }).catch(() => []);
    res.json(emailRows);
  }),

  sendMessage: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body ?? {};
    const created = await messagesRepo.create(data);
    res.status(201).json(created);
  }),
};

export default communicationController;
