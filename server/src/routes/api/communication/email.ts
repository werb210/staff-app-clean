import { Router } from "express";
import { z } from "zod";
import { emailService } from "../../../services/emailService.js";

const router = Router();

const EmailRequestSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

// Sends an email through the stubbed email service.
router.post("/", (req, res) => {
  const payload = EmailRequestSchema.parse(req.body);
  const message = emailService.sendEmail(payload);
  res.status(201).json({ message: "OK", data: message });
});

// Lists the recently sent emails.
router.get("/", (_req, res) => {
  const messages = emailService.listEmails();
  res.json({ message: "OK", data: messages });
});

export default router;
