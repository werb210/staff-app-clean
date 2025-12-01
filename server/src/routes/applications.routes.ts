import { Router } from "express";
import applicationsController from "../controllers/applicationsController.js";

const router = Router();

// List & create exist
router.get("/", applicationsController.list);
router.post("/", applicationsController.create);

// Update exists
router.put("/:id", applicationsController.update);

export default router;
