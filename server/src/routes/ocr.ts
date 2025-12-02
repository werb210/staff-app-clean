import { Router } from "express";
import ocrController from "../controllers/ocrController.js";

const router = Router();

// Only valid method (for document OCR)
router.post("/:documentId/run", ocrController.runOCR);

export default router;
