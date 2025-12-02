import { Router } from "express";
import aiController from "../controllers/aiController.js";

const router = Router();

router.get("/test", aiController.test);

export default router;
