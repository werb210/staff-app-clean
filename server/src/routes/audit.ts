// server/src/routes/audit.ts
import { Router } from "express";
import auditController from "../controllers/auditController.js";

const router = Router();

// Only keep valid methods implemented in controller
router.get("/", auditController.list);

export default router;
