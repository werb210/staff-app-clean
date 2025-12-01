import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import messagesRepo from "../db/repositories/messages.repo.js";

export const notificationsController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const rows = await messagesRepo.findMany({});
    res.json(rows);
  }),
};

export default notificationsController;
