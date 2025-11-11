import { Router } from "express";
import { z } from "zod";
import { twilioService } from "../../../services/twilioService.js";

const router = Router();

const SmsRequestSchema = z.object({
  to: z.string().min(5),
  body: z.string().min(1),
});

// Sends an SMS through the stubbed Twilio service.
router.post("/", (req, res) => {
  const payload = SmsRequestSchema.parse(req.body);
  const message = twilioService.sendSms(payload.to, payload.body);
  res.status(201).json({ message: "OK", data: message });
});

// Returns the messages recorded by the Twilio service.
router.get("/", (_req, res) => {
  const messages = twilioService.listMessages();
  res.json({ message: "OK", data: messages });
});

export default router;
