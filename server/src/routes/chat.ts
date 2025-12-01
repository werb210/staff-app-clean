// server/src/routes/chat.ts
import { Router } from 'express';
import { chatController } from '../controllers/chatController.js';
import { authGuard } from "../middlewares/authMiddleware.js";

const router = Router();

// Send message (client or staff)
router.post('/application/:applicationId/send', authGuard, chatController.send);

// Get all messages for an application
router.get('/application/:applicationId', authGuard, chatController.getThread);

export default router;
