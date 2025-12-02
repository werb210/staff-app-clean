// server/src/routes/communications.routes.ts
import { Router } from "express";
import communicationController from "../controllers/communicationController.js";

const router = Router();

// Only one unified sendMessage method exists
router.post("/send", communicationController.sendMessage);

export default router;
