import { Router } from "express";
import { backupService } from "../../../services/backupService.js";

const router = Router();

/**
 * GET /api/admin/backups
 * Lists generated backups.
 */
router.get("/", async (_req, res) => {
  const backups = await backupService.listBackups();
  res.json({ backups });
});

/**
 * POST /api/admin/backups
 * Triggers a new backup operation.
 */
router.post("/", async (_req, res) => {
  const backup = await backupService.createBackup();
  res.status(201).json({ backup });
});

export default router;
