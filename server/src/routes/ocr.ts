// server/src/routes/ocr.ts
import { Router } from 'express';
import * as ocrController from '../controllers/ocrController.js';

const router = Router();

// OCR a specific document
router.post('/:documentId/run', ocrController.runOCR);

// Get OCR results for one document
router.get('/:documentId', ocrController.getOCR);

// List OCR for an application
router.get('/application/:applicationId', ocrController.listOCR);

export default router;
