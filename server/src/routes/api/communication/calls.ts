import { Router } from "express";
import { z } from "zod";
import { twilioService } from "../../../services/twilioService.js";

const router = Router();

const CallSchema = z.object({
  to: z.string().min(5),
  note: z.string().min(1),
});

// Records an outbound call using the Twilio service stub.
router.post("/", (req, res) => {
  const payload = CallSchema.parse(req.body);
  const call = twilioService.logCall(payload.to, payload.note);
  res.status(201).json({ message: "OK", data: call });
});

// Lists previously logged calls.
router.get("/", (_req, res) => {
  res.json({ message: "OK", data: twilioService.listCalls() });
});

export default router;
