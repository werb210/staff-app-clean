import { Router } from "express";
import { z } from "zod";
import { backupService } from "../../../services/backupService.js";

const router = Router();

const BackupSchema = z.object({
  name: z.string().min(1),
});

// Returns metadata for the most recent backups.
router.get("/", (_req, res) => {
  res.json({ message: "OK", data: backupService.listBackups() });
});

// Creates a new backup snapshot.
router.post("/", (req, res) => {
  const payload = BackupSchema.parse(req.body);
  const backup = backupService.createBackup(payload.name);
  res.status(201).json({ message: "OK", data: backup });
});

export default router;
