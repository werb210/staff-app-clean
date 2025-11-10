import { Router } from "express";
import { z } from "zod";
import { emailService } from "../../../services/emailService.js";

const payloadSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1, "subject is required"),
  body: z.string().min(1, "body is required")
});

const router = Router();

/**
 * POST /api/communication/email
 * Sends an email message.
 */
router.post("/", async (req, res) => {
  try {
    const payload = payloadSchema.parse(req.body);
    const result = await emailService.sendEmail(payload);
    res.status(202).json(result);
  } catch (error) {
    res.status(400).json({
      message: "Failed to send email",
      error: (error as Error).message
    });
  }
});

export default router;
