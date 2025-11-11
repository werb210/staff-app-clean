import { Router } from "express";
import { z } from "zod";
import { lenderService } from "../../../services/lenderService.js";

const router = Router();

const SendSchema = z.object({
  applicationId: z.string().uuid(),
  lenderId: z.string().uuid(),
});

// Simulates sending an application package to a lender.
router.post("/", (req, res) => {
  const payload = SendSchema.parse(req.body);
  const result = lenderService.sendToLender(payload.applicationId, payload.lenderId);
  res.json({ message: "OK", data: result });
});

export default router;
