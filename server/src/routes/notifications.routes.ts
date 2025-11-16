// server/src/routes/notifications.routes.ts

import { Router } from "express";
import notificationsController from "../controllers/notificationsController.js";

const router = Router();

// MUST point to .list — this fixes the error
router.get("/", notificationsController.list);

export default router;
