import { Router } from "express";
import notificationsController from "../controllers/notificationsController.js";

const router = Router();

router.get("/", notificationsController.list);

// No get/create/update/delete exist → removed

export default router;
