// server/src/routes/documents.routes.ts

import { Router } from "express";
import { documentsController } from "../controllers/documentsController.js";

const router = Router();

router.get("/", documentsController.list);
router.post("/", documentsController.upload);
router.get("/:id", documentsController.getById);

export default router;
