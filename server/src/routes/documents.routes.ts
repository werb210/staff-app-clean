// server/src/routes/documents.routes.ts
import { Router } from "express";
import documentsController from "../controllers/documentsController.js";

const router = Router();

router.get("/application/:applicationId", documentsController.list);
router.post("/", documentsController.upload);

export default router;
