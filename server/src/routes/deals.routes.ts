// server/src/routes/deals.routes.ts
import { Router } from "express";
import { dealsController } from "../controllers/dealsController.js";

const router = Router();

router.get("/", dealsController.all);
router.get("/:id", dealsController.get);

export default router;
