import { Router } from "express";
import aiController from "../controllers/aiController.js";

const router = Router();

router.post("/test", aiController.test);

export default router;
