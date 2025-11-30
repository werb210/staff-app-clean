// server/src/routes/banking.ts
import { Router } from 'express';
import * as bankingController from '../controllers/bankingController.js';

const router = Router();

// Run banking analysis for an application
router.post('/:applicationId/run', bankingController.runAnalysis);

// Get banking analysis for an application
router.get('/:applicationId', bankingController.getAnalysis);

export default router;
