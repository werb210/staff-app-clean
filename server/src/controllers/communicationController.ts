import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import messagesRepo from "../db/repositories/messages.repo.js";

export const communicationController = {
  sendMessage: asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body ?? {};

    const created = await messagesRepo.create({
      applicationId: payload.applicationId ?? null,
      senderId: payload.senderId ?? "system",
      body: payload.body ?? "",
      attachments: payload.attachments ?? null,
    });

    res.json(created);
  }),
};

export default communicationController;
