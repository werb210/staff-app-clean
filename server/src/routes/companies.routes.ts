import { Router } from "express";
import companiesController from "../controllers/companiesController.js";

const router = Router();

// Only list + create exist
router.get("/", companiesController.list);
router.post("/", companiesController.create);

export default router;
