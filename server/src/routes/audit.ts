import { Router } from "express";
import auditController from "../controllers/auditController.js";

const router = Router();

// Only listAll exists
router.get("/", auditController.listAll);

export default router;
