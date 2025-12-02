import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import messagesRepo from "../db/repositories/messages.repo.js";

export const chatController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const rows = await messagesRepo.findMany({});
    res.json(rows);
  }),

  getThread: asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const rows = await messagesRepo.findMany({ applicationId });
    res.json(rows);
  }),

  send: asyncHandler(async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const payload = req.body ?? {};

    const created = await messagesRepo.create({
      applicationId,
      senderId: payload.senderId ?? "system",
      body: payload.body ?? "",
      attachments: payload.attachments ?? null,
    });

    res.json(created);
  }),
};

export default chatController;
