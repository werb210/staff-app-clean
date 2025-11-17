import { Router } from "express";
import { applicationsController } from "../controllers/applicationsController.js";

const router = Router();

router.get("/", applicationsController.all);
router.get("/:id", applicationsController.get);

export default router;
