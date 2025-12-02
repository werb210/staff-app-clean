import { Router } from "express";
import lenderController from "../controllers/lenderController.js";

const router = Router();

// Only valid method in the new lenderController
router.get("/match/:applicationId", lenderController.match);

export default router;
