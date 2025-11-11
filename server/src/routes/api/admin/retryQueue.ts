import { Router } from "express";
import { z } from "zod";
import { retryQueueService } from "../../../services/retryQueueService.js";

const router = Router();

const RetrySchema = z.object({ id: z.string().uuid() });

// Returns the current retry queue snapshot.
router.get("/", (_req, res) => {
  res.json({ message: "OK", data: retryQueueService.listJobs() });
});

// Marks a job for retry.
router.post("/retry", (req, res) => {
  const payload = RetrySchema.parse(req.body);
  const job = retryQueueService.retryJob(payload.id);
  res.json({ message: "OK", data: job });
});

export default router;
