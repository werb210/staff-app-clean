// FILE: server/src/controllers/notificationsController.ts
import { Request, Response } from "express";
import notificationsService from "../services/notificationsService.js";

export const sendNotification = async (req: Request, res: Response) => {
  res.json(await notificationsService.sendNotification(req.body));
};

export default { sendNotification };
