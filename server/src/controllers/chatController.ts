import { saveChatMessage, getChatThread } from "../services/chatService.js";
import type { Request, Response } from "express";

export const chatController = {
  async getThread(req: Request, res: Response) {
    const messages = await getChatThread(req.params.applicationId);
    res.json(messages);
  },

  async send(req: Request, res: Response) {
    const { body } = req.body;
    const saved = await saveChatMessage({
      senderId: (req as any).user.id,
      applicationId: req.params.applicationId,
      body,
      attachments: req.body.attachments ?? [],
    });

    res.json(saved);
  },
};
