import { Router } from "express";
import lendersController from "../controllers/lendersController.js";

const router = Router();

router.get("/", lendersController.list);
router.post("/", lendersController.create);

// No get/update/delete in new controller

export default router;
